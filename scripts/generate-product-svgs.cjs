const fs = require('fs');
const path = require('path');

const outDir = path.resolve('public/assets/products');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const svgs = {};

// 1. DS-1H18S/E(C) Video Balun
svgs['balun-ds-1h18s.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <radialGradient id="balunBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </radialGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.16"/>
    </filter>
    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="bncGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#e2e8f0"/>
      <stop offset="50%" stop-color="#94a3b8"/>
      <stop offset="100%" stop-color="#475569"/>
    </linearGradient>
    <linearGradient id="goldPin" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="100%" stop-color="#ca8a04"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#balunBg)"/>
  
  <g filter="url(#shadow)" transform="translate(60, 100)">
    <!-- Cable loop -->
    <path d="M 220,180 C 290,140 380,180 400,240 C 420,300 360,370 280,360 C 210,350 200,310 240,280" 
          fill="none" stroke="#1e293b" stroke-width="18" stroke-linecap="round"/>
    
    <!-- Main Balun Body 1 -->
    <g transform="translate(50, 140)">
      <rect x="0" y="0" width="130" height="180" rx="14" fill="url(#bodyGrad)"/>
      <rect x="20" y="15" width="40" height="40" rx="6" fill="#f97316"/>
      <rect x="70" y="15" width="40" height="40" rx="6" fill="#64748b"/>
      <circle cx="40" cy="35" r="5" fill="#c2410c"/>
      <circle cx="90" cy="35" r="5" fill="#334155"/>
      <text x="35" y="75" font-family="monospace" font-size="14" font-weight="bold" fill="#fb923c">+</text>
      <text x="85" y="75" font-family="monospace" font-size="14" font-weight="bold" fill="#94a3b8">-</text>
      <rect x="15" y="90" width="100" height="65" rx="6" fill="#1e293b" stroke="#334155" stroke-width="2"/>
      <text x="25" y="112" font-family="sans-serif" font-size="10" font-weight="900" fill="#ffffff" letter-spacing="1">HIKVISION</text>
      <text x="25" y="128" font-family="sans-serif" font-size="9" font-weight="bold" fill="#ef4444">DS-1H18S/E(C)</text>
      <text x="25" y="144" font-family="sans-serif" font-size="8" fill="#94a3b8">HD-TVI / AHD / CVI</text>
      <line x1="0" y1="168" x2="130" y2="168" stroke="#0f172a" stroke-width="3"/>
    </g>

    <!-- Balun Body 2 -->
    <g transform="translate(190, 70)">
      <rect x="0" y="0" width="120" height="160" rx="12" fill="url(#bodyGrad)"/>
      <rect x="18" y="12" width="36" height="36" rx="6" fill="#f97316"/>
      <rect x="64" y="12" width="36" height="36" rx="6" fill="#64748b"/>
      <text x="32" y="68" font-family="monospace" font-size="12" font-weight="bold" fill="#fb923c">+</text>
      <text x="78" y="68" font-family="monospace" font-size="12" font-weight="bold" fill="#94a3b8">-</text>
      <rect x="14" y="80" width="92" height="55" rx="5" fill="#1e293b"/>
      <text x="22" y="100" font-family="sans-serif" font-size="9" font-weight="bold" fill="#ffffff">VIDEO BALUN</text>
      <text x="22" y="115" font-family="sans-serif" font-size="8" fill="#ef4444">PASSIVE HD</text>
    </g>

    <!-- BNC Connector -->
    <g transform="translate(340, 260) rotate(-35)">
      <path d="M 0,15 L 25,12 L 25,38 L 0,35 Z" fill="#1e293b"/>
      <rect x="25" y="5" width="45" height="40" rx="4" fill="url(#bncGrad)"/>
      <line x1="32" y1="5" x2="32" y2="45" stroke="#334155" stroke-width="2"/>
      <line x1="42" y1="5" x2="42" y2="45" stroke="#334155" stroke-width="2"/>
      <line x1="52" y1="5" x2="52" y2="45" stroke="#334155" stroke-width="2"/>
      <line x1="62" y1="5" x2="62" y2="45" stroke="#334155" stroke-width="2"/>
      <rect x="70" y="8" width="28" height="34" rx="3" fill="url(#bncGrad)"/>
      <rect x="80" y="12" width="6" height="12" rx="2" fill="#1e293b"/>
      <rect x="98" y="21" width="16" height="8" rx="2" fill="url(#goldPin)"/>
    </g>
  </g>
</svg>`;

// 2. 12V 1.5A EU Power Adapter (DSA-12PFG-12 FEU)
svgs['power-adapter-12v.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <radialGradient id="adapterBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </radialGradient>
    <filter id="adShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#000000" flood-opacity="0.18"/>
    </filter>
    <linearGradient id="adapterBody" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="prongGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#cbd5e1"/>
      <stop offset="50%" stop-color="#94a3b8"/>
      <stop offset="100%" stop-color="#475569"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#adapterBg)"/>
  
  <g filter="url(#adShadow)" transform="translate(100, 100)">
    <path d="M 170,260 C 140,310 110,380 180,410 C 260,440 330,370 290,320 C 250,280 200,320 220,370 C 240,400 300,410 330,360 C 350,330 360,280 400,290" 
          fill="none" stroke="#1e293b" stroke-width="12" stroke-linecap="round"/>
    
    <rect x="90" y="70" width="160" height="200" rx="18" fill="url(#adapterBody)"/>
    <rect x="85" y="110" width="8" height="50" rx="4" fill="#0f172a"/>
    <rect x="85" y="170" width="8" height="50" rx="4" fill="#0f172a"/>
    <rect x="247" y="110" width="8" height="50" rx="4" fill="#0f172a"/>
    <rect x="247" y="170" width="8" height="50" rx="4" fill="#0f172a"/>
    
    <rect x="20" y="120" width="70" height="18" rx="4" fill="url(#prongGrad)"/>
    <rect x="20" y="180" width="70" height="18" rx="4" fill="url(#prongGrad)"/>
    <circle cx="28" cy="129" r="4" fill="#64748b"/>
    <circle cx="28" cy="189" r="4" fill="#64748b"/>
    <rect x="70" y="116" width="22" height="26" rx="3" fill="#1e293b"/>
    <rect x="70" y="176" width="22" height="26" rx="3" fill="#1e293b"/>

    <rect x="105" y="90" width="130" height="120" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    <text x="120" y="115" font-family="sans-serif" font-size="11" font-weight="900" fill="#ffffff" letter-spacing="1">HIKVISION</text>
    <text x="120" y="133" font-family="sans-serif" font-size="9" font-weight="bold" fill="#ef4444">SWITCHING ADAPTER</text>
    <text x="120" y="150" font-family="monospace" font-size="8" fill="#94a3b8">MODEL: DSA-12PFG-12</text>
    <text x="120" y="165" font-family="monospace" font-size="8" fill="#cbd5e1">INPUT: 100-240V~ 50/60Hz</text>
    <text x="120" y="180" font-family="monospace" font-size="9" font-weight="bold" fill="#22c55e">OUTPUT: 12V ⎓ 1.5A</text>
    <text x="120" y="195" font-family="sans-serif" font-size="8" fill="#64748b">CCTV GRADE · CE · EAC</text>

    <circle cx="170" cy="235" r="5" fill="#22c55e"/>
    <circle cx="170" cy="235" r="9" fill="none" stroke="#22c55e" stroke-width="1.5" opacity="0.4"/>

    <path d="M 160,270 L 180,270 L 175,295 L 165,295 Z" fill="#1e293b"/>

    <g transform="translate(400, 280) rotate(-20)">
      <rect x="0" y="0" width="35" height="18" rx="4" fill="#0f172a"/>
      <rect x="35" y="3" width="26" height="12" rx="2" fill="url(#prongGrad)"/>
      <circle cx="58" cy="9" r="3" fill="#0f172a"/>
      <rect x="35" y="3" width="5" height="12" fill="#eab308"/>
    </g>
  </g>
</svg>`;

// 3. Junction Box DS-1280ZJ
svgs['junction-box-ds-1280zj.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <radialGradient id="boxBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </radialGradient>
    <filter id="boxShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.14"/>
    </filter>
    <linearGradient id="bodyWhite" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="60%" stop-color="#f1f5f9"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
    <linearGradient id="lipMetal" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#e2e8f0"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#boxBg)"/>
  
  <g filter="url(#boxShadow)" transform="translate(300, 300)">
    <path d="M 140,-25 L 210,-18 L 210,18 L 140,25 Z" fill="url(#lipMetal)" stroke="#94a3b8" stroke-width="2"/>
    <rect x="210" y="-22" width="24" height="44" rx="4" fill="#cbd5e1" stroke="#64748b" stroke-width="2"/>
    <circle cx="234" cy="0" r="12" fill="#334155"/>

    <circle cx="0" cy="0" r="175" fill="url(#lipMetal)" stroke="#cbd5e1" stroke-width="4"/>
    <circle cx="0" cy="0" r="155" fill="url(#bodyWhite)" stroke="#94a3b8" stroke-width="3"/>
    
    <circle cx="0" cy="0" r="125" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <circle cx="0" cy="0" r="95" fill="url(#bodyWhite)" stroke="#cbd5e1" stroke-width="2"/>
    
    <circle cx="0" cy="0" r="45" fill="#1e293b" stroke="#0f172a" stroke-width="4"/>
    <circle cx="0" cy="0" r="30" fill="#020617"/>
    <circle cx="0" cy="0" r="16" fill="#334155"/>

    <circle cx="0" cy="-138" r="7" fill="#64748b" stroke="#334155" stroke-width="2"/>
    <circle cx="0" cy="138" r="7" fill="#64748b" stroke="#334155" stroke-width="2"/>
    <circle cx="-138" cy="0" r="7" fill="#64748b" stroke="#334155" stroke-width="2"/>
    <circle cx="138" cy="0" r="7" fill="#64748b" stroke="#334155" stroke-width="2"/>
    <circle cx="-97" cy="-97" r="6" fill="#94a3b8" stroke="#475569" stroke-width="2"/>
    <circle cx="97" cy="-97" r="6" fill="#94a3b8" stroke="#475569" stroke-width="2"/>
    <circle cx="-97" cy="97" r="6" fill="#94a3b8" stroke="#475569" stroke-width="2"/>
    <circle cx="97" cy="97" r="6" fill="#94a3b8" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="-75" r="5" fill="#64748b"/>
    <circle cx="-65" cy="38" r="5" fill="#64748b"/>
    <circle cx="65" cy="38" r="5" fill="#64748b"/>

    <text x="0" y="-105" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="900" fill="#94a3b8" letter-spacing="2">HIKVISION</text>
    <text x="0" y="115" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="bold" fill="#64748b">DS-1280ZJ · IP66 ALUMINUM</text>
  </g>
</svg>`;

// 4. RJ45 Modular Connector (DS-1T04/E)
svgs['rj45-connector-ds-1t04.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <radialGradient id="rjBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </radialGradient>
    <filter id="rjShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="22" flood-color="#000000" flood-opacity="0.16"/>
    </filter>
    <linearGradient id="polyGlass" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="40%" stop-color="#e0f2fe" stop-opacity="0.75"/>
      <stop offset="100%" stop-color="#93c5fd" stop-opacity="0.6"/>
    </linearGradient>
    <linearGradient id="goldPin" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#rjBg)"/>

  <g filter="url(#rjShadow)" transform="translate(140, 160) rotate(-22)">
    <path d="M 60,60 L 220,10 L 250,22 L 90,80 Z" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/>
    <polygon points="210,12 245,22 235,45" fill="#38bdf8"/>

    <rect x="50" y="70" width="220" height="140" rx="14" fill="url(#polyGlass)" stroke="#38bdf8" stroke-width="3"/>
    
    <g transform="translate(70, 90)">
      <line x1="0" y1="10" x2="120" y2="10" stroke="#f97316" stroke-width="4" opacity="0.85"/>
      <line x1="0" y1="22" x2="120" y2="22" stroke="#ea580c" stroke-width="4" stroke-dasharray="6,4" opacity="0.85"/>
      <line x1="0" y1="34" x2="120" y2="34" stroke="#22c55e" stroke-width="4" opacity="0.85"/>
      <line x1="0" y1="46" x2="120" y2="46" stroke="#3b82f6" stroke-width="4" opacity="0.85"/>
      <line x1="0" y1="58" x2="120" y2="58" stroke="#2563eb" stroke-width="4" stroke-dasharray="6,4" opacity="0.85"/>
      <line x1="0" y1="70" x2="120" y2="70" stroke="#16a34a" stroke-width="4" stroke-dasharray="6,4" opacity="0.85"/>
      <line x1="0" y1="82" x2="120" y2="82" stroke="#92400e" stroke-width="4" opacity="0.85"/>
      <line x1="0" y1="94" x2="120" y2="94" stroke="#b45309" stroke-width="4" stroke-dasharray="6,4" opacity="0.85"/>
    </g>

    <g transform="translate(230, 85)">
      <rect x="0" y="0" width="35" height="110" rx="4" fill="#0284c7" opacity="0.2"/>
      <rect x="5" y="4" width="25" height="8" rx="2" fill="url(#goldPin)"/>
      <rect x="5" y="17" width="25" height="8" rx="2" fill="url(#goldPin)"/>
      <rect x="5" y="30" width="25" height="8" rx="2" fill="url(#goldPin)"/>
      <rect x="5" y="43" width="25" height="8" rx="2" fill="url(#goldPin)"/>
      <rect x="5" y="56" width="25" height="8" rx="2" fill="url(#goldPin)"/>
      <rect x="5" y="69" width="25" height="8" rx="2" fill="url(#goldPin)"/>
      <rect x="5" y="82" width="25" height="8" rx="2" fill="url(#goldPin)"/>
      <rect x="5" y="95" width="25" height="8" rx="2" fill="url(#goldPin)"/>
    </g>

    <rect x="25" y="85" width="25" height="110" rx="4" fill="#64748b" opacity="0.3"/>

    <g transform="translate(-40, 160)">
      <rect x="0" y="0" width="70" height="40" rx="6" fill="url(#polyGlass)" stroke="#38bdf8" stroke-width="2"/>
      <line x1="10" y1="12" x2="60" y2="12" stroke="#0284c7" stroke-width="2"/>
      <line x1="10" y1="20" x2="60" y2="20" stroke="#0284c7" stroke-width="2"/>
      <line x1="10" y1="28" x2="60" y2="28" stroke="#0284c7" stroke-width="2"/>
    </g>
  </g>
</svg>`;

// 5. AX PRO Wireless Security Kit (DS-PWA64-Kit-WB)
svgs['alarm-kit-axpro.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <radialGradient id="kitBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </radialGradient>
    <filter id="kitShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="22" flood-color="#000000" flood-opacity="0.14"/>
    </filter>
    <linearGradient id="panelWhite" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="80%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#kitBg)"/>

  <g filter="url(#kitShadow)">
    <g transform="translate(90, 110)">
      <rect x="0" y="0" width="280" height="280" rx="36" fill="url(#panelWhite)" stroke="#e2e8f0" stroke-width="4"/>
      <rect x="8" y="8" width="264" height="264" rx="30" fill="none" stroke="#f1f5f9" stroke-width="2"/>
      <text x="140" y="90" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="900" fill="#0f172a" letter-spacing="3">HIKVISION</text>
      <text x="140" y="112" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="900" fill="#D71920" letter-spacing="2">AX PRO WIRELESS</text>
      
      <g transform="translate(60, 200)">
        <circle cx="20" cy="0" r="4.5" fill="#22c55e"/>
        <circle cx="60" cy="0" r="4.5" fill="#22c55e"/>
        <circle cx="100" cy="0" r="4.5" fill="#D71920"/>
        <circle cx="140" cy="0" r="4.5" fill="#f59e0b"/>
      </g>
      <circle cx="130" cy="235" r="2" fill="#cbd5e1"/>
      <circle cx="140" cy="235" r="2" fill="#cbd5e1"/>
      <circle cx="150" cy="235" r="2" fill="#cbd5e1"/>
    </g>

    <g transform="translate(390, 130)">
      <rect x="0" y="0" width="110" height="175" rx="22" fill="url(#panelWhite)" stroke="#e2e8f0" stroke-width="3"/>
      <path d="M 22,40 Q 55,25 88,40 L 82,100 Q 55,108 28,100 Z" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/>
      <line x1="38" y1="45" x2="42" y2="95" stroke="#e2e8f0" stroke-width="1.5"/>
      <line x1="55" y1="35" x2="55" y2="102" stroke="#e2e8f0" stroke-width="1.5"/>
      <line x1="72" y1="45" x2="68" y2="95" stroke="#e2e8f0" stroke-width="1.5"/>
      <circle cx="55" cy="130" r="3" fill="#3b82f6"/>
      <text x="55" y="155" text-anchor="middle" font-family="sans-serif" font-size="8" font-weight="900" fill="#94a3b8">HIKVISION</text>
    </g>

    <g transform="translate(390, 330)">
      <rect x="0" y="0" width="34" height="120" rx="10" fill="url(#panelWhite)" stroke="#e2e8f0" stroke-width="2"/>
      <circle cx="17" cy="30" r="2.5" fill="#22c55e"/>
      <text x="17" y="105" text-anchor="middle" font-family="sans-serif" font-size="6" font-weight="900" fill="#94a3b8">HIK</text>
      <rect x="42" y="15" width="20" height="90" rx="8" fill="url(#panelWhite)" stroke="#e2e8f0" stroke-width="2"/>
    </g>

    <g transform="translate(465, 330)">
      <rect x="0" y="0" width="60" height="110" rx="18" fill="#1e293b" stroke="#334155" stroke-width="2"/>
      <circle cx="30" cy="10" r="4" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
      <circle cx="20" cy="40" r="8" fill="#334155"/>
      <circle cx="40" cy="40" r="8" fill="#334155"/>
      <circle cx="20" cy="65" r="8" fill="#334155"/>
      <circle cx="40" cy="65" r="8" fill="#D71920"/>
      <circle cx="30" cy="24" r="2.5" fill="#22c55e"/>
      <text x="30" y="95" text-anchor="middle" font-family="sans-serif" font-size="7" font-weight="bold" fill="#ffffff">AX PRO</text>
    </g>
  </g>
</svg>`;

// 6. AX PRO Outdoor Siren with Red Strobe
svgs['alarm-siren-outdoor-red.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <radialGradient id="sirenBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </radialGradient>
    <filter id="sirenShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.16"/>
    </filter>
    <linearGradient id="strobeRed" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ef4444"/>
      <stop offset="50%" stop-color="#dc2626"/>
      <stop offset="100%" stop-color="#991b1b"/>
    </linearGradient>
    <linearGradient id="sirenWhite" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#sirenBg)"/>

  <g filter="url(#sirenShadow)" transform="translate(160, 90)">
    <path d="M 140,20 L 260,250 Q 270,270 250,290 L 30,290 Q 10,270 20,250 Z" 
          fill="url(#sirenWhite)" stroke="#cbd5e1" stroke-width="4"/>
    
    <path d="M 140,40 L 210,160 L 70,160 Z" 
          fill="url(#strobeRed)" stroke="#b91c1c" stroke-width="3"/>
    <circle cx="140" cy="100" r="10" fill="#ffffff" opacity="0.9"/>
    <circle cx="120" cy="130" r="7" fill="#fecaca" opacity="0.8"/>
    <circle cx="160" cy="130" r="7" fill="#fecaca" opacity="0.8"/>
    <line x1="140" y1="45" x2="140" y2="155" stroke="#ffffff" stroke-width="2" opacity="0.5"/>
    <line x1="105" y1="100" x2="175" y2="100" stroke="#ffffff" stroke-width="1.5" opacity="0.4"/>

    <rect x="70" y="185" width="140" height="45" rx="8" fill="#1e293b"/>
    <line x1="85" y1="197" x2="195" y2="197" stroke="#475569" stroke-width="3"/>
    <line x1="85" y1="207" x2="195" y2="207" stroke="#475569" stroke-width="3"/>
    <line x1="85" y1="217" x2="195" y2="217" stroke="#475569" stroke-width="3"/>

    <text x="140" y="260" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="900" fill="#0f172a" letter-spacing="2">HIKVISION</text>
    <text x="140" y="278" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="bold" fill="#D71920" letter-spacing="1.5">AX PRO · 110 dB WIRELESS</text>

    <circle cx="45" cy="275" r="4" fill="#94a3b8"/>
    <circle cx="235" cy="275" r="4" fill="#94a3b8"/>
  </g>
</svg>`;

// 7. AX PRO PIRCAM with Built-in Camera (DS-PDPC12P-EG2-WB)
svgs['alarm-pircam.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <radialGradient id="pircamBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </radialGradient>
    <filter id="pirShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#000000" flood-opacity="0.15"/>
    </filter>
    <linearGradient id="lensGlass" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#pircamBg)"/>

  <g filter="url(#pirShadow)" transform="translate(190, 80)">
    <rect x="0" y="0" width="220" height="380" rx="36" fill="#ffffff" stroke="#e2e8f0" stroke-width="4"/>
    
    <g transform="translate(40, 45)">
      <rect x="0" y="0" width="140" height="120" rx="18" fill="#1e293b" stroke="#334155" stroke-width="2"/>
      <circle cx="70" cy="55" r="32" fill="url(#lensGlass)" stroke="#64748b" stroke-width="3"/>
      <circle cx="70" cy="55" r="18" fill="#020617"/>
      <circle cx="64" cy="49" r="6" fill="#38bdf8" opacity="0.7"/>
      <circle cx="22" cy="30" r="5" fill="#334155"/>
      <circle cx="118" cy="30" r="5" fill="#334155"/>
      <circle cx="22" cy="80" r="5" fill="#334155"/>
      <circle cx="118" cy="80" r="5" fill="#334155"/>
      <text x="70" y="105" text-anchor="middle" font-family="sans-serif" font-size="8" font-weight="bold" fill="#94a3b8">DAY/NIGHT CAM</text>
    </g>

    <g transform="translate(45, 190)">
      <path d="M 15,10 Q 65,-5 115,10 L 105,95 Q 65,105 25,95 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
      <line x1="45" y1="15" x2="48" y2="90" stroke="#e2e8f0" stroke-width="1.5"/>
      <line x1="65" y1="5" x2="65" y2="100" stroke="#cbd5e1" stroke-width="1.5"/>
      <line x1="85" y1="15" x2="82" y2="90" stroke="#e2e8f0" stroke-width="1.5"/>
      <circle cx="65" cy="120" r="4" fill="#3b82f6"/>
    </g>

    <text x="110" y="340" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="900" fill="#0f172a" letter-spacing="2">HIKVISION</text>
    <text x="110" y="358" text-anchor="middle" font-family="sans-serif" font-size="8.5" font-weight="bold" fill="#D71920">AX PRO · PIRCAM 12M</text>
  </g>
</svg>`;

// 8. AX PRO Touch Wireless Keypad (DS-PK1-E-WB)
svgs['alarm-keypad-axpro.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <radialGradient id="kpBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </radialGradient>
    <filter id="kpShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="22" flood-color="#000000" flood-opacity="0.14"/>
    </filter>
  </defs>
  <rect width="600" height="600" fill="url(#kpBg)"/>

  <g filter="url(#kpShadow)" transform="translate(170, 70)">
    <rect x="0" y="0" width="260" height="420" rx="28" fill="#ffffff" stroke="#e2e8f0" stroke-width="4"/>
    
    <rect x="25" y="25" width="210" height="60" rx="12" fill="#0f172a"/>
    <circle cx="50" cy="55" r="7" fill="#22c55e"/>
    <circle cx="85" cy="55" r="7" fill="#3b82f6"/>
    <circle cx="120" cy="55" r="7" fill="#eab308"/>
    <circle cx="155" cy="55" r="7" fill="#D71920"/>
    <circle cx="190" cy="55" r="7" fill="#38bdf8"/>
    <text x="50" y="40" text-anchor="middle" font-family="sans-serif" font-size="7" fill="#94a3b8">OK</text>
    <text x="85" y="40" text-anchor="middle" font-family="sans-serif" font-size="7" fill="#94a3b8">AWAY</text>
    <text x="120" y="40" text-anchor="middle" font-family="sans-serif" font-size="7" fill="#94a3b8">STAY</text>
    <text x="155" y="40" text-anchor="middle" font-family="sans-serif" font-size="7" fill="#94a3b8">ALARM</text>

    <g transform="translate(35, 115)">
      <circle cx="30" cy="30" r="22" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="30" y="37" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="bold" fill="#1e293b">1</text>
      <circle cx="95" cy="30" r="22" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="95" y="37" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="bold" fill="#1e293b">2</text>
      <circle cx="160" cy="30" r="22" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="160" y="37" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="bold" fill="#1e293b">3</text>
      
      <circle cx="30" cy="85" r="22" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="30" y="92" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="bold" fill="#1e293b">4</text>
      <circle cx="95" cy="85" r="22" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="95" y="92" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="bold" fill="#1e293b">5</text>
      <circle cx="160" cy="85" r="22" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="160" y="92" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="bold" fill="#1e293b">6</text>
      
      <circle cx="30" cy="140" r="22" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="30" y="147" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="bold" fill="#1e293b">7</text>
      <circle cx="95" cy="140" r="22" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="95" y="147" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="bold" fill="#1e293b">8</text>
      <circle cx="160" cy="140" r="22" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="160" y="147" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="bold" fill="#1e293b">9</text>
      
      <circle cx="30" cy="195" r="22" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="30" y="202" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="bold" fill="#64748b">*</text>
      <circle cx="95" cy="195" r="22" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="95" y="202" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="bold" fill="#1e293b">0</text>
      <circle cx="160" cy="195" r="22" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="160" y="202" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="bold" fill="#64748b">#</text>
    </g>

    <rect x="40" y="340" width="180" height="40" rx="10" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1"/>
    <text x="130" y="364" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="bold" fill="#64748b">RFID TAG ZONE</text>
    <text x="130" y="402" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="900" fill="#0f172a" letter-spacing="2">HIKVISION</text>
  </g>
</svg>`;

// 9. PTZ Keyboard Controller (DS-1200KI)
svgs['ptz-keyboard-ds-1200ki.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <radialGradient id="ptzBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </radialGradient>
    <filter id="kbShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#000000" flood-opacity="0.16"/>
    </filter>
    <linearGradient id="kbBody" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <radialGradient id="joyGrip" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#64748b"/>
      <stop offset="50%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
  </defs>
  <rect width="600" height="600" fill="url(#ptzBg)"/>

  <g filter="url(#kbShadow)" transform="translate(60, 130)">
    <rect x="0" y="0" width="480" height="290" rx="18" fill="url(#kbBody)" stroke="#475569" stroke-width="3"/>
    
    <g transform="translate(35, 25)">
      <rect x="0" y="0" width="220" height="70" rx="8" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
      <text x="15" y="25" font-family="monospace" font-size="11" font-weight="bold" fill="#ffffff">CAM: 001 [MAIN GATE]</text>
      <text x="15" y="42" font-family="monospace" font-size="10" fill="#e0f2fe">PTZ: PAN 180° TILT 45°</text>
      <text x="15" y="58" font-family="monospace" font-size="9" fill="#bae6fd">ZOOM: 25X · PRESET 04</text>
    </g>

    <g transform="translate(35, 115)">
      <rect x="0" y="0" width="45" height="30" rx="4" fill="#1e293b" stroke="#475569"/>
      <text x="22" y="19" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="bold" fill="#ffffff">PRESET</text>
      <rect x="55" y="0" width="45" height="30" rx="4" fill="#1e293b" stroke="#475569"/>
      <text x="77" y="19" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="bold" fill="#ffffff">PATROL</text>
      <rect x="110" y="0" width="45" height="30" rx="4" fill="#1e293b" stroke="#475569"/>
      <text x="132" y="19" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="bold" fill="#ffffff">PATTERN</text>
      <rect x="165" y="0" width="45" height="30" rx="4" fill="#1e293b" stroke="#475569"/>
      <text x="187" y="19" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="bold" fill="#ffffff">WIPER</text>

      <g transform="translate(0, 42)">
        <rect x="0" y="0" width="35" height="24" rx="3" fill="#1e293b"/>
        <text x="17" y="16" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">1</text>
        <rect x="42" y="0" width="35" height="24" rx="3" fill="#1e293b"/>
        <text x="59" y="16" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">2</text>
        <rect x="84" y="0" width="35" height="24" rx="3" fill="#1e293b"/>
        <text x="101" y="16" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">3</text>
        <rect x="126" y="0" width="40" height="24" rx="3" fill="#D71920"/>
        <text x="146" y="16" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="bold" fill="#ffffff">CAM</text>
        
        <rect x="0" y="30" width="35" height="24" rx="3" fill="#1e293b"/>
        <text x="17" y="46" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">4</text>
        <rect x="42" y="30" width="35" height="24" rx="3" fill="#1e293b"/>
        <text x="59" y="46" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">5</text>
        <rect x="84" y="30" width="35" height="24" rx="3" fill="#1e293b"/>
        <text x="101" y="46" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">6</text>
        <rect x="126" y="30" width="40" height="24" rx="3" fill="#1e293b"/>
        <text x="146" y="46" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="bold" fill="#ffffff">ENTER</text>
      </g>
    </g>

    <g transform="translate(365, 140)">
      <circle cx="0" cy="0" r="75" fill="#1e293b" stroke="#334155" stroke-width="4"/>
      <circle cx="0" cy="0" r="55" fill="#0f172a" stroke="#1e293b" stroke-width="3"/>
      <circle cx="0" cy="0" r="40" fill="#1e293b"/>
      <circle cx="-5" cy="-8" r="32" fill="url(#joyGrip)" stroke="#64748b" stroke-width="2"/>
      <circle cx="-5" cy="-8" r="14" fill="#0f172a"/>
      <circle cx="-5" cy="-8" r="7" fill="#D71920"/>
    </g>

    <text x="35" y="255" font-family="sans-serif" font-size="13" font-weight="900" fill="#ffffff" letter-spacing="2">HIKVISION</text>
    <text x="135" y="255" font-family="sans-serif" font-size="10" font-weight="bold" fill="#94a3b8">DS-1200KI · NETWORK KEYBOARD</text>
  </g>
</svg>`;

// 10. PTZ 7-Inch Speed Dome (DS-2DE7A432IW-AEB)
svgs['ptz-speed-dome-7inch.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <radialGradient id="domeBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </radialGradient>
    <filter id="domeShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#000000" flood-opacity="0.16"/>
    </filter>
    <linearGradient id="domeWhite" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="80%" stop-color="#f1f5f9"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </linearGradient>
    <radialGradient id="darkBubble" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="60%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
  </defs>
  <rect width="600" height="600" fill="url(#domeBg)"/>

  <g filter="url(#domeShadow)" transform="translate(180, 50)">
    <path d="M 0,40 L 70,40 Q 120,40 120,90 L 120,130 L 160,130 L 160,90 Q 160,10 70,10 L 0,10 Z" 
          fill="url(#domeWhite)" stroke="#cbd5e1" stroke-width="2"/>
    <rect x="-15" y="0" width="18" height="60" rx="4" fill="#cbd5e1" stroke="#94a3b8"/>

    <g transform="translate(140, 130)">
      <rect x="-70" y="0" width="140" height="24" rx="6" fill="url(#domeWhite)" stroke="#94a3b8" stroke-width="2"/>
      <path d="M -70,24 L -115,120 L 115,120 L 70,24 Z" fill="url(#domeWhite)" stroke="#cbd5e1" stroke-width="2"/>
      
      <text x="0" y="85" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="900" fill="#0f172a" letter-spacing="2">HIKVISION</text>
      <line x1="-110" y1="110" x2="110" y2="110" stroke="#D71920" stroke-width="3"/>

      <circle cx="0" cy="205" r="95" fill="url(#domeWhite)" stroke="#cbd5e1" stroke-width="3"/>
      <circle cx="0" cy="215" r="75" fill="url(#darkBubble)"/>
      <circle cx="0" cy="215" r="32" fill="#020617" stroke="#334155" stroke-width="3"/>
      <circle cx="0" cy="215" r="22" fill="#0284c7" opacity="0.6"/>
      <circle cx="-6" cy="209" r="7" fill="#38bdf8" opacity="0.8"/>

      <circle cx="-45" cy="185" r="8" fill="#1e293b" stroke="#475569"/>
      <circle cx="45" cy="185" r="8" fill="#1e293b" stroke="#475569"/>
      <circle cx="-55" cy="225" r="8" fill="#1e293b" stroke="#475569"/>
      <circle cx="55" cy="225" r="8" fill="#1e293b" stroke="#475569"/>
      <circle cx="0" cy="155" r="6" fill="#ef4444"/>
    </g>
  </g>
</svg>`;

// 11. Solar 4G Security Camera (DS-2CFSP8-D/4G & DS-2DE2C400)
svgs['solar-camera-4g.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <radialGradient id="solarBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </radialGradient>
    <filter id="solarShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.15"/>
    </filter>
    <linearGradient id="solarCells" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e3a8a"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#172554"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#solarBg)"/>

  <g filter="url(#solarShadow)" transform="translate(100, 60)">
    <g transform="translate(40, 20) rotate(-15)">
      <rect x="0" y="0" width="300" height="170" rx="10" fill="#cbd5e1" stroke="#94a3b8" stroke-width="4"/>
      <rect x="10" y="10" width="280" height="150" rx="6" fill="url(#solarCells)"/>
      <line x1="10" y1="60" x2="290" y2="60" stroke="#60a5fa" stroke-width="1.5" opacity="0.6"/>
      <line x1="10" y1="110" x2="290" y2="110" stroke="#60a5fa" stroke-width="1.5" opacity="0.6"/>
      <line x1="80" y1="10" x2="80" y2="160" stroke="#60a5fa" stroke-width="1.5" opacity="0.6"/>
      <line x1="150" y1="10" x2="150" y2="160" stroke="#60a5fa" stroke-width="1.5" opacity="0.6"/>
      <line x1="220" y1="10" x2="220" y2="160" stroke="#60a5fa" stroke-width="1.5" opacity="0.6"/>
    </g>

    <path d="M 200,160 L 220,240 L 190,240 Z" fill="#64748b"/>

    <g transform="translate(120, 160)">
      <rect x="0" y="0" width="14" height="110" rx="7" fill="#0f172a"/>
      <circle cx="7" cy="115" r="8" fill="#475569"/>
    </g>

    <g transform="translate(150, 220)">
      <path d="M 0,20 L 170,20 L 160,0 L 0,0 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
      <rect x="10" y="20" width="145" height="105" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
      <rect x="140" y="25" width="22" height="95" rx="6" fill="#0f172a"/>
      <circle cx="150" cy="50" r="14" fill="#0284c7" stroke="#334155" stroke-width="2"/>
      <circle cx="150" cy="90" r="14" fill="#0284c7" stroke="#334155" stroke-width="2"/>
      <text x="75" y="65" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="900" fill="#0f172a" letter-spacing="1">HIKVISION</text>
      <rect x="55" y="80" width="40" height="18" rx="4" fill="#D71920"/>
      <text x="75" y="93" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="bold" fill="#ffffff">4G LTE</text>
    </g>

    <g transform="translate(80, 260)">
      <rect x="0" y="0" width="45" height="75" rx="8" fill="#cbd5e1" stroke="#94a3b8" stroke-width="2"/>
      <circle cx="22" cy="18" r="4" fill="#475569"/>
      <circle cx="22" cy="55" r="4" fill="#475569"/>
    </g>
  </g>
</svg>`;

// 12. Enterprise 64CH 8K NVR (DS-7764NI-M4)
svgs['nvr-enterprise-64ch.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <radialGradient id="nvrBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </radialGradient>
    <filter id="nvrShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#000000" flood-opacity="0.18"/>
    </filter>
    <linearGradient id="nvrBlack" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="30%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#nvrBg)"/>

  <g filter="url(#nvrShadow)" transform="translate(60, 160)">
    <polygon points="40,0 470,0 490,40 20,40" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    <g fill="#0f172a">
      <ellipse cx="250" cy="20" rx="80" ry="10"/>
      <ellipse cx="250" cy="12" rx="60" ry="6"/>
    </g>

    <polygon points="490,40 470,0 470,160 490,200" fill="#0f172a" stroke="#334155" stroke-width="2"/>
    <g transform="translate(473, 50)">
      <circle cx="8" cy="40" r="14" fill="#020617"/>
      <circle cx="8" cy="80" r="14" fill="#020617"/>
    </g>

    <rect x="20" y="40" width="470" height="160" rx="8" fill="url(#nvrBlack)" stroke="#475569" stroke-width="3"/>
    <path d="M 20,40 L 490,40 L 490,48 L 60,48 L 50,60 L 20,60 Z" fill="#cbd5e1"/>

    <text x="45" y="85" font-family="sans-serif" font-size="14" font-weight="900" fill="#ffffff" letter-spacing="2">HIKVISION</text>
    <rect x="45" y="145" width="16" height="8" rx="2" fill="#020617" stroke="#64748b"/>
    <rect x="68" y="145" width="16" height="8" rx="2" fill="#020617" stroke="#64748b"/>

    <g transform="translate(340, 115)">
      <circle cx="0" cy="0" r="12" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
      <polygon points="-2,-4 -7,0 -2,4" fill="#ffffff"/>
      <circle cx="30" cy="-28" r="12" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
      <polygon points="26,-30 30,-35 34,-30" fill="#ffffff"/>
      <circle cx="30" cy="28" r="12" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
      <polygon points="26,26 30,31 34,26" fill="#ffffff"/>
      <circle cx="60" cy="0" r="12" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
      <polygon points="58,-4 63,0 58,4" fill="#ffffff"/>
      <circle cx="-35" cy="0" r="11" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
      <circle cx="95" cy="0" r="11" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
      <circle cx="130" cy="-10" r="13" fill="#1e293b" stroke="#D71920" stroke-width="2.5"/>
      <circle cx="130" cy="-10" r="4" fill="#D71920"/>
    </g>

    <g transform="translate(470, 130)">
      <circle cx="0" cy="0" r="3" fill="#22c55e"/>
      <circle cx="0" cy="12" r="3" fill="#3b82f6"/>
      <circle cx="0" cy="24" r="3" fill="#e2e8f0"/>
    </g>
  </g>
</svg>`;

// 13. Active Optical Cable AOC HDMI Fiber (DS-1HF1TPZ0)
svgs['hdmi-fiber-optic.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <radialGradient id="hdmiBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </radialGradient>
    <filter id="hdmiShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="22" flood-color="#000000" flood-opacity="0.16"/>
    </filter>
    <linearGradient id="goldConnector" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="100%" stop-color="#ca8a04"/>
    </linearGradient>
    <linearGradient id="zincShell" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#475569"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#hdmiBg)"/>

  <g filter="url(#hdmiShadow)" transform="translate(80, 100)">
    <circle cx="280" cy="230" r="130" fill="none" stroke="#1e293b" stroke-width="14"/>
    <circle cx="280" cy="230" r="115" fill="none" stroke="#0f172a" stroke-width="12"/>
    <circle cx="280" cy="230" r="100" fill="none" stroke="#334155" stroke-width="10"/>

    <g transform="translate(60, 100) rotate(-35)">
      <rect x="0" y="8" width="25" height="24" rx="4" fill="#0f172a"/>
      <rect x="25" y="0" width="85" height="40" rx="8" fill="url(#zincShell)" stroke="#64748b" stroke-width="2"/>
      <path d="M 110,5 L 150,5 L 150,35 L 110,35 Z" fill="url(#goldConnector)"/>
      <polygon points="110,5 110,12 118,12 118,5" fill="#ca8a04"/>
      <polygon points="110,28 110,35 118,35 118,28" fill="#ca8a04"/>
      <text x="35" y="24" font-family="sans-serif" font-size="9" font-weight="900" fill="#ffffff">SOURCE</text>
      <text x="35" y="34" font-family="sans-serif" font-size="7" font-weight="bold" fill="#38bdf8">8K / 4K AOC FIBER</text>
    </g>

    <g transform="translate(330, 240) rotate(15)">
      <rect x="0" y="8" width="25" height="24" rx="4" fill="#0f172a"/>
      <rect x="25" y="0" width="85" height="40" rx="8" fill="url(#zincShell)" stroke="#64748b" stroke-width="2"/>
      <path d="M 110,5 L 150,5 L 150,35 L 110,35 Z" fill="url(#goldConnector)"/>
      <text x="35" y="24" font-family="sans-serif" font-size="9" font-weight="900" fill="#ffffff">DISPLAY</text>
      <text x="35" y="34" font-family="sans-serif" font-size="7" font-weight="bold" fill="#22c55e">ACTIVE OPTIC</text>
    </g>
  </g>
</svg>`;

// 14. Orange Cat6 Patch Cord
svgs['patch-cord-orange.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <radialGradient id="cordBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </radialGradient>
    <filter id="cordShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="22" flood-color="#000000" flood-opacity="0.14"/>
    </filter>
    <linearGradient id="orangeJacket" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fb923c"/>
      <stop offset="100%" stop-color="#ea580c"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#cordBg)"/>

  <g filter="url(#cordShadow)" transform="translate(100, 100)">
    <path d="M 60,120 C 120,40 280,30 340,140 C 400,250 300,360 180,330 C 80,300 70,180 160,170 C 240,160 300,240 330,300" 
          fill="none" stroke="url(#orangeJacket)" stroke-width="22" stroke-linecap="round"/>
    
    <g transform="translate(40, 120) rotate(-65)">
      <path d="M 0,5 L 30,0 L 45,5 L 45,35 L 30,40 L 0,35 Z" fill="#c2410c"/>
      <path d="M 20,-5 Q 40,-8 50,2 L 35,5 Z" fill="#9a3412"/>
      <rect x="45" y="4" width="35" height="32" rx="4" fill="#e0f2fe" opacity="0.8" stroke="#38bdf8"/>
      <rect x="68" y="8" width="10" height="24" rx="2" fill="#eab308"/>
    </g>

    <g transform="translate(330, 300) rotate(55)">
      <path d="M 0,5 L 30,0 L 45,5 L 45,35 L 30,40 L 0,35 Z" fill="#c2410c"/>
      <path d="M 20,-5 Q 40,-8 50,2 L 35,5 Z" fill="#9a3412"/>
      <rect x="45" y="4" width="35" height="32" rx="4" fill="#e0f2fe" opacity="0.8" stroke="#38bdf8"/>
      <rect x="68" y="8" width="10" height="24" rx="2" fill="#eab308"/>
    </g>
  </g>
</svg>`;

// 15. Blue Cat6 Patch Cord
svgs['patch-cord-blue.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <radialGradient id="blueCordBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </radialGradient>
    <filter id="blueCordShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="22" flood-color="#000000" flood-opacity="0.14"/>
    </filter>
    <linearGradient id="blueJacket" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#blueCordBg)"/>

  <g filter="url(#blueCordShadow)" transform="translate(100, 100)">
    <path d="M 60,120 C 120,40 280,30 340,140 C 400,250 300,360 180,330 C 80,300 70,180 160,170 C 240,160 300,240 330,300" 
          fill="none" stroke="url(#blueJacket)" stroke-width="22" stroke-linecap="round"/>
    
    <g transform="translate(40, 120) rotate(-65)">
      <path d="M 0,5 L 30,0 L 45,5 L 45,35 L 30,40 L 0,35 Z" fill="#0369a1"/>
      <path d="M 20,-5 Q 40,-8 50,2 L 35,5 Z" fill="#075985"/>
      <rect x="45" y="4" width="35" height="32" rx="4" fill="#e0f2fe" opacity="0.8" stroke="#38bdf8"/>
      <rect x="68" y="8" width="10" height="24" rx="2" fill="#eab308"/>
    </g>

    <g transform="translate(330, 300) rotate(55)">
      <path d="M 0,5 L 30,0 L 45,5 L 45,35 L 30,40 L 0,35 Z" fill="#0369a1"/>
      <path d="M 20,-5 Q 40,-8 50,2 L 35,5 Z" fill="#075985"/>
      <rect x="45" y="4" width="35" height="32" rx="4" fill="#e0f2fe" opacity="0.8" stroke="#38bdf8"/>
      <rect x="68" y="8" width="10" height="24" rx="2" fill="#eab308"/>
    </g>
  </g>
</svg>`;

// 16. Cable Dispenser Box 305m (DS-1LN6U UTP Cat6)
svgs['cable-box-utp-cat6.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <radialGradient id="cboxBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </radialGradient>
    <filter id="cboxShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#000000" flood-opacity="0.16"/>
    </filter>
  </defs>
  <rect width="600" height="600" fill="url(#cboxBg)"/>

  <g filter="url(#cboxShadow)" transform="translate(140, 90)">
    <rect x="0" y="40" width="280" height="330" rx="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="4"/>
    <polygon points="0,40 50,0 330,0 280,40" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="3"/>
    <polygon points="280,40 330,0 330,310 280,370" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="3"/>

    <circle cx="140" cy="230" r="38" fill="#1e293b" stroke="#64748b" stroke-width="4"/>
    <circle cx="140" cy="230" r="22" fill="#020617"/>
    <path d="M 140,230 Q 110,210 80,240 T 40,230" fill="none" stroke="#ea580c" stroke-width="10" stroke-linecap="round"/>

    <rect x="0" y="70" width="280" height="75" fill="#D71920"/>
    <text x="25" y="115" font-family="sans-serif" font-size="24" font-weight="900" fill="#ffffff" letter-spacing="3">HIKVISION</text>
    <text x="25" y="135" font-family="sans-serif" font-size="11" font-weight="bold" fill="#fee2e2">CAT6 UTP NETWORK CABLE</text>

    <text x="25" y="180" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a">305m (1000ft) · 4 PAIRS</text>
    <text x="25" y="198" font-family="sans-serif" font-size="10" fill="#64748b">23AWG SOLID COPPER · FLUKETESTED</text>
    <text x="25" y="320" font-family="monospace" font-size="11" font-weight="bold" fill="#D71920">DS-1LN6U-W/CCA</text>
  </g>
</svg>`;

// 17. CCTV UPS Power Backup (DS-UPS1000 / DS-UPS2000)
svgs['ups-cctv-backup.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <radialGradient id="upsBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </radialGradient>
    <filter id="upsShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#000000" flood-opacity="0.18"/>
    </filter>
  </defs>
  <rect width="600" height="600" fill="url(#upsBg)"/>

  <g filter="url(#upsShadow)" transform="translate(170, 70)">
    <rect x="0" y="0" width="220" height="420" rx="18" fill="#0f172a" stroke="#334155" stroke-width="4"/>
    
    <g transform="translate(25, 40)">
      <rect x="0" y="0" width="170" height="90" rx="10" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
      <text x="15" y="28" font-family="monospace" font-size="11" font-weight="bold" fill="#ffffff">INPUT: 230V AC</text>
      <text x="15" y="50" font-family="monospace" font-size="11" font-weight="bold" fill="#ffffff">OUTPUT: 230V 50Hz</text>
      <text x="15" y="72" font-family="monospace" font-size="10" fill="#bae6fd">BATT: [████████] 100%</text>
    </g>

    <circle cx="110" cy="180" r="24" fill="#1e293b" stroke="#334155" stroke-width="3"/>
    <circle cx="110" cy="180" r="16" fill="#0f172a"/>
    <circle cx="110" cy="180" r="8" fill="#22c55e"/>

    <rect x="100" y="235" width="20" height="10" rx="2" fill="#1e293b" stroke="#64748b"/>

    <g stroke="#334155" stroke-width="3" transform="translate(35, 275)">
      <line x1="0" y1="0" x2="150" y2="0"/>
      <line x1="0" y1="12" x2="150" y2="12"/>
      <line x1="0" y1="24" x2="150" y2="24"/>
      <line x1="0" y1="36" x2="150" y2="36"/>
      <line x1="0" y1="48" x2="150" y2="48"/>
    </g>

    <text x="110" y="370" text-anchor="middle" font-family="sans-serif" font-size="15" font-weight="900" fill="#ffffff" letter-spacing="2">HIKVISION</text>
    <text x="110" y="390" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="bold" fill="#D71920">DS-UPS1000 · 1000VA</text>
  </g>
</svg>`;

// 18. Ceiling Mount Wi-Fi 6 Access Point (DS-3WAP522-SI & DS-3WAP622E)
svgs['wifi-ap-ceiling.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <radialGradient id="apBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </radialGradient>
    <filter id="apShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="22" flood-color="#000000" flood-opacity="0.14"/>
    </filter>
  </defs>
  <rect width="600" height="600" fill="url(#apBg)"/>

  <g filter="url(#apShadow)" transform="translate(300, 300)">
    <circle cx="0" cy="0" r="180" fill="#ffffff" stroke="#e2e8f0" stroke-width="4"/>
    <circle cx="0" cy="0" r="160" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="130" fill="#ffffff"/>

    <circle cx="0" cy="0" r="28" fill="none" stroke="#38bdf8" stroke-width="3"/>
    <circle cx="0" cy="0" r="20" fill="#0284c7" opacity="0.15"/>
    <circle cx="0" cy="0" r="6" fill="#38bdf8"/>

    <text x="0" y="65" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="900" fill="#0f172a" letter-spacing="2">HIKVISION</text>
    <text x="0" y="85" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="bold" fill="#D71920">Wi-Fi 6 · GIGABIT AP</text>
  </g>
</svg>`;

// Write all generated SVGs to outDir
for (const [filename, content] of Object.entries(svgs)) {
  const filePath = path.join(outDir, filename);
  fs.writeFileSync(filePath, content.trim(), 'utf-8');
  console.log('Generated:', filename);
}
console.log(`Successfully generated ${Object.keys(svgs).length} dedicated product visuals!`);
