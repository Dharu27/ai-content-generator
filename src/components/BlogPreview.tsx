"use client";

interface BlogPreviewProps {
  content: string;
}

export default function BlogPreview({ content }: BlogPreviewProps) {
  const lines = content.split("\n");

  return (
    <div className="text-sm leading-relaxed space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith("# "))
          return (
            <h1 key={i} className="text-xl font-bold text-slate-900 mb-3 mt-0 leading-snug">
              {line.slice(2)}
            </h1>
          );
        if (line.startsWith("## "))
          return (
            <h2 key={i} className="text-base font-semibold text-slate-800 mt-5 mb-1.5 border-l-4 border-violet-400 pl-3">
              {line.slice(3)}
            </h2>
          );
        if (line.startsWith("### "))
          return (
            <h3 key={i} className="text-sm font-semibold text-slate-700 mt-3 mb-1">
              {line.slice(4)}
            </h3>
          );
        if (line.startsWith("**") && line.endsWith("**"))
          return (
            <p key={i} className="font-semibold text-slate-800">
              {line.slice(2, -2)}
            </p>
          );
        if (line.startsWith("- ") || line.startsWith("* "))
          return (
            <li key={i} className="ml-4 text-slate-600 list-disc">
              {line.slice(2)}
            </li>
          );
        if (line.trim() === "") return <div key={i} className="h-2" />;
        return (
          <p key={i} className="text-slate-600 leading-relaxed">
            {line}
          </p>
        );
      })}
    </div>
  );
}
