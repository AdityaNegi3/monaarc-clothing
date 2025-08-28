import React from "react";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";

const AuthCTA: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-3 text-sm">
      <div className="text-white/80">
        Already using <span className="font-semibold text-white">Osiris</span>?{" "}
        <SignInButton mode="modal">
          <button className="underline text-violet-400 hover:text-violet-300">
            Sign in
          </button>
        </SignInButton>
      </div>

      <div className="text-white/70">
        New here?{" "}
        <SignUpButton mode="modal">
          <button className="underline text-violet-400 hover:text-violet-300">
            Create an account
          </button>
        </SignUpButton>
      </div>
    </div>
  );
};

export default AuthCTA;
