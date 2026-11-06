import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { CardConfig } from '../types';

interface LoginPageProps {
  onLoginSuccess: () => void;
  config: CardConfig;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, config }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Single access credential specified by user:
    // ID = Ervin Sukses
    // Password = SmpWarga2026
    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (cleanUser === 'Ervin Sukses' && cleanPass === 'SmpWarga2026') {
      if (rememberMe) {
        localStorage.setItem('smp_warga_auth_token', 'true');
      } else {
        sessionStorage.setItem('smp_warga_auth_token', 'true');
      }
      onLoginSuccess();
    } else {
      setErrorMessage('ID Pengguna atau Kata Sandi salah. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 flex flex-col justify-between p-4 sm:p-6 text-slate-100">
      <div className="flex-1 flex items-center justify-center py-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-200">
          {/* Header Banner */}
          <div className="bg-slate-950 p-6 text-white text-center relative overflow-hidden border-b-4 border-red-600">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none"></div>

            {/* Application Logo (Official HD Logo) */}
            <div className="flex justify-center mb-3">
              <img
                src={config.appLogoUrl || '/assets/aistudio/Logo_SMP_Warga_HD_Fixed_9bfc1cdc.png'}
                alt="Logo Resmi SMP Warga Surakarta"
                className="w-20 h-20 object-contain drop-shadow-md hover:scale-105 transition-transform"
              />
            </div>

            <h1 className="text-lg font-black tracking-tight text-white uppercase">
              SMP WARGA SURAKARTA
            </h1>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              Portal Akses Cetak Kartu Ujian Semester
            </p>
            <div className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-red-600/30 border border-red-500/50 text-[10.5px] font-semibold text-red-200">
              {config.tahunAjaran}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-6 sm:p-7 space-y-4">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2 animate-in shake">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ID Pengguna
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Masukkan ID Pengguna"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Masukkan Kata Sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500 w-3.5 h-3.5"
                />
                <span>Ingat Saya di Perangkat Ini</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/30 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>Masuk ke Aplikasi</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center">
              <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Akses Terproteksi Khusus Admin & Guru
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Footnote on login page */}
      <footer className="text-center py-3 text-xs text-slate-400 font-medium">
        <p>@ 2026 Guru Informatika - Ervin Yoga Pratama, S.Kom, M.M</p>
      </footer>
    </div>
  );
};
