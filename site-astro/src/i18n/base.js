/* Indonesian baseline data and the language list. Other languages live in public/i18n/*.js. */
export const BASE = {
 gen:[
  {k:"riset",t:["Riset","Skripsi, proposal, artikel jurnal","references/genre-research.md",["Mind map: Das Sollen, Das Sein, dan kesenjangannya","Rumusan masalah dengan kata tanya yang tepat, diuji FINER","Outline 12 butir untuk proposal, atau struktur bab untuk skripsi utuh","Checklist mixed methods dan joint display","Judul dirumuskan paling akhir, tiga pilihan"]]},
  {k:"pasca",t:["Pascasarjana","Tesis S2 dan disertasi S3","references/genre-thesis.md",["Tangga kontribusi: menerapkan, menguji, atau membaru","Research gap bersandar pada protokol pencarian, bukan klaim kosong","Empat bentuk kebaruan yang sah dan cara membuktikannya","Definisi operasional variabel dan perhitungan besar sampel","Pola monograf maupun berbasis artikel, plus bab diskusi umum"]]},
  {k:"laporan",t:["Laporan","KKP, magang, bisnis, policy brief, SOP","references/genre-report.md",["Ringkasan SCQA di halaman pertama","Temuan urut dari yang paling berpengaruh","Tabel target vs realisasi, rencana vs realisasi anggaran","Rekomendasi menyebut pelaku dan tenggat","Lampiran wajib dirangka sejak awal, lengkap dengan kapan diambil"]]},
  {k:"organisasi",t:["Organisasi","Proposal kegiatan, LPJ, SK, AD/ART, surat","references/genre-organizational.md",["RAB dengan satuan × jumlah × harga, pemasukan seimbang dengan pengeluaran","LPJ disandingkan baris per baris dengan proposalnya","SK: Menimbang berisi alasan, Mengingat berisi dasar hukum","Diktum KESATU sampai KEEMPAT, lengkap dengan klausul ralat","AD/ART: kuorum, sanksi, dan mekanisme perubahan tidak boleh kosong"]]},
  {k:"persuasi",t:["Persuasi","Landing page, brosur, pamflet, iklan, pitch deck","references/genre-persuasion.md",["Kunci satu pembaca, satu tindakan, satu janji","Pilih AIDA, PAS, atau Before–After–Bridge","Bukti nyata atau ditandai, tanpa testimoni karangan","CTA sama di awal dan di akhir","Enam panel untuk brosur lipat tiga"]]},
  {k:"teknis",t:["Teknis","README, spec, ADR, tutorial, referensi API","references/genre-technical.md",["Tentukan jenis Diátaxis dulu, jangan dicampur","Quick start dengan perintah yang benar-benar dijalankan","Non-tujuan dan metrik keberhasilan di spec","ADR: konteks, keputusan, konsekuensi","Tanpa kunci atau rahasia di contoh"]]},
  {k:"video",t:["Video & belajar","Video, podcast, sidang, mind map materi","references/genre-timed.md",["Satu kalimat: setelah menonton, pemirsa bisa …","Hook di tiga detik pertama, bukan perkenalan","Kolom visual, suara, dan teks layar","Struktur baku sidang skripsi","Mind map Mermaid tiga sampai tujuh cabang untuk belajar"]]}
 ],
 chk:[
  ["U1","Pembaca spesifik","Bisa disebut dengan satu frasa yang bukan “semua orang”"],
  ["U2","Gap nyata","Should dan Is berbeda, dan Is punya dasar atau ditandai [ISI]"],
  ["U3","Klaim inti satu kalimat","Orang di luar bidang paham kalimatnya"],
  ["U4","Tidak ada yatim","Tiap pertanyaan atau janji punya bagian yang menjawab dan bukti"],
  ["U5","Tidak ada bagian tanpa tugas","Tiap bagian punya baris Tugas yang melayani U3 atau U4"],
  ["U6","Urutan sesuai kebutuhan pembaca","Baca judul bagian saja: alurnya masuk akal tanpa isi"],
  ["U7","Tidak tumpang tindih","Dua bagian tidak menjawab hal yang sama (MECE)"],
  ["U8","Tindakan akhir jelas","Pembaca tahu apa yang harus dilakukan atau disimpulkan"],
  ["U9","Nol fakta karangan","Tiap angka, nama, kutipan berasal darimu, dari sources.md, atau ditandai"],
  ["U10","Aturan eksternal ditandai","Pedoman kampus, format klien, regulasi → [CEK]"],
  ["U11","Panjang realistis","Jumlah petunjuk panjang tiap bagian sesuai batas total"],
  ["U12","Judul dari klaim inti","Ditulis terakhir, tidak menjanjikan lebih dari isi"]
 ],
 ins:[
  ["Claude Code","Salin foldernya ke direktori skill, lalu panggil dengan /rangka atau sebut saja “susun kerangka”.","git clone https://github.com/bryankwandou/rangka ~/.claude/skills/rangka"],
  ["Claude.ai","Unduh arsipnya, lalu unggah lewat Settings → Capabilities → Skills.","https://github.com/bryankwandou/rangka/archive/refs/heads/main.zip"],
  ["ChatGPT, Gemini, lainnya","Tempel isi SKILL.md sebagai instruksi sistem, lalu satu file genre yang sesuai dan checklist.md. Tiga file sudah cukup.","SKILL.md  +  references/genre-*.md  +  references/checklist.md"]
 ],
 skel:{
  riset:{sec:["Latar belakang","Rumusan masalah","Tujuan penelitian","Manfaat","Tinjauan pustaka","Kerangka pikir","Metode","Instrumen","Rencana analisis"],
    fill:["data yang menunjukkan kondisi nyata","jumlah dan cara pengambilan sampel","nama instrumen dan sumbernya"],
    ver:["pedoman penulisan kampus","sumber asli teori yang dipakai"],
    claim:"Kondisi di lapangan berbeda dari yang seharusnya, dan selisih itu belum pernah diukur."},
  pasca:{sec:["Pendahuluan dan posisi penelitian","Pernyataan kebaruan","Tinjauan sistematis","Research gap","Kerangka teoretik","Metode dan etika penelitian","Hasil","Pembahasan dan implikasi","Simpulan dan keterbatasan"],
    fill:["protokol pencarian literatur: basis data, kata kunci, rentang tahun","perhitungan besar sampel","status ethical clearance"],
    ver:["syarat publikasi jenjang ini","urutan ujian di kampus ini"],
    claim:"Ada yang belum diketahui bidang ini, dan penelitian ini yang menutupnya."},
  laporan:{sec:["Ringkasan SCQA","Latar dan lingkup","Temuan 1 (paling berpengaruh)","Temuan 2","Temuan 3","Rekomendasi","Lampiran data"],
    fill:["angka periode berjalan","target yang disepakati di awal"],ver:["format laporan yang diminta penerima"],
    claim:"Ada satu keputusan yang harus diambil pembaca, dan datanya sudah cukup untuk itu."},
  organisasi:{sec:["Latar belakang","Dasar pemikiran","Nama dan bentuk kegiatan","Tujuan dan sasaran","Waktu dan tempat","Susunan panitia","Susunan acara","Rencana anggaran biaya","Penutup dan pengesahan"],
    fill:["harga penawaran tiap pos anggaran","jumlah dan kriteria peserta","nama serta jabatan penanda tangan"],
    ver:["format proposal yang diminta lembaga","ambang selisih anggaran yang wajib dijelaskan"],
    claim:"Kegiatan ini perlu, layak dijalankan, dan biayanya terjangkau."},
  persuasi:{sec:["Hook","Masalah yang dirasakan","Janji tunggal","Bukti","Penawaran","Keberatan yang dijawab","CTA"],
    fill:["harga dan apa yang termasuk","bukti nyata: angka, testimoni asli, atau portofolio"],ver:["klaim yang diatur regulasi"],
    claim:"Satu pembaca, satu tindakan, satu janji."},
  teknis:{sec:["Apa ini dan untuk siapa","Quick start","Konfigurasi","Cara pakai per tugas","Referensi","Batasan dan non-tujuan"],
    fill:["versi minimum yang benar-benar diuji"],ver:["perintah quick start dijalankan di mesin bersih"],
    claim:"Pembaca bisa menjalankannya sampai berhasil tanpa bertanya."},
  video:{sec:["Hook 0–3 detik","Konteks","Isi 1","Isi 2","Isi 3","Bayaran","CTA"],
    fill:["durasi target dalam detik","footage atau visual yang tersedia"],ver:["klaim yang disebut di narasi"],
    claim:"Setelah menonton, pemirsa bisa melakukan satu hal yang tadinya tidak bisa."}
 },
 ui:{
  b_map:"1 · PETA INTI",b_out:"2 · KERANGKA",b_chk:"3 · CEK",b_title:"4 · PILIHAN JUDUL",b_need:"YANG HARUS KAMU LENGKAPI",
  b_reader:"Pembaca",b_should:"Seharusnya",b_is:"Kenyataan",b_gap:"Kesenjangan",b_claim:"Klaim inti",
  b_job:"Tugas",b_content:"Isi",b_ev:"Bukti",b_len:"Panjang",
  b_prov:"sementara, menunggu data",b_mode_note:"Mode cepat: U1, U2, U4, U8, U9 + semua butir genre.",
  b_ideal:"kondisi ideal untuk",b_obs:"data atau observasi yang kamu punya",b_diff:"selisih antara dua baris di atas",
  b_proves:"apa yang dibuktikan bagian ini",b_points:"poin utama",b_srcdata:"sumber atau data",b_est:"perkiraan",
  b_wait:"Menunggu data",b_allgenre:"semua butir cek genre",b_titleline:"judul diturunkan setelah klaim inti punya bukti",
  b_topic:"topik",b_readerph:"pembaca",
  ex_topic:"penggunaan QRIS di pasar tradisional Yogyakarta",ex_reader:"dosen pembimbing",
  fill:"ISI",verify:"CEK",quick:"Cepat",full:"Lengkap",copy:"Salin",copied:"Tersalin",
  theme_light:"Tema: terang",theme_dark:"Tema: gelap",theme_sys:"Tema: ikut sistem"
 }
};

export const LANGS=[
 {c:"id",n:"Bahasa Indonesia",dir:"ltr"},
 {c:"en",n:"English",dir:"ltr"},
 {c:"es",n:"Español",dir:"ltr"},
 {c:"fr",n:"Français",dir:"ltr"},
 {c:"zh",n:"中文",dir:"ltr"},
 {c:"ar",n:"العربية",dir:"rtl"}
];
