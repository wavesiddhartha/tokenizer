export interface EncodingResult {
  format: string;
  content: string;
  bytes: number;
  success: boolean;
  error?: string;
}

export interface CharacterAnalysis {
  char: string;
  unicode: string;
  decimal: number;
  hex: string;
  binary: string;
  octal: string;
  frequency: number;
  category: string;
}

export interface TextStatistics {
  totalCharacters: number;
  uniqueCharacters: number;
  words: number;
  lines: number;
  sentences: number;
  paragraphs: number;
  bytes: number;
  entropy: number;
  characterFrequency: { [char: string]: number };
  topCharacters: Array<{ char: string; count: number; percentage: number }>;
}

// Encoding functions
export function textToBinary(text: string): EncodingResult {
  try {
    const binary = Array.from(text)
      .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join(' ');
    
    return {
      format: "Binary",
      content: binary,
      bytes: text.length,
      success: true,
    };
  } catch (error) {
    return {
      format: "Binary",
      content: "",
      bytes: 0,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export function textToHex(text: string): EncodingResult {
  try {
    const hex = Array.from(text)
      .map(char => char.charCodeAt(0).toString(16).padStart(2, '0').toUpperCase())
      .join(' ');
    
    return {
      format: "Hexadecimal",
      content: hex,
      bytes: text.length,
      success: true,
    };
  } catch (error) {
    return {
      format: "Hexadecimal",
      content: "",
      bytes: 0,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export function textToBase64(text: string): EncodingResult {
  try {
    const base64 = btoa(unescape(encodeURIComponent(text)));
    
    return {
      format: "Base64",
      content: base64,
      bytes: Math.ceil((text.length * 4) / 3),
      success: true,
    };
  } catch (error) {
    return {
      format: "Base64",
      content: "",
      bytes: 0,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export function textToASCII(text: string): EncodingResult {
  try {
    const ascii = Array.from(text)
      .map(char => char.charCodeAt(0))
      .join(' ');
    
    return {
      format: "ASCII Codes",
      content: ascii,
      bytes: text.length,
      success: true,
    };
  } catch (error) {
    return {
      format: "ASCII Codes",
      content: "",
      bytes: 0,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export function textToOctal(text: string): EncodingResult {
  try {
    const octal = Array.from(text)
      .map(char => char.charCodeAt(0).toString(8).padStart(3, '0'))
      .join(' ');
    
    return {
      format: "Octal",
      content: octal,
      bytes: text.length,
      success: true,
    };
  } catch (error) {
    return {
      format: "Octal",
      content: "",
      bytes: 0,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export function textToUnicode(text: string): EncodingResult {
  try {
    const unicode = Array.from(text)
      .map(char => `U+${char.codePointAt(0)?.toString(16).padStart(4, '0').toUpperCase()}`)
      .join(' ');
    
    return {
      format: "Unicode",
      content: unicode,
      bytes: text.length * 2, // Approximate for UTF-16
      success: true,
    };
  } catch (error) {
    return {
      format: "Unicode",
      content: "",
      bytes: 0,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export function createHexDump(text: string): EncodingResult {
  try {
    const bytes = new TextEncoder().encode(text);
    let hexDump = "";
    
    for (let i = 0; i < bytes.length; i += 16) {
      const chunk = bytes.slice(i, i + 16);
      const offset = i.toString(16).padStart(8, '0').toUpperCase();
      
      const hex = Array.from(chunk)
        .map(byte => byte.toString(16).padStart(2, '0').toUpperCase())
        .join(' ')
        .padEnd(47, ' '); // 16 * 3 - 1 = 47
      
      const ascii = Array.from(chunk)
        .map(byte => (byte >= 32 && byte <= 126) ? String.fromCharCode(byte) : '.')
        .join('');
      
      hexDump += `${offset}  ${hex}  |${ascii}|\n`;
    }
    
    return {
      format: "Hex Dump",
      content: hexDump.trim(),
      bytes: bytes.length,
      success: true,
    };
  } catch (error) {
    return {
      format: "Hex Dump",
      content: "",
      bytes: 0,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Decoding functions
export function binaryToText(binary: string): EncodingResult {
  try {
    const cleanBinary = binary.replace(/\s+/g, '');
    if (cleanBinary.length % 8 !== 0) {
      throw new Error("Binary string length must be divisible by 8");
    }
    
    let text = "";
    for (let i = 0; i < cleanBinary.length; i += 8) {
      const byte = cleanBinary.substr(i, 8);
      text += String.fromCharCode(parseInt(byte, 2));
    }
    
    return {
      format: "Text from Binary",
      content: text,
      bytes: text.length,
      success: true,
    };
  } catch (error) {
    return {
      format: "Text from Binary",
      content: "",
      bytes: 0,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export function hexToText(hex: string): EncodingResult {
  try {
    const cleanHex = hex.replace(/\s+/g, '');
    if (cleanHex.length % 2 !== 0) {
      throw new Error("Hex string length must be even");
    }
    
    let text = "";
    for (let i = 0; i < cleanHex.length; i += 2) {
      const byte = cleanHex.substr(i, 2);
      text += String.fromCharCode(parseInt(byte, 16));
    }
    
    return {
      format: "Text from Hex",
      content: text,
      bytes: text.length,
      success: true,
    };
  } catch (error) {
    return {
      format: "Text from Hex",
      content: "",
      bytes: 0,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export function base64ToText(base64: string): EncodingResult {
  try {
    const text = decodeURIComponent(escape(atob(base64)));
    
    return {
      format: "Text from Base64",
      content: text,
      bytes: text.length,
      success: true,
    };
  } catch (error) {
    return {
      format: "Text from Base64",
      content: "",
      bytes: 0,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Analysis functions
export function analyzeCharacters(text: string): CharacterAnalysis[] {
  const chars = Array.from(new Set(text));
  const charFrequency: { [char: string]: number } = {};
  
  // Count character frequencies
  for (const char of text) {
    charFrequency[char] = (charFrequency[char] || 0) + 1;
  }
  
  return chars.map(char => {
    const codePoint = char.codePointAt(0) || 0;
    
    return {
      char: char === ' ' ? '␣' : char === '\n' ? '↵' : char === '\t' ? '→' : char,
      unicode: `U+${codePoint.toString(16).padStart(4, '0').toUpperCase()}`,
      decimal: codePoint,
      hex: `0x${codePoint.toString(16).toUpperCase()}`,
      binary: codePoint.toString(2).padStart(8, '0'),
      octal: `0${codePoint.toString(8)}`,
      frequency: charFrequency[char],
      category: getUnicodeCategory(codePoint),
    };
  }).sort((a, b) => b.frequency - a.frequency);
}

export function calculateTextStatistics(text: string): TextStatistics {
  const chars = Array.from(text);
  const uniqueChars = Array.from(new Set(chars));
  const charFrequency: { [char: string]: number } = {};
  
  // Count character frequencies
  for (const char of chars) {
    charFrequency[char] = (charFrequency[char] || 0) + 1;
  }
  
  // Calculate entropy
  const entropy = -uniqueChars.reduce((sum, char) => {
    const p = charFrequency[char] / chars.length;
    return sum + (p * Math.log2(p));
  }, 0);
  
  // Get top characters
  const topCharacters = Object.entries(charFrequency)
    .map(([char, count]) => ({
      char: char === ' ' ? '␣' : char === '\n' ? '↵' : char === '\t' ? '→' : char,
      count,
      percentage: (count / chars.length) * 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text.split('\n').length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;
  const bytes = new TextEncoder().encode(text).length;
  
  return {
    totalCharacters: chars.length,
    uniqueCharacters: uniqueChars.length,
    words,
    lines,
    sentences,
    paragraphs,
    bytes,
    entropy: isFinite(entropy) ? entropy : 0,
    characterFrequency: charFrequency,
    topCharacters,
  };
}

function getUnicodeCategory(codePoint: number): string {
  if (codePoint >= 0x0000 && codePoint <= 0x001F) return "Control";
  if (codePoint >= 0x0020 && codePoint <= 0x007F) return "Basic Latin";
  if (codePoint >= 0x0080 && codePoint <= 0x00FF) return "Latin-1 Supplement";
  if (codePoint >= 0x0100 && codePoint <= 0x017F) return "Latin Extended-A";
  if (codePoint >= 0x0180 && codePoint <= 0x024F) return "Latin Extended-B";
  if (codePoint >= 0x1E00 && codePoint <= 0x1EFF) return "Latin Extended Additional";
  if (codePoint >= 0x2000 && codePoint <= 0x206F) return "General Punctuation";
  if (codePoint >= 0x20A0 && codePoint <= 0x20CF) return "Currency Symbols";
  if (codePoint >= 0x2100 && codePoint <= 0x214F) return "Letterlike Symbols";
  if (codePoint >= 0x2190 && codePoint <= 0x21FF) return "Arrows";
  if (codePoint >= 0x2200 && codePoint <= 0x22FF) return "Mathematical Operators";
  if (codePoint >= 0x0400 && codePoint <= 0x04FF) return "Cyrillic";
  if (codePoint >= 0x0590 && codePoint <= 0x05FF) return "Hebrew";
  if (codePoint >= 0x0600 && codePoint <= 0x06FF) return "Arabic";
  if (codePoint >= 0x4E00 && codePoint <= 0x9FFF) return "CJK Unified Ideographs";
  if (codePoint >= 0x3040 && codePoint <= 0x309F) return "Hiragana";
  if (codePoint >= 0x30A0 && codePoint <= 0x30FF) return "Katakana";
  return "Other";
}

export const ENCODING_FORMATS = [
  { id: "binary", name: "Binary", description: "Convert to binary representation" },
  { id: "hex", name: "Hexadecimal", description: "Convert to hexadecimal" },
  { id: "base64", name: "Base64", description: "Convert to Base64 encoding" },
  { id: "ascii", name: "ASCII", description: "Show ASCII character codes" },
  { id: "unicode", name: "Unicode", description: "Show Unicode code points" },
  { id: "octal", name: "Octal", description: "Convert to octal representation" },
  { id: "hexdump", name: "Hex Dump", description: "Traditional hex dump format" },
];

export function encodeText(text: string, format: string): EncodingResult {
  switch (format.toLowerCase()) {
    case "binary":
      return textToBinary(text);
    case "hex":
    case "hexadecimal":
      return textToHex(text);
    case "base64":
      return textToBase64(text);
    case "ascii":
      return textToASCII(text);
    case "unicode":
      return textToUnicode(text);
    case "octal":
      return textToOctal(text);
    case "hexdump":
      return createHexDump(text);
    default:
      return {
        format,
        content: "",
        bytes: 0,
        success: false,
        error: `Unsupported format: ${format}`,
      };
  }
}