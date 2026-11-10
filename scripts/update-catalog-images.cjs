const fs = require('fs');
const path = require('path');

const masterPath = path.resolve('server/data/master-products.json');
const publicPath = path.resolve('src/data/products.json');

const masterProducts = JSON.parse(fs.readFileSync(masterPath, 'utf-8'));
const publicProducts = JSON.parse(fs.readFileSync(publicPath, 'utf-8'));

function getBestImageForProduct(p) {
  // If product already has an assigned image, keep it!
  if (p.image && p.image.trim()) {
    return p.image;
  }

  const ref = (p.reference || '').toUpperCase();
  const name = (p.name || '').toUpperCase();
  const cat = p.category || '';
  const desc = (p.description || '').toUpperCase();

  // 1. TRANSMISSION VIDÉO & BALUNS
  if (cat.includes('Transmission')) {
    if (ref.includes('1H18S') || name.includes('1H18S') || desc.includes('BALUN')) {
      return '/assets/products/balun-ds-1h18s.svg';
    }
    if (ref.includes('12PFG') || ref.includes('DC12V') || name.includes('101700272') || name.includes('101700275') || desc.includes('DC12V')) {
      return '/assets/products/power-adapter-12v.svg';
    }
    if (ref.includes('2FA1225') || ref.includes('2FA1205') || ref.includes('2FA1208')) {
      return '/assets/aistudio/transmission_r17_c1_4_4d17fbe8.png';
    }
    if (ref.includes('1LN6U')) {
      return '/assets/products/cable-box-utp-cat6.svg';
    }
    return '/assets/aistudio/transmission_r7_c1_1_ac08cd3b.png';
  }

  // 2. ACCESSOIRES DE FIXATION & CÂBLAGE
  if (cat.includes('Accessoires') || cat.includes('Accessory')) {
    if (ref.includes('1280ZJ') || ref.includes('2280ZJ') || desc.includes('JUNCTION BOX')) {
      return '/assets/products/junction-box-ds-1280zj.svg';
    }
    if (ref.includes('1T03') || ref.includes('1T04') || desc.includes('CLAMP') || desc.includes('CONNECTOR')) {
      return '/assets/products/rj45-connector-ds-1t04.svg';
    }
    if (ref.includes('1HF1TPZ0') || desc.includes('FIBER')) {
      return '/assets/products/hdmi-fiber-optic.svg';
    }
    if (ref.includes('HDMI') || name.includes('HDMI')) {
      return '/assets/aistudio/accessory_r4_c1_1_9ce7f5b0.png';
    }
    if (ref.includes('ORANGE') || desc.includes('ORANGE')) {
      return '/assets/products/patch-cord-orange.svg';
    }
    if (ref.includes('BLUE') || desc.includes('BLUE')) {
      return '/assets/products/patch-cord-blue.svg';
    }
    if (ref.includes('1LH1S') || ref.includes('COAXIAL') || desc.includes('COAXIAL')) {
      return '/assets/aistudio/accessory_r27_c1_4_f4c17122.png';
    }
    return '/assets/products/junction-box-ds-1280zj.svg';
  }

  // 3. CAMÉRAS PTZ MOTORISÉES
  if (cat.includes('PTZ')) {
    if (ref.includes('1200KI') || name.includes('1200KI')) {
      return '/assets/products/ptz-keyboard-ds-1200ki.svg';
    }
    if (ref.includes('2SE4C425') || ref.includes('2SE4C415') || ref.includes('TANDEMVU')) {
      return '/assets/aistudio/ptz_r7_c1_5_a6c9b58f.jpg';
    }
    if (ref.includes('2DE7A') || ref.includes('32X') || ref.includes('7A432')) {
      return '/assets/products/ptz-speed-dome-7inch.svg';
    }
    if (ref.includes('2DE1C') || ref.includes('2DE4')) {
      return '/assets/products/ptz-speed-dome-7inch.svg';
    }
    return '/assets/aistudio/ptz_r7_c1_5_a6c9b58f.jpg';
  }

  // 4. CAMÉRAS SOLAIRES 4G
  if (cat.includes('solaire') || cat.includes('Solar')) {
    if (ref.includes('2XS2T41')) {
      return '/assets/aistudio/solar-powered-security-camera_r3_c2_1_8c4d9aec.jpg';
    }
    return '/assets/products/solar-camera-4g.svg';
  }

  // 5. SYSTÈMES D'ALARME SANS FIL AX PRO
  if (cat.includes('sans fil AX PRO') || cat.includes('AX PRO')) {
    if (ref.includes('PWA64') || ref.includes('KIT')) {
      return '/assets/products/alarm-kit-axpro.svg';
    }
    if (ref.includes('PK1') || ref.includes('KEYPAD')) {
      return '/assets/products/alarm-keypad-axpro.svg';
    }
    if (ref.includes('PS1-E') && ref.includes('RED')) {
      return '/assets/products/alarm-siren-outdoor-red.svg';
    }
    if (ref.includes('PS1-E') || ref.includes('PS1-I') || desc.includes('SOUNDER') || desc.includes('SIREN')) {
      return '/assets/aistudio/wireless-intrusion-alarm_r24_c3_8_a85d89bb.jpg';
    }
    if (ref.includes('PDPC12') || desc.includes('PIRCAM')) {
      return '/assets/products/alarm-pircam.svg';
    }
    if (ref.includes('PDMC') || desc.includes('MAGNETIC')) {
      return '/assets/aistudio/wireless-intrusion-alarm_r11_c3_6_01a14db1.jpg';
    }
    if (ref.includes('PM1-O1') || desc.includes('RELAY') || desc.includes('EXPANDER')) {
      return '/assets/aistudio/wireless-intrusion-alarm_r22_c3_23_431cb522.jpg';
    }
    if (ref.includes('PDSMK') || desc.includes('SMOKE')) {
      return '/assets/aistudio/wireless-intrusion-alarm_r24_c3_8_a85d89bb.jpg';
    }
    return '/assets/products/alarm-kit-axpro.svg';
  }

  // 6. SYSTÈMES D'ALARME FILAIRES
  if (cat.includes('filaires') || cat.includes('Wired')) {
    if (ref.includes('PHA48') || ref.includes('PHA64') || desc.includes('HYBRID PRO')) {
      return '/assets/products/alarm-kit-axpro.svg';
    }
    if (ref.includes('PK1') || desc.includes('KEYPAD')) {
      return '/assets/products/alarm-keypad-axpro.svg';
    }
    if (ref.includes('PS1-R') || desc.includes('SOUNDER')) {
      return '/assets/aistudio/wired-intrusion-alarm_r7_c3_5_d5abe121.jpg';
    }
    if (ref.includes('PM1-') || ref.includes('PM2-') || desc.includes('EXPANDER') || desc.includes('MODULE')) {
      return '/assets/aistudio/wired-intrusion-alarm_r9_c3_6_6ca72311.jpg';
    }
    if (ref.includes('PD1-MC') || desc.includes('MAGNETIC')) {
      return '/assets/aistudio/wired-intrusion-alarm_r20_c3_16_f91306d0.jpg';
    }
    if (ref.includes('PDB-IN') || desc.includes('BRACKET')) {
      return '/assets/aistudio/wired-intrusion-alarm_r21_c3_17_d3cc7b4b.jpg';
    }
    return '/assets/products/alarm-pircam.svg';
  }

  // 7. ENREGISTREURS DVR (TURBO HD)
  if (cat.includes('DVR')) {
    if (ref.includes('E04HGHI') || ref.includes('E08HGHI')) {
      return '/assets/aistudio/dvr_r16_c1_9_4cf29d1c.jpg';
    }
    if (ref.includes('7232') || ref.includes('7332')) {
      return '/assets/products/nvr-enterprise-64ch.svg';
    }
    return '/assets/aistudio/dvr_r16_c1_9_4cf29d1c.jpg';
  }

  // 8. ENREGISTREURS NVR (RÉSEAU IP)
  if (cat.includes('NVR')) {
    if (ref.includes('7764')) {
      return '/assets/products/nvr-enterprise-64ch.svg';
    }
    if (ref.includes('7732NI-K4/16P')) {
      return '/assets/aistudio/nvr_r6_c1_8_d5977e04.jpg';
    }
    if (ref.includes('7732NXI')) {
      return '/assets/aistudio/nvr_r5_c1_2_d98d7f69.png';
    }
    if (ref.includes('7632') || ref.includes('7616')) {
      return '/assets/aistudio/nvr_r4_c1_9_365fded7.jpg';
    }
    return '/assets/aistudio/nvr_r2_c1_1_607b2ad6.png';
  }

  // 9. DISQUES DURS DE SURVEILLANCE
  if (cat.includes('Disques durs') || cat.includes('HDD')) {
    if (ref.includes('ST6000') || name.includes('ST6000') || desc.includes('6TB') || desc.includes('8TB') || desc.includes('10TB')) {
      return '/assets/aistudio/hdd_r5_c3_4_99ab58a0.png';
    }
    return '/assets/aistudio/hdd_r3_c3_1_99ab58a0.png';
  }

  // 10. KITS VIDÉOSURVEILLANCE
  if (cat.includes('Kits')) {
    return '/assets/aistudio/hikvision-kit_r3_c1_1_295ddbc1.jpg';
  }

  // 11. SWITCHS POE RÉSEAU
  if (cat.includes('Switch')) {
    if (ref.includes('3E1528') || ref.includes('0526') || desc.includes('24') || desc.includes('26') || desc.includes('28')) {
      return '/assets/aistudio/switch_r20_c1_12_84190b01.png';
    }
    if (ref.includes('1526') || ref.includes('1520') || desc.includes('16') || desc.includes('18')) {
      return '/assets/aistudio/switch_r14_c1_6_503775f0.jpg';
    }
    if (ref.includes('0510') || ref.includes('0310') || desc.includes('8') || desc.includes('10')) {
      return '/assets/aistudio/switch_r18_c1_8_4dc4aa65.png';
    }
    if (ref.includes('1505') || desc.includes('PoE')) {
      return '/assets/aistudio/switch_r12_c1_7_4844c0a5.png';
    }
    return '/assets/aistudio/switch_r3_c1_1_72f74e66.jpg';
  }

  // 12. BAIES & COFFRETS MURAUX
  if (cat.includes('Baies') || cat.includes('coffrets') || cat.includes('Cabinet')) {
    if (ref.includes('FD1238') || desc.includes('FAN')) {
      return '/assets/aistudio/cabinet_r9_c1_6_42cb49a0.jpg';
    }
    if (ref.includes('UPS') || desc.includes('UPS') || desc.includes('ONDULEUR')) {
      return '/assets/products/ups-cctv-backup.svg';
    }
    return '/assets/aistudio/cabinet_r4_c1_3_db5fdb85.png';
  }

  // 13. MONITEURS DE SURVEILLANCE
  if (cat.includes('Moniteurs') || cat.includes('MONITOR')) {
    if (ref.includes('D5SC3B-W')) {
      return '/assets/aistudio/monitor_r13_c1_14_044c0312.jpg';
    }
    if (ref.includes('D5SC3B-B') || desc.includes('DONGLE')) {
      return '/assets/aistudio/monitor_r12_c1_13_624f6e33.jpg';
    }
    if (ref.includes('D5AC11') || ref.includes('D5ABKY') || ref.includes('D4430') || ref.includes('D42B04')) {
      return '/assets/aistudio/monitor_r14_c1_5_ec2c97c4.jpg';
    }
    if (ref.includes('D5032') || ref.includes('D5043') || desc.includes('32') || desc.includes('43') || desc.includes('65') || desc.includes('86')) {
      return '/assets/aistudio/monitor_r5_c1_2_a0c80a70.jpg';
    }
    return '/assets/aistudio/monitor_r6_c1_10_872cbb3f.jpg';
  }

  // 14. ROUTEURS WI-FI & POINTS D'ACCÈS
  if (cat.includes('Routeurs') || cat.includes('Points d')) {
    if (ref.includes('WAP522') || ref.includes('WAP622') || desc.includes('CEILING') || desc.includes('CELLING')) {
      return '/assets/products/wifi-ap-ceiling.svg';
    }
    if (ref.includes('WAP521') || desc.includes('IN-WALL')) {
      return '/assets/aistudio/ac-router-ap_r3_c2_2_3cbaa76f.png';
    }
    if (ref.includes('MESH') || name.includes('Mesh')) {
      return '/assets/aistudio/wireless-router_r15_c2_12_431dc4d2.png';
    }
    if (ref.includes('3WF02') || ref.includes('3WF0A') || desc.includes('OUTDOOR') || desc.includes('BRIDGE')) {
      return '/assets/aistudio/wireless-router_r17_c1_1_aef31f44.jpg';
    }
    if (ref.includes('3WR12') || ref.includes('3WR18') || ref.includes('3WR30') || ref.includes('3WR4G')) {
      return '/assets/aistudio/wireless-router_r6_c1_7_7fc0b986.jpg';
    }
    return '/assets/aistudio/wireless-router_r3_c1_8_3ab1a39b.png';
  }

  // 15. CAMÉRAS ANALOGIQUES
  if (cat.includes('analogiques') || cat.includes('Analog')) {
    // Turret or Dome
    if (ref.includes('76') || ref.includes('56') || ref.includes('78') || desc.includes('TURRET') || desc.includes('DOME')) {
      if (ref.includes('K0T') || ref.includes('ColorVu') || desc.includes('COLORVU')) {
        return '/assets/aistudio/analog_r23_c1_17_2896f0f9.jpg';
      }
      return '/assets/aistudio/analog_r5_c1_13_7cef10b3.png';
    }
    // Bullet
    if (ref.includes('K0T') || desc.includes('COLORVU') || desc.includes('SMART HYBRID')) {
      return '/assets/aistudio/analog_r24_c1_11_c40cf9f9.png';
    }
    if (ref.includes('LPXTS')) {
      return '/assets/aistudio/analog_r10_c1_3_5408bd81.png';
    }
    return '/assets/aistudio/analog_r2_c1_9_58c86f3f.jpg';
  }

  // 16. CAMÉRAS IP
  if (cat.includes('IP')) {
    // Turret / Dome IP
    if (ref.includes('132') || ref.includes('134') || ref.includes('114') || ref.includes('115') || ref.includes('116') || ref.includes('118') || ref.includes('174') || desc.includes('TURRET') || desc.includes('DOME')) {
      if (ref.includes('1143') || ref.includes('1153') || ref.includes('1163') || ref.includes('1183')) {
        return '/assets/aistudio/ip-1-0_r9_c1_17_6189ab9a.jpg';
      }
      if (ref.includes('1153G0')) {
        return '/assets/aistudio/ip-1-0_r27_c1_10_2d61c6cf.jpg';
      }
      return '/assets/aistudio/ip-1-0_r4_c1_33_11f56b3a.jpg';
    }
    // Fisheye 360
    if (ref.includes('2935') || ref.includes('2955') || desc.includes('FISHEYE')) {
      return '/assets/aistudio/ip-2-0_r11_c1_4_3d61c4be.jpg';
    }
    // Thermal
    if (ref.includes('2TD') || desc.includes('THERMAL')) {
      return '/assets/aistudio/ip-2-0_r9_c1_10_980b1157.png';
    }
    // Bullet IP
    if (ref.includes('2083') || ref.includes('2043')) {
      return '/assets/aistudio/ip-2-0_r5_c1_8_8b064d4a.jpg';
    }
    if (ref.includes('1T47') || ref.includes('1T27')) {
      return '/assets/aistudio/ip-1-0_r17_c1_34_a560fce1.jpg';
    }
    if (ref.includes('1047') || ref.includes('1027')) {
      return '/assets/aistudio/ip-1-0_r41_c1_12_caf4277b.jpg';
    }
    if (ref.includes('1083') || ref.includes('1063')) {
      return '/assets/aistudio/ip-1-0_r22_c1_22_feccad00.jpg';
    }
    return '/assets/aistudio/ip-1-0_r3_c1_32_eef30959.jpg';
  }

  // Default fallback if anything slips through
  return '/assets/aistudio/analog_r2_c1_9_58c86f3f.jpg';
}

// Update Master Products
let masterUpdatedCount = 0;
masterProducts.forEach(prod => {
  const chosen = getBestImageForProduct(prod);
  if (chosen && prod.image !== chosen) {
    prod.image = chosen;
    prod.images = [chosen];
    masterUpdatedCount++;
  }
});

// Update Public Products
let publicUpdatedCount = 0;
publicProducts.forEach(prod => {
  const chosen = getBestImageForProduct(prod);
  if (chosen && prod.image !== chosen) {
    prod.image = chosen;
    prod.images = [chosen];
    publicUpdatedCount++;
  }
});

fs.writeFileSync(masterPath, JSON.stringify(masterProducts, null, 2), 'utf-8');
fs.writeFileSync(publicPath, JSON.stringify(publicProducts, null, 2), 'utf-8');

console.log(`Updated Master Products: ${masterUpdatedCount} items now have images!`);
console.log(`Updated Public Products: ${publicUpdatedCount} items now have images!`);

// Summary statistics
const masterWithImg = masterProducts.filter(p => p.image).length;
const publicWithImg = publicProducts.filter(p => p.image).length;

console.log(`Master total: ${masterProducts.length}, with image: ${masterWithImg} (${((masterWithImg/masterProducts.length)*100).toFixed(1)}%)`);
console.log(`Public total: ${publicProducts.length}, with image: ${publicWithImg} (${((publicWithImg/publicProducts.length)*100).toFixed(1)}%)`);
