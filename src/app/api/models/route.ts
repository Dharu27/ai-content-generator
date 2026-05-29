/**
 * GET /api/models
 */

import { NextResponse } from "next/server";
import { ollamaClient } from "@/lib/ollama";

export async function GET() {
  try {
    const data = await ollamaClient.listModels();

    return NextResponse.json({
      success: true,
      models: data.models.map((m: any) => ({
        name: m.name.split(":")[0], // ✅ clean name
        size: formatBytes(m.size),
      })),
    });
  } catch (err: any) {
    console.error("MODEL ERROR:", err);

    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  const kb = bytes / 1024;
  if (kb < 1024) return kb.toFixed(1) + " KB";
  const mb = kb / 1024;
  if (mb < 1024) return mb.toFixed(1) + " MB";
  return (mb / 1024).toFixed(1) + " GB";
}