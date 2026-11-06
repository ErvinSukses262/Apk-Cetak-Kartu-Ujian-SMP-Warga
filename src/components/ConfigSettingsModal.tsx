import React, { useRef } from 'react';
import { CardConfig } from '../types';
import {
  Settings,
  X,
  RotateCcw,
  Upload,
  CheckSquare,
  Square,
  FileText,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { INITIAL_CONFIG } from '../constants/initialData';

interface ConfigSettingsModalProps {
  config: CardConfig;
  isOpen: boolean;
  onClose: () => void;
  onUpdateConfig: (config: CardConfig) => void;
}

export const ConfigSettingsModal: React.FC<ConfigSettingsModalProps> = ({
  config,
  isOpen,
  onClose,
  onUpdateConfig,
}) => {
  const logoYayasanRef = useRef<HTMLInputElement>(null);
  const logoSekolahRef = useRef<HTMLInputElement>(null);
  const stempelRef = useRef<HTMLInputElement>(null);
  const appLogoRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'logoYayasanUrl' | 'logoSekolahUrl' | 'stempelTtdUrl' | 'appLogoUrl'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onUpdateConfig({
          ...config,
          [field]: event.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-red-500" />
            <div>
              <h3 className="font-bold text-sm">Pengaturan Template Kartu Ujian</h3>
              <p className="text-[11px] text-slate-400">
                Ubah identitas kop sekolah, judul asesmen, tanda tangan kepala sekolah, dan format cetak
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* Section 1: Kop & Identitas Ujian */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3 pb-1 border-b border-slate-200 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-red-600" />
              Identitas Kop & Judul Ujian
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Nama Yayasan</label>
                <input
                  type="text"
                  value={config.yayasan}
                  onChange={(e) => onUpdateConfig({ ...config, yayasan: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Nama Sekolah</label>
                <input
                  type="text"
                  value={config.namaSekolah}
                  onChange={(e) => onUpdateConfig({ ...config, namaSekolah: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Judul Ujian (Baris 1 Kop)</label>
                <input
                  type="text"
                  value={config.judulUjian}
                  onChange={(e) => onUpdateConfig({ ...config, judulUjian: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 font-semibold uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Tahun Ajaran</label>
                <input
                  type="text"
                  value={config.tahunAjaran}
                  onChange={(e) => onUpdateConfig({ ...config, tahunAjaran: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 font-bold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold mb-1">Judul Tabel Jadwal Ujian</label>
                <input
                  type="text"
                  value={config.judulTabelJadwal}
                  onChange={(e) => onUpdateConfig({ ...config, judulTabelJadwal: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 font-bold uppercase"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Titimangsa, Kepala Sekolah & Teks Perhatian */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3 pb-1 border-b border-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-red-600" />
              Titimangsa, Kepala Sekolah & Catatan Perhatian
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Kota & Tanggal (Titimangsa)</label>
                <input
                  type="text"
                  value={config.titimangsa}
                  onChange={(e) => onUpdateConfig({ ...config, titimangsa: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Nama Kepala Sekolah</label>
                <input
                  type="text"
                  value={config.namaKepsek}
                  onChange={(e) => onUpdateConfig({ ...config, namaKepsek: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 font-bold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold mb-1">Teks PERHATIAN di Bawah Kartu</label>
                <textarea
                  rows={2}
                  value={config.perhatianText}
                  onChange={(e) => onUpdateConfig({ ...config, perhatianText: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Format Layout & Elemen Tampilan */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3 pb-1 border-b border-slate-200 flex items-center gap-1.5">
              <Printer className="w-4 h-4 text-red-600" />
              Opsi Tampilan & Format Cetak Massal A4
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateConfig({ ...config, tampilkanFoto: !config.tampilkanFoto })
                  }
                  className="flex items-center gap-2 font-medium hover:text-black transition-colors"
                >
                  {config.tampilkanFoto ? (
                    <CheckSquare className="w-4 h-4 text-red-600" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                  Tampilkan Kotak Foto Siswa (3x4)
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onUpdateConfig({
                      ...config,
                      tampilkanPresensi: !config.tampilkanPresensi,
                    })
                  }
                  className="flex items-center gap-2 font-medium hover:text-black transition-colors"
                >
                  {config.tampilkanPresensi ? (
                    <CheckSquare className="w-4 h-4 text-red-600" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                  Tampilkan Baris No. Presensi
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onUpdateConfig({
                      ...config,
                      tampilkanStempel: !config.tampilkanStempel,
                    })
                  }
                  className="flex items-center gap-2 font-medium hover:text-black transition-colors"
                >
                  {config.tampilkanStempel ? (
                    <CheckSquare className="w-4 h-4 text-red-600" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                  Tampilkan Stempel & Tanda Tangan Resmi
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onUpdateConfig({
                      ...config,
                      tampilkanTTDPengawas: !config.tampilkanTTDPengawas,
                    })
                  }
                  className="flex items-center gap-2 font-medium hover:text-black transition-colors"
                >
                  {config.tampilkanTTDPengawas ? (
                    <CheckSquare className="w-4 h-4 text-red-600" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                  Tampilkan Kolom TT Pengawas di Tabel
                </button>
              </div>

              <div>
                <label className="block font-semibold mb-1.5">
                  Jumlah Kartu per Lembar Kertas A4:
                </label>
                <div className="space-y-2">
                  <label
                    className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      config.cardsPerPage === 2
                        ? 'border-red-500 bg-red-50/40 text-red-950 font-bold'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cardsPerPage"
                      checked={config.cardsPerPage === 2}
                      onChange={() => onUpdateConfig({ ...config, cardsPerPage: 2 })}
                      className="text-red-600"
                    />
                    <div>
                      <div>2 Kartu per Lembar (Standar SMP Warga / Setengah A4)</div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        Paling direkomendasikan & tulisan sangat jelas terbaca
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      config.cardsPerPage === 4
                        ? 'border-red-500 bg-red-50/40 text-red-950 font-bold'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cardsPerPage"
                      checked={config.cardsPerPage === 4}
                      onChange={() => onUpdateConfig({ ...config, cardsPerPage: 4 })}
                      className="text-red-600"
                    />
                    <div>
                      <div>4 Kartu per Lembar (Hemat Kertas)</div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        Ukuran kartu lebih saku (seperempat A4)
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Kustomisasi Gambar Logo & Stempel */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3 pb-1 border-b border-slate-200 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-red-600" />
              Unggah Logo Kustom (Opsional)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* Logo Yayasan */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center text-center">
                <span className="font-bold mb-1">Logo Kiri (Yayasan)</span>
                <input
                  type="file"
                  ref={logoYayasanRef}
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'logoYayasanUrl')}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => logoYayasanRef.current?.click()}
                  className="px-2.5 py-1 text-[11px] bg-white border border-slate-300 rounded font-semibold text-slate-700 hover:bg-slate-100 mt-2"
                >
                  {config.logoYayasanUrl ? 'Ganti File' : 'Unggah File'}
                </button>
                {config.logoYayasanUrl && (
                  <button
                    type="button"
                    onClick={() => onUpdateConfig({ ...config, logoYayasanUrl: undefined })}
                    className="text-[10px] text-red-600 underline mt-1"
                  >
                    Reset ke Standar
                  </button>
                )}
              </div>

              {/* Logo Sekolah */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center text-center">
                <span className="font-bold mb-1">Logo Kanan (SMP Warga)</span>
                <input
                  type="file"
                  ref={logoSekolahRef}
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'logoSekolahUrl')}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => logoSekolahRef.current?.click()}
                  className="px-2.5 py-1 text-[11px] bg-white border border-slate-300 rounded font-semibold text-slate-700 hover:bg-slate-100 mt-2"
                >
                  {config.logoSekolahUrl ? 'Ganti File' : 'Unggah File'}
                </button>
                {config.logoSekolahUrl && (
                  <button
                    type="button"
                    onClick={() => onUpdateConfig({ ...config, logoSekolahUrl: undefined })}
                    className="text-[10px] text-red-600 underline mt-1"
                  >
                    Reset ke Standar
                  </button>
                )}
              </div>

              {/* Stempel & TTD */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center text-center">
                <span className="font-bold mb-1">Stempel & TTD Basah</span>
                <input
                  type="file"
                  ref={stempelRef}
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'stempelTtdUrl')}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => stempelRef.current?.click()}
                  className="px-2.5 py-1 text-[11px] bg-white border border-slate-300 rounded font-semibold text-slate-700 hover:bg-slate-100 mt-2"
                >
                  {config.stempelTtdUrl ? 'Ganti File' : 'Unggah File'}
                </button>
                {config.stempelTtdUrl && (
                  <button
                    type="button"
                    onClick={() => onUpdateConfig({ ...config, stempelTtdUrl: undefined })}
                    className="text-[10px] text-red-600 underline mt-1"
                  >
                    Reset ke Standar
                  </button>
                )}
              </div>

              {/* Logo Utama Aplikasi (Navbar & Login) */}
              <div className="p-3 bg-slate-50 border-2 border-red-200 rounded-lg flex flex-col items-center text-center">
                <span className="font-bold mb-1 text-slate-900">Logo Aplikasi (Navbar/Login)</span>
                <div className="w-10 h-10 my-1 flex items-center justify-center">
                  {config.appLogoUrl ? (
                    <img
                      src={config.appLogoUrl}
                      alt="Logo Aplikasi"
                      className="w-10 h-10 object-contain rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-red-600 text-white flex items-center justify-center font-black text-xs">
                      SMPW
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={appLogoRef}
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'appLogoUrl')}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => appLogoRef.current?.click()}
                  className="px-2.5 py-1 text-[11px] bg-red-600 border border-red-700 rounded font-bold text-white hover:bg-red-700 mt-1"
                >
                  {config.appLogoUrl ? 'Ganti Logo' : 'Unggah Logo'}
                </button>
                {config.appLogoUrl && (
                  <button
                    type="button"
                    onClick={() => onUpdateConfig({ ...config, appLogoUrl: undefined })}
                    className="text-[10px] text-red-600 underline mt-1"
                  >
                    Reset ke Standar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (confirm('Kembalikan semua pengaturan kartu ke default SMP Warga?')) {
                onUpdateConfig(INITIAL_CONFIG);
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-red-600 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset ke Pengaturan Awal
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors"
          >
            Selesai & Simpan
          </button>
        </div>
      </div>
    </div>
  );
};
