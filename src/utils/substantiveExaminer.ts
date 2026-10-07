import { PdkiRecord } from '../data/pdkiDatabase';
import { SimilarityAnalysis } from './trademarkMatcher';

export interface SevenFactorEvaluation {
  productNature: { relevant: boolean; note: string }; // Sifat produk
  purposeAndMethod: { relevant: boolean; note: string }; // Tujuan dan metode penggunaan
  functionalComplementarity: { relevant: boolean; note: string }; // Komplementaritas fungsional
  competitiveOrSubstitutive: { relevant: boolean; note: string }; // Hubungan kompetisi / substitusi
  distributionChannels: { relevant: boolean; note: string }; // Saluran distribusi
  targetConsumers: { relevant: boolean; note: string }; // Target konsumen
  manufacturingOrigin: { relevant: boolean; note: string }; // Asal produsen industri
}

export interface BlockedGoodsAssessment {
  id: string;
  appliedItem: string; // Uraian barang/jasa yang dimohonkan
  blockingRegisteredItem: string; // Barang/jasa pembanding terdaftar di PDKI
  conflictingMarkName: string; // Nama merek terdaftar pembanding
  conflictingRegistrationNumber: string; // No. Pendaftaran PDKI
  niceClass: number; // Kelas Nice
  substantiveBasis: '5.1.4.1 Aturan Pembatasan Frasa' | '5.1.4.2 Hubungan Identik / Sinonim / Genus-Species' | '5.1.4.3 Keterkaitan 7 Faktor Non-Identik';
  legalEvaluationDetail: string; // Evaluasi yuridis objektif
  sevenFactors?: SevenFactorEvaluation;
  similarityNote: string;
}

// Synonyms and Genus-Species Dictionary for Trademark Examinations
interface GenusSpeciesRule {
  genus: string;
  species: string[];
  synonyms: Record<string, string[]>;
}

const GENUS_SPECIES_RULES: Record<number, GenusSpeciesRule[]> = {
  3: [
    {
      genus: 'sediaan kosmetik',
      species: ['krim wajah', 'serum wajah', 'toner', 'pelembab', 'masker kecantikan', 'esens', 'alas bedak', 'foundation', 'bedak tabur', 'lipstik', 'perona pipi', 'maskara', 'tabir surya', 'sunscreen', 'lotion kulit'],
      synonyms: {
        'sabun': ['sabun mandi', 'sabun pembersih muka', 'facial wash', 'sabun cair', 'sabun batangan'],
        'parfum': ['wewangian', 'minyak wangi', 'eau de cologne', 'eau de parfum', 'body mist'],
        'pembersih kulit wajah': ['facial wash', 'cleanser', 'micellar water', 'sabun muka', 'pembersih muka'],
        'tabir surya': ['sunscreen', 'sunblock', 'pelindung sinar matahari']
      }
    }
  ],
  5: [
    {
      genus: 'sediaan farmasi',
      species: ['obat tradisional', 'kapsul obat', 'tablet obat', 'sirup obat', 'salep obat', 'antibiotik', 'analgesik', 'salep kulit anti-jamur'],
      synonyms: {
        'suplemen': ['suplemen diet', 'suplemen makanan', 'multivitamin', 'nutrisi tambahan'],
        'salep obat': ['krim obat luka', 'salep anti-jamur', 'gel pereda luka']
      }
    }
  ],
  25: [
    {
      genus: 'pakaian',
      species: ['kaos', 't-shirt', 'kemeja', 'celana', 'celana panjang', 'celana pendek', 'jaket', 'gaun', 'rok', 'sweater', 'jas', 'blazer', 'pakaian olahraga', 'legging', 'pakaian renang'],
      synonyms: {
        'pakaian': ['busana', 'sandang', 'baju', 'garmen'],
        'alas kaki': ['sepatu', 'sandal', 'sepatu bot', 'sepatu olahraga', 'sneakers', 'selop', 'footwear'],
        'tutup kepala': ['topi', 'peci', 'kopiah', 'kupluk', 'helm pelindung kain']
      }
    },
    {
      genus: 'alas kaki',
      species: ['sepatu olahraga', 'sepatu lari', 'sepatu basket', 'sandal santai', 'sepatu kasual', 'sepatu kulit', 'sepatu bot', 'sepatu hak tinggi'],
      synonyms: {
        'sepatu': ['sepatu olahraga', 'sepatu jalan', 'sneakers', 'sepatu kulit']
      }
    }
  ],
  30: [
    {
      genus: 'kopi',
      species: ['biji kopi sangrai', 'kopi bubuk', 'minuman kopi siap saji', 'kopi instan', 'es kopi susu', 'kopi espresso'],
      synonyms: {
        'kopi': ['minuman kopi', 'kopi olahan', 'ekstrak kopi'],
        'roti': ['kue', 'bakery', 'roti manis', 'roti tawar', 'pastry']
      }
    }
  ],
  35: [
    {
      genus: 'jasa penjualan eceran',
      species: ['toko pakaian', 'butik busana', 'toko ritel kosmetik', 'supermarket', 'department store', 'penjualan online'],
      synonyms: {
        'toko ritel': ['jasa penjualan eceran', 'butik', 'outlet retail', 'gerai toko']
      }
    }
  ],
  43: [
    {
      genus: 'jasa penyediaan makanan dan minuman',
      species: ['kedai kopi', 'kafe', 'restoran', 'rumah makan', 'jasa katering', 'kedai minuman', 'warung kopi'],
      synonyms: {
        'kedai kopi': ['kafe', 'coffee shop', 'warkop', 'kafe kopi'],
        'restoran': ['rumah makan', 'bistro', 'eatery']
      }
    }
  ]
};

// Split user item text into discrete items (by comma, semicolon, newline, bullet)
export function parseGoodsServicesList(rawText: string): string[] {
  if (!rawText || !rawText.trim()) return [];

  // Split on delimiters
  const items = rawText
    .split(/[,;\n\r•\-\*]+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 1);

  return items;
}

// Check if description uses restrictive clause ("yaitu" / "khususnya") vs illustrative ("seperti" / "termasuk")
export function parsePhraseLimitation(text: string): {
  type: 'restrictive' | 'illustrative' | 'general';
  phraseUsed?: string;
  itemsListed: string[];
} {
  const lower = text.toLowerCase();

  const restrictiveMatch = lower.match(/(yaitu|khususnya)\s*:\s*([^.]+)/);
  if (restrictiveMatch) {
    const rawList = restrictiveMatch[2];
    const items = rawList
      .split(/[,;dan&]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 1);
    return {
      type: 'restrictive',
      phraseUsed: restrictiveMatch[1],
      itemsListed: items
    };
  }

  const illustrativeMatch = lower.match(/(seperti|termasuk)\s*:\s*([^.]+)/);
  if (illustrativeMatch) {
    const rawList = illustrativeMatch[2];
    const items = rawList
      .split(/[,;dan&]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 1);
    return {
      type: 'illustrative',
      phraseUsed: illustrativeMatch[1],
      itemsListed: items
    };
  }

  return {
    type: 'general',
    itemsListed: parseGoodsServicesList(text)
  };
}

// Evaluate 7 Factors of Non-Identical Related Goods (Pedoman 5.1.4.3)
export function evaluateSevenFactors(
  appliedItem: string,
  registeredItem: string,
  niceClass: number
): SevenFactorEvaluation {
  const a = appliedItem.toLowerCase();
  const r = registeredItem.toLowerCase();

  // Factor 1: Nature of goods
  const sharesFormulation =
    (niceClass === 3 && (a.includes('krim') || a.includes('sabun') || a.includes('lotion') || a.includes('gel'))) ||
    (niceClass === 25 && (a.includes('kain') || a.includes('baju') || a.includes('katun') || a.includes('serat'))) ||
    (niceClass === 30 && (a.includes('kopi') || a.includes('biji') || a.includes('bubuk')));

  const productNature = {
    relevant: true,
    note: sharesFormulation
      ? `Kedua barang memiliki kesamaan sifat fisik, formulasi bahan dasar, dan karakteristik komposisi dalam rumpun Kelas ${niceClass}.`
      : `Barang berwujud dalam kategori komoditas niaga sejenis pada peredaran Kelas ${niceClass}.`
  };

  // Factor 2: Purpose and method of use
  const purposeAndMethod = {
    relevant: true,
    note: `Memiliki tujuan penggunaan primer yang beririsan untuk kebutuhan fungsional konsumen yang sepadan.`
  };

  // Factor 3: Functional complementarity
  const isComplementary =
    (a.includes('serum') && r.includes('krim')) ||
    (a.includes('toner') && r.includes('pembersih')) ||
    (a.includes('celana') && r.includes('kemeja')) ||
    (a.includes('sepatu') && r.includes('pakaian')) ||
    (a.includes('kopi') && r.includes('roti'));

  const functionalComplementarity = {
    relevant: isComplementary,
    note: isComplementary
      ? `Terdapat komplementaritas fungsional nyata: barang lazim digunakan secara bersamaan atau saling melengkapi satu sama lain sehingga publik mengira berasal dari satu sumber usaha.`
      : `Dapat digunakan dalam rangkaian siklus pemakaian produk sejenis.`
  };

  // Factor 4: Competitive / substitutive relationship
  const isSubstitutive =
    (a.includes('krim') && r.includes('lotion')) ||
    (a.includes('kaos') && r.includes('kemeja')) ||
    (a.includes('sabun') && r.includes('pembersih'));

  const competitiveOrSubstitutive = {
    relevant: isSubstitutive,
    note: isSubstitutive
      ? `Berada dalam hubungan kompetisi dan substitusi langsung di mana pembeli dapat saling menggantikan produk satu dengan lainnya di pasar.`
      : `Berada pada kategori pilihan belanja substitutif sekunder bagi konsumen.`
  };

  // Factor 5: Distribution channels
  const distributionChannels = {
    relevant: true,
    note: `Beredar melalui saluran distribusi niaga yang identik (etalase ritel, gerai resmi, departemen store, atau etalase e-commerce terverifikasi yang sama).`
  };

  // Factor 6: Target consumers
  const targetConsumers = {
    relevant: true,
    note: `Menyasar target khalayak konsumen yang sama (relevant public) dengan tingkat ketelitian rata-rata (average consumer) pada segmen pasar yang bersangkutan.`
  };

  // Factor 7: Commercial manufacturing origin
  const manufacturingOrigin = {
    relevant: true,
    note: `Berdasarkan kelaziman perdagangan modern, kedua komoditas diproduksi atau dikendalikan oleh entitas pabrikasi/industri komersial yang sejenis.`
  };

  return {
    productNature,
    purposeAndMethod,
    functionalComplementarity,
    competitiveOrSubstitutive,
    distributionChannels,
    targetConsumers,
    manufacturingOrigin
  };
}

// Perform Comprehensive Substantive Conflict Examination under Bagian 5.1.4
export function evaluateSubstantiveConflicts(
  appliedItemsRaw: string,
  targetClass: number,
  similarMarks: { record: PdkiRecord; similarity: SimilarityAnalysis }[]
): BlockedGoodsAssessment[] {
  const parsedItems = parseGoodsServicesList(appliedItemsRaw);
  const assessments: BlockedGoodsAssessment[] = [];

  // Filter only candidate marks in the target class or closely related cross-class
  // (DJKI 5.1.4.1 confirms cross-class similarity when closely tied, e.g. class 3 vs 44, class 25 vs 35, class 30 vs 43)
  const candidateMarks = similarMarks.filter(
    (item) => item.similarity.isSimilar && (item.record.niceClass === targetClass || isCrossClassRelated(targetClass, item.record.niceClass))
  );

  if (candidateMarks.length === 0 || parsedItems.length === 0) {
    return [];
  }

  // Iterate over each applied item and compare against registered goods/services
  for (const appliedItem of parsedItems) {
    const appliedLower = appliedItem.toLowerCase();

    for (const { record, similarity } of candidateMarks) {
      const regDescription = record.goodsServicesDescription;
      const regLower = regDescription.toLowerCase();
      const limitation = parsePhraseLimitation(regDescription);

      // 1. Check 5.1.4.1: Phrase Limitation Rule ("yaitu / khususnya" vs "seperti / termasuk")
      if (limitation.type === 'restrictive') {
        // Restrictive: only blocks if appliedItem matches or directly overlaps with listed items
        const isMatchedInRestrictedList = limitation.itemsListed.some((listed) => {
          const lLower = listed.toLowerCase();
          return (
            appliedLower.includes(lLower) ||
            lLower.includes(appliedLower) ||
            checkSynonymOrSpecies(appliedLower, lLower, record.niceClass)
          );
        });

        if (isMatchedInRestrictedList) {
          assessments.push({
            id: `BLK-${record.id}-${appliedItem}`,
            appliedItem,
            blockingRegisteredItem: `Uraian terdaftar dengan frasa pembatas '${limitation.phraseUsed}': ${limitation.itemsListed.join(', ')}`,
            conflictingMarkName: record.markName,
            conflictingRegistrationNumber: record.registrationNumber || record.applicationNumber,
            niceClass: record.niceClass,
            substantiveBasis: '5.1.4.1 Aturan Pembatasan Frasa',
            legalEvaluationDetail: `Berdasarkan Bagian 5.1.4.1 Pedoman Pemeriksaan Substantif Merek, penggunaan frasa pembatas '${limitation.phraseUsed}' membatasi ruang lingkup merek terdaftar hanya pada item tertulis. Karena barang yang dimohonkan ('${appliedItem}') terbukti berada dalam cakupan item spesifik yang dibatasi tersebut, maka pendaftaran barang ini terblokir oleh merek terdaftar.`,
            similarityNote: `Persamaan merek: ${similarity.explanation}`
          });
          continue; // Evaluated for this mark
        } else {
          // Outside the restrictive scope -> not blocked under 5.1.4.1 for this specific mark
          continue;
        }
      }

      // 2. Check 5.1.4.2: Identical, Synonym, and Genus-Species (Luas vs Spesifik)
      const genusSpeciesCheck = checkGenusSpeciesConflict(appliedLower, regLower, record.niceClass);
      if (genusSpeciesCheck.isConflicted) {
        assessments.push({
          id: `BLK-${record.id}-${appliedItem}`,
          appliedItem,
          blockingRegisteredItem: genusSpeciesCheck.matchedRegisteredTerm,
          conflictingMarkName: record.markName,
          conflictingRegistrationNumber: record.registrationNumber || record.applicationNumber,
          niceClass: record.niceClass,
          substantiveBasis: '5.1.4.2 Hubungan Identik / Sinonim / Genus-Species',
          legalEvaluationDetail: `Berdasarkan Bagian 5.1.4.2 Pedoman Pemeriksaan Substantif Merek, ${genusSpeciesCheck.legalRationale}`,
          similarityNote: `Persamaan merek: ${similarity.explanation}`
        });
        continue;
      }

      // 3. Check 5.1.4.3: 7-Factor Non-Identical Related Goods Testing
      const sevenFactorCheck = checkSevenFactorConflict(appliedLower, regLower, record.niceClass);
      if (sevenFactorCheck.isConflicted) {
        const factors = evaluateSevenFactors(appliedItem, sevenFactorCheck.matchedRegisteredTerm, record.niceClass);
        assessments.push({
          id: `BLK-${record.id}-${appliedItem}`,
          appliedItem,
          blockingRegisteredItem: sevenFactorCheck.matchedRegisteredTerm,
          conflictingMarkName: record.markName,
          conflictingRegistrationNumber: record.registrationNumber || record.applicationNumber,
          niceClass: record.niceClass,
          substantiveBasis: '5.1.4.3 Keterkaitan 7 Faktor Non-Identik',
          legalEvaluationDetail: `Berdasarkan Bagian 5.1.4.3 Pedoman Pemeriksaan Substantif Merek, meskipun nama barang tidak identik harfiah, pengujian 7 faktor keterkaitan menunjukkan korelasi substansial: sifat produk (${factors.productNature.note}), tujuan dan saluran distribusi yang sama, serta persepsi publik atas asal produsen yang lazim bersinggungan.`,
          sevenFactors: factors,
          similarityNote: `Persamaan merek: ${similarity.explanation}`
        });
      }
    }
  }

  // Deduplicate assessments by appliedItem + conflictingRegistrationNumber
  const uniqueMap = new Map<string, BlockedGoodsAssessment>();
  for (const a of assessments) {
    const key = `${a.appliedItem.toLowerCase()}|${a.conflictingRegistrationNumber}`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, a);
    }
  }

  return Array.from(uniqueMap.values());
}

// Helper: Check Genus-Species Conflict under 5.1.4.2
function checkGenusSpeciesConflict(
  appliedItem: string,
  registeredText: string,
  niceClass: number
): { isConflicted: boolean; matchedRegisteredTerm: string; legalRationale: string } {
  const rules = GENUS_SPECIES_RULES[niceClass] || [];

  // Check identical or synonym first
  for (const rule of rules) {
    for (const [key, syns] of Object.entries(rule.synonyms)) {
      const allSyns = [key, ...syns];
      const matchApplied = allSyns.some((s) => appliedItem.includes(s));
      const matchReg = allSyns.some((s) => registeredText.includes(s));

      if (matchApplied && matchReg) {
        return {
          isConflicted: true,
          matchedRegisteredTerm: `Terdaftar: "${key}" (${allSyns.join(', ')})`,
          legalRationale: `terdapat kesamaan identik / sinonim istilah perdagangan antara '${appliedItem}' dengan barang yang dilindungi dalam merek pembanding. Barang memiliki arti dan fungsi komersial yang setara.`
        };
      }
    }

    // Genus vs Species: Registered owns Genus, Applied requests Species
    if (registeredText.includes(rule.genus)) {
      const isSpecies = rule.species.some((sp) => appliedItem.includes(sp));
      if (isSpecies) {
        return {
          isConflicted: true,
          matchedRegisteredTerm: `Genus terdaftar: "${rule.genus}"`,
          legalRationale: `merek terdahulu terdaftar untuk kategori luas (genus) '${rule.genus}', sedangkan permohonan baru mengajukan barang spesifik (species) '${appliedItem}'. Karena species berada dalam cakupan perlindungan genus merek terdahulu, permohonan species terblokir secara substantive.`
        };
      }
    }
  }

  // Broad fallback keyword intersection
  const tokens = appliedItem.split(/\s+/).filter((t) => t.length > 3);
  for (const t of tokens) {
    if (registeredText.includes(t)) {
      return {
        isConflicted: true,
        matchedRegisteredTerm: `Klausul terdaftar memuat unsur: "${t}"`,
        legalRationale: `terdapat irisan kata kunci komoditas esensial '${t}' yang menjadi objek perlindungan dalam pendaftaran merek pembanding.`
      };
    }
  }

  return { isConflicted: false, matchedRegisteredTerm: '', legalRationale: '' };
}

// Helper: Check 7-factor relationship under 5.1.4.3
function checkSevenFactorConflict(
  appliedItem: string,
  registeredText: string,
  niceClass: number
): { isConflicted: boolean; matchedRegisteredTerm: string } {
  // Check if both belong to typical related clusters
  const classKeywords: Record<number, string[]> = {
    3: ['kulit', 'wajah', 'krim', 'sabun', 'kosmetik', 'body', 'lotion', 'rambut', 'bibir', 'mata', 'serum', 'toner'],
    5: ['obat', 'farmasi', 'vitamin', 'suplemen', 'kesehatan', 'kapsul', 'tablet', 'salep'],
    25: ['pakaian', 'sepatu', 'sandal', 'baju', 'kaos', 'kemeja', 'celana', 'jaket', 'topi', 'busana', 'alas kaki'],
    30: ['kopi', 'teh', 'cokelat', 'roti', 'kue', 'minuman kopi', 'biji', 'bubuk'],
    35: ['toko', 'ritel', 'eceran', 'supermarket', 'butik', 'jual beli', 'periklanan'],
    43: ['kafe', 'kedai', 'restoran', 'makanan', 'minuman', 'katering', 'warung']
  };

  const keywords = classKeywords[niceClass] || [];
  const appliedHits = keywords.filter((k) => appliedItem.includes(k));
  const regHits = keywords.filter((k) => registeredText.includes(k));

  if (appliedHits.length > 0 && regHits.length > 0) {
    return {
      isConflicted: true,
      matchedRegisteredTerm: `Sediaan sekelompok industri: ${regHits.join(', ')}`
    };
  }

  return { isConflicted: false, matchedRegisteredTerm: '' };
}

function checkSynonymOrSpecies(a: string, b: string, niceClass: number): boolean {
  const rules = GENUS_SPECIES_RULES[niceClass] || [];
  for (const rule of rules) {
    for (const [key, syns] of Object.entries(rule.synonyms)) {
      const all = [key, ...syns];
      if (all.some((s) => a.includes(s)) && all.some((s) => b.includes(s))) {
        return true;
      }
    }
  }
  return false;
}

function isCrossClassRelated(classA: number, classB: number): boolean {
  const crossMap: Record<number, number[]> = {
    3: [44], // Kosmetik vs Klinik kecantikan
    44: [3],
    25: [35], // Pakaian vs Butik busana
    35: [25, 30],
    30: [43], // Kopi produk vs Kafe kedai kopi
    43: [30],
    9: [42], // Software produk vs Jasa SaaS IT
    42: [9]
  };
  return crossMap[classA]?.includes(classB) || false;
}
