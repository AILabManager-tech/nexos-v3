import '@testing-library/jest-dom/vitest';

// Force deterministic test environment — no network calls to LLM providers.
process.env.LLM_ADAPTER = 'mock';
process.env.ANTHROPIC_API_KEY = '';
process.env.OPENAI_API_KEY = '';
process.env.DATABASE_URL = '';
process.env.GENCORE_URL = '';
