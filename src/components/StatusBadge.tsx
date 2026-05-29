"use client";

import { useEffect, useState } from "react";
import { Wifi, WifiOff, Loader2 } from "lucide-react";

type Status = "checking" | "ok" | "error";

interface StatusInfo {
  status: "ok" | "unreachable";
  ollamaUrl: string;
  activeModel: string;
  availableModels: string[];
}

export default function StatusBadge() {
  const [status, setStatus] = useState<Status>("checking");
  const [info, setInfo] = useState<StatusInfo | null>(null);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/api/generate");
        const data: StatusInfo = await res.json();
        setInfo(data);
        setStatus(data.status === "ok" ? "ok" : "error");
      } catch {
        setStatus("error");
      }
    };
    check();
    const interval = setInterval(check, 30_000); // recheck every 30s
    return () => clearInterval(interval);
  }, []);

  if (status === "checking") {
    return (
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Loader2 size={12} className="animate-spin" />
        Checking Ollama…
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center gap-1.5 text-xs text-red-500 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
        <WifiOff size={12} />
        Ollama offline — run <code className="font-mono ml-1">ollama serve</code>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
      <Wifi size={12} />
      {info?.activeModel ?? "llama3"} ready
    </div>
  );
}
