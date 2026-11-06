export interface Student {
  id: string;
  nomorTes: string;
  nama: string;
  kelas: string;
  presensi: string;
  ruang: string;
  fotoUrl?: string;
  nisn?: string;
}

export interface ExamScheduleItem {
  id: string;
  hariTanggal: string;
  waktu: string;
  mataPelajaran: string;
  tingkatKelas: string; // 'Semua' | '7' | '8' | '9'
}

export interface CardConfig {
  yayasan: string;
  namaSekolah: string;
  judulUjian: string;
  tahunAjaran: string;
  judulTabelJadwal: string;
  titimangsa: string;
  namaKepsek: string;
  nipKepsek?: string;
  perhatianText: string;
  tampilkanFoto: boolean;
  tampilkanPresensi: boolean;
  tampilkanStempel: boolean;
  tampilkanTTDPengawas: boolean;
  cardsPerPage: 2 | 4 | 1;
  printOrientation?: 'landscape' | 'portrait';
  logoYayasanUrl?: string;
  logoSekolahUrl?: string;
  stempelTtdUrl?: string;
  appLogoUrl?: string; // Customizable logo for the app navigation / header
  useCroppedOriginalAssets?: boolean;
}
