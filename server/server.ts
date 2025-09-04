import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Razorpay from "razorpay";
import { Webhook as SvixWebhook } from "svix";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { verifyToken } from "@clerk/backend";
import crypto from "crypto";

const app = express();

// ---- CORE / CORS ----
app.set("trust proxy", 1);
app.use(
  cors({
    origin: ["http://localhost:5173", "https://monaarcclothing.com"],
    credentials: true,
  })
);

// NOTE: normal APIs parse JSON
app.use(bodyParser.json());

// Clerk webhook must read RAW TEXT
app.use("/webhooks/clerk", bodyParser.text({ type: "*/*" }));

// Health check
app.get("/health", (_req, res) => res.send("ok"));

// ---- ENV ----
const {
  PORT = "8787",
  CLERK_SECRET_KEY,
  CLERK_WEBHOOK_SECRET,
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
  RAZORPAY_WEBHOOK_SECRET,
} = process.env;

if (!CLERK_SECRET_KEY) console.error("❗ Missing CLERK_SECRET_KEY");
if (!CLERK_WEBHOOK_SECRET) console.error("❗ Missing CLERK_WEBHOOK_SECRET");
if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) console.error("❗ Missing Razorpay keys");

// ---- Razorpay client ----
const razorpay = new Razorpay({ key_id: RAZORPAY_KEY_ID!, key_secret: RAZORPAY_KEY_SECRET! });

// ---- Auth helper for SPA -> API ----
async function requireClerkUser(req: any, res: any, next: any) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!token) return res.status(401).json({ error: "Missing token" });
    const { sub } = await verifyToken(token, { secretKey: CLERK_SECRET_KEY! });
    req.clerkUserId = sub;
    next();
  } catch (e) {
    console.error("Auth error:", e);
    return res.status(401).json({ error: "Invalid session" });
  }
}

/**
 * 1) Clerk webhook: set 24h eligibility at sign-up
 *    (must use RAW TEXT body)
 */
app.post("/webhooks/clerk", async (req, res) => {
  try {
    const wh = new SvixWebhook(CLERK_WEBHOOK_SECRET!);
    const evt: any = wh.verify(req.body, {
      "svix-id": req.header("svix-id")!,
      "svix-timestamp": req.header("svix-timestamp")!,
      "svix-signature": req.header("svix-signature")!,
    });

    console.log("✅ Clerk webhook:", evt.type);

    if (evt.type === "user.created") {
      const userId = evt.data.id as string;
      const now = Math.floor(Date.now() / 1000);
      const exp = now + 24 * 60 * 60;

      await clerkClient.users.updateUser(userId, {
        privateMetadata: {
          firstOrderDiscountEligible: true,
          firstOrderDiscountUsed: false,
          firstOrderDiscountExp: exp,
          firstOrderDiscountPercent: 10,
        },
      });
      console.log("🎁 Set first-order 10% (24h) for", userId);
    }

    res.sendStatus(200);
  } catch (e) {
    console.error("❌ Clerk webhook error:", e);
    res.status(400).send("bad signature");
  }
});

/**
 * 2) Status endpoint for banner/timer
 */
app.get("/api/first-order-discount/status", requireClerkUser, async (req, res) => {
  const user = await clerkClient.users.getUser(req.clerkUserId);
  const meta: any = user.privateMetadata || {};
  const now = Math.floor(Date.now() / 1000);

  const valid =
    meta.firstOrderDiscountEligible &&
    !meta.firstOrderDiscountUsed &&
    typeof meta.firstOrderDiscountExp === "number" &&
    meta.firstOrderDiscountExp > now;

  res.json({
    valid,
    percent: valid ? Number(meta.firstOrderDiscountPercent ?? 10) : 0,
    secondsLeft: valid ? meta.firstOrderDiscountExp - now : 0,
  });
});

/**
 * 3) Create Razorpay order with server-side 10% reduction (no codes)
 */
app.post("/api/razorpay/order", requireClerkUser, async (req, res) => {
  const { subtotalInPaise, receipt } = req.body as { subtotalInPaise: number; receipt?: string };
  if (!Number.isInteger(subtotalInPaise) || subtotalInPaise <= 0) {
    return res.status(400).json({ error: "Bad subtotal" });
  }

  const user = await clerkClient.users.getUser(req.clerkUserId);
  const meta: any = user.privateMetadata || {};
  const now = Math.floor(Date.now() / 1000);

  const eligible =
    meta.firstOrderDiscountEligible &&
    !meta.firstOrderDiscountUsed &&
    typeof meta.firstOrderDiscountExp === "number" &&
    meta.firstOrderDiscountExp > now;

  const percent = Number(meta.firstOrderDiscountPercent ?? 10);
  const discount = eligible ? Math.floor(subtotalInPaise * (percent / 100)) : 0;
  const amount = Math.max(0, subtotalInPaise - discount);

  console.log("🧾 Create RZP order:", { eligible, subtotalInPaise, discount, amount });

  const order = await razorpay.orders.create({
    amount, // paise
    currency: "INR",
    receipt,
    notes: {
      clerkUserId: req.clerkUserId, // so webhook can mark used
      firstOrderDiscountApplied: eligible ? "true" : "false",
      discountPaise: String(discount),
      percent: String(percent),
    },
  });

  res.json({ order, discount, eligible });
});

/**
 * 4) Razorpay webhook: mark used ONLY after successful capture.
 *    IMPORTANT: compute HMAC on the RAW BODY.
 */
app.post(
  "/webhooks/razorpay",
  bodyParser.json({
    // capture raw body buffer for signature verification
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  }),
  async (req: any, res) => {
    try {
      const signature = req.header("x-razorpay-signature") || "";
      const expected = crypto
        .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET!)
        .update(req.rawBody) // RAW body buffer, not JSON.stringify
        .digest("hex");

      if (signature !== expected) {
        console.error("❌ Razorpay bad signature");
        return res.status(400).send("bad signature");
      }

      const evt = req.body;
      console.log("✅ Razorpay webhook:", evt.event);

      if (evt.event === "payment.captured") {
        const payment = evt.payload?.payment?.entity;
        const userId = payment?.notes?.clerkUserId as string | undefined;

        if (userId) {
          const user = await clerkClient.users.getUser(userId);
          const meta: any = user.privateMetadata || {};
          if (meta.firstOrderDiscountEligible && !meta.firstOrderDiscountUsed) {
            await clerkClient.users.updateUser(userId, {
              privateMetadata: {
                ...meta,
                firstOrderDiscountUsed: true,
                firstOrderDiscountEligible: false,
              },
            });
            console.log("🎯 Marked discount used for", userId);
          }
        } else {
          console.warn("⚠️ No clerkUserId in payment.notes");
        }
      }

      res.sendStatus(200);
    } catch (e) {
      console.error("❌ Razorpay webhook error:", e);
      res.status(400).send("webhook error");
    }
  }
);

// ---- START ----
app.listen(Number(PORT), () => console.log(`API on :${PORT}`));
