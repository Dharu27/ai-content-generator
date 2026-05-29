/**
 * lib/prompts.ts
 * Centralised prompt builders — keeps API route clean
 */

export interface BlogPromptInput {
  topic: string;
  tone: string;
  length: string;
}

const WORD_COUNTS: Record<string, number> = {
  short: 800,
  medium: 1200,
  long: 2000,
};

export function buildBlogPrompt(input: BlogPromptInput): string {
  const words = WORD_COUNTS[input.length] ?? 1200;

  return `You are an expert content writer. Write a complete, high-quality blog post.

Topic: ${input.topic}
Tone: ${input.tone}
Target length: approximately ${words} words

Formatting rules:
- Start with a compelling title using "# Title"
- Write 3-4 sections each with "## Section Heading"  
- Use plain paragraphs (no bullet lists unless absolutely necessary)
- End with a short conclusion
- Do NOT wrap output in code blocks
- Output only the blog post content, nothing else

Write the blog post now:`;
}

export function buildSystemPrompt(tone: string): string {
  const toneGuides: Record<string, string> = {
    professional:
      "You write in a clear, authoritative, and formal tone suited for business audiences.",
    casual:
      "You write in a relaxed, conversational tone — like talking to a friend.",
    friendly:
      "You write warmly and encouragingly, making readers feel welcome and supported.",
    persuasive:
      "You write compelling, action-oriented content that motivates readers to act.",
    creative:
      "You write with vivid language, metaphors, and storytelling to captivate readers.",
  };

  return (
    toneGuides[tone.toLowerCase()] ??
    "You write clear, engaging, and well-structured content."
  );
}
