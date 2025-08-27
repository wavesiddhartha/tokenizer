export interface AIModel {
  id: string;
  name: string;
  provider: string;
  inputPrice: number; // Price per 1K tokens
  outputPrice: number; // Price per 1K tokens
  contextWindow: number;
  category: "gpt" | "claude" | "gemini" | "llama" | "mistral" | "other";
}

export interface TokenizationResult {
  modelId: string;
  tokenCount: number;
  characterCount: number;
  inputCost: number;
  outputCost: number;
  wordsCount: number;
  processingTime: number;
}

export const AI_MODELS: AIModel[] = [
  // OpenAI Models
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    inputPrice: 0.005, // $5 per 1K tokens
    outputPrice: 0.015, // $15 per 1K tokens
    contextWindow: 128000,
    category: "gpt",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    inputPrice: 0.00015, // $0.15 per 1K tokens
    outputPrice: 0.0006, // $0.60 per 1K tokens
    contextWindow: 128000,
    category: "gpt",
  },
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    provider: "OpenAI",
    inputPrice: 0.01, // $10 per 1K tokens
    outputPrice: 0.03, // $30 per 1K tokens
    contextWindow: 128000,
    category: "gpt",
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    inputPrice: 0.0005, // $0.50 per 1K tokens
    outputPrice: 0.0015, // $1.50 per 1K tokens
    contextWindow: 16385,
    category: "gpt",
  },

  // Anthropic Models
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    inputPrice: 0.003, // $3 per 1K tokens
    outputPrice: 0.015, // $15 per 1K tokens
    contextWindow: 200000,
    category: "claude",
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    inputPrice: 0.015, // $15 per 1K tokens
    outputPrice: 0.075, // $75 per 1K tokens
    contextWindow: 200000,
    category: "claude",
  },
  {
    id: "claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "Anthropic",
    inputPrice: 0.00025, // $0.25 per 1K tokens
    outputPrice: 0.00125, // $1.25 per 1K tokens
    contextWindow: 200000,
    category: "claude",
  },

  // Google Models
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    inputPrice: 0.0035, // $3.50 per 1K tokens
    outputPrice: 0.0105, // $10.50 per 1K tokens
    contextWindow: 2000000,
    category: "gemini",
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    provider: "Google",
    inputPrice: 0.000075, // $0.075 per 1K tokens
    outputPrice: 0.0003, // $0.30 per 1K tokens
    contextWindow: 1000000,
    category: "gemini",
  },
  {
    id: "gemini-1.0-pro",
    name: "Gemini 1.0 Pro",
    provider: "Google",
    inputPrice: 0.0005, // $0.50 per 1K tokens
    outputPrice: 0.0015, // $1.50 per 1K tokens
    contextWindow: 32760,
    category: "gemini",
  },

  // Meta Models
  {
    id: "llama-3.1-405b",
    name: "LLaMA 3.1 405B",
    provider: "Meta",
    inputPrice: 0.0016, // $1.60 per 1K tokens
    outputPrice: 0.0016, // $1.60 per 1K tokens
    contextWindow: 32768,
    category: "llama",
  },
  {
    id: "llama-3.1-70b",
    name: "LLaMA 3.1 70B",
    provider: "Meta",
    inputPrice: 0.00088, // $0.88 per 1K tokens
    outputPrice: 0.00088, // $0.88 per 1K tokens
    contextWindow: 32768,
    category: "llama",
  },

  // Mistral Models
  {
    id: "mistral-large",
    name: "Mistral Large",
    provider: "Mistral",
    inputPrice: 0.008, // $8 per 1K tokens
    outputPrice: 0.024, // $24 per 1K tokens
    contextWindow: 32768,
    category: "mistral",
  },
  {
    id: "mistral-medium",
    name: "Mistral Medium",
    provider: "Mistral",
    inputPrice: 0.0027, // $2.70 per 1K tokens
    outputPrice: 0.0081, // $8.10 per 1K tokens
    contextWindow: 32768,
    category: "mistral",
  },

  // Other Models
  {
    id: "command-r-plus",
    name: "Command R+",
    provider: "Cohere",
    inputPrice: 0.003, // $3 per 1K tokens
    outputPrice: 0.015, // $15 per 1K tokens
    contextWindow: 128000,
    category: "other",
  },
];

// Mock tokenizer functions
function mockGPTTokenizer(text: string): number {
  // GPT models generally use ~4 characters per token on average
  return Math.ceil(text.length / 4);
}

function mockClaudeTokenizer(text: string): number {
  // Claude models generally use ~3.5 characters per token on average
  return Math.ceil(text.length / 3.5);
}

function mockGeminiTokenizer(text: string): number {
  // Gemini models generally use ~3.8 characters per token on average
  return Math.ceil(text.length / 3.8);
}

function mockLlamaTokenizer(text: string): number {
  // LLaMA models generally use ~4.2 characters per token on average
  return Math.ceil(text.length / 4.2);
}

function mockMistralTokenizer(text: string): number {
  // Mistral models generally use ~3.9 characters per token on average
  return Math.ceil(text.length / 3.9);
}

function mockOtherTokenizer(text: string): number {
  // Other models generally use ~4 characters per token on average
  return Math.ceil(text.length / 4);
}

export function tokenizeText(text: string, model: AIModel): TokenizationResult {
  const startTime = performance.now();
  
  let tokenCount: number;
  
  // Use different tokenizers based on model category
  switch (model.category) {
    case "gpt":
      tokenCount = mockGPTTokenizer(text);
      break;
    case "claude":
      tokenCount = mockClaudeTokenizer(text);
      break;
    case "gemini":
      tokenCount = mockGeminiTokenizer(text);
      break;
    case "llama":
      tokenCount = mockLlamaTokenizer(text);
      break;
    case "mistral":
      tokenCount = mockMistralTokenizer(text);
      break;
    default:
      tokenCount = mockOtherTokenizer(text);
  }

  const characterCount = text.length;
  const wordsCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const inputCost = (tokenCount / 1000) * model.inputPrice;
  const outputCost = (tokenCount / 1000) * model.outputPrice;
  const processingTime = performance.now() - startTime;

  return {
    modelId: model.id,
    tokenCount,
    characterCount,
    inputCost,
    outputCost,
    wordsCount,
    processingTime,
  };
}

export function tokenizeAllModels(text: string): TokenizationResult[] {
  return AI_MODELS.map(model => tokenizeText(text, model));
}

export function getModelById(id: string): AIModel | undefined {
  return AI_MODELS.find(model => model.id === id);
}

export function getModelsByProvider(provider: string): AIModel[] {
  return AI_MODELS.filter(model => model.provider === provider);
}

export function getModelsByCategory(category: string): AIModel[] {
  return AI_MODELS.filter(model => model.category === category);
}