import React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export default function Alert({ type, message }) {
  if (!message) return null;

  const isError = type === "error";

  return (
    <div
      className={`flex flex-col items-center justify-center text-center px-4 py-4 mb-6 rounded-2xl border ${
        isError ? "bg-red-50 border-red-100" : "bg-emerald-50 border-emerald-100"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
          isError ? "bg-red-100" : "bg-emerald-100"
        }`}
      >
        {isError ? (
          <AlertTriangle size={18} className="text-red-500" />
        ) : (
          <CheckCircle2 size={18} className="text-emerald-600" />
        )}
      </div>
      <p
        className={`font-bold text-sm ${
          isError ? "text-slate-800" : "text-emerald-800"
        }`}
      >
        {message}
      </p>
    </div>
  );
}
