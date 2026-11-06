import React from 'react';
import { Student, ExamScheduleItem, CardConfig } from '../types';
import { LogoYayasanPendidikanWarga, LogoSmpWarga, StempelTandaTangan } from './Logos';

interface ExamCardProps {
  student: Student;
  schedule: ExamScheduleItem[];
  config: CardConfig;
  className?: string;
  isPrintMode?: boolean;
}

export const ExamCard: React.FC<ExamCardProps> = ({
  student,
  schedule,
  config,
  className = '',
  isPrintMode = false,
}) => {
  // Extract grade level (e.g. '7 C' -> '7')
  const gradeLevel = student.kelas.trim().charAt(0);

  // Filter schedule relevant to this student's grade or 'Semua'
  const relevantSchedule = schedule.filter(
    (item) => item.tingkatKelas === 'Semua' || item.tingkatKelas === gradeLevel
  );

  // Group consecutive sessions by hariTanggal so same date shares 1 merged cell (border)
  interface ScheduleGroup {
    hariTanggal: string;
    items: ExamScheduleItem[];
  }

  const groupedSchedule: ScheduleGroup[] = [];
  relevantSchedule.forEach((item) => {
    const trimmedDate = item.hariTanggal.trim();
    const lastGroup = groupedSchedule[groupedSchedule.length - 1];
    if (lastGroup && lastGroup.hariTanggal === trimmedDate) {
      lastGroup.items.push(item);
    } else {
      groupedSchedule.push({
        hariTanggal: trimmedDate,
        items: [item],
      });
    }
  });

  return (
    <div
      className={`exam-card-print bg-white text-black border-[2px] border-black p-1 font-sans relative box-border overflow-hidden select-none ${
        isPrintMode ? '' : 'shadow-sm rounded-xs'
      } ${className}`}
      style={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Inner double border simulation */}
      <div className="border border-black p-1 relative flex flex-col justify-between h-full box-border">
        {/* Header Section */}
        <div className="flex items-center justify-between pb-0.5 border-b-[1.5px] border-black flex-shrink-0">
          {/* Left Emblem: Yayasan Pendidikan Warga */}
          <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
            <LogoYayasanPendidikanWarga
              className="h-7 w-7"
              customUrl={config.logoYayasanUrl}
            />
          </div>

          {/* Center Titles */}
          <div className="flex-1 text-center px-1">
            <h1 className="text-[6.5px] font-black uppercase tracking-tight leading-tight text-black line-clamp-2">
              {config.judulUjian}
            </h1>
            <h2 className="text-[8.5px] font-black uppercase tracking-tight leading-tight text-black">
              {config.namaSekolah}
            </h2>
            <h3 className="text-[6px] font-bold uppercase tracking-wide leading-tight text-black">
              {config.tahunAjaran}
            </h3>
          </div>

          {/* Right Emblem: SMP Warga (Official HD Logo) */}
          <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
            <LogoSmpWarga
              className="h-7 w-7"
              customUrl={config.logoSekolahUrl}
            />
          </div>
        </div>

        {/* Content Section: 2 Columns */}
        <div className="grid grid-cols-12 gap-1 pt-0.5 flex-1 items-stretch min-h-0">
          {/* Left Column:
              1. Foto di atas center (proporsional 3x4)
              2. Biodata siswa di tengah-tengah (fit vertikal, tidak terpotong)
              3. Tanggal & tanda tangan dekat bawah
              4. Perhatian di paling bawah */}
          <div className="col-span-5 flex flex-col justify-between pr-0.5 border-r border-dashed border-slate-300 h-full min-h-0">
            {/* 1. Foto Siswa di Atas Center */}
            {config.tampilkanFoto && (
              <div className="flex justify-center flex-shrink-0 pt-0.5">
                <div className="w-11 h-[48px] border-[1.2px] border-black bg-slate-50 flex flex-col items-center justify-center p-0.5 flex-shrink-0 text-center overflow-hidden shadow-2xs">
                  {student.fotoUrl ? (
                    <img
                      src={student.fotoUrl}
                      alt={student.nama}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <svg
                        className="w-4 h-4 text-slate-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                      <span className="text-[5.5px] font-bold text-slate-500 uppercase leading-none mt-0.5">
                        FOTO 3X4
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. Biodata Siswa di Tengah (Pas di tengah-tengah kolom) */}
            <div className="w-full my-auto py-0.5">
              <table className="w-full text-[6.8px] font-medium leading-tight table-fixed">
                <tbody>
                  <tr>
                    <td className="w-[44px] whitespace-nowrap text-black font-semibold py-[0.5px]">
                      Nomor Tes
                    </td>
                    <td className="w-[7px] text-center font-bold">:</td>
                    <td className="font-extrabold text-[7.5px] text-black">
                      {student.nomorTes}
                    </td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap text-black font-semibold py-[0.5px] align-top">
                      Nama
                    </td>
                    <td className="text-center font-bold align-top">:</td>
                    <td className="font-extrabold text-[7px] uppercase text-black break-words leading-tight">
                      {student.nama}
                    </td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap text-black font-semibold py-[0.5px]">
                      Kelas
                    </td>
                    <td className="text-center font-bold">:</td>
                    <td className="font-extrabold text-[7.5px] text-black">
                      {student.kelas}
                    </td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap text-black font-semibold py-[0.5px]">
                      Ruang
                    </td>
                    <td className="text-center font-bold">:</td>
                    <td className="font-extrabold text-[7.5px] text-black">
                      {student.ruang || '-'}
                    </td>
                  </tr>
                  {config.tampilkanPresensi && (
                    <tr>
                      <td className="whitespace-nowrap text-black font-semibold py-[0.5px]">
                        No. Presensi
                      </td>
                      <td className="text-center font-bold">:</td>
                      <td className="font-extrabold text-[7.5px] text-black">
                        {student.presensi || '-'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 3. Tanggal dan Tanda Tangan Dekat Bawah */}
            {config.tampilkanStempel && (
              <div className="w-full flex justify-center flex-shrink-0 my-0.5">
                <StempelTandaTangan
                  titimangsa={config.titimangsa}
                  namaKepsek={config.namaKepsek}
                  nipKepsek={config.nipKepsek}
                  customUrl={config.stempelTtdUrl}
                  compact={true}
                />
              </div>
            )}

            {/* 4. Catatan Perhatian di Paling Bawah */}
            <div className="pt-0.5 border-t border-slate-300 flex-shrink-0">
              <div className="text-[5.8px] font-black uppercase text-black leading-none">
                PERHATIAN :
              </div>
              <div className="text-[5.2px] font-medium leading-tight text-black mt-0.5">
                {config.perhatianText}
              </div>
            </div>
          </div>

          {/* Right Column: Schedule Table - Menyesuaikan / Fit 100% Tinggi Kolom Sisa */}
          <div className="col-span-7 pl-0.5 flex flex-col h-full min-h-0">
            <div className="border border-black overflow-hidden flex-1 flex flex-col h-full">
              {/* Table Header Banner - Rapi 2 Baris */}
              <div className="bg-black text-white font-extrabold text-[6.2px] text-center py-0.5 px-0.5 uppercase tracking-normal leading-tight flex items-center justify-center min-h-[14px] flex-shrink-0">
                <span className="inline-block max-w-full text-center">
                  {config.judulTabelJadwal}
                </span>
              </div>

              {/* Table with Merged Date cells - Full Height to Bottom */}
              <div className="flex-1 w-full flex flex-col min-h-0">
                <table className="w-full h-full border-collapse text-[5.8px] text-black table-fixed">
                  <thead>
                    <tr className="border-b border-black bg-slate-100 text-center font-bold leading-tight flex-shrink-0">
                      <th className="border-r border-black px-0.5 py-[1px] text-center w-[26%] font-extrabold">
                        Tanggal
                      </th>
                      <th className="border-r border-black px-0.5 py-[1px] text-center w-[22%] font-extrabold">
                        Waktu
                      </th>
                      <th className="border-r border-black px-1 py-[1px] text-left w-[38%] font-extrabold">
                        Mata Pelajaran
                      </th>
                      {config.tampilkanTTDPengawas && (
                        <th className="px-0.5 py-[1px] text-center w-[14%] font-extrabold leading-tight">
                          <div>TT</div>
                          <div>Pengawas</div>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="h-full">
                    {groupedSchedule.length > 0 ? (
                      groupedSchedule.map((group, groupIdx) =>
                        group.items.map((item, itemIdx) => {
                          const isFirst = itemIdx === 0;

                          return (
                            <tr
                              key={item.id || `${groupIdx}-${itemIdx}`}
                              className="border-b border-black last:border-b-0 leading-tight"
                            >
                              {/* Merged Tanggal Cell */}
                              {isFirst && (
                                <td
                                  rowSpan={group.items.length}
                                  className="border-r border-black px-0.5 py-[0.5px] font-medium text-[5.6px] leading-tight break-words align-middle text-center bg-white"
                                >
                                  {group.hariTanggal}
                                </td>
                              )}

                              {/* Waktu Cell */}
                              <td className="border-r border-black px-0.5 py-[0.5px] text-center font-mono text-[5.4px] whitespace-nowrap align-middle">
                                {item.waktu}
                              </td>

                              {/* Mata Pelajaran Cell */}
                              <td className="border-r border-black px-1 py-[0.5px] font-semibold text-[5.6px] leading-tight break-words align-middle">
                                {item.mataPelajaran}
                              </td>

                              {/* TT Pengawas Cell */}
                              {config.tampilkanTTDPengawas && (
                                <td className="px-0.5 py-[0.5px] text-center align-middle">
                                  <div className="h-2 w-full"></div>
                                </td>
                              )}
                            </tr>
                          );
                        })
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan={config.tampilkanTTDPengawas ? 4 : 3}
                          className="text-center py-4 text-slate-500 italic align-middle"
                        >
                          Belum ada jadwal ujian.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
