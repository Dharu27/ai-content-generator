/**
 * POST /api/generate
 * Generate blog content using Ollama
 */

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { ollamaClient } from "@/lib/ollama";

import { verifyToken } from "@/lib/auth";

// ✅ SUCCESS RESPONSE
export interface GenerateSuccessResponse {
  success: true;

  blog: {
    id: number;
    topic: string;
    tone: string;
    content: string;
    createdAt: string;
  };
}

// ✅ ERROR RESPONSE
export interface GenerateErrorResponse {
  success: false;

  error: string;

  code?: string;

  hint?: string;
}

export async function POST(req: Request) {
  try {
    // AUTHENTICATION
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Missing token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const payload = await verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid or expired token" },
        { status: 401 }
      );
    }

    const userId = payload.userId;

    // REQUEST BODY
    const { topic, tone, length } =
      await req.json();

    // WORD LIMIT
    let wordLimit = 200;

    if (length === "medium") {
      wordLimit = 350;
    }

    if (length === "long") {
      wordLimit = 500;
    }

    // PROMPT
    const prompt = `
Write a ${tone} blog post about "${topic}".

Keep it engaging and under ${wordLimit} words.
`;

    // GENERATE USING OLLAMA
    const result =
      await ollamaClient.generate({
        model: "phi3",

        prompt,

        options: {
          num_predict: wordLimit,

          temperature: 0.7,
        },
      });

    // CONTENT
    const content =
      result.response;

    // SAVE DATABASE
    const blog =
  await prisma.blog.create({
    data: {
      topic,

      tone,

      content,

      createdAt:
        new Date().toLocaleString(
          "en-IN",
          {
            dateStyle:
              "medium",

            timeStyle:
              "short",
          }
        ),
      
      userId,
    },
  });

    // RETURN SUCCESS
    return NextResponse.json({
      success: true,

      blog,
    });
  } catch (err: any) {
    console.error(
      "GENERATE ERROR:",
      err
    );

    return NextResponse.json(
      {
        success: false,

        error:
          err.message ||
          "Generation failed",
      },

      { status: 500 }
    );
  }
}