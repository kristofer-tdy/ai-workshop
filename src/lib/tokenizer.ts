// Simplified tokenization simulation
// This is not a real tokenizer like tiktoken, but approximates behavior for educational purposes

export interface Token {
  text: string;
  id: number;
}

// Common English words that typically stay together in subword tokenization
const COMMON_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
  'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought',
  'used', 'this', 'that', 'these', 'those', 'it', 'its', 'he', 'she', 'they',
  'we', 'you', 'I', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his',
  'our', 'their', 'what', 'which', 'who', 'whom', 'whose', 'where', 'when',
  'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other',
  'some', 'such', 'no', 'nor', 'not', 'only', 'same', 'so', 'than', 'too',
  'very', 'just', 'hello', 'world', 'hi', 'yes', 'no', 'please', 'thank',
  'thanks', 'sorry', 'good', 'great', 'nice', 'okay', 'ok', 'well', 'now',
  'here', 'there', 'then', 'today', 'if', 'else', 'while', 'let', 'cat',
  'sat', 'on', 'mat', 'dog', 'ran', 'fast'
]);

// Common prefixes and suffixes for subword splitting
const PREFIXES = ['un', 're', 'pre', 'dis', 'mis', 'non', 'anti', 'auto', 'semi'];
const SUFFIXES = ['ing', 'ed', 'er', 'est', 'ly', 'tion', 'sion', 'ness', 'ment', 'able', 'ible', 'ful', 'less', 'ous', 'ive', 'al', 'ial'];

// Emoji regex pattern
const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]/gu;

/**
 * Word-level tokenization
 * Splits on whitespace and punctuation
 */
export function tokenizeWord(text: string): Token[] {
  if (!text.trim()) return [];

  // Split by whitespace, keeping punctuation as separate tokens
  const parts = text.split(/(\s+|[.,!?;:'"()[\]{}])/);

  let id = 0;
  return parts
    .filter(part => part.trim() !== '')
    .map(part => ({
      text: part,
      id: id++,
    }));
}

/**
 * Character-level tokenization
 * Each character becomes a token
 */
export function tokenizeCharacter(text: string): Token[] {
  if (!text) return [];

  return [...text].map((char, id) => ({
    text: char,
    id,
  }));
}

/**
 * Subword tokenization (BPE-like simulation)
 * Approximates how models like GPT tokenize text
 */
export function tokenizeSubword(text: string): Token[] {
  if (!text.trim()) return [];

  const tokens: Token[] = [];
  let id = 0;

  // First, split by whitespace and punctuation, preserving delimiters
  const parts = text.split(/(\s+|[.,!?;:'"()[\]{}])/);

  for (const part of parts) {
    if (!part) continue;

    // Handle whitespace
    if (/^\s+$/.test(part)) {
      // In real tokenizers, spaces are often attached to following words
      // We'll keep single spaces as tokens for visibility
      if (part === ' ') {
        tokens.push({ text: ' ', id: id++ });
      } else {
        // Multiple spaces become one token
        tokens.push({ text: part, id: id++ });
      }
      continue;
    }

    // Handle punctuation
    if (/^[.,!?;:'"()[\]{}]$/.test(part)) {
      tokens.push({ text: part, id: id++ });
      continue;
    }

    // Handle emojis - each emoji is its own token
    const emojiMatches = part.match(EMOJI_REGEX);
    if (emojiMatches) {
      let remaining = part;
      for (const emoji of emojiMatches) {
        const emojiIndex = remaining.indexOf(emoji);
        if (emojiIndex > 0) {
          // Text before emoji
          const before = remaining.slice(0, emojiIndex);
          tokens.push(...splitSubword(before, id));
          id = tokens.length;
        }
        tokens.push({ text: emoji, id: id++ });
        remaining = remaining.slice(emojiIndex + emoji.length);
      }
      if (remaining) {
        tokens.push(...splitSubword(remaining, id));
        id = tokens.length;
      }
      continue;
    }

    // Handle regular words
    tokens.push(...splitSubword(part, id));
    id = tokens.length;
  }

  // Re-index tokens
  return tokens.map((token, index) => ({ ...token, id: index }));
}

/**
 * Split a word into subword tokens
 */
function splitSubword(word: string, startId: number): Token[] {
  const lower = word.toLowerCase();

  // Common words stay together
  if (COMMON_WORDS.has(lower)) {
    return [{ text: word, id: startId }];
  }

  // Short words stay together
  if (word.length <= 4) {
    return [{ text: word, id: startId }];
  }

  const tokens: Token[] = [];
  let remaining = word;
  let id = startId;

  // Check for prefixes
  for (const prefix of PREFIXES) {
    if (lower.startsWith(prefix) && remaining.length > prefix.length + 2) {
      tokens.push({ text: remaining.slice(0, prefix.length), id: id++ });
      remaining = remaining.slice(prefix.length);
      break;
    }
  }

  // Check for suffixes
  let suffix = '';
  for (const suf of SUFFIXES) {
    if (lower.endsWith(suf) && remaining.length > suf.length + 2) {
      suffix = remaining.slice(-suf.length);
      remaining = remaining.slice(0, -suf.length);
      break;
    }
  }

  // Add the root/remaining part
  if (remaining) {
    // If remaining is still long, split it further
    if (remaining.length > 6) {
      const mid = Math.ceil(remaining.length / 2);
      tokens.push({ text: remaining.slice(0, mid), id: id++ });
      tokens.push({ text: remaining.slice(mid), id: id++ });
    } else {
      tokens.push({ text: remaining, id: id++ });
    }
  }

  // Add suffix if present
  if (suffix) {
    tokens.push({ text: suffix, id: id++ });
  }

  return tokens;
}

/**
 * Main tokenize function that dispatches to the correct method
 */
export function tokenize(text: string, method: 'word' | 'subword' | 'character'): Token[] {
  switch (method) {
    case 'word':
      return tokenizeWord(text);
    case 'character':
      return tokenizeCharacter(text);
    case 'subword':
    default:
      return tokenizeSubword(text);
  }
}
