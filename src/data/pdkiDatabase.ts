export interface PdkiRecord {
  id: string;
  applicationNumber: string;
  registrationNumber: string;
  markName: string;
  ownerName: string;
  ownerAddress: string;
  niceClass: number;
  filingDate: string;
  registrationDate: string;
  expiryDate: string;
  status: string; // 'Terdaftar' | 'Dalam Proses'
  goodsServicesDescription: string;
  niceClauseNotes?: string;
  categoryKeywords: string[];
}

export const PDKI_DATABASE: PdkiRecord[] = [
  // KELAS 3 (Kosmetik, Sabun, Perawatan Tubuh)
  {
    id: 'PDKI-03-001',
    applicationNumber: 'DID2018042918',
    registrationNumber: 'IDM000784201',
    markName: 'FOREVER FLORA',
    ownerName: 'PT FLORAL BEAUTY INDONESIA',
    ownerAddress: 'Jakarta Barat, DKI Jakarta',
    niceClass: 3,
    filingDate: '12 September 2018',
    registrationDate: '20 Februari 2020',
    expiryDate: '12 September 2028',
    status: 'Terdaftar',
    goodsServicesDescription: 'Sediaan kosmetik; sabun mandi; sediaan pembersih kulit wajah; toner; serum wajah; krim pencerah; lotion tubuh; sediaan wewangian (parfum, eau de cologne).',
    categoryKeywords: ['kosmetik', 'sabun', 'pembersih', 'toner', 'serum', 'krim', 'lotion', 'parfum', 'wewangian', 'kulit', 'wajah']
  },
  {
    id: 'PDKI-03-002',
    applicationNumber: 'DID2020019482',
    registrationNumber: 'IDM000892341',
    markName: 'FOREVER YOUNG BEAUTY',
    ownerName: 'CV JAYA ESTETIKA PERKASA',
    ownerAddress: 'Surabaya, Jawa Timur',
    niceClass: 3,
    filingDate: '15 April 2020',
    registrationDate: '11 Agustus 2021',
    expiryDate: '15 April 2030',
    status: 'Terdaftar',
    goodsServicesDescription: 'Sediaan perawatan kulit yaitu: krim anti-penuaan, esens wajah, masker kecantikan, dan minyak pembersih wajah.',
    categoryKeywords: ['perawatan kulit', 'krim', 'anti-penuaan', 'esens', 'masker', 'minyak pembersih', 'kecantikan', 'wajah']
  },
  {
    id: 'PDKI-03-003',
    applicationNumber: 'DID2021063810',
    registrationNumber: 'IDM000958102',
    markName: '4EVER CARE',
    ownerName: 'PT DERMA COSMO GLOBAL',
    ownerAddress: 'Bandung, Jawa Barat',
    niceClass: 3,
    filingDate: '08 November 2021',
    registrationDate: '19 Oktober 2022',
    expiryDate: '08 November 2031',
    status: 'Terdaftar',
    goodsServicesDescription: 'Sediaan kosmetik untuk perlindungan sinar matahari seperti: tabir surya (sunscreen), sunblock spray, gel penenang setelah terpapar matahari (after-sun gel).',
    categoryKeywords: ['kosmetik', 'tabir surya', 'sunscreen', 'sunblock', 'gel', 'after-sun', 'kulit', 'care']
  },
  {
    id: 'PDKI-03-004',
    applicationNumber: 'DID2019033481',
    registrationNumber: 'IDM000812903',
    markName: 'AQUA FRESH DERM',
    ownerName: 'PT MEGA FARMA KOSMETINDO',
    ownerAddress: 'Tangerang, Banten',
    niceClass: 3,
    filingDate: '14 Juni 2019',
    registrationDate: '05 Mei 2020',
    expiryDate: '14 Juni 2029',
    status: 'Terdaftar',
    goodsServicesDescription: 'Sabun bukan obat; sediaan pembersih kulit muka; pasta gigi bukan obat; pencuci mulut bukan untuk keperluan medis.',
    categoryKeywords: ['sabun', 'pembersih', 'kulit', 'muka', 'pasta gigi', 'pencuci mulut']
  },
  {
    id: 'PDKI-03-005',
    applicationNumber: 'DID2022029140',
    registrationNumber: 'IDM001021489',
    markName: 'GLOW4EVER',
    ownerName: 'ESTEE GLOW INTERNATIONAL PTE. LTD.',
    ownerAddress: 'Singapura (Didaftarkan melalui Konsultan HKI di Jakarta)',
    niceClass: 3,
    filingDate: '17 Mei 2022',
    registrationDate: '02 Februari 2023',
    expiryDate: '17 Mei 2032',
    status: 'Terdaftar',
    goodsServicesDescription: 'Sediaan kosmetik rias wajah khususnya: alas bedak (foundation), bedak tabur, perona pipi, maskara, dan lipstik.',
    categoryKeywords: ['kosmetik', 'rias', 'foundation', 'bedak', 'perona pipi', 'maskara', 'lipstik', 'bibir', 'wajah']
  },

  // KELAS 5 (Farmasi, Medis, Suplemen, Obat Tradisional)
  {
    id: 'PDKI-05-001',
    applicationNumber: 'DID2017058912',
    registrationNumber: 'IDM000721490',
    markName: 'FOREVER VITA',
    ownerName: 'PT INDO FARMA PRIMA',
    ownerAddress: 'Semarang, Jawa Tengah',
    niceClass: 5,
    filingDate: '22 November 2017',
    registrationDate: '18 Januari 2019',
    expiryDate: '22 November 2027',
    status: 'Terdaftar',
    goodsServicesDescription: 'Suplemen makanan kesehatan; vitamin dan mineral; sediaan farmasi; obat tradisional berbentuk kapsul dan tablet.',
    categoryKeywords: ['suplemen', 'makanan kesehatan', 'vitamin', 'mineral', 'farmasi', 'obat', 'kapsul', 'tablet']
  },
  {
    id: 'PDKI-05-002',
    applicationNumber: 'DID2020041289',
    registrationNumber: 'IDM000889211',
    markName: 'BIO-DERM CARE',
    ownerName: 'PT PHARMA DERMATIKA NUSANTARA',
    ownerAddress: 'Jakarta Selatan, DKI Jakarta',
    niceClass: 5,
    filingDate: '10 Juli 2020',
    registrationDate: '03 Juni 2021',
    expiryDate: '10 Juli 2030',
    status: 'Terdaftar',
    goodsServicesDescription: 'Salep obat untuk penyakit kulit yaitu: salep anti-jamur, salep anti-bakteri, dan gel pereda luka bakar ringan.',
    categoryKeywords: ['salep', 'obat', 'kulit', 'anti-jamur', 'anti-bakteri', 'gel luka']
  },

  // KELAS 25 (Pakaian, Alas Kaki, Tutup Kepala)
  {
    id: 'PDKI-25-001',
    applicationNumber: 'DID2019011928',
    registrationNumber: 'IDM000823901',
    markName: 'SUPREME WEAR',
    ownerName: 'PT APPAREL MODE INDONESIA',
    ownerAddress: 'Bandung, Jawa Barat',
    niceClass: 25,
    filingDate: '14 Februari 2019',
    registrationDate: '09 Desember 2019',
    expiryDate: '14 Februari 2029',
    status: 'Terdaftar',
    goodsServicesDescription: 'Pakaian, alas kaki, tutup kepala (genus luas mencakup seluruh pakaian jadi pria, wanita, anak-anak, kaos, kemeja, celana, jaket, sepatu, dan topi).',
    categoryKeywords: ['pakaian', 'alas kaki', 'tutup kepala', 'kaos', 'kemeja', 'celana', 'jaket', 'sepatu', 'topi', 'busana']
  },
  {
    id: 'PDKI-25-002',
    applicationNumber: 'DID2021033819',
    registrationNumber: 'IDM000941902',
    markName: '4EVER FIT',
    ownerName: 'CV KREASI BUSANA SEJAHTERA',
    ownerAddress: 'Jakarta Utara, DKI Jakarta',
    niceClass: 25,
    filingDate: '20 Mei 2021',
    registrationDate: '14 Maret 2022',
    expiryDate: '20 Mei 2031',
    status: 'Terdaftar',
    goodsServicesDescription: 'Pakaian olahraga yaitu: celana legging senam, baju olahraga lari, kaos berkerah olahraga, dan pakaian renang.',
    categoryKeywords: ['pakaian olahraga', 'legging', 'baju lari', 'kaos olahraga', 'pakaian renang']
  },
  {
    id: 'PDKI-25-003',
    applicationNumber: 'DID2018029141',
    registrationNumber: 'IDM000762981',
    markName: 'APEX ACTIVE',
    ownerName: 'PT LANGKAH PRIMA SPORT',
    ownerAddress: 'Tangerang, Banten',
    niceClass: 25,
    filingDate: '05 Mei 2018',
    registrationDate: '11 Februari 2019',
    expiryDate: '05 Mei 2028',
    status: 'Terdaftar',
    goodsServicesDescription: 'Alas kaki khususnya: sepatu olahraga, sepatu lari, sepatu basket, dan sandal kasual santai.',
    categoryKeywords: ['alas kaki', 'sepatu', 'sepatu olahraga', 'sepatu lari', 'sepatu basket', 'sandal']
  },
  {
    id: 'PDKI-25-004',
    applicationNumber: 'DID2022049102',
    registrationNumber: 'IDM001049219',
    markName: 'GR8 STYLE',
    ownerName: 'PT FASHION DELAPAN NUSANTARA',
    ownerAddress: 'Jakarta Pusat, DKI Jakarta',
    niceClass: 25,
    filingDate: '19 Agustus 2022',
    registrationDate: '08 Mei 2023',
    expiryDate: '19 Agustus 2032',
    status: 'Terdaftar',
    goodsServicesDescription: 'Pakaian pria dan wanita seperti: kemeja kasual, gaun santai, rok pendek, celana denim, jas santai, dan syal leher.',
    categoryKeywords: ['pakaian', 'kemeja', 'gaun', 'rok', 'celana denim', 'jas', 'syal']
  },

  // KELAS 30 (Kopi, Teh, Cokelat, Olahan Tepung, Roti)
  {
    id: 'PDKI-30-001',
    applicationNumber: 'DID2019058190',
    registrationNumber: 'IDM000841920',
    markName: 'KOPI LUV',
    ownerName: 'PT KASIH KOPI NUSANTARA',
    ownerAddress: 'Jakarta Selatan, DKI Jakarta',
    niceClass: 30,
    filingDate: '02 Oktober 2019',
    registrationDate: '16 Juli 2020',
    expiryDate: '02 Oktober 2029',
    status: 'Terdaftar',
    goodsServicesDescription: 'Biji kopi sangrai; kopi bubuk; minuman berbahan dasar kopi; sediaan minuman kopi susu dalam kemasan; teh tarik.',
    categoryKeywords: ['kopi', 'biji kopi', 'kopi bubuk', 'minuman kopi', 'kopi susu', 'teh']
  },
  {
    id: 'PDKI-30-002',
    applicationNumber: 'DID2020011928',
    registrationNumber: 'IDM000871920',
    markName: 'KOPI KENANGAN ABADI',
    ownerName: 'PT BUMI BERKAH BOGA',
    ownerAddress: 'Jakarta Selatan, DKI Jakarta',
    niceClass: 30,
    filingDate: '28 Februari 2020',
    registrationDate: '04 Desember 2020',
    expiryDate: '28 Februari 2030',
    status: 'Terdaftar',
    goodsServicesDescription: 'Kopi; ekstrak kopi; minuman dengan perisa kopi; minuman kopi siap saji; teh; kakao; roti dan kue basah.',
    categoryKeywords: ['kopi', 'ekstrak kopi', 'minuman kopi', 'kopi siap saji', 'teh', 'kakao', 'roti', 'kue']
  },
  {
    id: 'PDKI-30-003',
    applicationNumber: 'DID2021021948',
    registrationNumber: 'IDM000932149',
    markName: 'FOREVER SWEET',
    ownerName: 'PT MANISAN ALAMI BERSAMA',
    ownerAddress: 'Sidoarjo, Jawa Timur',
    niceClass: 30,
    filingDate: '11 Maret 2021',
    registrationDate: '19 November 2021',
    expiryDate: '11 Maret 2031',
    status: 'Terdaftar',
    goodsServicesDescription: 'Kue kering, roti manis, biskuit, cokelat batang, dan kembang gula (permen).',
    categoryKeywords: ['kue kering', 'roti manis', 'biskuit', 'cokelat', 'kembang gula', 'permen']
  },

  // KELAS 32 (Minuman Non-Alkohol, Jus, Air Mineral)
  {
    id: 'PDKI-32-001',
    applicationNumber: 'DID2018049102',
    registrationNumber: 'IDM000782190',
    markName: 'AQUA FRESH SPRINGS',
    ownerName: 'PT TIRTA MURNI LESTARI',
    ownerAddress: 'Bogor, Jawa Barat',
    niceClass: 32,
    filingDate: '18 Agustus 2018',
    registrationDate: '24 Mei 2019',
    expiryDate: '18 Agustus 2028',
    status: 'Terdaftar',
    goodsServicesDescription: 'Air mineral kemasan; air minum demineral; air soda berkarbonasi; sari buah kemasan; minuman sari kelapa tanpa alkohol.',
    categoryKeywords: ['air mineral', 'air minum', 'air soda', 'sari buah', 'jus', 'minuman tanpa alkohol']
  },

  // KELAS 35 (Jasa Ritel, Periklanan, Manajemen Bisnis)
  {
    id: 'PDKI-35-001',
    applicationNumber: 'DID2019028190',
    registrationNumber: 'IDM000831092',
    markName: 'SUPREME MART',
    ownerName: 'PT RITEL NIAGA CEMERLANG',
    ownerAddress: 'Jakarta Barat, DKI Jakarta',
    niceClass: 35,
    filingDate: '17 April 2019',
    registrationDate: '12 Januari 2020',
    expiryDate: '17 April 2029',
    status: 'Terdaftar',
    goodsServicesDescription: 'Jasa penjualan eceran dan grosir barang-barang kebutuhan sehari-hari, supermarket, toko serba ada (department store); jasa periklanan daring.',
    categoryKeywords: ['penjualan eceran', 'ritel', 'supermarket', 'department store', 'periklanan']
  },
  {
    id: 'PDKI-35-002',
    applicationNumber: 'DID2021071290',
    registrationNumber: 'IDM000982109',
    markName: '4EVER BOUTIQUE',
    ownerName: 'CV BUTIK KREASI FASHION',
    ownerAddress: 'Denpasar, Bali',
    niceClass: 35,
    filingDate: '03 Desember 2021',
    registrationDate: '14 September 2022',
    expiryDate: '03 Desember 2031',
    status: 'Terdaftar',
    goodsServicesDescription: 'Jasa toko ritel pakaian, alas kaki, tas, dan aksesoris busana; promosi penjualan untuk pihak ketiga melalui platform digital.',
    categoryKeywords: ['toko ritel', 'butik', 'pakaian', 'alas kaki', 'tas', 'aksesoris', 'promosi']
  },

  // KELAS 42 (Jasa TI, SaaS, Desain Perangkat Lunak)
  {
    id: 'PDKI-42-001',
    applicationNumber: 'DID2020059102',
    registrationNumber: 'IDM000912803',
    markName: 'CYBERBYTE TECH',
    ownerName: 'PT DIGITAL CIPTA TEKNOLOGI',
    ownerAddress: 'Jakarta Selatan, DKI Jakarta',
    niceClass: 42,
    filingDate: '29 September 2020',
    registrationDate: '18 Juni 2021',
    expiryDate: '29 September 2030',
    status: 'Terdaftar',
    goodsServicesDescription: 'Jasa desain dan pengembangan perangkat lunak komputer; penyediaan platform Software as a Service (SaaS); jasa konsultasi arsitektur sistem informasi komputer; hosting situs web.',
    categoryKeywords: ['perangkat lunak', 'software', 'saas', 'konsultasi', 'hosting', 'pemrograman', 'sistem']
  },

  // KELAS 43 (Kafe, Kedai Kopi, Restoran, Katering)
  {
    id: 'PDKI-43-001',
    applicationNumber: 'DID2019069102',
    registrationNumber: 'IDM000859102',
    markName: 'KOPI LUV CAFE',
    ownerName: 'PT KASIH BOGA MAKMUR',
    ownerAddress: 'Jakarta Selatan, DKI Jakarta',
    niceClass: 43,
    filingDate: '14 November 2019',
    registrationDate: '08 September 2020',
    expiryDate: '14 November 2029',
    status: 'Terdaftar',
    goodsServicesDescription: 'Jasa penyediaan makanan dan minuman; kedai kopi; kafe; kedai minuman boba; jasa katering makanan pesta; restoran cepat saji.',
    categoryKeywords: ['penyediaan makanan dan minuman', 'kedai kopi', 'kafe', 'restoran', 'katering']
  },
  {
    id: 'PDKI-43-002',
    applicationNumber: 'DID2021011928',
    registrationNumber: 'IDM000928190',
    markName: '2GETHER COFFEE & EATERY',
    ownerName: 'CV KITA BERSAMA KULINER',
    ownerAddress: 'Yogyakarta, DI Yogyakarta',
    niceClass: 43,
    filingDate: '18 Februari 2021',
    registrationDate: '25 Oktober 2021',
    expiryDate: '18 Februari 2031',
    status: 'Terdaftar',
    goodsServicesDescription: 'Jasa kafe kopi, kedai makan, penyediaan makanan ringan, dan pemesanan tempat makan bersama.',
    categoryKeywords: ['kafe kopi', 'kedai makan', 'makanan ringan', 'restoran']
  },

  // KELAS 44 (Klinik Kecantikan, Perawatan Higienis)
  {
    id: 'PDKI-44-001',
    applicationNumber: 'DID2020038910',
    registrationNumber: 'IDM000898210',
    markName: 'FOREVER CLINIC',
    ownerName: 'PT ESTETIKA MEDIKA UTAMA',
    ownerAddress: 'Jakarta Pusat, DKI Jakarta',
    niceClass: 44,
    filingDate: '23 Juni 2020',
    registrationDate: '17 Mei 2021',
    expiryDate: '23 Juni 2030',
    status: 'Terdaftar',
    goodsServicesDescription: 'Jasa klinik kecantikan estetika; perawatan kulit wajah dan tubuh; jasa salon kecantikan; spa terapi higienis.',
    categoryKeywords: ['klinik kecantikan', 'estetika', 'perawatan kulit', 'salon', 'spa']
  },

  // KELAS 9 (Perangkat Keras, Komputer, Software Aplikasi)
  {
    id: 'PDKI-09-001',
    applicationNumber: 'DID2018034912',
    registrationNumber: 'IDM000779210',
    markName: 'CYBERBYTE',
    ownerName: 'PT DIGITAL TEKNOLOGI SOLUSINDO',
    ownerAddress: 'Jakarta Barat, DKI Jakarta',
    niceClass: 9,
    filingDate: '19 Juni 2018',
    registrationDate: '10 Maret 2019',
    expiryDate: '19 Juni 2028',
    status: 'Terdaftar',
    goodsServicesDescription: 'Perangkat lunak komputer yang dapat diunduh untuk manajemen database; aplikasi seluler untuk transaksi keuangan; perangkat keras komputer; periferal komputer.',
    categoryKeywords: ['perangkat lunak', 'aplikasi seluler', 'database', 'perangkat keras', 'komputer']
  },
  {
    id: 'PDKI-09-002',
    applicationNumber: 'DID2022019283',
    registrationNumber: 'IDM001019283',
    markName: 'X-PRESS PAY',
    ownerName: 'PT FINTEK CIPTA NUSANTARA',
    ownerAddress: 'Jakarta Selatan, DKI Jakarta',
    niceClass: 9,
    filingDate: '28 Maret 2022',
    registrationDate: '12 Desember 2022',
    expiryDate: '28 Maret 2032',
    status: 'Terdaftar',
    goodsServicesDescription: 'Perangkat lunak aplikasi pembayaran elektronik dan dompet digital; perangkat lunak autentikasi keamanan siber.',
    categoryKeywords: ['aplikasi pembayaran', 'dompet digital', 'autentikasi', 'perangkat lunak']
  },

  // KELAS 39 (Logistik, Pengiriman, Ekspedisi)
  {
    id: 'PDKI-39-001',
    applicationNumber: 'DID2017049102',
    registrationNumber: 'IDM000719820',
    markName: 'X-PRESS LOGISTICS',
    ownerName: 'PT EKSPEDISI CEPAT NUSANTARA',
    ownerAddress: 'Bekasi, Jawa Barat',
    niceClass: 39,
    filingDate: '11 Oktober 2017',
    registrationDate: '15 Agustus 2018',
    expiryDate: '11 Oktober 2027',
    status: 'Terdaftar',
    goodsServicesDescription: 'Jasa kurir pengiriman barang dan dokumen; jasa transportasi kargo darat dan udara; pergudangan dan penyimpanan paket.',
    categoryKeywords: ['kurir', 'pengiriman barang', 'transportasi kargo', 'pergudangan', 'logistik']
  }
];
