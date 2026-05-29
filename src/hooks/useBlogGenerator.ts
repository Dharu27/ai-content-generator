"use client";

import { useState, useCallback } from "react";

export interface BlogFormInput {
  topic: string;
  tone: string;
  length: string;
}

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

export interface GenerateErrorResponse {
  success: false;
  error: string;
}

export type GenerateState =
  | { status: "idle" }
  | { status: "loading" }
  | {
      status: "success";
      data: GenerateSuccessResponse;
    }
  | {
      status: "error";
      error: GenerateErrorResponse;
    };

export function useBlogGenerator() {
  const [state, setState] =
    useState<GenerateState>({
      status: "idle",
    });

  const generate = useCallback(
    async (input: BlogFormInput) => {
      setState({
        status: "loading",
      });

      try {
        const res = await fetch(
          "/api/generate",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(input),
          }
        );

        const data = await res.json();

        if (!res.ok || !data.success) {
          setState({
            status: "error",
            error: data,
          });

          return;
        }

        setState({
          status: "success",
          data,
        });
      } catch (err: any) {
        setState({
          status: "error",
          error: {
            success: false,
            error:
              err.message ||
              "Something went wrong",
          },
        });
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({
      status: "idle",
    });
  }, []);

  return {
    state,
    generate,
    reset,
  };
}