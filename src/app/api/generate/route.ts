/**
 * POST /api/generate
 * Generate blog content using Ollama
 */

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { ollamaClient } from "@/lib/ollama";

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