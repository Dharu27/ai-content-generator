"use client";

import { useState } from "react";

import {
  FileText,
  Sparkles,
  CheckCircle2,
  PenLine,
  BookOpen,
  ArrowRight,
  AlertTriangle,
  Clock,
  Hash,
} from "lucide-react";

import Select from "./Select";
import BlogPreview from "./BlogPreview";

import { useBlogGenerator } from "@/hooks/useBlogGenerator";

// ─────────────────────────────────────────────────────────────
// OPTIONS
// ─────────────────────────────────────────────────────────────

const TONE_OPTIONS = [
  {
    value: "professional",
    label: "Professional",
  },

  {
    value: "casual",
    label: "Casual",
  },

  {
    value: "friendly",
    label: "Friendly",
  },

  {
    value: "persuasive",
    label: "Persuasive",
  },

  {
    value: "creative",
    label: "Creative",
  },
];

const LENGTH_OPTIONS = [
  {
    value: "short",
    label: "Short (~800 words)",
  },

  {
    value: "medium",
    label: "Medium (~1200 words)",
  },

  {
    value: "long",
    label: "Long (~2000 words)",
  },
];

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────

export default function BlogGenerator() {
  const [topic, setTopic] =
    useState("");

  const [tone, setTone] =
    useState("professional");

  const [length, setLength] =
    useState("medium");

  const [dots, setDots] =
    useState("");

  const {
    state,
    generate,
    reset,
  } = useBlogGenerator();

  const isLoading =
    state.status === "loading";

  // ─────────────────────────────────────────────────────────
  // LOADING DOTS
  // ─────────────────────────────────────────────────────────

  const startDots = () => {
    let c = 0;

    const iv = setInterval(() => {
      c = (c + 1) % 4;

      setDots(".".repeat(c));
    }, 350);

    return iv;
  };

  // ─────────────────────────────────────────────────────────
  // GENERATE
  // ─────────────────────────────────────────────────────────

  const handleGenerate =
    async () => {
      if (!topic.trim() || isLoading)
        return;

      const iv = startDots();

      await generate({
        topic,
        tone,
        length,
      });

      clearInterval(iv);

      setDots("");
    };

  // ─────────────────────────────────────────────────────────
  // RESET
  // ─────────────────────────────────────────────────────────

  const handleReset = () => {
    reset();

    setTopic("");

    setTone("professional");

    setLength("medium");
  };

  // ─────────────────────────────────────────────────────────
  // WORD COUNT
  // ─────────────────────────────────────────────────────────

  const wordCount =
    state.status === "success"
      ? state.data.blog.content
          .trim()
          .split(/\s+/).length
      : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <h1 className="text-3xl font-bold text-slate-900">
            Blog Post Generator
          </h1>

          <p className="text-slate-500 mt-1 text-sm">
            Powered by Ollama • Runs
            100% locally
          </p>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT PANEL */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          {/* TITLE */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
              <BookOpen
                size={18}
                className="text-violet-600"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Enter Blog Details
              </h2>

              <p className="text-sm text-slate-500">
                Generate content locally
                with Ollama
              </p>
            </div>
          </div>

          {/* TOPIC */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Blog Topic / Title
            </label>

            <div className="relative">
              <PenLine
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={topic}
                onChange={(e) =>
                  setTopic(
                    e.target.value
                  )
                }
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  handleGenerate()
                }
                disabled={isLoading}
                placeholder="e.g. What is Python?"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm
                  focus:outline-none focus:ring-2 focus:ring-violet-300
                  disabled:opacity-50"
              />
            </div>
          </div>

          {/* TONE */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tone
            </label>

            <Select
              value={tone}
              onChange={setTone}
              options={TONE_OPTIONS}
              placeholder="Select tone"
              disabled={isLoading}
            />
          </div>

          {/* LENGTH */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Blog Length
            </label>

            <Select
              value={length}
              onChange={setLength}
              options={LENGTH_OPTIONS}
              placeholder="Select length"
              disabled={isLoading}
            />
          </div>

          {/* GENERATE BUTTON */}
          <button
            onClick={handleGenerate}
            disabled={
              !topic.trim() ||
              isLoading
            }
            className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2
              transition-all disabled:opacity-60"
            style={{
              background:
                "linear-gradient(135deg,#7c3aed 0%,#9333ea 50%,#a855f7 100%)",
            }}
          >
            {isLoading ? (
              <>
                <Sparkles
                  size={16}
                  className="animate-spin"
                />
                Generating{dots}
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate Blog Post
                <ArrowRight size={15} />
              </>
            )}
          </button>

          {/* INFO */}
          <div className="mt-5 flex flex-wrap gap-4">
            <div className="flex items-center gap-1.5">
              <CheckCircle2
                size={13}
                className="text-emerald-500"
              />

              <span className="text-xs text-slate-500">
                100% Local
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <CheckCircle2
                size={13}
                className="text-emerald-500"
              />

              <span className="text-xs text-slate-500">
                Powered by Ollama
              </span>
            </div>
          </div>

          {/* RESET */}
          {(state.status ===
            "success" ||
            state.status ===
              "error") && (
            <button
              onClick={handleReset}
              className="w-full mt-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            >
              Reset & Start Over
            </button>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col min-h-[500px]">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <FileText
                  size={18}
                  className="text-slate-500"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Preview
                </h2>

                <p className="text-sm text-slate-500">
                  Generated output
                </p>
              </div>
            </div>

            {/* STATUS */}
            {state.status ===
              "success" && (
              <div className="flex items-center gap-2">
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full flex items-center gap-1">
                  <Hash size={10} />
                  {wordCount} words
                </span>

                <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2
                    size={10}
                  />
                  Ready
                </span>
              </div>
            )}
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto border-t pt-5">
            {/* LOADING */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full min-h-[320px]">
                <div className="w-16 h-16 rounded-full border-4 border-violet-100 border-t-violet-500 animate-spin mb-5" />

                <p className="text-slate-700 font-semibold">
                  Generating with
                  Ollama{dots}
                </p>

                <p className="text-slate-400 text-sm mt-1">
                  Local AI model may
                  take 10–60 seconds
                </p>
              </div>
            )}

            {/* ERROR */}
            {!isLoading &&
              state.status ===
                "error" && (
                <div className="flex flex-col items-center justify-center h-full min-h-[320px] text-center px-6">
                  <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-4">
                    <AlertTriangle
                      size={22}
                      className="text-red-400"
                    />
                  </div>

                  <p className="text-slate-800 font-bold text-sm mb-1">
                    {
                      state.error
                        .error
                    }
                  </p>
                </div>
              )}

            {/* SUCCESS */}
            {!isLoading &&
              state.status ===
                "success" && (
                <div>
                  <BlogPreview
                    content={
                      state.data.blog
                        .content
                    }
                  />

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>
                      Tone:
                      <span className="ml-1 font-medium text-slate-500">
                        {
                          state
                            .data
                            .blog
                            .tone
                        }
                      </span>
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {wordCount} words
                    </span>
                  </div>
                </div>
              )}

            {/* EMPTY */}
            {!isLoading &&
              state.status ===
                "idle" && (
                <div className="flex flex-col items-center justify-center h-full min-h-[320px] text-center">
                  <div className="w-16 h-16 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mb-4">
                    <BookOpen
                      size={26}
                      className="text-violet-400"
                    />
                  </div>

                  <p className="text-slate-700 font-semibold text-sm mb-2">
                    Your blog post
                    will appear here
                  </p>

                  <p className="text-slate-400 text-xs max-w-xs">
                    Fill in the
                    details and click{" "}
                    <span className="text-violet-500 font-semibold">
                      Generate Blog
                      Post
                    </span>
                  </p>
                </div>
              )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center text-slate-400 text-xs pb-6">
        ContientAI · Running
        locally via Ollama · No
        data leaves your machine
      </footer>
    </div>
  );
}