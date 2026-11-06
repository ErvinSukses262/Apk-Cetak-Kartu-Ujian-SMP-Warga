/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Student, ExamScheduleItem, CardConfig } from './types';
import {
  INITIAL_STUDENTS,
  INITIAL_SCHEDULE,
  INITIAL_CONFIG,
} from './constants/initialData';
import { StudentManager } from './components/StudentManager';
import { ScheduleManager } from './components/ScheduleManager';
import { ExamCard } from './components/ExamCard';
import { BulkPrintView } from './components/BulkPrintView';
import { ConfigSettingsModal } from './components/ConfigSettingsModal';
import { OriginalSampleModal } from './components/OriginalSampleModal';
import { LoginPage } from './components/LoginPage';
import { downloadElementAsPng } from './utils/exportImage';
import {
  Users,
  Calendar,
  CreditCard,
  Printer,
  Settings,
  Eye,
  ChevronLeft,
  ChevronRight,
  School,
  Download,
  CheckCircle,
  HelpCircle,
  LogOut,
  Camera,
} from 'lucide-react';

export default function App() {
  // Authentication State (Single Access Portal)
  // ID = Ervin Sukses, Password = SmpWarga2026
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return (
      localStorage.getItem('smp_warga_auth_token') === 'true' ||
      sessionStorage.getItem('smp_warga_auth_token') === 'true'
    );
  });

  // State with LocalStorage persistence
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('smp_warga_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [schedule, setSchedule] = useState<ExamScheduleItem[]>(() => {
    const saved = localStorage.getItem('smp_warga_schedule');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
  });

  const [config, setConfig] = useState<CardConfig>(() => {
    const saved = localStorage.getItem('smp_warga_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.appLogoUrl || parsed.appLogoUrl === '') {
          parsed.appLogoUrl = '/assets/aistudio/Logo_SMP_Warga_HD_Fixed_9bfc1cdc.png';
        }
        if (!parsed.logoSekolahUrl || parsed.logoSekolahUrl === '') {
          parsed.logoSekolahUrl = '/assets/aistudio/Logo_SMP_Warga_HD_Fixed_9bfc1cdc.png';
        }
        return parsed;
      } catch (e) {
        return INITIAL_CONFIG;
      }
    }
    return INITIAL_CONFIG;
  });

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<'students' | 'schedule' | 'preview'>('students');
  const [isBulkPrintOpen, setIsBulkPrintOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isOriginalSampleOpen, setIsOriginalSampleOpen] = useState(false);
  const [previewStudentIndex, setPreviewStudentIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDownloadingSinglePng, setIsDownloadingSinglePng] = useState(false);

  const navbarLogoInputRef = useRef<HTMLInputElement>(null);
  const singleCardRef = useRef<HTMLDivElement>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('smp_warga_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('smp_warga_schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('smp_warga_config', JSON.stringify(config));
  }, [config]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handle direct logo change from navbar
  const handleNavbarLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setConfig((prev) => ({
          ...prev,
          appLogoUrl: event.target?.result as string,
        }));
        showToast('Logo aplikasi berhasil diperbarui!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Student handlers
  const handleAddStudent = (newStudentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...newStudentData,
      id: `std-${Date.now()}`,
    };
    setStudents((prev) => [...prev, newStudent]);
    showToast(`Murid "${newStudent.nama}" berhasil ditambahkan.`);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    showToast(`Data "${updatedStudent.nama}" berhasil diperbarui.`);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    showToast('Murid berhasil dihapus.');
  };

  const handleDownloadSingleCardPng = async () => {
    const student = students[previewStudentIndex];
    if (!singleCardRef.current || !student) return;

    try {
      setIsDownloadingSinglePng(true);
      showToast('Sedang memproses gambar PNG kartu...');
      const cleanName = student.nama.replace(/[^a-zA-Z0-9]/g, '_');
      await downloadElementAsPng(
        singleCardRef.current,
        `Kartu-Ujian-${student.nomorTes}-${cleanName}`,
        3.0
      );
      showToast(`Kartu ujian ${student.nama} berhasil diunduh (PNG)!`);
    } catch (err) {
      console.error(err);
      showToast('Gagal mengunduh gambar kartu.');
    } finally {
      setIsDownloadingSinglePng(false);
    }
  };

  const handleBulkImport = (newStudents: Omit<Student, 'id'>[]) => {
    const withIds = newStudents.map((s, index) => ({
      ...s,
      id: `std-${Date.now()}-${index}`,
    }));
    setStudents((prev) => [...prev, ...withIds]);
    showToast(`Berhasil menambahkan ${withIds.length} murid secara massal.`);
  };

  const handleBatchUpdatePhotos = (photosMap: { [studentId: string]: string }) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (photosMap[s.id]) {
          return { ...s, fotoUrl: photosMap[s.id] };
        }
        return s;
      })
    );
    showToast(`Berhasil memperbarui foto untuk ${Object.keys(photosMap).length} murid.`);
  };

  const handleResetDefaultStudents = () => {
    setStudents(INITIAL_STUDENTS);
    showToast('Data contoh murid SMP Warga dipulihkan.');
  };

  const handleSelectStudentForPrint = (student: Student) => {
    const idx = students.findIndex((s) => s.id === student.id);
    if (idx !== -1) {
      setPreviewStudentIndex(idx);
      setActiveTab('preview');
    }
  };

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar dari aplikasi?')) {
      localStorage.removeItem('smp_warga_auth_token');
      sessionStorage.removeItem('smp_warga_auth_token');
      setIsAuthenticated(false);
    }
  };

  // If not logged in, show single access login portal
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} config={config} />;
  }

  const currentPreviewStudent = students[previewStudentIndex] || students[0] || INITIAL_STUDENTS[0];

  // If Bulk Print mode is triggered
  if (isBulkPrintOpen) {
    return (
      <BulkPrintView
        students={students}
        schedule={schedule}
        config={config}
        onBackToAdmin={() => setIsBulkPrintOpen(false)}
        onOpenOriginalRef={() => setIsOriginalSampleOpen(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      {/* Hidden input to change app logo directly */}
      <input
        type="file"
        ref={navbarLogoInputRef}
        accept="image/*"
        onChange={handleNavbarLogoChange}
        className="hidden"
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold border border-slate-700 animate-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Logo & School Title */}
          <div className="flex items-center gap-3">
            {/* Clickable App Logo to change manually directly */}
            <button
              type="button"
              onClick={() => navbarLogoInputRef.current?.click()}
              className="relative group cursor-pointer flex-shrink-0"
              title="Klik untuk ganti logo aplikasi secara langsung"
            >
              <img
                src={config.appLogoUrl || '/assets/aistudio/Logo_SMP_Warga_HD_Fixed_9bfc1cdc.png'}
                alt="Logo Aplikasi"
                className="w-10 h-10 object-contain rounded-lg p-0.5 border border-slate-200 bg-white shadow-2xs group-hover:ring-2 group-hover:ring-red-400 transition-all"
              />
              <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-4 h-4" />
              </div>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-slate-900 text-base tracking-tight leading-tight">
                  Aplikasi Kartu Ujian Semester
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200 uppercase">
                  SMP WARGA SURAKARTA
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {config.judulUjian} • {config.tahunAjaran}
              </p>
            </div>
          </div>

          {/* Action Header Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOriginalSampleOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors"
              title="Lihat foto kartu contoh asli yang dilampirkan"
            >
              <Eye className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Contoh Asli</span>
            </button>

            <button
              onClick={() => setIsConfigOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors shadow-2xs"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>Pengaturan Kop</span>
            </button>

            <button
              onClick={() => setIsBulkPrintOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all shadow-md shadow-red-600/20 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Massal PDF</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-red-700 hover:bg-red-50 border border-slate-300 rounded-lg transition-colors"
              title="Keluar dari Portal Aplikasi"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('students')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'students'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Peserta Murid ({students.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'schedule'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Jadwal Asesmen ({schedule.length} Mapel)</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'preview'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Pratinjau Kartu Ujian</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6">
        {activeTab === 'students' && (
          <StudentManager
            students={students}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
            onBulkImport={handleBulkImport}
            onBatchUpdatePhotos={handleBatchUpdatePhotos}
            onResetDefault={handleResetDefaultStudents}
            onSelectForPrint={handleSelectStudentForPrint}
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleManager
            schedule={schedule}
            onUpdateSchedule={(newSched) => {
              setSchedule(newSched);
              showToast('Jadwal ujian berhasil diperbarui.');
            }}
          />
        )}

        {activeTab === 'preview' && (
          <div className="space-y-6">
            {/* Card Preview Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">Pilih Siswa:</span>
                <select
                  value={previewStudentIndex}
                  onChange={(e) => setPreviewStudentIndex(Number(e.target.value))}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 font-semibold"
                >
                  {students.map((st, idx) => (
                    <option key={st.id} value={idx}>
                      {st.nomorTes} - {st.nama} ({st.kelas})
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      setPreviewStudentIndex((p) => Math.max(0, p - 1))
                    }
                    disabled={previewStudentIndex === 0}
                    className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Siswa Sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setPreviewStudentIndex((p) =>
                        Math.min(students.length - 1, p + 1)
                      )
                    }
                    disabled={previewStudentIndex >= students.length - 1}
                    className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Siswa Berikutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadSingleCardPng}
                  disabled={!currentPreviewStudent || isDownloadingSinglePng}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors shadow-2xs disabled:opacity-40"
                  title="Unduh kartu siswa ini sebagai gambar PNG HD"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isDownloadingSinglePng ? 'Mengunduh...' : 'Unduh Kartu Ini (PNG)'}</span>
                </button>

                <button
                  onClick={() => setIsBulkPrintOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Cetak Massal Semua Siswa
                </button>
              </div>
            </div>

            {/* Live Card Renderer */}
            <div className="bg-slate-200/80 p-4 sm:p-8 rounded-2xl flex flex-col items-center justify-center border border-slate-300/60 shadow-inner">
              <div className="mb-3 text-xs font-semibold text-slate-600 flex items-center gap-2 bg-white/80 px-3 py-1 rounded-full border border-slate-300 shadow-2xs">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Pratinjau Kartu Ujian Resmi: Standar 6 Kartu per Lembar A4</span>
              </div>
              <div
                ref={singleCardRef}
                className="w-full max-w-[580px] bg-white rounded shadow-lg border border-slate-300 p-2 transform transition-all"
              >
                <ExamCard
                  student={currentPreviewStudent}
                  schedule={schedule}
                  config={config}
                />
              </div>
            </div>

            {/* Quick Helper Banner */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-600 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-50 text-red-600">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">
                    Format Sesuai Kartu Resmi SMP Warga Surakarta
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Bordir ganda, nomor tes, kelas, ruang, foto 3x4, stempel biru resmi & tanda tangan Kepala Sekolah Budi Prabowo, S.T., S.Kom.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOriginalSampleOpen(true)}
                className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline flex-shrink-0"
              >
                Bandingkan dengan Lampiran &rarr;
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footnote as requested by user */}
      <footer className="no-print bg-white border-t border-slate-200 py-3.5 px-6 text-center text-xs text-slate-600">
        <p className="font-semibold text-slate-800">
          @ 2026 Guru Informatika - Ervin Yoga Pratama, S.Kom, M.M
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Aplikasi Kartu Ujian Semester SMP Warga Surakarta • Asesmen Sumatif Tengah Semester (ASTS) & Akhir Semester (ASAS)
        </p>
      </footer>

      {/* Modals */}
      <ConfigSettingsModal
        config={config}
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onUpdateConfig={(newConf) => {
          setConfig(newConf);
          showToast('Pengaturan kartu disimpan.');
        }}
      />

      <OriginalSampleModal
        isOpen={isOriginalSampleOpen}
        onClose={() => setIsOriginalSampleOpen(false)}
        sampleStudent={currentPreviewStudent}
        schedule={schedule}
        config={config}
      />
    </div>
  );
}
