import React, { useState } from 'react';
import { ExamScheduleItem } from '../types';
import {
  Calendar,
  Clock,
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  RotateCcw,
} from 'lucide-react';
import { INITIAL_SCHEDULE } from '../constants/initialData';

interface ScheduleManagerProps {
  schedule: ExamScheduleItem[];
  onUpdateSchedule: (schedule: ExamScheduleItem[]) => void;
}

export const ScheduleManager: React.FC<ScheduleManagerProps> = ({
  schedule,
  onUpdateSchedule,
}) => {
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);

  // Form State
  const [formHariTanggal, setFormHariTanggal] = useState('');
  const [formWaktu, setFormWaktu] = useState('');
  const [formMataPelajaran, setFormMataPelajaran] = useState('');
  const [formTingkatKelas, setFormTingkatKelas] = useState('Semua');

  const startEdit = (item: ExamScheduleItem) => {
    setEditingId(item.id);
    setFormHariTanggal(item.hariTanggal);
    setFormWaktu(item.waktu);
    setFormMataPelajaran(item.mataPelajaran);
    setFormTingkatKelas(item.tingkatKelas);
    setIsAddMode(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAddMode(false);
  };

  const saveEdit = () => {
    if (!formHariTanggal.trim() || !formMataPelajaran.trim()) {
      alert('Hari/Tanggal dan Mata Pelajaran wajib diisi');
      return;
    }

    if (editingId) {
      onUpdateSchedule(
        schedule.map((s) =>
          s.id === editingId
            ? {
                ...s,
                hariTanggal: formHariTanggal,
                waktu: formWaktu,
                mataPelajaran: formMataPelajaran,
                tingkatKelas: formTingkatKelas,
              }
            : s
        )
      );
    } else if (isAddMode) {
      const newItem: ExamScheduleItem = {
        id: `sch-${Date.now()}`,
        hariTanggal: formHariTanggal,
        waktu: formWaktu || '07.30 - 09.30',
        mataPelajaran: formMataPelajaran,
        tingkatKelas: formTingkatKelas,
      };
      onUpdateSchedule([...schedule, newItem]);
    }

    setEditingId(null);
    setIsAddMode(false);
  };

  const deleteItem = (id: string) => {
    if (confirm('Hapus jadwal mata pelajaran ini?')) {
      onUpdateSchedule(schedule.filter((s) => s.id !== id));
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= schedule.length) return;
    const newSched = [...schedule];
    const temp = newSched[index];
    newSched[index] = newSched[newIdx];
    newSched[newIdx] = temp;
    onUpdateSchedule(newSched);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormHariTanggal('Senin, 21 Sept 2026');
    setFormWaktu('07.30 - 09.30');
    setFormMataPelajaran('');
    setFormTingkatKelas('Semua');
    setIsAddMode(true);
  };

  const filteredSchedule = schedule.filter(
    (s) => filterGrade === 'all' || s.tingkatKelas === 'Semua' || s.tingkatKelas === filterGrade
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-red-600" />
            Pengaturan Jadwal Asesmen / Ujian
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar mata pelajaran, hari/tanggal, dan alokasi waktu yang tertera di kartu peserta ujian
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (confirm('Kembalikan jadwal ke jadwal standar SMP Warga Surakarta?')) {
                onUpdateSchedule(INITIAL_SCHEDULE);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Jadwal Standar
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Mata Pelajaran
          </button>
        </div>
      </div>

      {/* Filter by Grade */}
      <div className="p-3 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-600">Filter Jadwal:</span>
          {['all', 'Semua', '7', '8', '9'].map((gr) => (
            <button
              key={gr}
              onClick={() => setFilterGrade(gr)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                filterGrade === gr
                  ? 'bg-red-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {gr === 'all'
                ? 'Semua (' + schedule.length + ')'
                : gr === 'Semua'
                ? 'Umum (Semua Kelas)'
                : `Khusus Kelas ${gr}`}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400">Total: {filteredSchedule.length} Sesi Ujian</span>
      </div>

      {/* Inline Add / Edit Form */}
      {(isAddMode || editingId) && (
        <div className="p-4 bg-red-50/40 border-b-2 border-red-200 animate-in fade-in">
          <div className="text-xs font-bold text-red-900 mb-3 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-red-600" />
            {isAddMode ? 'Tambah Sesi Ujian Baru' : 'Edit Sesi Ujian'}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Hari, Tanggal *
              </label>
              <input
                type="text"
                value={formHariTanggal}
                onChange={(e) => setFormHariTanggal(e.target.value)}
                placeholder="Contoh: Senin, 14 Sept 2026"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500/20 font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Alokasi Waktu *
              </label>
              <input
                type="text"
                value={formWaktu}
                onChange={(e) => setFormWaktu(e.target.value)}
                placeholder="Contoh: 07.30 - 09.30"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500/20 font-mono font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Mata Pelajaran *
              </label>
              <input
                type="text"
                value={formMataPelajaran}
                onChange={(e) => setFormMataPelajaran(e.target.value)}
                placeholder="Contoh: 1. Matematika"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500/20 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Berlaku Untuk
              </label>
              <select
                value={formTingkatKelas}
                onChange={(e) => setFormTingkatKelas(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500/20 font-medium"
              >
                <option value="Semua">Semua Tingkat (Kelas 7, 8, 9)</option>
                <option value="7">Khusus Kelas 7</option>
                <option value="8">Khusus Kelas 8</option>
                <option value="9">Khusus Kelas 9</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={cancelEdit}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50"
            >
              <X className="w-3.5 h-3.5" /> Batal
            </button>
            <button
              onClick={saveEdit}
              className="inline-flex items-center gap-1 px-3.5 py-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-md shadow-xs"
            >
              <Check className="w-3.5 h-3.5" /> Simpan Sesi
            </button>
          </div>
        </div>
      )}

      {/* Schedule Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3 w-10 text-center">Urutan</th>
              <th className="py-2.5 px-4">Hari, Tanggal</th>
              <th className="py-2.5 px-4">Waktu</th>
              <th className="py-2.5 px-4">Mata Pelajaran</th>
              <th className="py-2.5 px-4 text-center">Tingkat Kelas</th>
              <th className="py-2.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredSchedule.map((item, idx) => {
              const actualIdx = schedule.findIndex((s) => s.id === item.id);
              return (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-3 text-center">
                    <div className="inline-flex flex-col items-center">
                      <button
                        onClick={() => moveItem(actualIdx, 'up')}
                        disabled={actualIdx === 0}
                        className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                        title="Geser ke Atas"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => moveItem(actualIdx, 'down')}
                        disabled={actualIdx === schedule.length - 1}
                        className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                        title="Geser ke Bawah"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="py-2 px-4 font-semibold text-slate-900">
                    {item.hariTanggal}
                  </td>
                  <td className="py-2 px-4 font-mono font-medium text-slate-700">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {item.waktu}
                    </span>
                  </td>
                  <td className="py-2 px-4 font-bold text-slate-900">
                    {item.mataPelajaran}
                  </td>
                  <td className="py-2 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10.5px] font-semibold ${
                        item.tingkatKelas === 'Semua'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {item.tingkatKelas === 'Semua'
                        ? 'Semua Kelas'
                        : `Kelas ${item.tingkatKelas}`}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => startEdit(item)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
