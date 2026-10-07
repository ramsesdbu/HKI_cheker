import React, { useState, useId } from 'react';
import { 
  Search, 
  RotateCcw, 
  FileText, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  ShieldCheck,
  Scale,
  Printer
} from 'lucide-react';
import { NICE_CLASSES, NiceClass } from './data/niceClasses';
import { PDKI_DATABASE, PdkiRecord } from './data/pdkiDatabase';
import { compareTrademarkNames, SimilarityAnalysis } from './utils/trademarkMatcher';
import { 
  evaluateSubstantiveConflicts, 
  BlockedGoodsAssessment, 
  SevenFactorEvaluation 
} from './utils/substantiveExaminer';

interface SimilarMarkResult {
  record: PdkiRecord;
  similarity: SimilarityAnalysis;
}

export default function App() {
  const markNameId = useId();
  const niceClassId = useId();
  const goodsServicesId = useId();

  // Form State
  const [markName, setMarkName] = useState('');
  const [selectedClassNumber, setSelectedClassNumber] = useState<number>(3);
  const [goodsServicesText, setGoodsServicesText] = useState('');

  // Processing & Results State
  const [isExamining, setIsExamining] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [similarMarks, setSimilarMarks] = useState<SimilarMarkResult[]>([]);
  const [blockedAssessments, setBlockedAssessments] = useState<BlockedGoodsAssessment[]>([]);
  const [selectedAssessmentForModal, setSelectedAssessmentForModal] = useState<BlockedGoodsAssessment | null>(null);

  // Filter & UI Helpers
  const [tableSearchQuery, setTableSearchQuery] = useState('');
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'both' | 'similar-marks' | 'blocked-goods'>('both');

  const selectedNiceClass = NICE_CLASSES.find((c) => c.number === selectedClassNumber) || NICE_CLASSES[2];

  // Presets for quick consultant demonstration
  const handleLoadPreset = (preset: { mark: string; classNum: number; desc: string }) => {
    setMarkName(preset.mark);
    setSelectedClassNumber(preset.classNum);
    setGoodsServicesText(preset.desc);
    // Clear previous search results so new one is clean
    setSimilarMarks([]);
    setBlockedAssessments([]);
    setHasSearched(false);
  };

  // Reset & Clear Cache
  const handleResetAndClearCache = () => {
    setMarkName('');
    setSelectedClassNumber(3);
    setGoodsServicesText('');
    setSimilarMarks([]);
    setBlockedAssessments([]);
    setHasSearched(false);
    setSelectedAssessmentForModal(null);
    setTableSearchQuery('');
    try {
      localStorage.removeItem('pdki_consultant_last_query');
      sessionStorage.clear();
    } catch {
      // Ignore if localStorage unavailable
    }
  };

  // Perform Substantive Trademark Examination
  const handlePerformExamination = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!markName.trim()) return;

    setIsExamining(true);

    try {
      // 1. First, search and compare candidate marks from PDKI database
      const candidates: SimilarMarkResult[] = [];

      for (const record of PDKI_DATABASE) {
        const similarity = compareTrademarkNames(markName, record.markName);
        if (similarity.isSimilar || similarity.compositeScore >= 40) {
          candidates.push({ record, similarity });
        }
      }

      // Sort candidates by highest similarity score
      candidates.sort((a, b) => b.similarity.compositeScore - a.similarity.compositeScore);

      // 2. Perform Substantive Goods/Services conflict examination under Pedoman 5.1.4
      const blockedResults = evaluateSubstantiveConflicts(
        goodsServicesText,
        selectedClassNumber,
        candidates
      );

      // Optional: Query server-side proxy route if configured
      try {
        await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            markName,
            niceClass: selectedClassNumber,
            goodsServices: goodsServicesText
          })
        });
      } catch {
        // Fallback gracefully to offline deterministic engine
      }

      setSimilarMarks(candidates);
      setBlockedAssessments(blockedResults);
      setHasSearched(true);
    } finally {
      setIsExamining(false);
    }
  };

  // Filtered lists for in-table lookup
  const filteredSimilarMarks = similarMarks.filter((item) => {
    if (!tableSearchQuery.trim()) return true;
    const q = tableSearchQuery.toLowerCase();
    return (
      item.record.markName.toLowerCase().includes(q) ||
      item.record.registrationNumber.toLowerCase().includes(q) ||
      item.record.ownerName.toLowerCase().includes(q) ||
      item.record.goodsServicesDescription.toLowerCase().includes(q)
    );
  });

  const filteredBlockedGoods = blockedAssessments.filter((item) => {
    if (!tableSearchQuery.trim()) return true;
    const q = tableSearchQuery.toLowerCase();
    return (
      item.appliedItem.toLowerCase().includes(q) ||
      item.blockingRegisteredItem.toLowerCase().includes(q) ||
      item.conflictingMarkName.toLowerCase().includes(q) ||
      item.legalEvaluationDetail.toLowerCase().includes(q)
    );
  });

  // Export / Copy Formal Legal Memo for Trademark Consultant
  const handleCopyLegalMemo = () => {
    const lines = [
      '================================================================================',
      'MEMORANDUM PEMERIKSAAN SUBSTANTIF POTENSI KONFLIK MEREK (PDKI DJKI)',
      '================================================================================',
      `Tanggal Pemeriksaan : ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`,
      `Merek Dimohonkan    : ${markName.toUpperCase()}`,
      `Kelas Nice          : Kelas ${selectedNiceClass.number} (${selectedNiceClass.title})`,
      `Uraian Barang/Jasa  : ${goodsServicesText || '-'}`,
      '--------------------------------------------------------------------------------',
      'I. DAFTAR MEREK TERDAFTAR YANG MEMILIKI KEMIRIPAN (PDKI DJKI)',
      '--------------------------------------------------------------------------------',
    ];

    if (similarMarks.length === 0) {
      lines.push('Tidak ditemukan catatan merek terdaftar dengan tingkat kemiripan signifikan.');
    } else {
      similarMarks.forEach((m, idx) => {
        lines.push(
          `${idx + 1}. Merek: "${m.record.markName}" | No. Reg: ${m.record.registrationNumber} (Kelas ${m.record.niceClass})`,
          `   Pemilik: ${m.record.ownerName}`,
          `   Status : ${m.record.status} (Perlindungan s/d ${m.record.expiryDate})`,
          `   Analisis: ${m.similarity.explanation}`
        );
      });
    }

    lines.push(
      '--------------------------------------------------------------------------------',
      'II. DAFTAR JENIS BARANG/JASA SEJENIS YANG SUDAH TIDAK BISA DIDAFTARKAN',
      '(Dinilai Berdasarkan Pedoman Pemeriksaan Substantif Merek DJKI Bagian 5.1.4)',
      '--------------------------------------------------------------------------------'
    );

    if (blockedAssessments.length === 0) {
      lines.push('Tidak ditemukan pemblokiran spesifik terhadap uraian barang/jasa yang diajukan.');
    } else {
      blockedAssessments.forEach((b, idx) => {
        lines.push(
          `${idx + 1}. Barang yang Diajukan : "${b.appliedItem}"`,
          `   Pembanding Terdaftar: "${b.blockingRegisteredItem}" pada Merek "${b.conflictingMarkName}" (${b.conflictingRegistrationNumber})`,
          `   Dasar Pengujian     : ${b.substantiveBasis}`,
          `   Evaluasi Yuridis    : ${b.legalEvaluationDetail}`
        );
      });
    }

    lines.push(
      '================================================================================',
      'Catatan Konsultan: Penilaian dilakukan secara objektif tanpa mencantumkan rekomendasi',
      'barang/jasa alternatif. Diperuntukkan khusus telaah yuridis konsultan KI.',
      '================================================================================'
    );

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-slate-200 selection:text-slate-900 print:bg-white print:text-black">
      {/* Top Professional Header (Clean, Judicial, Non-Alarmist) */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-slate-700" strokeWidth={1.75} />
                <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                  Sistem Pemeriksaan Substantif Konflik Merek PDKI DJKI
                </h1>
              </div>
              <p className="mt-1 text-xs text-slate-500 font-normal">
                Modul diagnostik hukum merek untuk konsultan HKI · Evaluasi kemiripan fonetik, visual, leksikal & Pedoman Pemeriksaan Substantif Merek Bagian 5.1.4
              </p>
            </div>

            {/* Quick Metadata Info */}
            <div className="flex items-center gap-3 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 border border-slate-200">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                Pangkalan Data PDKI RI
              </span>
              <span className="text-slate-300">|</span>
              <span>Klasifikasi Nice Ke-12</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Case Presets for Instant Testing by Trademark Consultant */}
        <section aria-label="Contoh Kasus Pengujian" className="bg-white border border-slate-200 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
            <span className="font-medium text-slate-700">Contoh Kasus Pengujian Cepat Konsultan:</span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleLoadPreset({
                  mark: '4EVER CARE',
                  classNum: 3,
                  desc: 'Krim pencerah kulit, sabun pembersih muka, toner wajah, tabir surya (sunscreen), lotion tubuh, parfum'
                })}
                className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
              >
                Kasus 1: "4EVER CARE" (Kelas 3 - Leetspeak & Kosmetik)
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset({
                  mark: 'KOPILUV',
                  classNum: 43,
                  desc: 'Kedai kopi, kafe penyedia minuman kopi, restoran cepat saji, jasa katering makanan pesta'
                })}
                className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
              >
                Kasus 2: "KOPILUV" (Kelas 43 - Ejaan Gaul & Kafe)
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset({
                  mark: 'SUPREME WEAR',
                  classNum: 25,
                  desc: 'Kemeja pria, kaos polo, celana panjang denim, sepatu olahraga, sandal kasual, topi'
                })}
                className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
              >
                Kasus 3: "SUPREME WEAR" (Kelas 25 - Genus vs Species)
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset({
                  mark: 'X-PRESS PAY',
                  classNum: 9,
                  desc: 'Perangkat lunak dompet digital, aplikasi mobile perbankan, software keamanan sistem komputer'
                })}
                className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
              >
                Kasus 4: "X-PRESS PAY" (Kelas 9 - Fintek & Software)
              </button>
            </div>
          </div>
        </section>

        {/* INPUT FORM: Structured strictly in separate independent rows (Baris 1, Baris 2, Baris 3) */}
        <section aria-labelledby="form-section-title" className="bg-white border border-slate-200 p-6 sm:p-7 shadow-xs">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h2 id="form-section-title" className="text-base font-medium text-slate-900 tracking-tight">
              Formulir Permohonan Pemeriksaan Substantif Merek
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Masukkan data permohonan merek untuk ditelaah terhadap pangkalan data pendaftaran terdaftar dan pedoman klausul barang/jasa sejenis.
            </p>
          </div>

          <form onSubmit={handlePerformExamination} className="space-y-6">
            
            {/* BARIS 1: Kolom input teks untuk "Nama Merek yang Dimohonkan" */}
            <div className="space-y-1.5">
              <label 
                htmlFor={markNameId} 
                className="block text-sm font-medium text-slate-800"
              >
                Baris 1: Nama Merek yang Dimohonkan
              </label>
              <div className="relative">
                <input
                  id={markNameId}
                  type="text"
                  required
                  value={markName}
                  onChange={(e) => setMarkName(e.target.value)}
                  placeholder="Ketikkan nama merek yang akan diperiksa (contoh: 4EVER CARE, KOPILUV, SUPREME WEAR, dll.)"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-slate-700 focus:border-slate-700 placeholder:text-slate-400 text-slate-900 transition-colors"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Mesin deteksi akan menguji persamaan nama secara fonetik, visual, dan leksikal (termasuk substitusi angka seperti "4" untuk "for" dan ejaan gaul seperti "luv" untuk "love").
              </p>
            </div>

            {/* BARIS 2: Kolom dropdown pilihan mandiri untuk memilih "Kelas Nice (Kelas 1 s/d 45)" dengan deskripsi kelas lengkap */}
            <div className="space-y-1.5">
              <label 
                htmlFor={niceClassId} 
                className="block text-sm font-medium text-slate-800"
              >
                Baris 2: Kelas Nice (Kelas 1 s/d 45)
              </label>
              <div className="relative">
                <select
                  id={niceClassId}
                  value={selectedClassNumber}
                  onChange={(e) => setSelectedClassNumber(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-slate-700 focus:border-slate-700 text-slate-900 transition-colors"
                >
                  <optgroup label="Klasifikasi Barang (Kelas 1 - 34)">
                    {NICE_CLASSES.filter((c) => c.type === 'Barang').map((nc) => (
                      <option key={nc.number} value={nc.number}>
                        Kelas {nc.number} ({nc.type}) - {nc.title}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Klasifikasi Jasa (Kelas 35 - 45)">
                    {NICE_CLASSES.filter((c) => c.type === 'Jasa').map((nc) => (
                      <option key={nc.number} value={nc.number}>
                        Kelas {nc.number} ({nc.type}) - {nc.title}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
              
              {/* Deskripsi Kelas Lengkap */}
              <div className="mt-2 p-3 bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <span className="font-semibold text-slate-900">Deskripsi Resmi Kelas {selectedNiceClass.number} ({selectedNiceClass.type}):</span>{' '}
                {selectedNiceClass.description}
              </div>
            </div>

            {/* BARIS 3: Kolom teks area mandiri untuk menuliskan "Uraian Jenis Barang / Jasa" */}
            <div className="space-y-1.5">
              <label 
                htmlFor={goodsServicesId} 
                className="block text-sm font-medium text-slate-800"
              >
                Baris 3: Uraian Jenis Barang / Jasa
              </label>
              <textarea
                id={goodsServicesId}
                rows={4}
                value={goodsServicesText}
                onChange={(e) => setGoodsServicesText(e.target.value)}
                placeholder="Tuliskan daftar jenis barang atau jasa yang dimohonkan, dipisahkan koma atau baris baru (contoh: Krim pembersih wajah, sabun mandi, pelembab kulit, toner wajah, sediaan tabir surya)"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-slate-700 focus:border-slate-700 placeholder:text-slate-400 text-slate-900 transition-colors leading-relaxed"
              />
              <p className="text-[11px] text-slate-500">
                Sistem akan menguji setiap item terhadap Pedoman Pemeriksaan Substantif Merek Bagian 5.1.4 (pembatasan frasa yaitu/khususnya vs seperti/termasuk, identik/sinonim/genus-species, dan 7 faktor keterkaitan non-identik).
              </p>
            </div>

            {/* ACTION BUTTONS: Reset & Hapus Cache + Mulai Pemeriksaan */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100">
              {/* Tombol Reset & Hapus Cache */}
              <button
                type="button"
                onClick={handleResetAndClearCache}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                title="Mengosongkan formulir dan membersihkan seluruh riwayat atau cache analisis"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                Reset & Hapus Cache
              </button>

              {/* Tombol Mulai Pemeriksaan Substantif */}
              <button
                type="submit"
                disabled={isExamining || !markName.trim()}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 transition-colors cursor-pointer shadow-xs"
              >
                <Search className="w-3.5 h-3.5" />
                {isExamining ? 'Menganalisis Berkas PDKI...' : 'Lakukan Pemeriksaan Substantif'}
              </button>
            </div>

          </form>
        </section>

        {/* RESULTS SECTION: DUA TABEL NETRAL (TIDAK ADA KOTAK MERAH, TIDAK ADA BANNER HEBOH, TIDAK ADA KARTU METRIK) */}
        {hasSearched && (
          <section aria-labelledby="results-section-title" className="space-y-6">
            
            {/* Header Kontrol Hasil Pemeriksaan */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-slate-200 p-4">
              <div>
                <h2 id="results-section-title" className="text-base font-semibold text-slate-900">
                  Hasil Pemeriksaan Substantif Merek: "{markName.toUpperCase()}"
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span>Kelas Dimohonkan: Kelas {selectedClassNumber}</span>
                  <span aria-hidden="true">·</span>
                  <span>Basis Data: PDKI DJKI Indonesia</span>
                  <span aria-hidden="true">·</span>
                  <span>Pedoman: Bagian 5.1.4</span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Search In Results */}
                <div className="relative">
                  <input
                    type="text"
                    value={tableSearchQuery}
                    onChange={(e) => setTableSearchQuery(e.target.value)}
                    placeholder="Saring hasil tabel..."
                    className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-slate-600 focus:border-slate-600 w-44"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>

                {/* Salin Teks Format Berita Acara Konsultan */}
                <button
                  type="button"
                  onClick={handleCopyLegalMemo}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  title="Salin hasil pemeriksaan untuk lampiran telaah hukum konsultan"
                >
                  {copiedSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-slate-700" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Salin Berita Acara</span>
                    </>
                  )}
                </button>

                {/* Cetak Hasil */}
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer print:hidden"
                  title="Cetak atau simpan sebagai dokumen PDF"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Cetak / PDF</span>
                </button>
              </div>
            </div>

            {/* TAB SELECTION (Neutral Navigation) */}
            <div className="flex border-b border-slate-200 bg-white">
              <button
                type="button"
                onClick={() => setActiveTab('both')}
                className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'both'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Semua Tabel ({filteredSimilarMarks.length} Merek Mirip · {filteredBlockedGoods.length} Barang Terblokir)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('similar-marks')}
                className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'similar-marks'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                1. Daftar Merek Terdaftar yang Mirip ({filteredSimilarMarks.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('blocked-goods')}
                className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'blocked-goods'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                2. Daftar Jenis Barang/Jasa Sejenis yang Sudah Tidak Bisa Didaftarkan ({filteredBlockedGoods.length})
              </button>
            </div>

            {/* TABEL 1: "Daftar Merek Terdaftar yang Mirip" dari PDKI */}
            {(activeTab === 'both' || activeTab === 'similar-marks') && (
              <div className="bg-white border border-slate-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Tabel 1: Daftar Merek Terdaftar yang Mirip (PDKI DJKI)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pemeriksaan persamaan pokok pada nama secara fonetik, visual, leksikal, serta substitusi angka / ejaan gaul.
                    </p>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    Total: {filteredSimilarMarks.length} data pembanding
                  </span>
                </div>

                {filteredSimilarMarks.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    Tidak ditemukan data pendaftaran merek terdahulu yang memiliki persamaan pokok nama signifikan di pangkalan data PDKI.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-medium">
                          <th className="py-3 px-4 w-40">No. Pendaftaran / Permohonan</th>
                          <th className="py-3 px-4 w-48">Merek Terdaftar Pembanding</th>
                          <th className="py-3 px-4 w-48">Pemilik Merek</th>
                          <th className="py-3 px-4 w-24">Kelas Nice</th>
                          <th className="py-3 px-4 w-36">Status & Masa Berlaku</th>
                          <th className="py-3 px-4">Analisis Persamaan Nama (Fonetik, Visual, Leksikal)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredSimilarMarks.map(({ record, similarity }) => (
                          <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-4 font-mono text-slate-700 align-top">
                              <div>{record.registrationNumber}</div>
                              <div className="text-[11px] text-slate-400 mt-0.5">Ref: {record.applicationNumber}</div>
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-900 align-top">
                              <div className="text-sm tracking-wide">{record.markName}</div>
                              <div className="mt-1 flex flex-wrap gap-1 text-[11px] text-slate-500">
                                <span>Norm: {similarity.normalizedTarget}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-700 align-top">
                              <div className="font-medium text-slate-800">{record.ownerName}</div>
                              <div className="text-[11px] text-slate-500 mt-0.5">{record.ownerAddress}</div>
                            </td>
                            <td className="py-3 px-4 text-slate-700 align-top font-mono">
                              Kelas {record.niceClass}
                            </td>
                            <td className="py-3 px-4 text-slate-700 align-top">
                              <div className="text-slate-800">{record.status}</div>
                              <div className="text-[11px] text-slate-500 mt-0.5">s/d {record.expiryDate}</div>
                            </td>
                            <td className="py-3 px-4 text-slate-700 align-top space-y-1.5">
                              {/* Rincian Aspek Kemiripan */}
                              <div className="flex items-center gap-2 text-[11px] text-slate-600">
                                <span className="font-medium text-slate-800">Modalitas Terdeteksi:</span>
                                <span>{similarity.aspects.join(' · ')}</span>
                              </div>

                              {/* Penjelasan Yuridis Objektif */}
                              <p className="text-xs text-slate-600 leading-relaxed">
                                {similarity.explanation}
                              </p>

                              {/* Nilai Skor Netral */}
                              <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                                <span>Fonetik: {similarity.phoneticScore}%</span>
                                <span>Visual: {similarity.visualScore}%</span>
                                <span>Leksikal: {similarity.lexicalScore}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TABEL 2: "Daftar Jenis Barang/Jasa Sejenis yang Sudah Tidak Bisa Didaftarkan" */}
            {(activeTab === 'both' || activeTab === 'blocked-goods') && (
              <div className="bg-white border border-slate-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Tabel 2: Daftar Jenis Barang/Jasa Sejenis yang Sudah Tidak Bisa Didaftarkan
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Dinilai secara objektif berdasarkan Pedoman Pemeriksaan Substantif Merek Bagian 5.1.4 DJKI (Aturan pembatasan frasa 5.1.4.1, Pengujian identik/sinonim/genus-species 5.1.4.2, dan 7 Faktor Keterkaitan Non-Identik 5.1.4.3).
                    </p>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    Total: {filteredBlockedGoods.length} item terblokir
                  </span>
                </div>

                {filteredBlockedGoods.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    {goodsServicesText.trim() === ''
                      ? 'Silakan isi Uraian Jenis Barang / Jasa pada Baris 3 formulir untuk melihat telaah pengujian substantif Bagian 5.1.4.'
                      : 'Berdasarkan pengujian substantif objektif Bagian 5.1.4, tidak ditemukan konflik identik, genus-species, maupun keterkaitan 7 faktor terhadap merek terdaftar pembanding yang memblokir pendaftaran barang/jasa yang diisikan.'}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-medium">
                          <th className="py-3 px-4 w-48">Uraian Barang/Jasa yang Diajukan</th>
                          <th className="py-3 px-4 w-60">Barang/Jasa Pembanding Terdaftar (PDKI)</th>
                          <th className="py-3 px-4 w-44">Merek Pembanding & No. Reg</th>
                          <th className="py-3 px-4 w-48">Dasar Klausul Pedoman DJKI</th>
                          <th className="py-3 px-4">Evaluasi Yuridis Objektif (Bagian 5.1.4)</th>
                          <th className="py-3 px-4 w-28 text-right">Rincian 7 Faktor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredBlockedGoods.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-4 font-medium text-slate-900 align-top">
                              <div className="text-xs font-semibold">{item.appliedItem}</div>
                              <div className="text-[11px] text-slate-500 mt-0.5">Dimohonkan di Kelas {selectedClassNumber}</div>
                            </td>
                            <td className="py-3 px-4 text-slate-700 align-top">
                              <p className="leading-relaxed text-xs">{item.blockingRegisteredItem}</p>
                            </td>
                            <td className="py-3 px-4 text-slate-700 align-top">
                              <div className="font-medium text-slate-900">{item.conflictingMarkName}</div>
                              <div className="font-mono text-[11px] text-slate-500 mt-0.5">
                                {item.conflictingRegistrationNumber} (Kelas {item.niceClass})
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-700 align-top">
                              <div className="font-medium text-slate-800">{item.substantiveBasis}</div>
                            </td>
                            <td className="py-3 px-4 text-slate-700 align-top leading-relaxed">
                              <p className="text-xs text-slate-600">{item.legalEvaluationDetail}</p>
                              <div className="text-[11px] text-slate-500 mt-1">
                                {item.similarityNote}
                              </div>
                            </td>
                            <td className="py-3 px-4 align-top text-right">
                              {item.sevenFactors ? (
                                <button
                                  type="button"
                                  onClick={() => setSelectedAssessmentForModal(item)}
                                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors cursor-pointer"
                                  title="Lihat rincian telaah 7 faktor keterkaitan non-identik"
                                >
                                  Telaah 7 Faktor
                                </button>
                              ) : (
                                <span className="text-[11px] text-slate-400">N/A (Identik)</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Catatan Kepatuhan Konsultan (Neutral, No Recommendations) */}
            <div className="p-4 bg-white border border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  Hasil pemeriksaan di atas disusun secara independen dan objektif semata-mata untuk mengidentifikasi potensi konflik substantive. Sesuai prinsip netralitas pemeriksaan hukum merek, sistem tidak menyajikan saran atau rekomendasi alternatif barang/jasa.
                </span>
              </div>
            </div>

          </section>
        )}

      </main>

      {/* MODAL: DETAIL TELAAH 7 FAKTOR KETERKAITAN NON-IDENTIK (PEDOMAN 5.1.4.3) */}
      {selectedAssessmentForModal && selectedAssessmentForModal.sevenFactors && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-seven-factors-title"
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white border border-slate-300 max-w-2xl w-full p-6 shadow-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 id="modal-seven-factors-title" className="text-sm font-semibold text-slate-900">
                  Rincian Pengujian 7 Faktor Keterkaitan Non-Identik (Pedoman 5.1.4.3)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Objek: "{selectedAssessmentForModal.appliedItem}" terhadap Merek "{selectedAssessmentForModal.conflictingMarkName}"
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAssessmentForModal(null)}
                className="text-slate-400 hover:text-slate-700 text-sm p-1 cursor-pointer"
                aria-label="Tutup modal"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-700 divide-y divide-slate-100">
              <div className="pt-2">
                <span className="font-semibold text-slate-900">1. Sifat Produk (Nature of Goods):</span>
                <p className="mt-0.5 text-slate-600 leading-relaxed">
                  {selectedAssessmentForModal.sevenFactors.productNature.note}
                </p>
              </div>

              <div className="pt-2">
                <span className="font-semibold text-slate-900">2. Tujuan dan Metode Penggunaan (Purpose & Method of Use):</span>
                <p className="mt-0.5 text-slate-600 leading-relaxed">
                  {selectedAssessmentForModal.sevenFactors.purposeAndMethod.note}
                </p>
              </div>

              <div className="pt-2">
                <span className="font-semibold text-slate-900">3. Komplementaritas Fungsional (Functional Complementarity):</span>
                <p className="mt-0.5 text-slate-600 leading-relaxed">
                  {selectedAssessmentForModal.sevenFactors.functionalComplementarity.note}
                </p>
              </div>

              <div className="pt-2">
                <span className="font-semibold text-slate-900">4. Hubungan Kompetisi / Substitusi (Competitive / Substitutive):</span>
                <p className="mt-0.5 text-slate-600 leading-relaxed">
                  {selectedAssessmentForModal.sevenFactors.competitiveOrSubstitutive.note}
                </p>
              </div>

              <div className="pt-2">
                <span className="font-semibold text-slate-900">5. Saluran Distribusi (Distribution Channels):</span>
                <p className="mt-0.5 text-slate-600 leading-relaxed">
                  {selectedAssessmentForModal.sevenFactors.distributionChannels.note}
                </p>
              </div>

              <div className="pt-2">
                <span className="font-semibold text-slate-900">6. Target Konsumen (Relevant Public / Target Consumers):</span>
                <p className="mt-0.5 text-slate-600 leading-relaxed">
                  {selectedAssessmentForModal.sevenFactors.targetConsumers.note}
                </p>
              </div>

              <div className="pt-2">
                <span className="font-semibold text-slate-900">7. Asal Produsen Industri (Commercial Manufacturing Origin):</span>
                <p className="mt-0.5 text-slate-600 leading-relaxed">
                  {selectedAssessmentForModal.sevenFactors.manufacturingOrigin.note}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedAssessmentForModal(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Tutup Telaah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 py-6 text-center text-xs text-slate-500 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <p>
            Alat Bantu Konsultan Merek Indonesia · Terkalibrasi dengan Pedoman Pemeriksaan Substantif Merek DJKI Bagian 5.1.4
          </p>
          <p className="mt-1 text-slate-400">
            Penilaian bersifat diagnostik objektif dan tidak memuat rekomendasi penggantian barang atau jasa.
          </p>
        </div>
      </footer>
    </div>
  );
}
