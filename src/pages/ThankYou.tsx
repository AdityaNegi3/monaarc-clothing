import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, ClipboardCopy } from 'lucide-react';

type ThankYouState = {
  orderId?: string;
  paymentId?: string;
  amount?: number;
  email?: string;
  name?: string;
} | null;

const ThankYou: React.FC = () => {
  const { state } = useLocation() as { state: ThankYouState };

  const copy = (text?: string) => {
    if (!text) return;
    navigator.clipboard?.writeText(text).catch(() => {});
  };

  const hasDetails = Boolean(state?.orderId || state?.paymentId || state?.amount || state?.email || state?.name);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
      <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
      <h1 className="text-3xl font-bold mb-2">
        Thank You{state?.name ? `, ${state.name}` : ''}!
      </h1>

      <p className="text-lg mb-4">
        Your payment was successful. Order details will be sent to your WhatsApp and Email within 15 minutes.
      </p>

      {hasDetails && (
        <div className="w-full max-w-xl text-left bg-gray-900/60 border border-white/10 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order details</h2>

          {state?.orderId && (
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-400">Order ID</span>
              <div className="flex items-center gap-2">
                <code className="text-sm">{state.orderId}</code>
                <button
                  type="button"
                  onClick={() => copy(state.orderId)}
                  className="p-1 rounded hover:bg-white/10"
                  aria-label="Copy Order ID"
                  title="Copy"
                >
                  <ClipboardCopy className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {state?.paymentId && (
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-400">Payment ID</span>
              <div className="flex items-center gap-2">
                <code className="text-sm">{state.paymentId}</code>
                <button
                  type="button"
                  onClick={() => copy(state.paymentId)}
                  className="p-1 rounded hover:bg-white/10"
                  aria-label="Copy Payment ID"
                  title="Copy"
                >
                  <ClipboardCopy className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {typeof state?.amount === 'number' && (
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-400">Amount</span>
              <span className="text-yellow-400 font-semibold">₹{state.amount}</span>
            </div>
          )}

          {state?.email && (
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-400">Receipt Email</span>
              <span>{state.email}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-6">
        <Link
          to="/"
          className="px-5 py-2 rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-400"
        >
          Continue Shopping
        </Link>
        <a
          href="mailto:crew@monaarcclothing.com"
          className="px-5 py-2 rounded-lg bg-gray-800 border border-white/10 hover:bg-gray-700"
        >
          Email Support
        </a>
      </div>

      <p className="text-sm text-gray-400">
        If you do not receive a confirmation, contact us on Instagram{' '}
        <a
          href="https://instagram.com/monnaarcclothing"
          target="_blank"
          rel="noreferrer"
          className="underline text-yellow-400"
        >
          @monnaarcclothing
        </a>
        <br />
        or email us at{' '}
        <a href="mailto:crew@monaarcclothing.com" className="underline text-yellow-400">
          crew@monaarcclothing.com
        </a>
      </p>
    </div>
  );
};

export default ThankYou;
