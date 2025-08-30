import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const ThankYou = () => {
  const [allowed, setAllowed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if payment flag exists
    const paid = sessionStorage.getItem("orderPaid");

    if (paid === "true") {
      setAllowed(true);
      // Remove it so the page can’t be re-opened manually again
      sessionStorage.removeItem("orderPaid");
    } else {
      // No flag? Kick them back home
      navigate("/");
    }
  }, [navigate]);

  if (!allowed) return null; // Prevent flash before redirect

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
      <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
      <p className="text-lg mb-4">
        Your payment was successful. Order details will be sent to your WhatsApp and Email within 15 minutes.
      </p>
      <p className="text-sm text-gray-400">
        If you do not receive a confirmation, contact us on Instagram{" "}
        <a
          href="https://instagram.com/officialmonaarcclothing"
          target="_blank"
          className="underline text-white"
        >
          @monaarcclothing
        </a>
        <br />
        or email us at{" "}
        <a href="mailto:crew@monaarcclothing.com" className="underline text-white">
          crew@monaarcclothing.com
        </a>
      </p>
    </div>
  );
};

export default ThankYou;
