import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";

export default function SubmitButton({ text, loadingText = "Processing...", isLoading, disabled = false }) {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 hover:opacity-90 active:scale-[0.98]"
      style={{
        background: "linear-gradient(135deg,#7c3aed 0%,#9333ea 50%,#a855f7 100%)",
      }}
    >
      {isLoading ? (
        <>
          <Sparkles size={16} className="animate-spin" />
          {loadingText}
        </>
      ) : (
        <>
          <Sparkles size={16} />
          {text}
          <ArrowRight size={15} />
        </>
      )}
    </button>
  );
}
