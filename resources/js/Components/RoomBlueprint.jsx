import React, { useState } from 'react';

/**
 * Interactive Architectural Room Blueprint & FOV Simulator Component
 * Renders technical floor plan with dynamic camera angle, mic radius, and seating topology
 */
export default function RoomBlueprint({ solution }) {
  const [activeLayer, setActiveLayer] = useState('all'); // 'all' | 'fov' | 'audio'
  const [hoveredNode, setHoveredNode] = useState(null);

  const { id, title, dimension, area, cameraPlacement, micRange, tableDistance } = solution;

  return (
    <div className="relative w-full rounded-2xl bg-[#07131F] border border-[#1B3752] overflow-hidden text-white p-4 sm:p-6 select-none shadow-2xl">
      {/* Blueprint Header & HUD Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1B3752] text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[#8FCDFF] font-bold tracking-wider">// DENAH TEKNIKAL: {title.toUpperCase()}</span>
          <span className="text-[#58677E]">| {dimension} ({area})</span>
        </div>
        
        {/* Layer Filters */}
        <div className="flex items-center gap-1.5 bg-[#0B1F33] p-1 rounded-lg border border-[#1B3752] text-[11px]">
          <button
            type="button"
            onClick={() => setActiveLayer('all')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeLayer === 'all' ? 'bg-primary text-white font-bold' : 'text-[#8FCDFF] hover:text-white'
            }`}
          >
            Semua Lapisan
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('fov')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeLayer === 'fov' ? 'bg-primary text-white font-bold' : 'text-[#8FCDFF] hover:text-white'
            }`}
          >
            Lensa Kamera (FOV)
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('audio')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeLayer === 'audio' ? 'bg-primary text-white font-bold' : 'text-[#8FCDFF] hover:text-white'
            }`}
          >
            Jangkauan Mic
          </button>
        </div>
      </div>

      {/* SVG Technical Blueprint Canvas */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] my-4 flex items-center justify-center">
        {/* Reticle Corner Marks */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary pointer-events-none" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary pointer-events-none" />

        <svg viewBox="0 0 600 360" className="w-full h-full">
          <defs>
            {/* Grid Pattern */}
            <pattern id="blueprint-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#162D42" strokeWidth="0.75" />
            </pattern>

            {/* Camera FOV Gradients */}
            <radialGradient id="fov-gradient-huddle" cx="50%" cy="0%" r="90%">
              <stop offset="0%" stopColor="#0094DA" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#0094DA" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0094DA" stopOpacity="0.0" />
            </radialGradient>

            <radialGradient id="fov-gradient-ptz" cx="50%" cy="0%" r="95%">
              <stop offset="0%" stopColor="#0094DA" stopOpacity="0.5" />
              <stop offset="70%" stopColor="#0094DA" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#0094DA" stopOpacity="0.0" />
            </radialGradient>

            {/* Audio Wave Gradient */}
            <radialGradient id="audio-wave-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E52421" stopOpacity="0.0" />
              <stop offset="70%" stopColor="#E52421" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#E52421" stopOpacity="0.25" />
            </radialGradient>
          </defs>

          {/* Grid Background */}
          <rect width="600" height="360" fill="url(#blueprint-grid)" />

          {/* Room Outer Boundary Walls */}
          <rect x="30" y="20" width="540" height="320" rx="8" fill="none" stroke="#2B4C6F" strokeWidth="2" strokeDasharray="8 4" />

          {/* Dimension Indicator Labels */}
          <text x="300" y="14" fill="#6582A0" fontSize="10" fontFamily="monospace" textAnchor="middle">
            LEBAR RUANG: {dimension.split('×')[0]?.trim() || '5m'}
          </text>
          <text x="14" y="180" fill="#6582A0" fontSize="10" fontFamily="monospace" textAnchor="middle" transform="rotate(-90 14 180)">
            PANJANG: {dimension.split('×')[1]?.trim() || '7m'}
          </text>

          {/* 1. FRONT WALL & DISPLAY UNIT */}
          <g
            className="cursor-pointer"
            onMouseEnter={() => setHoveredNode({ title: 'Front Display Monitor', desc: 'Display 65"–85" 4K HDR dipasang di ketinggian tengah 1.4m dari lantai untuk eye-level sejajar peserta.' })}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* TV Frame */}
            <rect x="210" y="22" width="180" height="10" rx="2" fill="#0E2841" stroke="#0094DA" strokeWidth="1.5" />
            <text x="300" y="30" fill="#8FCDFF" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              DISPLAY MONITOR 4K
            </text>
          </g>

          {/* 2. CAMERA POSITION & OPTICAL CONE */}
          {(activeLayer === 'all' || activeLayer === 'fov') && (
            <g>
              {/* FOV Cone dependent on room type */}
              {id === 'huddle' && (
                /* 120 Ultra Wide FOV Triangle */
                <polygon points="300,32 50,280 550,280" fill="url(#fov-gradient-huddle)" />
              )}

              {id === 'medium' && (
                /* Dual Lens PTZ 85° + 95° Panorama */
                <polygon points="300,32 110,320 490,320" fill="url(#fov-gradient-ptz)" />
              )}

              {id === 'boardroom' && (
                /* Boardroom 86° with active radar tracking beam */
                <polygon points="300,32 130,330 470,330" fill="url(#fov-gradient-ptz)" />
              )}

              {id === 'classroom' && (
                /* Classroom 90° Stage & Zone Tracking */
                <polygon points="300,32 120,320 480,320" fill="url(#fov-gradient-ptz)" />
              )}

              {/* FOV Angle Arc Line */}
              <path d="M 230 110 A 100 100 0 0 1 370 110" fill="none" stroke="#0094DA" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
              <text x="300" y="105" fill="#0094DA" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                FOV SUDUT KAMERA {solution.cameraFov}°
              </text>
            </g>
          )}

          {/* 3. AUDIO COVERAGE RADIUS (IF ACTIVE) */}
          {(activeLayer === 'all' || activeLayer === 'audio') && (
            <g>
              {/* Audio concentric wave circles */}
              <circle cx="300" cy="180" r="110" fill="url(#audio-wave-gradient)" stroke="#E52421" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
              <circle cx="300" cy="180" r="60" fill="none" stroke="#E52421" strokeWidth="0.8" opacity="0.4" />
              <text x="300" y="76" fill="#FF8D8A" fontSize="8" fontFamily="monospace" textAnchor="middle">
                RADIAL TANGKAPAN AUDIO: {micRange}
              </text>
            </g>
          )}

          {/* 4. CAMERA HARDWARE NODE (INTERACTIVE PIN) */}
          <g
            className="cursor-pointer"
            onMouseEnter={() => setHoveredNode({ title: 'Kamera AVer', desc: `${solution.recommended} — Penempatan: ${cameraPlacement}. Jarak ideal ke meja: ${tableDistance}.` })}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Camera mount base */}
            <circle cx="300" cy="34" r="10" fill="#0B1F33" stroke="#0094DA" strokeWidth="2" />
            <circle cx="300" cy="34" r="5" fill="#E52421" className="animate-pulse" />
            <circle cx="300" cy="34" r="14" fill="none" stroke="#0094DA" strokeWidth="0.75" strokeDasharray="2 2" />
            <text x="300" y="56" fill="#8FCDFF" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              [KAMERA AVER]
            </text>
          </g>

          {/* 5. CONFERENCE TABLE & CHAIRS (DYNAMIC PER ROOM TYPE) */}
          {id === 'huddle' && (
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode({ title: 'Meja Rapat Huddle', desc: 'Meja semi-lingkaran atau persegi ringkas jarak 1.2m dari layar. Semua 2–6 peserta masuk frame tanpa terpotong.' })}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Table */}
              <rect x="230" y="140" width="140" height="90" rx="20" fill="#112940" stroke="#37628B" strokeWidth="1.5" />
              <text x="300" y="190" fill="#9FC6E8" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                Meja Huddle (2–6 P)
              </text>
              {/* Chairs */}
              <circle cx="210" cy="165" r="9" fill="#1E3E5E" stroke="#5283B0" />
              <circle cx="210" cy="205" r="9" fill="#1E3E5E" stroke="#5283B0" />
              <circle cx="390" cy="165" r="9" fill="#1E3E5E" stroke="#5283B0" />
              <circle cx="390" cy="205" r="9" fill="#1E3E5E" stroke="#5283B0" />
              <circle cx="300" cy="250" r="9" fill="#1E3E5E" stroke="#5283B0" />
            </g>
          )}

          {id === 'medium' && (
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode({ title: 'Meja Rapat Sedang (6–12 Orang)', desc: 'Meja konferensi oval 4 meter. Dilengkapi mikrofon ekspansi di tengah meja untuk eliminasi gema kaca.' })}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Table */}
              <rect x="200" y="130" width="200" height="120" rx="30" fill="#112940" stroke="#37628B" strokeWidth="1.5" />
              <text x="300" y="195" fill="#9FC6E8" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                Meja Oval 6–12 Peserta
              </text>
              {/* Mic Expansion Pods on Table */}
              <circle cx="250" cy="190" r="6" fill="#0094DA" />
              <circle cx="350" cy="190" r="6" fill="#0094DA" />
              {/* Chairs around */}
              {[-60, -20, 20, 60].map((offset, i) => (
                <React.Fragment key={i}>
                  <circle cx={300 + offset} cy="115" r="8" fill="#1E3E5E" stroke="#5283B0" />
                  <circle cx={300 + offset} cy="265" r="8" fill="#1E3E5E" stroke="#5283B0" />
                </React.Fragment>
              ))}
              <circle cx="180" cy="190" r="8" fill="#1E3E5E" stroke="#5283B0" />
              <circle cx="420" cy="190" r="8" fill="#1E3E5E" stroke="#5283B0" />
            </g>
          )}

          {id === 'boardroom' && (
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode({ title: 'Executive Boardroom Table (12–25 P)', desc: 'Meja U-shape atau oval panjang. Audio tracking AVer CAM570 otomatis mengarahkan PTZ optik ke pembicara aktif.' })}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* U-Shape / Executive Boat Table */}
              <path d="M 180 130 L 420 130 L 420 280 L 370 280 L 370 170 L 230 170 L 230 280 L 180 280 Z" fill="#112940" stroke="#37628B" strokeWidth="1.5" />
              <text x="300" y="155" fill="#9FC6E8" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                Executive Boardroom (12–25 P)
              </text>
              {/* Ceiling Array Indicator */}
              <rect x="280" y="210" width="40" height="40" rx="4" fill="none" stroke="#E52421" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="300" y="235" fill="#FF8D8A" fontSize="7" fontFamily="monospace" textAnchor="middle">
                CEILING MIC
              </text>
              {/* Chairs */}
              {[200, 240, 280, 320, 360, 400].map((x, i) => (
                <circle key={`top-${i}`} cx={x} cy="115" r="7" fill="#1E3E5E" stroke="#5283B0" />
              ))}
              {[190, 230, 270].map((y, i) => (
                <circle key={`left-${i}`} cx="165" cy={y} r="7" fill="#1E3E5E" stroke="#5283B0" />
              ))}
              {[190, 230, 270].map((y, i) => (
                <circle key={`right-${i}`} cx="435" cy={y} r="7" fill="#1E3E5E" stroke="#5283B0" />
              ))}
            </g>
          )}

          {id === 'classroom' && (
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode({ title: 'Stage & Whiteboard Tracking Zone', desc: 'Area mimbar dan papan tulis 8 meter. AI Auto Tracking mengunci presenter secara otomatis tanpa lanyard sensor.' })}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Stage Podium & Whiteboard */}
              <rect x="150" y="60" width="300" height="40" rx="4" fill="#0D2C4D" stroke="#0094DA" strokeWidth="1.5" strokeDasharray="4 2" />
              <text x="300" y="84" fill="#8FCDFF" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                ZONA PENGAJAR & PAPAN TULIS (TRACKING AREA)
              </text>
              {/* Podium */}
              <rect x="180" y="110" width="40" height="25" rx="3" fill="#1E3E5E" stroke="#5283B0" />
              <text x="200" y="126" fill="#FFFFFF" fontSize="8" fontFamily="sans-serif" textAnchor="middle">MIMBAR</text>
              {/* Classroom Seating Rows */}
              {[160, 210, 260].map((y, rowIdx) => (
                <g key={`row-${rowIdx}`}>
                  <rect x="160" y={y} width="280" height="15" rx="2" fill="#112940" stroke="#2D547A" />
                  {[180, 220, 260, 300, 340, 380, 420].map((cx, seatIdx) => (
                    <circle key={`seat-${rowIdx}-${seatIdx}`} cx={cx} cy={y + 24} r="6" fill="#1E3E5E" stroke="#5283B0" />
                  ))}
                </g>
              ))}
            </g>
          )}
        </svg>
      </div>

      {/* Interactive Tooltip & Telemetry Bar */}
      <div className="min-h-[50px] p-3 rounded-xl bg-[#0B1F33] border border-[#1B3752] flex items-center justify-between gap-4">
        {hoveredNode ? (
          <div className="flex items-center gap-2 animate-in fade-in">
            <span className="material-symbols-outlined text-primary text-lg">info</span>
            <div className="text-xs">
              <span className="font-bold text-white block">{hoveredNode.title}</span>
              <span className="text-[#8FCDFF]">{hoveredNode.desc}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-[#6582A0]">
            <span className="material-symbols-outlined text-sm">touch_app</span>
            <span>Arahkan kursor atau klik pada elemen denah (Kamera, Display, Meja) untuk melihat rekomendasi penataan optik & akustik.</span>
          </div>
        )}

        <div className="hidden sm:flex items-center gap-3 font-mono text-[11px] text-[#8FCDFF] shrink-0">
          <span>JARAK MEJA: <b className="text-white">{tableDistance}</b></span>
          <span>•</span>
          <span>AUDIO RANGE: <b className="text-[#FF8D8A]">{micRange}</b></span>
        </div>
      </div>
    </div>
  );
}
