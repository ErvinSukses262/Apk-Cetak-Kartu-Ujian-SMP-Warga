import React from 'react';
import { X, CheckCircle, ExternalLink } from 'lucide-react';
import { Student, ExamScheduleItem, CardConfig } from '../types';
import { ExamCard } from './ExamCard';

interface OriginalSampleModalProps {
  isOpen: boolean;
  onClose: () => void;
  sampleStudent: Student;
  schedule: ExamScheduleItem[];
  config: CardConfig;
}

export const OriginalSampleModal: React.FC<OriginalSampleModalProps> = ({
  isOpen,
  onClose,
  sampleStudent,
  schedule,
  config,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white">
          <div>
            <h3 className="font-bold text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              Perbandingan: Foto Asli Contoh vs Hasil Kartu Aplikasi
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              SMP Warga Surakarta • Asesmen Sumatif Tengah Semester Gasal
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Original Screenshot */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  Foto Kartu Contoh Asli (Lampiran Anda)
                </span>
                <span className="text-[11px] text-slate-400">SMP Warga</span>
              </div>
              <div className="bg-black/40 p-2 rounded-xl border border-slate-800 flex items-center justify-center min-h-[380px]">
                <img
                  src="/assets/aistudio/Screen_Shot_2026-10-27_at_19.47.38_74f9c8ed.png"
                  alt="Contoh Asli Kartu Ujian SMP Warga Surakarta"
                  className="w-full h-auto object-contain rounded border border-slate-700 shadow-md"
                />
              </div>
            </div>

            {/* Right: Generated Card in App */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Hasil Cetak Digital Aplikasi
                </span>
                <span className="text-[11px] text-emerald-400/80 font-mono">
                  Presisi Vector & Siap Cetak
                </span>
              </div>
              <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700 flex items-center justify-center min-h-[380px] overflow-x-auto">
                <div className="w-full scale-[0.92] origin-top">
                  <ExamCard
                    student={sampleStudent}
                    schedule={schedule}
                    config={config}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
            <h4 className="font-bold text-white mb-1.5">Kelengkapan Fitur Sesuai Kartu Asli:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Kop Yayasan & SMP Warga</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Format Border Dobel</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Identitas & Foto Siswa</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Tabel Jadwal 11 Mapel</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Kolom TT Pengawas</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Stempel & TTD Budi Prabowo</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Peringatan Wajib Bawa Kartu</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Cetak Massal A4 Hemat Kertas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Tutup Pratinjau
          </button>
        </div>
      </div>
    </div>
  );
};
