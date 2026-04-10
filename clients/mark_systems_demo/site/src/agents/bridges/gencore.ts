/**
 * Gencore Bridge — connects Mark Systems Mega-Lab to the Gencore FastAPI gateway
 * for multimodal, browser automation, voice, and Docker sandbox capabilities.
 *
 * Gencore runs locally at http://localhost:8080 by default.
 * Set GENCORE_URL and GENCORE_API_KEY in .env.local to enable.
 *
 * Graceful degradation: if Gencore is unreachable, return a `{status: 'offline'}`
 * response instead of throwing. Callers decide whether to fall back.
 */

const GENCORE_URL = process.env.GENCORE_URL ?? 'http://localhost:8080';
const GENCORE_API_KEY = process.env.GENCORE_API_KEY ?? '';
const TIMEOUT_MS = 10_000;

async function gencoreFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ status: 'success'; data: T } | { status: 'offline'; reason: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${GENCORE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(GENCORE_API_KEY && { Authorization: `Bearer ${GENCORE_API_KEY}` }),
        ...options.headers,
      },
    });
    clearTimeout(timer);

    if (!response.ok) {
      return { status: 'offline', reason: `HTTP ${response.status}` };
    }

    const data = (await response.json()) as T;
    return { status: 'success', data };
  } catch (error) {
    clearTimeout(timer);
    const reason = error instanceof Error ? error.message : String(error);
    return { status: 'offline', reason };
  }
}

/**
 * Generate an image via Gencore → Geargrinder MCP (DALL-E, SD, FLUX, Leonardo).
 */
export async function generateImage(prompt: string, options: {
  width?: number;
  height?: number;
  provider?: 'dall-e-3' | 'stable-diffusion' | 'flux' | 'leonardo';
} = {}) {
  return gencoreFetch<{ url: string; provider: string; costUsd: number }>(
    '/v1/images/generate',
    {
      method: 'POST',
      body: JSON.stringify({
        prompt,
        width: options.width ?? 1200,
        height: options.height ?? 630,
        provider: options.provider ?? 'flux',
      }),
    }
  );
}

/**
 * Take a screenshot of a URL via Playwright (for visual regression).
 */
export async function screenshot(url: string, options: {
  fullPage?: boolean;
  viewport?: { width: number; height: number };
} = {}) {
  return gencoreFetch<{ imageBase64: string; url: string }>('/v1/browser/screenshot', {
    method: 'POST',
    body: JSON.stringify({
      url,
      full_page: options.fullPage ?? false,
      viewport: options.viewport ?? { width: 1280, height: 720 },
    }),
  });
}

/**
 * Transcribe audio via Whisper (STT).
 */
export async function transcribe(audioBase64: string, options: { language?: string } = {}) {
  return gencoreFetch<{ text: string; language: string; duration: number }>(
    '/v1/voice/stt',
    {
      method: 'POST',
      body: JSON.stringify({
        audio_base64: audioBase64,
        language: options.language ?? 'fr',
      }),
    }
  );
}

/**
 * Synthesize speech via Edge TTS (300+ voices).
 */
export async function synthesize(text: string, options: { voice?: string } = {}) {
  return gencoreFetch<{ audioBase64: string; voice: string; duration: number }>(
    '/v1/voice/tts',
    {
      method: 'POST',
      body: JSON.stringify({
        text,
        voice: options.voice ?? 'fr-CA-SylvieNeural',
      }),
    }
  );
}

/**
 * Check if Gencore is online without making a real call.
 */
export async function healthCheck() {
  return gencoreFetch<{ status: string; version: string }>('/v1/health');
}
