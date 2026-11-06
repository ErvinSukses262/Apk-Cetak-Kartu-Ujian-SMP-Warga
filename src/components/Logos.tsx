import React from 'react';

export const LogoYayasanPendidikanWarga: React.FC<{ className?: string; customUrl?: string }> = ({
  className = 'h-16 w-auto',
  customUrl,
}) => {
  if (customUrl) {
    return <img src={customUrl} alt="Logo Yayasan Pendidikan Warga" className={`${className} object-contain`} />;
  }

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* High-fidelity vector recreation of Yayasan Pendidikan Warga emblem */}
      <svg viewBox="0 0 160 140" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer wreath & wings */}
        <g stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Left Laurel */}
          <path d="M 45 110 C 20 85 20 50 48 30 C 43 45 42 65 52 82" />
          <path d="M 32 75 C 22 68 24 55 35 52" />
          <path d="M 28 92 C 18 84 21 72 32 70" />
          <path d="M 36 106 C 26 98 28 86 40 85" />

          {/* Right Laurel */}
          <path d="M 115 110 C 140 85 140 50 112 30 C 117 45 118 65 108 82" />
          <path d="M 128 75 C 138 68 136 55 125 52" />
          <path d="M 132 92 C 142 84 139 72 128 70" />
          <path d="M 124 106 C 134 98 132 86 120 85" />
        </g>

        {/* Center Torch & Monument */}
        <path d="M 77 15 L 83 15 L 82 72 L 78 72 Z" fill="#0f172a" />
        {/* Flame on top */}
        <path d="M 80 5 C 75 10 75 14 80 17 C 85 14 85 10 80 5 Z" fill="#dc2626" />
        <path d="M 80 8 C 77 11 77 13 80 15 C 83 13 83 11 80 8 Z" fill="#facc15" />

        {/* Inner concentric rays */}
        <circle cx="80" cy="55" r="24" stroke="#0f172a" strokeWidth="2" strokeDasharray="3 3" />

        {/* Open Book */}
        <path
          d="M 58 75 C 68 70 78 72 80 77 C 82 72 92 70 102 75 L 102 92 C 92 87 82 89 80 94 C 78 89 68 87 58 92 Z"
          fill="#ffffff"
          stroke="#0f172a"
          strokeWidth="2.5"
        />
        <line x1="80" y1="77" x2="80" y2="94" stroke="#0f172a" strokeWidth="2.5" />
        {/* Text lines in book */}
        <line x1="64" y1="81" x2="75" y2="79" stroke="#64748b" strokeWidth="1.2" />
        <line x1="64" y1="86" x2="75" y2="84" stroke="#64748b" strokeWidth="1.2" />
        <line x1="85" y1="79" x2="96" y2="81" stroke="#64748b" strokeWidth="1.2" />
        <line x1="85" y1="84" x2="96" y2="86" stroke="#64748b" strokeWidth="1.2" />

        {/* Banner ribbon at bottom */}
        <path
          d="M 25 118 L 40 110 L 120 110 L 135 118 L 125 128 L 115 122 L 45 122 L 35 128 Z"
          fill="#f8fafc"
          stroke="#0f172a"
          strokeWidth="2"
        />
        <text
          x="80"
          y="120"
          textAnchor="middle"
          fontSize="7.5"
          fontWeight="bold"
          fontFamily="sans-serif"
          fill="#0f172a"
          letterSpacing="0.4"
        >
          YAYASAN PENDIDIKAN WARGA
        </text>
      </svg>
    </div>
  );
};

export const LogoSmpWarga: React.FC<{ className?: string; customUrl?: string }> = ({
  className = 'h-16 w-auto',
  customUrl = '/assets/aistudio/Logo_SMP_Warga_HD_Fixed_9bfc1cdc.png',
}) => {
  return (
    <img
      src={customUrl}
      alt="Logo SMP Warga Surakarta"
      className={`${className} object-contain`}
    />
  );
};

export const StempelTandaTangan: React.FC<{
  titimangsa?: string;
  namaKepsek?: string;
  nipKepsek?: string;
  customUrl?: string;
  className?: string;
  compact?: boolean;
}> = ({
  titimangsa = 'Surakarta, 7 September 2026',
  namaKepsek = 'Budi Prabowo, S.T., S.Kom.',
  nipKepsek = '',
  customUrl,
  className = '',
  compact = false,
}) => {
  if (customUrl) {
    return (
      <div className={`relative flex flex-col items-center ${className}`}>
        <div className={`${compact ? 'text-[8px]' : 'text-[11px]'} font-medium text-black mb-0.5`}>
          {titimangsa}
        </div>
        <img
          src={customUrl}
          alt="Stempel dan Tanda Tangan"
          className={`${compact ? 'h-12' : 'h-24'} w-auto object-contain`}
        />
        <div className={`${compact ? 'text-[9px]' : 'text-[12px]'} font-bold text-black underline mt-0.5`}>
          {namaKepsek}
        </div>
        {nipKepsek && (
          <div className={`${compact ? 'text-[7.5px]' : 'text-[10px]'} text-black`}>
            NIP. {nipKepsek}
          </div>
        )}
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`relative flex flex-col items-center select-none ${className}`}>
        <div className="text-[8px] font-semibold text-black self-center tracking-tight leading-none mb-0.5">
          {titimangsa}
        </div>

        <div className="relative w-28 h-9 max-w-full flex items-center justify-center my-0.5 overflow-visible">
          {/* Stamp compact */}
          <div className="absolute left-0 w-[40px] h-[40px] rounded-full border-[1.5px] border-[#224193] border-dashed p-[1px] opacity-90 rotate-[-8deg] pointer-events-none">
            <div className="w-full h-full rounded-full border-[1.2px] border-[#224193] flex flex-col items-center justify-between p-0.5 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path id="textPathUpperCompact" d="M 12,50 A 38,38 0 1,1 88,50" fill="none" />
                <path id="textPathLowerCompact" d="M 88,50 A 38,38 0 0,1 12,50" fill="none" />
                <text fill="#224193" fontSize="8.2" fontWeight="bold">
                  <textPath href="#textPathUpperCompact" startOffset="50%" textAnchor="middle">
                    YAYASAN PENDIDIKAN WARGA
                  </textPath>
                </text>
                <text fill="#224193" fontSize="8.5" fontWeight="bold">
                  <textPath href="#textPathLowerCompact" startOffset="50%" textAnchor="middle">
                    ★ KOTA SURAKARTA ★
                  </textPath>
                </text>
                <rect x="20" y="40" width="60" height="20" rx="2" fill="none" stroke="#224193" strokeWidth="1" />
                <text x="50" y="50" fill="#224193" fontSize="6.8" fontWeight="900" textAnchor="middle" dominantBaseline="central">
                  SMP WARGA
                </text>
                <text x="50" y="56" fill="#224193" fontSize="5.2" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
                  SURAKARTA
                </text>
              </svg>
            </div>
          </div>

          {/* Signature compact */}
          <svg
            viewBox="0 0 150 70"
            className="absolute right-0 w-22 h-9 pointer-events-none transform -rotate-2"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 15 50 C 25 35, 30 18, 42 12 C 48 8, 52 24, 46 54 C 42 62, 38 68, 55 58 C 72 48, 90 32, 108 42 C 118 48, 114 62, 98 64 C 82 66, 68 56, 75 42 C 82 28, 102 38, 120 46 C 132 52, 142 54, 148 52"
              stroke="#1d4ed8"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M 50 48 L 92 48" stroke="#1d4ed8" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="106" cy="46" r="1.8" fill="#1d4ed8" />
          </svg>
        </div>

        <div className="text-[8px] font-bold text-black underline tracking-tight leading-none text-center">
          {namaKepsek}
        </div>
        {nipKepsek ? (
          <div className="text-[6.8px] text-black leading-none mt-0.5 text-center">NIP. {nipKepsek}</div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      <div className="text-[11px] font-semibold text-black mb-1 self-center tracking-tight">
        {titimangsa}
      </div>

      <div className="relative w-48 h-20 flex items-center justify-center my-0.5">
        {/* Realistic Official School Stamp in Purple/Blue (#224193) */}
        <div className="absolute left-3 w-[78px] h-[78px] rounded-full border-[2.2px] border-[#224193] border-dashed p-[2px] opacity-90 rotate-[-8deg] pointer-events-none">
          <div className="w-full h-full rounded-full border-[1.8px] border-[#224193] flex flex-col items-center justify-between p-1 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path
                id="textPathUpper"
                d="M 12,50 A 38,38 0 1,1 88,50"
                fill="none"
              />
              <path
                id="textPathLower"
                d="M 88,50 A 38,38 0 0,1 12,50"
                fill="none"
              />
              <text fill="#224193" fontSize="8.2" fontWeight="bold" letterSpacing="0.8">
                <textPath href="#textPathUpper" startOffset="50%" textAnchor="middle">
                  YAYASAN PENDIDIKAN WARGA
                </textPath>
              </text>
              <text fill="#224193" fontSize="8.5" fontWeight="bold" letterSpacing="1.2">
                <textPath href="#textPathLower" startOffset="50%" textAnchor="middle">
                  ★ KOTA SURAKARTA ★
                </textPath>
              </text>
              {/* Inner box or star */}
              <rect x="20" y="40" width="60" height="20" rx="3" fill="none" stroke="#224193" strokeWidth="1.2" />
              <text
                x="50"
                y="50"
                fill="#224193"
                fontSize="6.8"
                fontWeight="900"
                textAnchor="middle"
                dominantBaseline="central"
              >
                SMP WARGA
              </text>
              <text
                x="50"
                y="56"
                fill="#224193"
                fontSize="5.2"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="central"
              >
                SURAKARTA
              </text>
            </svg>
          </div>
        </div>

        {/* Dynamic Blue Ink Signature overlay (#0f52ba) */}
        <svg
          viewBox="0 0 150 70"
          className="absolute right-2 w-36 h-18 pointer-events-none transform -rotate-2"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Authentic signature curve resembling Budi Prabowo */}
          <path
            d="M 15 50 C 25 35, 30 18, 42 12 C 48 8, 52 24, 46 54 C 42 62, 38 68, 55 58 C 72 48, 90 32, 108 42 C 118 48, 114 62, 98 64 C 82 66, 68 56, 75 42 C 82 28, 102 38, 120 46 C 132 52, 142 54, 148 52"
            stroke="#1d4ed8"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 50 48 L 92 48"
            stroke="#1d4ed8"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <circle cx="106" cy="46" r="1.8" fill="#1d4ed8" />
        </svg>
      </div>

      <div className="text-[12px] font-bold text-black underline tracking-tight mt-0.5">
        {namaKepsek}
      </div>
      {nipKepsek ? (
        <div className="text-[10px] text-black">NIP. {nipKepsek}</div>
      ) : null}
    </div>
  );
};
