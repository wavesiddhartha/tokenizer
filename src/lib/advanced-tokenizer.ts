// Advanced Tokenization utilities with real tokenizers for multiple AI models
import { encode as gptEncode, decode as gptDecode } from 'gpt-tokenizer';
import { getEncoding } from 'js-tiktoken';

export interface DetailedTokenizationResult {
  modelId: string;
  tokenCount: number;
  tokens: number[];
  tokenStrings: string[];
  characterCount: number;
  wordsCount: number;
  inputCost: number;
  outputCost: number;
  processingTime: number;
  efficiency: number;
  compressionRatio: number;
}

export interface DetailedTokenInfo {
  token: string;
  id: number;
  startIndex: number;
  endIndex: number;
  length: number;
  frequency: number;
  semanticType: 'word' | 'punctuation' | 'whitespace' | 'number' | 'special';
}

export interface TokenAnalytics {
  totalTokens: number;
  uniqueTokens: number;
  averageTokenLength: number;
  longestToken: string;
  shortestToken: string;
  mostFrequentToken: string;
  tokenLengthDistribution: { [length: number]: number };
  semanticDistribution: { [type: string]: number };
}

// Real tokenization functions using actual tokenizer libraries
function tokenizeWithTiktoken(text: string, modelName: string): { tokens: number[]; tokenStrings: string[] } {
  try {
    let encoding;
    
    // Map model names to tiktoken encodings
    switch (modelName) {
      case 'gpt-4':
      case 'gpt-4-turbo':
      case 'gpt-4o':
      case 'gpt-4o-mini':
        encoding = getEncoding('cl100k_base');
        break;
      case 'gpt-3.5-turbo':
        encoding = getEncoding('cl100k_base');
        break;
      default:
        encoding = getEncoding('cl100k_base');
    }
    
    const tokens = encoding.encode(text);
    const tokenStrings = tokens.map(token => {
      try {
        return encoding.decode([token]);
      } catch {
        return `<${token}>`;
      }
    });
    
    encoding.free();
    return { tokens: Array.from(tokens), tokenStrings };
  } catch (error) {
    // Fallback to simple tokenization
    const words = text.match(/\S+|\s+/g) || [];
    const tokens = words.map((_, i) => i);
    return { tokens, tokenStrings: words };
  }
}

function tokenizeWithGptTokenizer(text: string): { tokens: number[]; tokenStrings: string[] } {
  try {
    const tokens = gptEncode(text);
    const tokenStrings = tokens.map(token => {
      try {
        return gptDecode([token]);
      } catch {
        return `<${token}>`;
      }
    });
    
    return { tokens: Array.from(tokens), tokenStrings };
  } catch (error) {
    // Fallback tokenization
    const words = text.match(/\S+|\s+/g) || [];
    const tokens = words.map((_, i) => i);
    return { tokens, tokenStrings: words };
  }
}

function mockTokenizeOtherModels(text: string, avgCharsPerToken: number): { tokens: number[]; tokenStrings: string[] } {
  // Enhanced heuristic tokenization for non-OpenAI models
  const segments = text.match(/\S+|\s+/g) || [];
  const tokens: number[] = [];
  const tokenStrings: string[] = [];
  
  let tokenId = 0;
  
  segments.forEach(segment => {
    if (/^\s+$/.test(segment)) {
      // Whitespace - usually one token
      tokens.push(tokenId++);
      tokenStrings.push(segment);
    } else {
      // Word/punctuation - split based on model characteristics
      if (segment.length <= avgCharsPerToken) {
        tokens.push(tokenId++);
        tokenStrings.push(segment);
      } else {
        // Split longer words into subword tokens
        const numTokens = Math.ceil(segment.length / avgCharsPerToken);
        const tokensPerSegment = Math.ceil(segment.length / numTokens);
        
        for (let i = 0; i < segment.length; i += tokensPerSegment) {
          const tokenStr = segment.substring(i, i + tokensPerSegment);
          tokens.push(tokenId++);
          tokenStrings.push(tokenStr);
        }
      }
    }
  });
  
  return { tokens, tokenStrings };
}

export function detailedTokenizeText(text: string, modelId: string, avgCharsPerToken: number = 4): DetailedTokenizationResult {
  const startTime = performance.now();
  let tokens: number[] = [];
  let tokenStrings: string[] = [];
  
  // Use appropriate tokenizer based on model
  if (modelId.includes('gpt') || modelId.includes('openai')) {
    if (modelId === 'gpt-3.5-turbo' || modelId === 'gpt-4' || modelId === 'gpt-4o' || modelId === 'gpt-4-turbo') {
      const result = tokenizeWithTiktoken(text, modelId);
      tokens = result.tokens;
      tokenStrings = result.tokenStrings;
    } else {
      const result = tokenizeWithGptTokenizer(text);
      tokens = result.tokens;
      tokenStrings = result.tokenStrings;
    }
  } else {
    const result = mockTokenizeOtherModels(text, avgCharsPerToken);
    tokens = result.tokens;
    tokenStrings = result.tokenStrings;
  }
  
  const endTime = performance.now();
  
  const tokenCount = tokens.length;
  const characterCount = text.length;
  const wordsCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  
  const efficiency = tokenCount > 0 ? characterCount / tokenCount : 0;
  const compressionRatio = characterCount > 0 ? tokenCount / characterCount : 1;
  const processingTime = endTime - startTime;

  return {
    modelId,
    tokenCount,
    tokens,
    tokenStrings,
    characterCount,
    wordsCount,
    inputCost: 0, // Will be calculated elsewhere with pricing
    outputCost: 0, // Will be calculated elsewhere with pricing
    processingTime,
    efficiency,
    compressionRatio
  };
}

export function getDetailedTokenInfo(text: string, modelId: string): DetailedTokenInfo[] {
  const result = detailedTokenizeText(text, modelId);
  const tokenFreq: { [key: string]: number } = {};
  
  // Count token frequencies
  result.tokenStrings.forEach(token => {
    tokenFreq[token] = (tokenFreq[token] || 0) + 1;
  });
  
  let currentIndex = 0;
  return result.tokenStrings.map((token, i) => {
    const startIndex = currentIndex;
    const endIndex = currentIndex + token.length;
    currentIndex = endIndex;
    
    // Determine semantic type
    let semanticType: DetailedTokenInfo['semanticType'] = 'special';
    if (/^\s+$/.test(token)) {
      semanticType = 'whitespace';
    } else if (/^[a-zA-Z]+$/.test(token)) {
      semanticType = 'word';
    } else if (/^\d+$/.test(token)) {
      semanticType = 'number';
    } else if (/^[^\w\s]+$/.test(token)) {
      semanticType = 'punctuation';
    }
    
    return {
      token,
      id: result.tokens[i],
      startIndex,
      endIndex,
      length: token.length,
      frequency: tokenFreq[token],
      semanticType
    };
  });
}

export function analyzeTokens(tokenInfo: DetailedTokenInfo[]): TokenAnalytics {
  const uniqueTokens = new Set(tokenInfo.map(t => t.token)).size;
  const totalTokens = tokenInfo.length;
  
  const tokenLengths = tokenInfo.map(t => t.length);
  const averageTokenLength = tokenLengths.reduce((sum, len) => sum + len, 0) / tokenLengths.length;
  
  const sortedByLength = tokenInfo.slice().sort((a, b) => b.length - a.length);
  const longestToken = sortedByLength[0]?.token || '';
  const shortestToken = sortedByLength[sortedByLength.length - 1]?.token || '';
  
  // Find most frequent token
  const tokenCounts: { [token: string]: number } = {};
  tokenInfo.forEach(t => {
    tokenCounts[t.token] = (tokenCounts[t.token] || 0) + 1;
  });
  const mostFrequentToken = Object.entries(tokenCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || '';
  
  // Length distribution
  const tokenLengthDistribution: { [length: number]: number } = {};
  tokenInfo.forEach(t => {
    tokenLengthDistribution[t.length] = (tokenLengthDistribution[t.length] || 0) + 1;
  });
  
  // Semantic distribution
  const semanticDistribution: { [type: string]: number } = {};
  tokenInfo.forEach(t => {
    semanticDistribution[t.semanticType] = (semanticDistribution[t.semanticType] || 0) + 1;
  });
  
  return {
    totalTokens,
    uniqueTokens,
    averageTokenLength,
    longestToken,
    shortestToken,
    mostFrequentToken,
    tokenLengthDistribution,
    semanticDistribution
  };
}

export function compareTokenizations(text: string, modelIds: string[], avgCharsPerToken: { [modelId: string]: number } = {}): {
  results: DetailedTokenizationResult[];
  bestEfficiency: DetailedTokenizationResult;
  worstEfficiency: DetailedTokenizationResult;
  averageTokenCount: number;
  tokenCountVariance: number;
} {
  const results = modelIds.map(id => 
    detailedTokenizeText(text, id, avgCharsPerToken[id] || 4)
  );
  
  const bestEfficiency = results.reduce((best, current) => 
    current.efficiency > best.efficiency ? current : best
  );
  
  const worstEfficiency = results.reduce((worst, current) => 
    current.efficiency < worst.efficiency ? current : worst
  );
  
  const averageTokenCount = results.reduce((sum, r) => sum + r.tokenCount, 0) / results.length;
  
  const tokenCountVariance = results.reduce((sum, r) => 
    sum + Math.pow(r.tokenCount - averageTokenCount, 2), 0
  ) / results.length;
  
  return {
    results,
    bestEfficiency,
    worstEfficiency,
    averageTokenCount,
    tokenCountVariance
  };
}

// Enhanced token visualization helpers
export function visualizeTokensAdvanced(tokenInfo: DetailedTokenInfo[], colorMode: string = 'semantic'): Array<{
  token: string;
  id: number;
  color: string;
  info: DetailedTokenInfo;
}> {
  const semanticColors = {
    word: 'bg-blue-100 border-blue-300 text-blue-900 hover:bg-blue-200',
    punctuation: 'bg-red-100 border-red-300 text-red-900 hover:bg-red-200',
    whitespace: 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200',
    number: 'bg-green-100 border-green-300 text-green-900 hover:bg-green-200',
    special: 'bg-purple-100 border-purple-300 text-purple-900 hover:bg-purple-200'
  };
  
  const frequencyColors = {
    1: 'bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200',
    2: 'bg-blue-100 border-blue-300 text-blue-900 hover:bg-blue-200',
    3: 'bg-green-100 border-green-300 text-green-900 hover:bg-green-200',
    4: 'bg-yellow-100 border-yellow-300 text-yellow-900 hover:bg-yellow-200',
    5: 'bg-red-100 border-red-300 text-red-900 hover:bg-red-200'
  };
  
  const lengthColors = {
    1: 'bg-red-100 border-red-300 text-red-900 hover:bg-red-200',
    2: 'bg-orange-100 border-orange-300 text-orange-900 hover:bg-orange-200',
    3: 'bg-yellow-100 border-yellow-300 text-yellow-900 hover:bg-yellow-200',
    4: 'bg-green-100 border-green-300 text-green-900 hover:bg-green-200',
    5: 'bg-blue-100 border-blue-300 text-blue-900 hover:bg-blue-200'
  };
  
  return tokenInfo.map(token => {
    let color = '';
    
    switch (colorMode) {
      case 'semantic':
        color = semanticColors[token.semanticType];
        break;
      case 'frequency':
        const freq = Math.min(token.frequency, 5);
        color = frequencyColors[freq as keyof typeof frequencyColors];
        break;
      case 'length':
        const len = Math.min(token.length, 5);
        color = lengthColors[len as keyof typeof lengthColors];
        break;
      default:
        color = 'bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200';
    }
    
    return {
      token: token.token,
      id: token.id,
      color,
      info: token
    };
  });
}