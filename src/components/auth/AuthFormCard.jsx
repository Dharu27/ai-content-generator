import React from "react";

export default function AuthFormCard({ title, subtitle, icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 w-full max-w-md mx-auto">
      {/* HEADER */}
      <div className="flex flex-col items-center justify-center text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">{title}</h2>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>

      {/* BODY */}
      <div>{children}</div>
    </div>
  );
}
