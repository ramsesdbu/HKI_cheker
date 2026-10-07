export interface NiceClass {
  number: number;
  type: 'Barang' | 'Jasa';
  title: string;
  description: string;
}

export const NICE_CLASSES: NiceClass[] = [
  {
    number: 1,
    type: 'Barang',
    title: 'Bahan Kimia Industri, Sains, dan Pertanian',
    description: 'Bahan kimia untuk keperluan industri, ilmu pengetahuan, fotografi, pertanian, hortikultura, dan kehutanan; damar buatan yang belum diolah, plastik yang belum diolah; kompos, pupuk, pupuk alam; sediaan biologis untuk keperluan industri.'
  },
  {
    number: 2,
    type: 'Barang',
    title: 'Cat, Pernis, dan Bahan Anti Karat',
    description: 'Cat, pernis, lak; bahan pencegah karat dan pembusukan kayu; bahan pewarna, cat warna; tinta untuk pencetakan, penandaan dan pengukiran; damar alami mentah; logam dalam bentuk lembaran dan bubuk untuk keperluan melukis, menghias, mencetak dan seni.'
  },
  {
    number: 3,
    type: 'Barang',
    title: 'Kosmetik, Sabun, dan Sediaan Pembersih',
    description: 'Sediaan bukan obat untuk membersihkan dan kosmetik; sediaan wangi-wangian, minyak asiri; sediaan pemutih dan bahan lain untuk mencuci; sediaan untuk membersihkan, mengilapkan, menggosok dan meratakan permukaan kulit; sabun bukan obat; pasta gigi bukan obat.'
  },
  {
    number: 4,
    type: 'Barang',
    title: 'Minyak Industri, Pelumas, dan Bahan Bakar',
    description: 'Minyak dan lemak untuk industri, lilin; pelumas; bahan untuk menyerap, membasahi dan mengikat debu; bahan bakar dan bahan penerangan; lilin penerangan dan sumbu untuk penerangan.'
  },
  {
    number: 5,
    type: 'Barang',
    title: 'Farmasi, Medis, dan Suplemen Diet',
    description: 'Sediaan farmasi, medis dan veteriner; sediaan saniter untuk keperluan medis; makanan dan bahan dietetik yang disesuaikan untuk penggunaan medis atau veteriner, makanan bayi; suplemen diet untuk manusia dan hewan; plester, bahan pembalut; bahan untuk menambal gigi, lilin gigi; disinfektan; sediaan untuk membasmi hama; fungisida, herbisida.'
  },
  {
    number: 6,
    type: 'Barang',
    title: 'Logam Biasa dan Bahan Bangunan Logam',
    description: 'Logam biasa dan paduannya, bijih logam; bahan bangunan dan konstruksi dari logam; bangunan logam yang dapat dipindahkan; kabel dan kawat bukan listrik dari logam biasa; perkakas kecil dari besi dan logam; wadah dari logam untuk penyimpanan atau transportasi; brankas.'
  },
  {
    number: 7,
    type: 'Barang',
    title: 'Mesin, Perkakas Mesin, dan Motor',
    description: 'Mesin, perkakas mesin, perkakas bertenaga; motor dan mesin (kecuali untuk kendaraan darat); kopling mesin dan komponen transmisi (kecuali untuk kendaraan darat); instrumen pertanian selain alat tangan yang dioperasikan secara manual; mesin tetas telur; mesin penjual otomatis.'
  },
  {
    number: 8,
    type: 'Barang',
    title: 'Perkakas Tangan dan Alat Potong Manual',
    description: 'Perkakas dan alat tangan, dioperasikan secara manual; pisau, garpu dan sendok; senjata tajam; pisau cukur.'
  },
  {
    number: 9,
    type: 'Barang',
    title: 'Perangkat Lunak, Elektronik, dan Aparatus Ilmiah',
    description: 'Aparatus dan instrumen ilmiah, penelitian, navigasi, survei, fotografi, sinematografi, audio-visual, optik, timbang, ukur, sinyal, deteksi, uji, periksa, penyelamatan dan pengajaran; aparatus dan instrumen untuk menghantarkan, mengalihkan, mengubah, mengakumulasikan, mengatur atau mengontrol distribusi atau penggunaan listrik; aparatus dan instrumen untuk merekam, mengirimkan, mereproduksi atau memproses suara, gambar atau data; media yang dapat direkam dan diunduh, perangkat lunak komputer; mekanisme untuk aparatus yang dioperasikan dengan koin; mesin hitung kasir; komputer dan periferal komputer; pakaian selam, masker selam; alat pemadam kebakaran.'
  },
  {
    number: 10,
    type: 'Barang',
    title: 'Peralatan Bedah, Medis, dan Gigi',
    description: 'Aparatus dan instrumen bedah, medis, gigi dan veteriner; anggota tubuh, mata dan gigi buatan; barang ortopedi; bahan jahitan bedah; alat terapi dan bantu untuk penyandang cacat; aparatus pijat; aparatus, peralatan dan artikel perawatan bayi.'
  },
  {
    number: 11,
    type: 'Barang',
    title: 'Instalasi Penerangan, Pemanas, dan Saniter',
    description: 'Aparatus dan instalasi untuk penerangan, pemanasan, pendinginan, penghasil uap, pemasakan, pengeringan, ventilasi, penyediaan air dan keperluan saniter.'
  },
  {
    number: 12,
    type: 'Barang',
    title: 'Kendaraan dan Aparatus Transportasi',
    description: 'Kendaraan; aparatus untuk lokomosi di darat, udara atau air.'
  },
  {
    number: 13,
    type: 'Barang',
    title: 'Senjata Api, Amunisi, dan Kembang Api',
    description: 'Senjata api; amunisi dan proyektil; bahan peledak; kembang api.'
  },
  {
    number: 14,
    type: 'Barang',
    title: 'Logam Mulia, Perhiasan, dan Jam Tangan',
    description: 'Logam mulia dan paduannya; perhiasan, batu mulia dan semi-mulia; instrumen penunjuk waktu dan kronometris.'
  },
  {
    number: 15,
    type: 'Barang',
    title: 'Alat Musik dan Aksesorinya',
    description: 'Alat musik; alat penyangga dan wadah khusus untuk alat musik; tongkat dirigen musik.'
  },
  {
    number: 16,
    type: 'Barang',
    title: 'Kertas, Alat Tulis, Barang Cetakan, dan Kemasan',
    description: 'Kertas dan karton; barang cetakan; bahan penjilidan buku; foto; alat tulis menulis dan perlengkapan kantor, kecuali perabot; perekat untuk alat tulis atau keperluan rumah tangga; bahan lukis dan bahan untuk seniman; kuas cat; bahan pengajaran dan instruksional; lembaran plastik, film dan kantong untuk pembungkus dan pengemasan; huruf cetak, klise cetak.'
  },
  {
    number: 17,
    type: 'Barang',
    title: 'Karet, Plastik Setengah Jadi, dan Isolasi',
    description: 'Karet yang belum diolah dan setengah diolah, gutaperka, gom, asbes, mika dan bahan penggantinya; plastik dan resin dalam bentuk diekstrusi untuk digunakan dalam manufaktur; bahan penyekat, penutup dan isolasi; pipa lentur, tabung dan selang bukan dari logam.'
  },
  {
    number: 18,
    type: 'Barang',
    title: 'Kulit, Koper, Tas, Dompet, dan Payung',
    description: 'Kulit dan kulit imitasi; kulit binatang, belulang; koper dan tas jinjing; payung dan payung matahari; tongkat jalan; cambuk, pelana dan pakaian untuk hewan; kalung leher, tali kekang dan pakaian hewan.'
  },
  {
    number: 19,
    type: 'Barang',
    title: 'Bahan Bangunan Non-Logam',
    description: 'Bahan bangunan bukan dari logam; pipa kaku bukan dari logam untuk bangunan; aspal, tir dan bitumen; bangunan yang dapat dipindahkan bukan dari logam; monumen bukan dari logam.'
  },
  {
    number: 20,
    type: 'Barang',
    title: 'Perabot, Mebel, Cermin, dan Wadah Non-Logam',
    description: 'Perabot, cermin, bingkai gambar; wadah bukan dari logam untuk penyimpanan atau transportasi; tulang, tanduk, tulang paus atau kulit mutiara yang belum diolah atau setengah diolah; cangkang; sepiolit; ambar kuning.'
  },
  {
    number: 21,
    type: 'Barang',
    title: 'Perkakas Rumah Tangga, Dapur, dan Barang Pecah Belah',
    description: 'Perkakas dan wadah untuk rumah tangga atau dapur; peralatan masak dan makan, kecuali garpu, pisau dan sendok; sisir dan spons; sikat, kecuali kuas cat; bahan pembuat sikat; artikel untuk keperluan membersihkan; kaca yang belum diolah atau setengah diolah, kecuali kaca bangunan; barang pecah belah, porselen dan tembikar.'
  },
  {
    number: 22,
    type: 'Barang',
    title: 'Tali, Tenda, Terpal, Layar, dan Karung',
    description: 'Tali dan senar; jaring; tenda dan terpal; tenda terpal dari bahan tekstil atau sintetis; layar kapal; kantong untuk pengangkutan dan penyimpanan bahan dalam jumlah besar; bahan bantalan dan pengisi, kecuali dari kertas, karton, karet atau plastik; bahan serat tekstil mentah dan penggantinya.'
  },
  {
    number: 23,
    type: 'Barang',
    title: 'Benang dan Benang Wol untuk Tekstil',
    description: 'Benang dan benang wol untuk keperluan tekstil.'
  },
  {
    number: 24,
    type: 'Barang',
    title: 'Tekstil, Kain, Selimut, dan Sprei',
    description: 'Tekstil dan pengganti tekstil; kain linen untuk rumah tangga; tirai dari bahan tekstil atau plastik.'
  },
  {
    number: 25,
    type: 'Barang',
    title: 'Pakaian, Alas Kaki, dan Tutup Kepala',
    description: 'Pakaian, alas kaki, tutup kepala (termasuk kemeja, celana, kaos, jaket, gaun, sepatu, sandal, topi).'
  },
  {
    number: 26,
    type: 'Barang',
    title: 'Renda, Kancing, Pita, dan Hiasan Busana',
    description: 'Renda, jalinan pita dan bordir, serta pita dan busur perlengkapan pakaian; kancing, kait dan mata kait, peniti dan jarum; bunga buatan; hiasan rambut; rambut palsu.'
  },
  {
    number: 27,
    type: 'Barang',
    title: 'Karpet, Permadani, Tikar, dan Penutup Lantai',
    description: 'Karpet, permadani, tikar dan anyaman, linoleum dan bahan penutup lain untuk lantai; hiasan dinding bukan dari tekstil.'
  },
  {
    number: 28,
    type: 'Barang',
    title: 'Mainan, Alat Olahraga, dan Permainan Video',
    description: 'Permainan, mainan dan alat mainan; aparatus permainan video; artikel senam dan olahraga; dekorasi untuk pohon Natal.'
  },
  {
    number: 29,
    type: 'Barang',
    title: 'Daging, Ikan, Olahan Susu, Minyak Nabati, Makanan Awetan',
    description: 'Daging, ikan, unggas dan hewan buruan; ekstrak daging; buah dan sayuran yang diawetkan, dibekukan, dikeringkan dan dimasak; jeli, selai, kolak; telur; susu, keju, mentega, yoghurt dan produk susu lainnya; minyak dan lemak yang dapat dimakan.'
  },
  {
    number: 30,
    type: 'Barang',
    title: 'Kopi, Teh, Cokelat, Beras, Roti, Tepung, dan Bumbu',
    description: 'Kopi, teh, kakao dan pengganti kopi; beras, pasta dan mi; tapioka dan sagu; tepung dan sediaan terbuat dari serealia; roti, kue dan kembang gula; cokelat; es krim, sorbet dan es lainnya yang dapat dimakan; gula, madu, sirup; ragi, bubuk pengembang; garam, bumbu penyedap, rempah-rempah, herba awetan; cuka, saus dan bumbu lainnya; es batu.'
  },
  {
    number: 31,
    type: 'Barang',
    title: 'Produk Pertanian Segar, Benih, Hewan Hidup, dan Pakan',
    description: 'Produk pertanian, akuakultur, hortikultura dan kehutanan yang belum diolah dan mentah; biji-bijian dan bibit yang belum diolah; buah dan sayuran segar, herba segar; tanaman dan bunga alami; umbi, bibit dan benih untuk penanaman; hewan hidup; makanan untuk hewan; malt.'
  },
  {
    number: 32,
    type: 'Barang',
    title: 'Bir, Minuman Non-Alkohol, Air Mineral, dan Jus Buah',
    description: 'Bir; minuman tanpa alkohol; air mineral dan air berkarbonasi; minuman buah dan jus buah; sirup dan sediaan lain tanpa alkohol untuk membuat minuman.'
  },
  {
    number: 33,
    type: 'Barang',
    title: 'Minuman Beralkohol (Kecuali Bir)',
    description: 'Minuman beralkohol, kecuali bir; sediaan beralkohol untuk membuat minuman.'
  },
  {
    number: 34,
    type: 'Barang',
    title: 'Tembakau, Rokok, Rokok Elektronik, dan Korek Api',
    description: 'Tembakau dan pengganti tembakau; rokok dan cerutu; rokok elektronik dan alat penguap oral untuk perokok; barang keperluan perokok; korek api.'
  },
  {
    number: 35,
    type: 'Jasa',
    title: 'Periklanan, Manajemen Bisnis, dan Ritel / Grosir',
    description: 'Periklanan; manajemen bisnis, organisasi dan administrasi bisnis; fungsi kantor; jasa toko eceran dan grosir; jasa promosi komersial.'
  },
  {
    number: 36,
    type: 'Jasa',
    title: 'Keuangan, Perbankan, Asuransi, dan Real Estat',
    description: 'Jasa keuangan, moneter dan perbankan; jasa asuransi; urusan real estat; penilaian keuangan dan kepialangan saham.'
  },
  {
    number: 37,
    type: 'Jasa',
    title: 'Konstruksi, Pemasangan, dan Perbaikan',
    description: 'Jasa konstruksi; jasa pemasangan dan perbaikan; ekstraksi penambangan, pengeboran minyak dan gas.'
  },
  {
    number: 38,
    type: 'Jasa',
    title: 'Telekomunikasi dan Penyiaran Data',
    description: 'Jasa telekomunikasi; penyiaran program radio dan televisi; transmisi data digital dan pesan.'
  },
  {
    number: 39,
    type: 'Jasa',
    title: 'Transportasi, Pergudangan, dan Logistik Ekspedisi',
    description: 'Transportasi; pengemasan dan penyimpanan barang; pengaturan perjalanan; logistik pengiriman.'
  },
  {
    number: 40,
    type: 'Jasa',
    title: 'Perlakuan Bahan, Percetakan, dan Pengolahan Limbah',
    description: 'Perlakuan terhadap bahan; daur ulang sampah dan limbah; penyulingan udara dan pemurnian air; jasa percetakan; pengawetan makanan dan minuman.'
  },
  {
    number: 41,
    type: 'Jasa',
    title: 'Pendidikan, Pelatihan, Hiburan, dan Olahraga',
    description: 'Pendidikan; penyediaan pelatihan; hiburan; kegiatan olahraga dan kebudayaan; penerbitan buku dan materi multimedia.'
  },
  {
    number: 42,
    type: 'Jasa',
    title: 'TI, Perangkat Lunak, Desain, dan Penelitian Ilmiah',
    description: 'Jasa ilmiah dan teknologi serta penelitian dan desain yang berkaitan; jasa analisis industri, penelitian industri dan desain industri; jasa kontrol kualitas dan autentikasi; desain dan pengembangan perangkat keras dan perangkat lunak komputer (SaaS, aplikasi web, pemrograman sistem).'
  },
  {
    number: 43,
    type: 'Jasa',
    title: 'Restoran, Kafe, Katering, dan Akomodasi Sementara',
    description: 'Jasa penyediaan makanan dan minuman; akomodasi sementara; kedai kopi, kafe, restoran, katering pesta, dan reservasi hotel.'
  },
  {
    number: 44,
    type: 'Jasa',
    title: 'Medis, Klinik Kecantikan, Veteriner, dan Salon',
    description: 'Jasa medis; jasa veteriner; perawatan higienis dan kecantikan untuk manusia atau hewan; klinik dermatologi, salon kecantikan, spa, jasa pertanian, akuakultur, hortikultura dan kehutanan.'
  },
  {
    number: 45,
    type: 'Jasa',
    title: 'Jasa Hukum, Keamanan, dan Layanan Personal/Sosial',
    description: 'Jasa hukum; jasa keamanan untuk perlindungan fisik harta benda dan individu; jasa detektif; jasa jejaring sosial dan kencan pribadi; jasa penyewaan pakaian.'
  }
];
