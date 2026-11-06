import React, { useState, useRef } from 'react';
import { Student } from '../types';
import {
  UserPlus,
  Upload,
  Search,
  Trash2,
  Edit,
  Camera,
  FileSpreadsheet,
  Download,
  Filter,
  CheckCircle2,
  X,
  User,
  Image,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

interface StudentManagerProps {
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onBulkImport: (students: Omit<Student, 'id'>[]) => void;
  onBatchUpdatePhotos?: (photosMap: { [studentId: string]: string }) => void;
  onResetDefault: () => void;
  onSelectForPrint?: (student: Student) => void;
}

interface PhotoMatchResult {
  fileName: string;
  dataUrl: string;
  matchedStudent?: Student;
}

export const StudentManager: React.FC<StudentManagerProps> = ({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onBulkImport,
  onBatchUpdatePhotos,
  onResetDefault,
  onSelectForPrint,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isPhotoImportModalOpen, setIsPhotoImportModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nomorTes: '',
    nama: '',
    kelas: '7 C',
    presensi: '',
    ruang: '6',
    fotoUrl: '',
  });

  // Import State
  const [importText, setImportText] = useState('');
  const [importPreview, setImportPreview] = useState<Omit<Student, 'id'>[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const bulkPhotoInputRef = useRef<HTMLInputElement>(null);
  const singleRowPhotoInputRef = useRef<HTMLInputElement>(null);
  const [targetStudentForQuickPhoto, setTargetStudentForQuickPhoto] = useState<Student | null>(null);

  // Bulk Photo Match State
  const [photoMatches, setPhotoMatches] = useState<PhotoMatchResult[]>([]);

  // Unique classes for filter
  const uniqueClasses = Array.from(new Set(students.map((s) => s.kelas))).sort();

  // Filtered students
  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nomorTes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.ruang.toLowerCase().includes(searchTerm.toLowerCase());
    const matchClass = selectedClass === 'all' || s.kelas === selectedClass;
    return matchSearch && matchClass;
  });

  // Handle Single Student Photo Upload inside Add/Edit Form
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('Ukuran foto maksimal 3MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, fotoUrl: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick single row photo upload
  const handleQuickRowPhoto = (student: Student) => {
    setTargetStudentForQuickPhoto(student);
    singleRowPhotoInputRef.current?.click();
  };

  const handleRowPhotoFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && targetStudentForQuickPhoto) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onUpdateStudent({
          ...targetStudentForQuickPhoto,
          fotoUrl: event.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Bulk Photos Upload & Match
  const handleBulkPhotosSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const results: PhotoMatchResult[] = [];
    let processed = 0;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const cleanName = file.name
          .replace(/\.[^/.]+$/, '') // remove extension
          .trim();

        // Try matching with Nomor Tes (exact match or clean) or Nama
        const matched = students.find((s) => {
          const sNomor = s.nomorTes.trim().toLowerCase();
          const sNama = s.nama.trim().toLowerCase();
          const fName = cleanName.toLowerCase();

          return (
            sNomor === fName ||
            sNama === fName ||
            fName.includes(sNomor) ||
            sNama.includes(fName)
          );
        });

        results.push({
          fileName: file.name,
          dataUrl,
          matchedStudent: matched,
        });

        processed++;
        if (processed === files.length) {
          setPhotoMatches([...results]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const applyBulkPhotos = () => {
    if (!onBatchUpdatePhotos) return;
    const map: { [studentId: string]: string } = {};
    photoMatches.forEach((m) => {
      if (m.matchedStudent) {
        map[m.matchedStudent.id] = m.dataUrl;
      }
    });

    onBatchUpdatePhotos(map);
    setIsPhotoImportModalOpen(false);
    setPhotoMatches([]);
  };

  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setFormData({
      nomorTes: (students.length > 0 ? (parseInt(students[students.length - 1].nomorTes) + 1 || 7674) : 7601).toString(),
      nama: '',
      kelas: selectedClass !== 'all' ? selectedClass : '7 C',
      presensi: '',
      ruang: '6',
      fotoUrl: '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      nomorTes: student.nomorTes,
      nama: student.nama,
      kelas: student.kelas,
      presensi: student.presensi,
      ruang: student.ruang,
      fotoUrl: student.fotoUrl || '',
    });
    setIsAddModalOpen(true);
  };

  const handleSubmitStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama.trim() || !formData.nomorTes.trim()) {
      alert('Nama dan Nomor Tes wajib diisi');
      return;
    }

    if (editingStudent) {
      onUpdateStudent({
        ...editingStudent,
        ...formData,
      });
    } else {
      onAddStudent(formData);
    }
    setIsAddModalOpen(false);
  };

  // Parse CSV or Tab-separated text from Excel
  const parsePastedData = (text: string) => {
    const lines = text.trim().split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) return;

    const parsed: Omit<Student, 'id'>[] = [];

    lines.forEach((line) => {
      let parts = line.split('\t');
      if (parts.length < 2) parts = line.split(',');
      if (parts.length < 2) parts = line.split(';');

      const clean = parts.map((p) => p.trim().replace(/^["']|["']$/g, ''));
      if (clean.length >= 2) {
        if (/^(no|nama|name|nis|nomor)/i.test(clean[0]) && /^(nama|kelas)/i.test(clean[1])) {
          return;
        }

        let noTes = '';
        let nama = '';
        let kelas = '7 C';
        let presensi = '';
        let ruang = '6';

        if (clean.length === 2) {
          noTes = clean[0];
          nama = clean[1];
        } else if (clean.length === 3) {
          noTes = clean[0];
          nama = clean[1];
          kelas = clean[2];
        } else if (clean.length === 4) {
          noTes = clean[0];
          nama = clean[1];
          kelas = clean[2];
          presensi = clean[3];
        } else if (clean.length >= 5) {
          if (/^\d{1,2}$/.test(clean[0]) && /^\d{3,6}$/.test(clean[1])) {
            noTes = clean[1];
            nama = clean[2];
            kelas = clean[3] || '7 C';
            presensi = clean[4] || clean[0];
            ruang = clean[5] || '6';
          } else {
            noTes = clean[0];
            nama = clean[1];
            kelas = clean[2];
            presensi = clean[3];
            ruang = clean[4] || '6';
          }
        }

        if (nama && noTes) {
          parsed.push({
            nomorTes: noTes,
            nama: nama.toUpperCase(),
            kelas: kelas || '7 C',
            presensi: presensi || '',
            ruang: ruang || '6',
            fotoUrl: '',
          });
        }
      }
    });

    setImportPreview(parsed);
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Nomor Tes,Nama,Kelas,Presensi,Ruang\n7669,YUDHISTIRA CAHYA MAHENDRA,7 C,32,6\n7670,AISYAH PUTRI LARASATI,7 C,01,6\n7671,BAGAS ADITYA PRATAMA,7 C,05,6\n7672,CLARISSA AURELIA WIJAYA,7 C,08,6\n7673,DIMAS ARYA KUSUMA,7 C,12,6';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'template_siswa_smp_warga.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setImportText(text);
        parsePastedData(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Hidden single row photo input */}
      <input
        type="file"
        ref={singleRowPhotoInputRef}
        accept="image/*"
        onChange={handleRowPhotoFileSelected}
        className="hidden"
      />

      {/* Header Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span>
            Data Peserta Ujian ({students.length} Siswa)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola murid, upload pasfoto 3x4, nomor tes, kelas, ruang, dan nomor presensi
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Download Template */}
          <button
            onClick={handleDownloadTemplate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            title="Download Template Excel/CSV"
          >
            <Download className="w-3.5 h-3.5" />
            Template CSV
          </button>

          {/* Import Foto Massal */}
          <button
            onClick={() => {
              setPhotoMatches([]);
              setIsPhotoImportModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors shadow-2xs"
            title="Upload banyak foto sekaligus dengan nama file nomor tes"
          >
            <Image className="w-3.5 h-3.5 text-purple-600" />
            Import Foto Massal
          </button>

          {/* Import Data Siswa */}
          <button
            onClick={() => {
              setImportText('');
              setImportPreview([]);
              setIsImportModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Import Excel/CSV
          </button>

          {/* Tambah Murid */}
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Tambah Murid
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, no tes, ruang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs font-medium text-slate-600">Kelas:</span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium"
          >
            <option value="all">Semua Kelas ({students.length})</option>
            {uniqueClasses.map((cls) => (
              <option key={cls} value={cls}>
                Kelas {cls} ({students.filter((s) => s.kelas === cls).length})
              </option>
            ))}
          </select>

          {students.length === 0 && (
            <button
              onClick={onResetDefault}
              className="text-xs text-red-600 hover:underline font-medium ml-2"
            >
              Muat Data Contoh
            </button>
          )}
        </div>
      </div>

      {/* Students Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
            <tr>
              <th className="py-3 px-4 w-16 text-center">Pasfoto</th>
              <th className="py-3 px-4 w-28">No. Tes</th>
              <th className="py-3 px-4">Nama Lengkap</th>
              <th className="py-3 px-4 text-center w-24">Kelas</th>
              <th className="py-3 px-4 text-center w-24">Presensi</th>
              <th className="py-3 px-4 text-center w-24">Ruang</th>
              <th className="py-3 px-4 text-right w-32">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-red-50/40 transition-colors group"
                >
                  {/* Photo cell with quick change button */}
                  <td className="py-2 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleQuickRowPhoto(student)}
                      className="w-9 h-11 rounded border border-slate-300 bg-slate-100 overflow-hidden mx-auto flex items-center justify-center relative group/photo hover:ring-2 hover:ring-red-400 transition-all"
                      title="Klik untuk unggah/ganti foto siswa ini"
                    >
                      {student.fotoUrl ? (
                        <img
                          src={student.fotoUrl}
                          alt={student.nama}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="w-4 h-4 text-slate-400 group-hover/photo:text-red-600" />
                      )}
                      <div className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover/photo:opacity-100 text-[8px] font-bold">
                        Ganti
                      </div>
                    </button>
                  </td>
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-900">
                    {student.nomorTes}
                  </td>
                  <td className="py-2.5 px-4 font-bold text-slate-800">
                    {student.nama}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {student.kelas}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-center font-semibold text-slate-600">
                    {student.presensi || '-'}
                  </td>
                  <td className="py-2.5 px-4 text-center font-bold text-slate-700">
                    Ruang {student.ruang || '-'}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {onSelectForPrint && (
                        <button
                          onClick={() => onSelectForPrint(student)}
                          className="p-1.5 text-slate-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Lihat / Cetak Kartu Ini"
                        >
                          <CheckCircle2 className="w-4 h-4 text-red-600" />
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenEditModal(student)}
                        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit Data Siswa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus siswa "${student.nama}"?`)) {
                            onDeleteStudent(student.id);
                          }
                        }}
                        className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Hapus Siswa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  <p className="font-medium">Tidak ada murid yang sesuai filter pencarian.</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Coba ubah kata kunci atau pilih &quot;Semua Kelas&quot;.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in duration-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-red-400" />
                {editingStudent ? 'Edit Identitas Murid' : 'Tambah Murid Baru'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitStudent} className="p-5 space-y-4">
              {/* Photo Upload Box */}
              <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="w-16 h-20 bg-white border-2 border-dashed border-slate-300 rounded flex flex-col items-center justify-center overflow-hidden relative group">
                  {formData.fotoUrl ? (
                    <>
                      <img
                        src={formData.fotoUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, fotoUrl: '' }))}
                        className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold"
                      >
                        Hapus
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-1">
                      <Camera className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                      <span className="text-[9px] text-slate-400 font-medium">3x4</span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pasfoto Siswa (Opsional)
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Format JPG/PNG 3x4, otomatis tampil di kartu.
                  </p>
                  <input
                    type="file"
                    ref={photoInputRef}
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Pilih File Foto
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor Tes *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 7669"
                    value={formData.nomorTes}
                    onChange={(e) => setFormData({ ...formData, nomorTes: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kelas *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 7 C"
                    value={formData.kelas}
                    onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap Siswa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: YUDHISTIRA CAHYA MAHENDRA"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-bold uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    No. Presensi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 32"
                    value={formData.presensi}
                    onChange={(e) => setFormData({ ...formData, presensi: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ruang Ujian
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 6"
                    value={formData.ruang}
                    onChange={(e) => setFormData({ ...formData, ruang: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-semibold"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors"
                >
                  {editingStudent ? 'Simpan Perubahan' : 'Tambahkan Murid'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import Data Siswa Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in duration-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                Import Massal Murid dari Excel / CSV
              </h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900 leading-relaxed">
                <strong>Cara Mudah:</strong> Copy baris tabel langsung dari Microsoft Excel atau Google Sheets, lalu paste ke kotak di bawah ini. Urutan kolom standar:{' '}
                <code className="bg-white px-1 py-0.5 rounded border border-blue-200 font-bold">
                  Nomor Tes | Nama | Kelas | Presensi | Ruang
                </code>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Paste Data Teks / Unggah File CSV
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".csv,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-red-600 font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      <Upload className="w-3 h-3" />
                      Pilih File .CSV
                    </button>
                  </div>
                </div>
                <textarea
                  rows={5}
                  value={importText}
                  onChange={(e) => {
                    setImportText(e.target.value);
                    parsePastedData(e.target.value);
                  }}
                  placeholder="Paste tabel Excel di sini...&#10;Contoh:&#10;7669	YUDHISTIRA CAHYA MAHENDRA	7 C	32	6&#10;7670	AISYAH PUTRI LARASATI	7 C	01	6"
                  className="w-full p-2.5 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                ></textarea>
              </div>

              {/* Preview parsed students */}
              {importPreview.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800">
                      Pratinjau Hasil Deteksi ({importPreview.length} Murid):
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold">
                      ✓ Siap diimport
                    </span>
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-x-auto max-h-48">
                    <table className="w-full text-[11px] text-left">
                      <thead className="bg-slate-100 font-semibold text-slate-600 border-b border-slate-200">
                        <tr>
                          <th className="p-1.5 px-2">No. Tes</th>
                          <th className="p-1.5 px-2">Nama</th>
                          <th className="p-1.5 px-2">Kelas</th>
                          <th className="p-1.5 px-2">Presensi</th>
                          <th className="p-1.5 px-2">Ruang</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {importPreview.slice(0, 10).map((p, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-1.5 px-2 font-mono font-bold text-slate-800">
                              {p.nomorTes}
                            </td>
                            <td className="p-1.5 px-2 font-medium text-slate-800">
                              {p.nama}
                            </td>
                            <td className="p-1.5 px-2">{p.kelas}</td>
                            <td className="p-1.5 px-2">{p.presensi}</td>
                            <td className="p-1.5 px-2">{p.ruang}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {importPreview.length > 10 && (
                    <p className="text-[10px] text-slate-400 mt-1 italic">
                      ...dan {importPreview.length - 10} murid lainnya.
                    </p>
                  )}
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={importPreview.length === 0}
                  onClick={() => {
                    onBulkImport(importPreview);
                    setIsImportModalOpen(false);
                  }}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg shadow-sm transition-colors text-white ${
                    importPreview.length > 0
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-slate-300 cursor-not-allowed'
                  }`}
                >
                  Import {importPreview.length} Murid
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Photo Import Modal */}
      {isPhotoImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in duration-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Image className="w-4 h-4 text-purple-400" />
                Import Foto Massal Siswa
              </h3>
              <button
                onClick={() => setIsPhotoImportModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-xs text-purple-900 leading-relaxed space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Sistem Pencocokan Otomatis Foto Siswa:
                </div>
                <p>
                  Namai file foto sesuai <strong>Nomor Tes</strong> (contoh:{' '}
                  <code className="bg-white px-1 py-0.5 rounded font-bold border border-purple-200">
                    7669.jpg
                  </code>
                  ,{' '}
                  <code className="bg-white px-1 py-0.5 rounded font-bold border border-purple-200">
                    7670.png
                  </code>
                  ) atau sesuai <strong>Nama Siswa</strong>.
                </p>
                <p className="text-[11px] text-purple-700">
                  Pilih banyak file foto sekaligus (Ctrl+A / Cmd+A), sistem akan mencocokkannya secara otomatis dengan data murid!
                </p>
              </div>

              {/* Upload Input */}
              <div className="p-6 border-2 border-dashed border-purple-200 bg-purple-50/30 rounded-xl text-center">
                <input
                  type="file"
                  ref={bulkPhotoInputRef}
                  multiple
                  accept="image/*"
                  onChange={handleBulkPhotosSelected}
                  className="hidden"
                />
                <Camera className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700 mb-1">
                  Pilih File Foto Sekaligus
                </p>
                <p className="text-[11px] text-slate-500 mb-3">
                  Format JPG, JPEG, PNG, WEBP (Bisa pilih puluhan foto sekaligus)
                </p>
                <button
                  type="button"
                  onClick={() => bulkPhotoInputRef.current?.click()}
                  className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-sm inline-flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  Pilih Foto dari Komputer
                </button>
              </div>

              {/* Matching Results Preview */}
              {photoMatches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <span className="font-bold text-slate-800">
                      Hasil Pencocokan ({photoMatches.filter((m) => m.matchedStudent).length} dari{' '}
                      {photoMatches.length} foto cocok):
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-x-auto max-h-56 divide-y divide-slate-100">
                    {photoMatches.map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 p-2 text-xs ${
                          item.matchedStudent ? 'bg-emerald-50/30' : 'bg-red-50/30'
                        }`}
                      >
                        <img
                          src={item.dataUrl}
                          alt="preview"
                          className="w-8 h-10 object-cover rounded border border-slate-300"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-mono text-slate-700 font-semibold truncate">
                            {item.fileName}
                          </div>
                          {item.matchedStudent ? (
                            <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                              <span>✓ Cocok dengan:</span>
                              <span className="font-mono">{item.matchedStudent.nomorTes}</span> -{' '}
                              <span>{item.matchedStudent.nama}</span> ({item.matchedStudent.kelas})
                            </div>
                          ) : (
                            <div className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Tidak ada siswa dengan Nomor Tes/Nama ini
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPhotoImportModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  disabled={photoMatches.filter((m) => m.matchedStudent).length === 0}
                  onClick={applyBulkPhotos}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg shadow-sm transition-colors text-white ${
                    photoMatches.filter((m) => m.matchedStudent).length > 0
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-slate-300 cursor-not-allowed'
                  }`}
                >
                  Terapkan{' '}
                  {photoMatches.filter((m) => m.matchedStudent).length} Foto ke Siswa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
