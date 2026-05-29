/**
 * lib/ollama.ts
 * FINAL VERSION
 */

export interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  options?: {
    temperature?: number;
    num_predict?: number;
  };
}

export interface OllamaGenerateResponse {
  model: string;
  response: string;
  done: boolean;
}

export class OllamaConnectionError extends Error {}
export class OllamaTimeoutError extends Error {}

export class OllamaClient {
  private baseUrl: string;
  private timeoutMs: number;

  constructor(
    baseUrl = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434",
    timeoutMs = 300000 // 5 minutes
  ) {
    this.baseUrl = baseUrl;
    this.timeoutMs = timeoutMs;
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit
  ): Promise<Response> {
    const controller = new AbortController();

    const timer = setTimeout(() => {
      controller.abort();
    }, this.timeoutMs);

    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      return res;
    } catch (err: any) {
      if (err.name === "AbortError") {
        throw new OllamaTimeoutError("Request timed out");
      }

      throw new OllamaConnectionError(
        "Cannot connect to Ollama server"
      );
    } finally {
      clearTimeout(timer);
    }
  }

  async generate(
    request: OllamaGenerateRequest
  ): Promise<OllamaGenerateResponse> {
    const res = await this.fetchWithTimeout(
      `${this.baseUrl}/api/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...request,
          stream: false,
        }),
      }
    );

    if (!res.ok) {
      throw new Error(await res.text());
    }

    return res.json();
  }

  async listModels() {
    const res = await this.fetchWithTimeout(
      `${this.baseUrl}/api/tags`,
      {
        method: "GET",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch models");
    }

    return res.json();
  }
}

/**
 * Export SINGLE instance
 */
export const ollamaClient = new OllamaClient();