import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Server-side Trademark Substantive Examination Proxy
app.post('/api/analyze', async (req: Request, res: Response) => {
  try {
    const { markName, niceClass, goodsServices } = req.body;

    if (!markName || !niceClass) {
      return res.status(400).json({ error: 'Parameter markName dan niceClass diperlukan' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        geminiActive: false,
        message: 'Mode komputasi deterministik PDKI aktif'
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Anda adalah sistem penilai hukum merek substantif DJKI Indonesia (Direktorat Jenderal Kekayaan Intelektual).
Analisis potensi konflik merek berikut berdasarkan Pedoman Pemeriksaan Substantif Merek Bagian 5.1.4:
- Nama Merek yang Dimohonkan: "${markName}"
- Kelas Nice: Kelas ${niceClass}
- Uraian Jenis Barang / Jasa: "${goodsServices || '-'}"

Ketentuan Mutlak:
1. Analisis kemiripan nama secara:
   - Fonetik (pengucapan bunyi)
   - Visual (bentuk huruf)
   - Leksikal (makna kata, termasuk substitusi angka seperti "4ever" = "forever", leetspeak, dan ejaan gaul)
2. Uji jenis barang/jasa sejenis yang terblokir berdasarkan:
   - 5.1.4.1 Aturan Klasifikasi Nice dan pembatasan frasa ("yaitu/khususnya" vs "seperti/termasuk")
   - 5.1.4.2 Hubungan identik, sinonim, atau genus-species (luas vs spesifik)
   - 5.1.4.3 Pengujian 7 faktor keterkaitan non-identik: sifat produk, tujuan/metode penggunaan, komplementaritas fungsional, hubungan kompetisi/substitusi, saluran distribusi, target konsumen, asal produsen industri.
3. KETENTUAN MUTLAK: JANGAN PERNAH MENAMPILKAN REKOMENDASI ATAU SARAN BARANG/JASA ALTERNATIF YANG BISA DIDAFTARKAN! Tidak ada saran alternatif apa pun.

Kembalikan respon dalam format JSON murni:
{
  "phoneticAssessment": "penjelasan netral fonetik",
  "visualAssessment": "penjelasan netral visual",
  "lexicalAssessment": "penjelasan netral leksikal termasuk substitusi angka jika ada",
  "substantiveNotes": "penjelasan telaah substantif 5.1.4 objektif"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || '{}';
    let parsedData = {};
    try {
      parsedData = JSON.parse(text);
    } catch {
      parsedData = { substantiveNotes: text };
    }

    return res.json({
      geminiActive: true,
      analysis: parsedData
    });
  } catch (error) {
    console.error('Substantive analysis error:', error);
    return res.status(500).json({
      error: 'Terjadi kendala pada pemeriksaan server',
      fallback: true
    });
  }
});

// Setup Vite Dev Middleware or Static File Serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server pemeriksaan konflik merek PDKI berjalan di port ${PORT}`);
  });
}

startServer();
