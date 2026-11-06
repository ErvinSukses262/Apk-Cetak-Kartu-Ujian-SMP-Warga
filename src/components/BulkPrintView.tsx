import React, { useState, useRef } from 'react';
import { Student, ExamScheduleItem, CardConfig } from '../types';
import { ExamCard } from './ExamCard';
import { downloadElementAsPng } from '../utils/exportImage';
import { downloadElementAsPdf } from '../utils/exportPdf';
import {
  Printer,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckSquare,
  Square,
  FileCheck,
  Scissors,
  Eye,
  ArrowLeft,
  Sparkles,
  LayoutGrid,
  Download,
  Image,
  FileText,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

export type LayoutMode =
  | '6-landscape'
  | '6-portrait'
  | '4-landscape'
  | '2-portrait'
  | '3-portrait'
  | '1-card';

interface LayoutDetail {
  id: LayoutMode;
  label: string;
  badge: string;
  cardsPerPage: number;
  orientation: 'landscape' | 'portrait';
  pageClass: string;
  gridClass: string;
  aspectClass: string;
  pageSizeMm: string;
  marginMm: string;
}

const LAYOUT_DETAILS: Record<LayoutMode, LayoutDetail> = {
  '6-landscape': {
    id: '6-landscape',
    label: '6 Kartu (A4 Landscape)',
    badge: 'Pilihan Utama (3x2)',
    cardsPerPage: 6,
    orientation: 'landscape',
    pageClass: 'print-page-6-landscape',
    gridClass: 'grid grid-cols-3 grid-rows-2 gap-2 h-full w-full',
    aspectClass: 'max-w-[940px] aspect-[297/210]',
    pageSizeMm: 'A4 landscape',
    marginMm: '0mm',
  },
  '6-portrait': {
    id: '6-portrait',
    label: '6 Kartu (A4 Portrait)',
    badge: 'Kartu Landscape (2x3)',
    cardsPerPage: 6,
    orientation: 'portrait',
    pageClass: 'print-page-6-portrait',
    gridClass: 'grid grid-cols-2 grid-rows-3 gap-2 h-full w-full',
    aspectClass: 'max-w-[660px] aspect-[210/297]',
    pageSizeMm: 'A4 portrait',
    marginMm: '0mm',
  },
  '4-landscape': {
    id: '4-landscape',
    label: '4 Kartu (A4 Landscape)',
    badge: 'Ukuran Sedang (2x2)',
    cardsPerPage: 4,
    orientation: 'landscape',
    pageClass: 'print-page-4-landscape',
    gridClass: 'grid grid-cols-2 grid-rows-2 gap-3 h-full w-full',
    aspectClass: 'max-w-[890px] aspect-[297/210]',
    pageSizeMm: 'A4 landscape',
    marginMm: '0mm',
  },
  '2-portrait': {
    id: '2-portrait',
    label: '2 Kartu (A4 Portrait)',
    badge: 'Tegak Simetris',
    cardsPerPage: 2,
    orientation: 'portrait',
    pageClass: 'print-page-2-portrait',
    gridClass: 'flex flex-col justify-between gap-4 h-full w-full',
    aspectClass: 'max-w-[620px] aspect-[210/297]',
    pageSizeMm: 'A4 portrait',
    marginMm: '0mm',
  },
  '3-portrait': {
    id: '3-portrait',
    label: '3 Kartu (A4 Portrait)',
    badge: '3 Kartu per Lembar',
    cardsPerPage: 3,
    orientation: 'portrait',
    pageClass: 'print-page-3-portrait',
    gridClass: 'flex flex-col justify-between gap-2.5 h-full w-full',
    aspectClass: 'max-w-[620px] aspect-[210/297]',
    pageSizeMm: 'A4 portrait',
    marginMm: '0mm',
  },
  '1-card': {
    id: '1-card',
    label: '1 Kartu (A4 Jumbo)',
    badge: '1 Kartu Penuh',
    cardsPerPage: 1,
    orientation: 'landscape',
    pageClass: 'print-page-1-card',
    gridClass: 'flex items-center justify-center h-full w-full',
    aspectClass: 'max-w-[760px] aspect-[297/210]',
    pageSizeMm: 'A4 landscape',
    marginMm: '0mm',
  },
};

interface BulkPrintViewProps {
  students: Student[];
  schedule: ExamScheduleItem[];
  config: CardConfig;
  onBackToAdmin: () => void;
  onOpenOriginalRef?: () => void;
}

export const BulkPrintView: React.FC<BulkPrintViewProps> = ({
  students,
  schedule,
  config,
  onBackToAdmin,
  onOpenOriginalRef,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(
    students.map((s) => s.id)
  );
  const [previewPage, setPreviewPage] = useState<number>(1);
  const [showCuttingGuide, setShowCuttingGuide] = useState<boolean>(true);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('6-landscape');
  const [isExportingPng, setIsExportingPng] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const paperRef = useRef<HTMLDivElement>(null);
  const activeLayout = LAYOUT_DETAILS[layoutMode];

  // Filter students by class
  const filteredStudents = students.filter((s) => {
    const matchClass = selectedClass === 'all' || s.kelas === selectedClass;
    return matchClass;
  });

  // Filter selected students
  const studentsToPrint = filteredStudents.filter((s) =>
    selectedStudentIds.includes(s.id)
  );

  // Group into pages based on cardsPerPage
  const cardsPerPage = activeLayout.cardsPerPage;
  const isLandscape = activeLayout.orientation === 'landscape';

  const pages: Student[][] = [];
  for (let i = 0; i < studentsToPrint.length; i += cardsPerPage) {
    pages.push(studentsToPrint.slice(i, i + cardsPerPage));
  }

  const totalPages = pages.length;
  const currentPageStudents = pages[previewPage - 1] || [];

  const handleSelectAll = () => {
    setSelectedStudentIds(filteredStudents.map((s) => s.id));
  };

  const handleDeselectAll = () => {
    setSelectedStudentIds([]);
  };

  const toggleStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handlePrint = () => {
    // Simpan setting lama
    const prevTitle = document.title;
    document.title = `Kartu-Ujian-Lembar-${previewPage}`;
    const style = document.createElement('style');
    style.id = 'print-fix-mac';
    style.innerHTML = `
      @media print {
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        @page { size: A4 ${activeLayout.orientation}; margin: 0mm !important; }
        body { background: white !important; margin: 0 !important; }
        .print-only { display: block !important; }
        .no-print { display: none !important; }
      }
    `;
    document.head.appendChild(style);
    window.print();
    setTimeout(() => {
      document.title = prevTitle;
      const s = document.getElementById('print-fix-mac');
      if(s) s.remove();
    }, 1000);
  };

  // Download Current Sheet as direct A4 PDF document (100% exact match)
  const handleDownloadCurrentPagePdf = async () => {
    if (!paperRef.current) return;
    try {
      setIsExportingPdf(true);
      setExportMessage(`Membuat Dokumen PDF Lembar ${previewPage}...`);
      await downloadElementAsPdf(
        paperRef.current,
        `Kartu-Ujian-SMP-Warga-Lembar-${previewPage}-(${layoutMode})`,
        activeLayout.orientation
      );
      setExportMessage(`Berhasil membuat PDF Lembar ${previewPage}! (100% persis layar)`);
      setTimeout(() => setExportMessage(null), 3500);
    } catch (err: any) {
      console.error(err);
      setExportMessage('Gagal membuat dokumen PDF.');
      setTimeout(() => setExportMessage(null), 3000);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Download Current Sheet as high-resolution PNG
  const handleDownloadCurrentPagePng = async () => {
    if (!paperRef.current) return;
    try {
      setIsExportingPng(true);
      setExportMessage(`Memproses PNG Lembar ${previewPage}...`);
      await downloadElementAsPng(
        paperRef.current,
        `Kartu-Ujian-SMP-Warga-Halaman-${previewPage}-(${layoutMode})`,
        2.5
      );
      setExportMessage(`Berhasil mengunduh Lembar ${previewPage} sebagai PNG!`);
      setTimeout(() => setExportMessage(null), 3500);
    } catch (err: any) {
      console.error(err);
      setExportMessage('Gagal membuat gambar PNG.');
      setTimeout(() => setExportMessage(null), 3000);
    } finally {
      setIsExportingPng(false);
    }
  };

  // Download All Sheets sequentially
  const handleDownloadAllPagesPng = async () => {
    if (pages.length === 0) return;
    setIsExportingPng(true);

    try {
      for (let p = 1; p <= pages.length; p++) {
        setPreviewPage(p);
        setExportMessage(`Memproses PNG Lembar ${p} dari ${pages.length}...`);
        // Small delay for DOM to re-render the page
        await new Promise((resolve) => setTimeout(resolve, 450));
        if (paperRef.current) {
          await downloadElementAsPng(
            paperRef.current,
            `Kartu-Ujian-SMP-Warga-Halaman-${p}-dari-${pages.length}`,
            2.5
          );
        }
      }
      setExportMessage(`Selesai! Seluruh ${pages.length} lembar PNG berhasil diunduh.`);
      setTimeout(() => setExportMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      setExportMessage('Terjadi kendala saat mengunduh semua lembar.');
      setTimeout(() => setExportMessage(null), 3000);
    } finally {
      setIsExportingPng(false);
    }
  };

  const uniqueClasses = Array.from(new Set(students.map((s) => s.kelas))).sort();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Dynamic CSS for print orientation */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page {
                size: ${activeLayout.pageSizeMm} !important;
                margin: ${activeLayout.marginMm} !important;
              }
            }
          `,
        }}
      />

      {/* Top Bar (Hidden on print) */}
      <header className="no-print bg-slate-950 border-b border-slate-800 sticky top-0 z-40 px-4 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Kelola
            </button>
            <div>
              <h1 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Modul Cetak Massal & Ekspor Kartu</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600 text-white font-mono">
                  {studentsToPrint.length} Siswa Terpilih
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">
                Mode: <strong className="text-slate-200">{activeLayout.label}</strong> • {totalPages} Lembar A4
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenOriginalRef && (
              <button
                onClick={onOpenOriginalRef}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-700/60 rounded-lg transition-colors"
                title="Bandingkan dengan foto kartu contoh SMP Warga Surakarta"
              >
                <Eye className="w-3.5 h-3.5" />
                Contoh Asli
              </button>
            )}

            {/* Direct PDF Download Button (100% Identical to Screen) */}
            <button
              onClick={handleDownloadCurrentPagePdf}
              disabled={studentsToPrint.length === 0 || isExportingPdf || isExportingPng}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 border border-red-500 rounded-lg transition-colors shadow-lg shadow-red-900/40 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Unduh lembar ini langsung sebagai file PDF A4 (100% persis tampilan layar, bebas gangguan margin printer PC)"
            >
              {isExportingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileText className="w-3.5 h-3.5" />
              )}
              <span>Download PDF (100% Persis Layar)</span>
            </button>

            {/* PNG Download Button (HD 100% Identical to Screen) */}
            <button
              onClick={handleDownloadCurrentPagePng}
              disabled={studentsToPrint.length === 0 || isExportingPng || isExportingPdf}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900/90 border border-emerald-600/70 rounded-lg transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              title="Unduh halaman ini sebagai gambar PNG HD (100% persis seperti di layar, bebas margin printer)"
            >
              {isExportingPng ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>Unduh PNG Lembar Ini</span>
            </button>

            {/* Print / Save PDF via Browser Dialog Button */}
            <button
              onClick={handlePrint}
              disabled={studentsToPrint.length === 0 || isExportingPng || isExportingPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              title="Buka dialog cetak browser (Ctrl+P / Cmd+P)"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>Cetak Dialog Print</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mode Switcher Banner (1, 2, 3, 4, 6 Kartu per A4) */}
      <div className="no-print bg-slate-950/70 border-b border-slate-800 px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <LayoutGrid className="w-4 h-4 text-red-500" />
            <span className="font-semibold">Pilih Tata Letak Kertas A4:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(Object.keys(LAYOUT_DETAILS) as LayoutMode[]).map((modeKey) => {
              const item = LAYOUT_DETAILS[modeKey];
              const isSelected = layoutMode === modeKey;
              return (
                <button
                  key={modeKey}
                  onClick={() => {
                    setLayoutMode(modeKey);
                    setPreviewPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-md shadow-red-900/30 ring-1 ring-white/20'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                  }`}
                >
                  <span>{item.label}</span>
                  {modeKey === '6-landscape' && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400 text-black font-extrabold uppercase">
                      Utama (3x2)
                    </span>
                  )}
                  {modeKey === '6-portrait' && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-200 text-black font-bold uppercase">
                      2x3
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Notification Toast */}
      {exportMessage && (
        <div className="no-print fixed bottom-6 right-6 z-50 bg-slate-800 text-white px-4 py-2.5 rounded-xl border border-slate-700 shadow-2xl flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-3 duration-200">
          {isExportingPdf || isExportingPng ? (
            <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <span>{exportMessage}</span>
        </div>
      )}

      {/* Main Workspace (Hidden on print) */}
      <div className="no-print flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Controls & Student Selection (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-red-500" />
                Filter & Pemilihan Siswa
              </h2>
              <span className="text-xs text-slate-400">
                {totalPages} Lembar A4
              </span>
            </div>

            {/* Filter Kelas */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Filter Kelas:
              </label>
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setPreviewPage(1);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="all">Semua Kelas ({students.length} Siswa)</option>
                {uniqueClasses.map((kls) => (
                  <option key={kls} value={kls}>
                    Kelas {kls} ({students.filter((s) => s.kelas === kls).length} Siswa)
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-700">
              <span className="text-slate-400">
                Terpilih: <strong className="text-white">{studentsToPrint.length}</strong> / {filteredStudents.length}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAll}
                  className="text-red-400 hover:text-red-300 font-semibold"
                >
                  Pilih Semua
                </button>
                <span className="text-slate-600">•</span>
                <button
                  onClick={handleDeselectAll}
                  className="text-slate-400 hover:text-slate-200"
                >
                  Batal Semua
                </button>
              </div>
            </div>

            {/* Student List Checkbox */}
            <div className="max-h-60 overflow-y-auto space-y-1 pr-1 divide-y divide-slate-750">
              {filteredStudents.map((student) => {
                const isSelected = selectedStudentIds.includes(student.id);
                return (
                  <div
                    key={student.id}
                    onClick={() => toggleStudent(student.id)}
                    className="flex items-center gap-2.5 p-2 hover:bg-slate-800/70 cursor-pointer rounded transition-colors text-[11px]"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-red-500 flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    )}
                    <span className="font-mono text-slate-400 w-12 flex-shrink-0">
                      {student.nomorTes}
                    </span>
                    <span className="font-semibold text-slate-200 truncate flex-1">
                      {student.nama}
                    </span>
                    <span className="text-slate-400 text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">
                      {student.kelas}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Solusi Anti Berubah / 100% Persis Layar Info Box */}
            <div className="bg-red-950/40 p-3 rounded-lg border border-red-700/50 text-[11px] text-red-200 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-white">
                <FileText className="w-4 h-4 text-red-400" />
                Solusi Hasil 100% Persis Layar (Bebas Melar):
              </div>
              <p className="text-[10.5px] text-red-200/90 leading-relaxed">
                Gunakan tombol merah <strong>&quot;Download PDF (100% Persis Layar)&quot;</strong> di atas. File PDF A4 akan langsung di-generate dari layar tanpa terpengaruh oleh driver atau margin printer PC Anda!
              </p>
            </div>

            {/* Guide Tips for PDF Print via Browser */}
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700 text-[11px] text-slate-300 space-y-2">
              <div className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Jika Mencetak via Dialog Print (Ctrl+P):
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 space-y-1.5 text-[10.5px]">
                <div className="flex items-start gap-1.5">
                  <span className="text-red-400 font-bold">1.</span>
                  <span><strong>Margins (Margin):</strong> Pilih <strong>&quot;None&quot;</strong> atau <strong>&quot;Minimal&quot;</strong> (JANGAN &quot;Default&quot;).</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-red-400 font-bold">2.</span>
                  <span><strong>Headers and footers:</strong> <span className="text-red-400 font-semibold">HILANGKAN CENTANG</span>.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">3.</span>
                  <span><strong>Background graphics:</strong> <span className="text-emerald-400 font-semibold">WAJIB DICENTANG</span> (agar banner judul tabel tercetak).</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Preview: Interactive A4 Page View (8 cols) */}
        <div className="lg:col-span-8 flex flex-col items-center">
          {/* Pagination Navigation */}
          {totalPages > 0 ? (
            <div className="w-full flex items-center justify-between mb-3 bg-slate-800/80 border border-slate-700 px-4 py-2 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Pratinjau Lembar:</span>
                <span className="font-bold text-white px-2 py-0.5 bg-slate-900 rounded border border-slate-700">
                  Halaman {previewPage} dari {totalPages} ({cardsPerPage} kartu per lembar)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewPage((p) => Math.max(1, p - 1))}
                  disabled={previewPage <= 1}
                  className="p-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white"
                  title="Halaman Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewPage((p) => Math.min(totalPages, p + 1))}
                  disabled={previewPage >= totalPages}
                  className="p-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white"
                  title="Halaman Berikutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : null}

          {/* Simulated A4 Paper (Screen preview & PDF/PNG capture source) */}
          {currentPageStudents.length > 0 ? (
            <div
              ref={paperRef}
              className={`bg-white rounded-md shadow-2xl p-2.5 text-black border border-slate-300 w-full transition-all relative ${activeLayout.aspectClass}`}
            >
              {layoutMode === '6-landscape' && (
                /* 6 Cards in A4 Landscape: 3 cols x 2 rows */
                <div className="grid grid-cols-3 grid-rows-2 gap-2 h-full w-full relative">
                  {showCuttingGuide && (
                    <>
                      {/* Vertical cut lines at 33.33% and 66.67% */}
                      <div className="absolute top-0 bottom-0 left-[33.33%] -translate-x-1/2 w-0 border-r border-dashed border-slate-400 pointer-events-none z-10 flex items-center justify-center">
                        <div className="bg-white p-0.5 border border-slate-300 rounded text-slate-500 shadow-xs">
                          <Scissors className="w-2.5 h-2.5" />
                        </div>
                      </div>
                      <div className="absolute top-0 bottom-0 left-[66.67%] -translate-x-1/2 w-0 border-r border-dashed border-slate-400 pointer-events-none z-10 flex items-center justify-center">
                        <div className="bg-white p-0.5 border border-slate-300 rounded text-slate-500 shadow-xs">
                          <Scissors className="w-2.5 h-2.5" />
                        </div>
                      </div>
                      {/* Horizontal center cut line */}
                      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0 border-b border-dashed border-slate-400 pointer-events-none z-10 flex items-center justify-center">
                        <div className="bg-white p-0.5 border border-slate-300 rounded text-slate-500 shadow-xs">
                          <Scissors className="w-2.5 h-2.5" />
                        </div>
                      </div>
                    </>
                  )}

                  {currentPageStudents.map((student) => (
                    <div key={student.id} className="h-full w-full overflow-hidden">
                      <ExamCard
                        student={student}
                        schedule={schedule}
                        config={config}
                        isPrintMode={false}
                      />
                    </div>
                  ))}
                </div>
              )}

              {layoutMode === '6-portrait' && (
                /* 6 Cards in A4 Portrait: 2 cols x 3 rows (kartu landscape) */
                <div className="grid grid-cols-2 grid-rows-3 gap-2 h-full w-full relative">
                  {showCuttingGuide && (
                    <>
                      {/* Vertical center cut line */}
                      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0 border-r border-dashed border-slate-400 pointer-events-none z-10 flex items-center justify-center">
                        <div className="bg-white p-0.5 border border-slate-300 rounded text-slate-500 shadow-xs">
                          <Scissors className="w-2.5 h-2.5" />
                        </div>
                      </div>
                      {/* Horizontal cut lines at 33.33% and 66.67% */}
                      <div className="absolute left-0 right-0 top-[33.33%] -translate-y-1/2 h-0 border-b border-dashed border-slate-400 pointer-events-none z-10 flex items-center justify-center">
                        <div className="bg-white p-0.5 border border-slate-300 rounded text-slate-500 shadow-xs">
                          <Scissors className="w-2.5 h-2.5" />
                        </div>
                      </div>
                      <div className="absolute left-0 right-0 top-[66.67%] -translate-y-1/2 h-0 border-b border-dashed border-slate-400 pointer-events-none z-10 flex items-center justify-center">
                        <div className="bg-white p-0.5 border border-slate-300 rounded text-slate-500 shadow-xs">
                          <Scissors className="w-2.5 h-2.5" />
                        </div>
                      </div>
                    </>
                  )}

                  {currentPageStudents.map((student) => (
                    <div key={student.id} className="h-full w-full overflow-hidden">
                      <ExamCard
                        student={student}
                        schedule={schedule}
                        config={config}
                        isPrintMode={false}
                      />
                    </div>
                  ))}
                </div>
              )}

              {layoutMode === '4-landscape' && (
                /* 4 Cards in A4 Landscape: 2x2 Grid */
                <div className="grid grid-cols-2 grid-rows-2 gap-3 h-full w-full relative">
                  {showCuttingGuide && (
                    <>
                      {/* Vertical center cut line */}
                      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0 border-r border-dashed border-slate-400 pointer-events-none flex items-center justify-center">
                        <div className="bg-white p-0.5 border border-slate-300 rounded text-slate-500">
                          <Scissors className="w-3 h-3" />
                        </div>
                      </div>
                      {/* Horizontal center cut line */}
                      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0 border-b border-dashed border-slate-400 pointer-events-none flex items-center justify-center">
                        <div className="bg-white p-0.5 border border-slate-300 rounded text-slate-500">
                          <Scissors className="w-3 h-3" />
                        </div>
                      </div>
                    </>
                  )}

                  {currentPageStudents.map((student) => (
                    <div key={student.id} className="h-full w-full overflow-hidden">
                      <ExamCard
                        student={student}
                        schedule={schedule}
                        config={config}
                        isPrintMode={false}
                      />
                    </div>
                  ))}
                </div>
              )}

              {layoutMode === '2-portrait' && (
                /* 2 Cards in A4 Portrait */
                <div className="flex flex-col justify-between gap-4 h-full w-full relative">
                  {currentPageStudents.map((student, idx) => (
                    <React.Fragment key={student.id}>
                      <div className="flex-1 w-full overflow-hidden">
                        <ExamCard
                          student={student}
                          schedule={schedule}
                          config={config}
                          isPrintMode={false}
                        />
                      </div>

                      {/* Cutting guide between 2 cards */}
                      {idx < currentPageStudents.length - 1 && showCuttingGuide && (
                        <div className="relative py-1 flex items-center justify-center pointer-events-none">
                          <div className="w-full border-t border-dashed border-slate-400"></div>
                          <div className="absolute bg-white px-2 flex items-center gap-1 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                            <Scissors className="w-3 h-3 text-slate-500" />
                            Garis Potong
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}

              {layoutMode === '3-portrait' && (
                /* 3 Cards in A4 Portrait */
                <div className="flex flex-col justify-between gap-2.5 h-full w-full relative">
                  {currentPageStudents.map((student, idx) => (
                    <React.Fragment key={student.id}>
                      <div className="flex-1 w-full overflow-hidden">
                        <ExamCard
                          student={student}
                          schedule={schedule}
                          config={config}
                          isPrintMode={false}
                        />
                      </div>

                      {/* Cutting guide between 3 cards */}
                      {idx < currentPageStudents.length - 1 && showCuttingGuide && (
                        <div className="relative py-0.5 flex items-center justify-center pointer-events-none">
                          <div className="w-full border-t border-dashed border-slate-400"></div>
                          <div className="absolute bg-white px-1.5 flex items-center gap-1 text-[8px] font-bold text-slate-500 uppercase tracking-wider">
                            <Scissors className="w-2.5 h-2.5 text-slate-500" />
                            Potong
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}


              {layoutMode === '1-card' && (
                /* 1 Card in A4 Jumbo */
                <div className="flex items-center justify-center h-full w-full p-2">
                  <div className="w-full max-w-[620px]">
                    {currentPageStudents[0] && (
                      <ExamCard
                        student={currentPageStudents[0]}
                        schedule={schedule}
                        config={config}
                        isPrintMode={false}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-slate-800/40 rounded-xl border border-slate-800 w-full">
              <FileCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="font-semibold text-slate-300">
                Tidak ada kartu yang dipilih untuk dicetak.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Silakan centang siswa di daftar sebelah kiri.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footnote */}
      <footer className="no-print border-t border-slate-800 py-3 text-center text-xs text-slate-400">
        @ 2026 Guru Informatika - Ervin Yoga Pratama, S.Kom, M.M
      </footer>

      {/* Real Print Output Container (Active ONLY when window.print() is called) */}
      <div className="print-only">
        {pages.map((pageStudents, pageIndex) => (
          <div
            key={pageIndex}
            className={activeLayout.pageClass}
          >
            {pageStudents.map((student) => (
              <div key={student.id} className="h-full w-full box-border overflow-hidden">
                <ExamCard
                  student={student}
                  schedule={schedule}
                  config={config}
                  isPrintMode={true}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
