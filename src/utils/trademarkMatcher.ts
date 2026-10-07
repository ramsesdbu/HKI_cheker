export interface SimilarityAnalysis {
  phoneticScore: number; // 0 - 100
  visualScore: number; // 0 - 100
  lexicalScore: number; // 0 - 100
  compositeScore: number; // 0 - 100
  isSimilar: boolean;
  aspects: ('Fonetik' | 'Visual' | 'Leksikal' | 'Substitusi Angka / Gaul')[];
  explanation: string;
  normalizedQuery: string;
  normalizedTarget: string;
}

// Indonesian & International Slang, Leetspeak, and Number Substitution Map
const LEET_MAP: Record<string, string> = {
  '4EVER': 'FOREVER',
  '4-EVER': 'FOREVER',
  '2GETHER': 'TOGETHER',
  '2-GETHER': 'TOGETHER',
  'GR8': 'GREAT',
  'B4': 'BEFORE',
  'U2': 'YOU TWO',
  'L8R': 'LATER',
  'CR8': 'CREATE',
  'XPRESS': 'EXPRESS',
  'X-PRESS': 'EXPRESS',
  'KOOL': 'COOL',
  'LUV': 'LOVE',
  'LOV': 'LOVE',
  'NITE': 'NIGHT',
  'LITE': 'LIGHT',
  'EZ': 'EASY',
  'CARE4U': 'CARE FOR YOU',
  'ALL4ONE': 'ALL FOR ONE',
  'CYBER': 'SIBER',
  'BYTE': 'BAIT',
  'COFFE': 'COFFEE',
  'KOPI': 'COFFEE',
  'KAFE': 'CAFE',
  'DERM': 'DERMA',
  'PHARMA': 'FARMA',
  'FLORA': 'PHLORA',
  'BEAUTY': 'BEAUTI',
};

// Character replacement rules for leetspeak decoding
export function normalizeLeetspeak(input: string): { normalized: string; detectedSubstitutions: string[] } {
  let text = input.trim().toUpperCase();
  const detected: string[] = [];

  // Check specific multi-word/token tokens
  const tokens = text.split(/[\s\-_]+/);
  const transformedTokens = tokens.map((token) => {
    if (LEET_MAP[token]) {
      detected.push(`Substitusi token '${token}' ekuivalen leksikal '${LEET_MAP[token]}'`);
      return LEET_MAP[token];
    }

    // Number embedded in words, e.g. "4EVER", "GLOW4EVER"
    let mod = token;
    if (mod.includes('4EVER')) {
      mod = mod.replace(/4EVER/g, 'FOREVER');
      detected.push("Substitusi angka '4' sebagai 'FOR' dalam '4EVER' = 'FOREVER'");
    }
    if (mod.includes('2GETHER')) {
      mod = mod.replace(/2GETHER/g, 'TOGETHER');
      detected.push("Substitusi angka '2' sebagai 'TO' dalam '2GETHER' = 'TOGETHER'");
    }
    if (mod.includes('GR8')) {
      mod = mod.replace(/GR8/g, 'GREAT');
      detected.push("Substitusi angka '8' sebagai 'ATE' dalam 'GR8' = 'GREAT'");
    }
    if (mod.includes('B4')) {
      mod = mod.replace(/B4/g, 'BEFORE');
      detected.push("Substitusi angka '4' sebagai 'FORE' dalam 'B4' = 'BEFORE'");
    }
    if (mod.includes('LUV')) {
      mod = mod.replace(/LUV/g, 'LOVE');
      detected.push("Ejaan fonetik gaul 'LUV' ekuivalen 'LOVE'");
    }
    if (mod.includes('XPRESS')) {
      mod = mod.replace(/XPRESS/g, 'EXPRESS');
      detected.push("Singkatan visual/fonetik 'XPRESS' ekuivalen 'EXPRESS'");
    }
    if (mod.includes('KOOL')) {
      mod = mod.replace(/KOOL/g, 'COOL');
      detected.push("Substitusi fonetik 'K' untuk 'C' dalam 'KOOL' = 'COOL'");
    }

    // Isolated digit replacements if standalone or at edges
    if (mod === '4' || mod.startsWith('4-') || mod.endsWith('-4')) {
      mod = mod.replace(/4/g, 'FOR');
      detected.push("Substitusi angka '4' sebagai kata 'FOR'");
    } else if (mod === '2' || mod.startsWith('2-') || mod.endsWith('-2')) {
      mod = mod.replace(/2/g, 'TO');
      detected.push("Substitusi angka '2' sebagai kata 'TO'");
    } else if (mod === '8') {
      mod = 'ATE';
      detected.push("Substitusi angka '8' sebagai bunyi 'ATE'");
    }

    // Leet characters within words (e.g., '3' -> 'E', '0' -> 'O', '1' -> 'I')
    if (/\d/.test(mod)) {
      const original = mod;
      mod = mod
        .replace(/3/g, 'E')
        .replace(/0/g, 'O')
        .replace(/1/g, 'I')
        .replace(/5/g, 'S')
        .replace(/7/g, 'T');
      if (mod !== original) {
        detected.push(`Substitusi angka numerik dalam kata '${original}' menjadi huruf ('${mod}')`);
      }
    }

    return mod;
  });

  return {
    normalized: transformedTokens.join(' '),
    detectedSubstitutions: Array.from(new Set(detected))
  };
}

// Phonetic Normalization for Indonesian & English Trademarks
export function getIndonesianPhoneticCode(input: string): string {
  let str = input.toUpperCase().trim();
  // Remove non-alphanumeric except spaces
  str = str.replace(/[^A-Z0-9\s]/g, '');

  // Consonant clusters & common equivalents in Indonesian HKI examinations
  str = str.replace(/PH/g, 'F');
  str = str.replace(/CH/g, 'K');
  str = str.replace(/SH/g, 'S');
  str = str.replace(/SY/g, 'S');
  str = str.replace(/KH/g, 'K');
  str = str.replace(/DH/g, 'D');
  str = str.replace(/TH/g, 'T');
  str = str.replace(/GH/g, 'G');
  str = str.replace(/NY/g, 'N');
  str = str.replace(/NG/g, 'N');
  str = str.replace(/CK/g, 'K');
  str = str.replace(/QU/g, 'K');
  str = str.replace(/Q/g, 'K');
  str = str.replace(/X/g, 'KS');
  str = str.replace(/Z/g, 'S');
  str = str.replace(/V/g, 'F');
  str = str.replace(/W/g, 'V');
  str = str.replace(/C(?=[EIY])/g, 'S');
  str = str.replace(/C(?=[AOU])/g, 'K');
  str = str.replace(/C/g, 'K');
  str = str.replace(/J/g, 'Y'); // Common phonetic interchange in trademark practice

  // Vowel normalization & compression
  str = str.replace(/EE/g, 'I');
  str = str.replace(/EA/g, 'I');
  str = str.replace(/OO/g, 'U');
  str = str.replace(/OU/g, 'U');
  str = str.replace(/AI/g, 'E');
  str = str.replace(/AU/g, 'O');

  // Collapse consecutive duplicate consonants
  str = str.replace(/([B-DF-HJ-NP-TV-Z])\1+/g, '$1');

  // Standardize spaces
  return str.replace(/\s+/g, ' ').trim();
}

// Damerau-Levenshtein Distance for Visual Comparison
export function damerauLevenshtein(a: string, b: string): number {
  const al = a.length;
  const bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;

  const matrix: number[][] = [];
  for (let i = 0; i <= al; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= bl; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let min = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );

      // Transposition
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        min = Math.min(min, matrix[i - 2][j - 2] + cost);
      }
      matrix[i][j] = min;
    }
  }

  return matrix[al][bl];
}

// Visual Similarity (0 to 100)
export function calculateVisualScore(a: string, b: string): number {
  const s1 = a.trim().toUpperCase().replace(/\s+/g, ' ');
  const s2 = b.trim().toUpperCase().replace(/\s+/g, ' ');

  if (s1 === s2) return 100;

  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen === 0) return 100;

  const dist = damerauLevenshtein(s1, s2);
  const rawSimilarity = Math.max(0, (maxLen - dist) / maxLen) * 100;

  // Check prefix / dominant element sharing
  const words1 = s1.split(' ');
  const words2 = s2.split(' ');

  let sharedWords = 0;
  for (const w1 of words1) {
    if (words2.some((w2) => w1 === w2 || (w1.length > 3 && (w2.includes(w1) || w1.includes(w2))))) {
      sharedWords++;
    }
  }

  const wordOverlapBonus = (sharedWords / Math.max(words1.length, words2.length)) * 30;
  return Math.min(100, Math.round(rawSimilarity * 0.7 + wordOverlapBonus));
}

// Phonetic Similarity (0 to 100)
export function calculatePhoneticScore(a: string, b: string): number {
  const phoneA = getIndonesianPhoneticCode(a);
  const phoneB = getIndonesianPhoneticCode(b);

  if (phoneA === phoneB) return 100;

  const maxLen = Math.max(phoneA.length, phoneB.length);
  if (maxLen === 0) return 100;

  const dist = damerauLevenshtein(phoneA, phoneB);
  const similarity = Math.max(0, (maxLen - dist) / maxLen) * 100;

  return Math.round(similarity);
}

// Lexical / Semantic Root Similarity (0 to 100)
export function calculateLexicalScore(
  normA: string,
  normB: string,
  detectedLeetA: string[],
  detectedLeetB: string[]
): number {
  const wordsA = normA.split(/\s+/);
  const wordsB = normB.split(/\s+/);

  if (normA === normB) return 100;

  let commonCount = 0;
  for (const wa of wordsA) {
    if (wordsB.includes(wa)) {
      commonCount++;
    }
  }

  const ratio = commonCount / Math.max(wordsA.length, wordsB.length);
  let score = ratio * 100;

  // If leetspeak was normalized and yielded matches
  if ((detectedLeetA.length > 0 || detectedLeetB.length > 0) && commonCount > 0) {
    score = Math.max(score, 85);
  }

  return Math.round(score);
}

// Complete Trademark Comparison Analysis Engine
export function compareTrademarkNames(appliedMark: string, registeredMark: string): SimilarityAnalysis {
  const normResultA = normalizeLeetspeak(appliedMark);
  const normResultB = normalizeLeetspeak(registeredMark);

  const appliedNorm = normResultA.normalized;
  const regNorm = normResultB.normalized;

  const visual = calculateVisualScore(appliedMark, registeredMark);
  const phonetic = Math.max(
    calculatePhoneticScore(appliedMark, registeredMark),
    calculatePhoneticScore(appliedNorm, regNorm)
  );
  const lexical = calculateLexicalScore(
    appliedNorm,
    regNorm,
    normResultA.detectedSubstitutions,
    normResultB.detectedSubstitutions
  );

  // Composite weighted score according to DJKI trademark similarity jurisprudence
  // (Phonetic often carries heaviest weight in oral commerce, followed by visual and conceptual/lexical)
  let composite = Math.round(phonetic * 0.45 + visual * 0.35 + lexical * 0.20);

  // If there's an exact lexical root or leetspeak match (e.g. 4EVER vs FOREVER), elevate composite
  const hasLeetSubstitution = normResultA.detectedSubstitutions.length > 0 || normResultB.detectedSubstitutions.length > 0;
  if (appliedNorm.split(' ')[0] === regNorm.split(' ')[0] && appliedNorm.split(' ')[0].length >= 4) {
    composite = Math.max(composite, 75);
  }

  const aspects: ('Fonetik' | 'Visual' | 'Leksikal' | 'Substitusi Angka / Gaul')[] = [];
  if (phonetic >= 65) aspects.push('Fonetik');
  if (visual >= 60) aspects.push('Visual');
  if (lexical >= 60) aspects.push('Leksikal');
  if (hasLeetSubstitution) aspects.push('Substitusi Angka / Gaul');

  const isSimilar = composite >= 55 || phonetic >= 75 || visual >= 75 || (hasLeetSubstitution && composite >= 50);

  // Construct neutral, analytical legal explanation
  const explanationParts: string[] = [];

  if (hasLeetSubstitution) {
    const allSubs = [...normResultA.detectedSubstitutions, ...normResultB.detectedSubstitutions];
    explanationParts.push(allSubs.join('; '));
  }

  if (phonetic >= 80) {
    explanationParts.push(`Tingkat kesamaan bunyi ucap (fonetik) dominan tinggi (${phonetic}%) saat dilafalkan dalam tata bahasa niaga`);
  } else if (phonetic >= 60) {
    explanationParts.push(`Terdapat kesamaan rima bunyi dan suku kata (${phonetic}%)`);
  }

  if (visual >= 80) {
    explanationParts.push(`Bentuk visual dan susunan huruf memiliki kemiripan struktur langsung (${visual}%)`);
  } else if (visual >= 60) {
    explanationParts.push(`Pola susunan huruf dan panjang kata memiliki irisan visual (${visual}%)`);
  }

  if (lexical >= 70) {
    explanationParts.push(`Mengandung unsur kata dasar / leksikal yang semakna (${lexical}%)`);
  }

  const explanation = explanationParts.length > 0
    ? explanationParts.join('. ') + '.'
    : 'Perbandingan struktur huruf dan fonemik dasar.';

  return {
    phoneticScore: phonetic,
    visualScore: visual,
    lexicalScore: lexical,
    compositeScore: composite,
    isSimilar,
    aspects: aspects.length > 0 ? aspects : ['Visual'],
    explanation,
    normalizedQuery: appliedNorm,
    normalizedTarget: regNorm
  };
}
