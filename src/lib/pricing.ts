// LLM API pricing data (as of December 2025)
// Prices are per 1M tokens (displayed) and per 1K tokens (for calculations)

export interface ModelPricing {
  name: string;
  displayName: string;
  provider: 'openai' | 'anthropic' | 'google';
  input: number;  // $ per 1K input tokens
  output: number; // $ per 1K output tokens
  inputPer1M: number;  // $ per 1M input tokens (for display)
  outputPer1M: number; // $ per 1M output tokens (for display)
  description: string;
}

export const MODEL_PRICING: Record<string, ModelPricing> = {
  // OpenAI Models
  'gpt-5.1': {
    name: 'gpt-5.1',
    displayName: 'GPT-5.1',
    provider: 'openai',
    input: 0.00125,      // $1.25 / 1M
    output: 0.01,        // $10 / 1M
    inputPer1M: 1.25,
    outputPer1M: 10.00,
    description: 'Best for coding and agentic tasks',
  },
  'gpt-5-mini': {
    name: 'gpt-5-mini',
    displayName: 'GPT-5 mini',
    provider: 'openai',
    input: 0.00025,      // $0.25 / 1M
    output: 0.002,       // $2 / 1M
    inputPer1M: 0.25,
    outputPer1M: 2.00,
    description: 'Faster, cheaper for well-defined tasks',
  },
  'gpt-5-nano': {
    name: 'gpt-5-nano',
    displayName: 'GPT-5 nano',
    provider: 'openai',
    input: 0.00005,      // $0.05 / 1M
    output: 0.0004,      // $0.40 / 1M
    inputPer1M: 0.05,
    outputPer1M: 0.40,
    description: 'Fastest and cheapest, great for summarization',
  },
  'gpt-5-pro': {
    name: 'gpt-5-pro',
    displayName: 'GPT-5 pro',
    provider: 'openai',
    input: 0.015,        // $15 / 1M
    output: 0.12,        // $120 / 1M
    inputPer1M: 15.00,
    outputPer1M: 120.00,
    description: 'Smartest and most precise model',
  },

  // Anthropic Models
  'claude-opus-4.5': {
    name: 'claude-opus-4.5',
    displayName: 'Claude Opus 4.5',
    provider: 'anthropic',
    input: 0.005,        // $5 / 1M
    output: 0.025,       // $25 / 1M
    inputPer1M: 5.00,
    outputPer1M: 25.00,
    description: 'Frontier performance, best for complex reasoning',
  },

  // Google Models
  'gemini-3-pro': {
    name: 'gemini-3-pro',
    displayName: 'Gemini 3 Pro',
    provider: 'google',
    input: 0.002,        // $2 / 1M
    output: 0.012,       // $12 / 1M
    inputPer1M: 2.00,
    outputPer1M: 12.00,
    description: 'Best for multimodal understanding and agentic tasks',
  },
};

export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): { inputCost: number; outputCost: number; totalCost: number } {
  const pricing = MODEL_PRICING[model];

  if (!pricing) {
    return { inputCost: 0, outputCost: 0, totalCost: 0 };
  }

  const inputCost = (inputTokens / 1000) * pricing.input;
  const outputCost = (outputTokens / 1000) * pricing.output;
  const totalCost = inputCost + outputCost;

  return { inputCost, outputCost, totalCost };
}

export function formatCost(cost: number): string {
  if (cost === 0) return '$0.00';
  if (cost < 0.0001) return `$${cost.toFixed(6)}`;
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  return `$${cost.toFixed(2)}`;
}

export const MODEL_OPTIONS = Object.values(MODEL_PRICING);

// Group models by provider for display
export const MODELS_BY_PROVIDER = {
  openai: MODEL_OPTIONS.filter(m => m.provider === 'openai'),
  anthropic: MODEL_OPTIONS.filter(m => m.provider === 'anthropic'),
  google: MODEL_OPTIONS.filter(m => m.provider === 'google'),
};

// Example prompts for the demo
export const EXAMPLE_PROMPTS = [
  {
    name: 'Simple question',
    prompt: 'What is the capital of France?',
    expectedOutput: 'The capital of France is Paris.',
  },
  {
    name: 'Code generation',
    prompt: 'Write a Python function that checks if a number is prime.',
    expectedOutput: `def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True`,
  },
  {
    name: 'Creative writing',
    prompt: 'Write a haiku about programming.',
    expectedOutput: `Code flows like water
Bugs emerge from the shadows
Debug until dawn`,
  },
  {
    name: 'Summarization',
    prompt: 'Summarize the key benefits of using TypeScript over JavaScript in three bullet points.',
    expectedOutput: `• Type safety catches errors at compile time, reducing runtime bugs
• Better IDE support with autocomplete, refactoring, and documentation
• Improved code maintainability and self-documentation through explicit types`,
  },
];
