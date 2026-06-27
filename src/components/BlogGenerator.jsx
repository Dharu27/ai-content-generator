import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Wand2,
  MessageSquare,
  Image,
  Layers,
  Zap,
  ChevronDown,
  Plus,
  User,
  Sparkles,
  CheckCircle2,
  PenLine,
  AlignLeft,
  BookOpen,
  ArrowRight,
  Star,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", active: false },
  { icon: Layers, label: "Templates", active: false },
  { icon: FileText, label: "Documents", active: false },
  { icon: Wand2, label: "AI Editor", active: true },
  { icon: MessageSquare, label: "AI Chat", active: false },
  { icon: Image, label: "Images", active: false },
];

const TONE_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "friendly", label: "Friendly" },
  { value: "persuasive", label: "Persuasive" },
  { value: "creative", label: "Creative" },
];

const LENGTH_OPTIONS = [
  { value: "short", label: "Short (~800 words)" },
  { value: "medium", label: "Medium (~1200 words)" },
  { value: "long", label: "Long (~2000 words)" },
];

// ─── Custom Select ────────────────────────────────────────────────────────────
function Select({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 hover:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300 transition-all duration-150"
      >
        <span className={selected ? "text-slate-800 font-medium" : "text-slate-400"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          {/* backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-violet-50 hover:text-violet-700 transition-colors ${
                  value === opt.value
                    ? "bg-violet-50 text-violet-700 font-medium"
                    : "text-slate-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Markdown → JSX renderer ──────────────────────────────────────────────────
function GeneratedPost({ content }) {
  return (
    <div className="text-sm leading-relaxed space-y-2">
      {content.split("\n").map((line, i) => {
        if (line.startsWith("# "))
          return (
            <h1 key={i} className="text-xl font-bold text-slate-900 mb-3 mt-0 leading-snug">
              {line.slice(2)}
            </h1>
          );
        if (line.startsWith("## "))
          return (
            <h2 key={i} className="text-base font-semibold text-slate-800 mt-5 mb-1">
              {line.slice(3)}
            </h2>
          );
        if (line.startsWith("**") && line.endsWith("**"))
          return (
            <p key={i} className="font-semibold text-slate-800">
              {line.slice(2, -2)}
            </p>
          );
        if (line.trim() === "") return <div key={i} className="h-1" />;
        return (
          <p key={i} className="text-slate-600 leading-relaxed">
            {line}
          </p>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BlogGenerator() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("");
  const [length, setLength] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState("");
  const [dots, setDots] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("accessToken");
      navigate("/login");
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setGenerated("");
    setError("");

    const selectedTone =
      TONE_OPTIONS.find((o) => o.value === tone)?.label || "Professional";
    const selectedLength =
      LENGTH_OPTIONS.find((o) => o.value === length)?.label || "Medium (~1200 words)";

    let dotCount = 0;
    const dotInterval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      setDots(".".repeat(dotCount));
    }, 400);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Write a blog post about: "${topic}"
Tone: ${selectedTone}
Length: ${selectedLength}

Format with a clear title using # Title, then 3–4 sections each with ## Section Heading, and well-written paragraphs. Make it engaging, informative, and original. No markdown code blocks — just plain text with # headings.`,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const text =
        data.content?.map((b) => b.text || "").join("") ||
        "No content returned.";
      setGenerated(text);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      clearInterval(dotInterval);
      setDots("");
      setLoading(false);
    }
  };

  const handleReset = () => {
    setGenerated("");
    setError("");
    setTopic("");
    setTone("");
    setLength("");
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <AlignLeft size={20} />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Blog Post Generator
              </h1>
              <p className="text-slate-500 text-xs mt-0.5 hidden sm:block">
                Generate full blog posts from a title or brief in seconds
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
          >
            Logout
          </button>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* ── Left Card: Input ── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={15} className="text-violet-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Enter Blog Details
                  </h2>
                  <p className="text-xs text-slate-500">
                    Fill in the fields below to get started
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Topic input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Blog Topic / Title
                  </label>
                  <div className="relative">
                    <PenLine
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                      placeholder="e.g. 10 Ways to Boost Productivity Working From Home"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 hover:border-violet-300 transition-all"
                    />
                  </div>
                </div>

                {/* Tone */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Tone
                  </label>
                  <Select
                    value={tone}
                    onChange={setTone}
                    options={TONE_OPTIONS}
                    placeholder="Select a tone..."
                  />
                </div>

                {/* Length */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Blog Length
                  </label>
                  <Select
                    value={length}
                    onChange={setLength}
                    options={LENGTH_OPTIONS}
                    placeholder="Select length..."
                  />
                </div>

                {/* Generate button */}
                <button
                  onClick={handleGenerate}
                  disabled={!topic.trim() || loading}
                  className="w-full mt-2 py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2.5 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group"
                  style={{
                    background:
                      "linear-gradient(135deg, #7c3aed 0%, #9333ea 50%, #a855f7 100%)",
                    boxShadow: "0 4px 20px rgba(124, 58, 237, 0.35)",
                  }}
                >
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{
                      background:
                        "linear-gradient(135deg, #6d28d9 0%, #7c3aed 50%, #9333ea 100%)",
                    }}
                  />
                  <span className="relative flex items-center gap-2.5">
                    {loading ? (
                      <>
                        <Sparkles size={16} className="animate-spin" />
                        Generating{dots}
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        Generate Blog Post
                        <ArrowRight size={15} />
                      </>
                    )}
                  </span>
                </button>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    <span className="text-xs text-slate-500">
                      100% original &amp; plagiarism-free
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    <span className="text-xs text-slate-500">SEO ready</span>
                  </div>
                </div>

                {/* Reset button (shown after generation) */}
                {(generated || error) && (
                  <button
                    onClick={handleReset}
                    className="w-full py-2.5 rounded-xl text-slate-600 text-sm font-medium border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
                  >
                    ↺ Reset &amp; Start Over
                  </button>
                )}
              </div>
            </div>

            {/* ── Right Card: Preview ── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 flex flex-col min-h-[480px]">
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <FileText size={15} className="text-slate-500" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Preview
                    </h2>
                    <p className="text-xs text-slate-500">
                      Your generated post
                    </p>
                  </div>
                </div>
                {generated && !loading && (
                  <span className="text-xs bg-emerald-50 text-emerald-600 font-semibold px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 size={11} />
                    Ready
                  </span>
                )}
                {loading && (
                  <span className="text-xs bg-violet-50 text-violet-600 font-semibold px-2.5 py-1 rounded-full border border-violet-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse inline-block" />
                    Writing…
                  </span>
                )}
              </div>

              {/* Preview body */}
              <div className="flex-1 overflow-y-auto">
                {/* Loading state */}
                {loading && (
                  <div className="flex flex-col items-center justify-center h-full min-h-[340px]">
                    <div className="relative mb-5">
                      <div className="w-16 h-16 rounded-full border-4 border-violet-100 border-t-violet-500 animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles size={20} className="text-violet-500" />
                      </div>
                    </div>
                    <p className="text-slate-700 font-semibold text-sm">
                      Crafting your blog post{dots}
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                      This takes just a few seconds
                    </p>
                    <div className="mt-5 flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Error state */}
                {!loading && error && (
                  <div className="flex flex-col items-center justify-center h-full min-h-[340px] text-center px-6">
                    <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-4">
                      <X size={22} className="text-red-400" />
                    </div>
                    <p className="text-slate-700 font-semibold text-sm mb-2">
                      Generation failed
                    </p>
                    <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
                      {error}
                    </p>
                  </div>
                )}

                {/* Generated content */}
                {!loading && generated && (
                  <div className="p-1">
                    <GeneratedPost content={generated} />
                  </div>
                )}

                {/* Empty state */}
                {!loading && !generated && !error && (
                  <div className="flex flex-col items-center justify-center h-full min-h-[340px] text-center px-8">
                    <div className="w-16 h-16 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mb-4">
                      <BookOpen
                        size={26}
                        className="text-violet-400"
                        strokeWidth={1.5}
                      />
                    </div>
                    <p className="text-slate-700 font-semibold text-sm mb-2">
                      Your blog post will appear here
                    </p>
                    <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
                      Fill in the details on the left and click{" "}
                      <span className="text-violet-500 font-semibold">
                        Generate Blog Post
                      </span>{" "}
                      to create amazing content.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-400">
                      {["SEO Ready", "AI Powered", "100% Original"].map((tag) => (
                        <div key={tag} className="flex items-center gap-1">
                          <CheckCircle2 size={11} className="text-violet-400" />
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer note */}
        </div>
      </main>
    </div>
  );
}
