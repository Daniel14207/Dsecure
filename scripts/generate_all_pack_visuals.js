import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const PACKS_DIR = path.resolve('public/images/packs');
if (!fs.existsSync(PACKS_DIR)) {
  fs.mkdirSync(PACKS_DIR, { recursive: true });
}

const TMP_DIR = '/tmp/pack_assets_clean';
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

const fontBold = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';
const fontRegular = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';

function prep(src, name, maxW = 220, maxH = 170) {
  const out = `${TMP_DIR}/${name}.png`;
  if (!fs.existsSync(out)) {
    try {
      execSync(`convert "${src}" -fuzz 8% -transparent white -trim +repage -resize ${maxW}x${maxH} "${out}"`);
    } catch (e) {
      console.error(`Error prepping ${name}:`, e.message);
    }
  }
  return out;
}

console.log('1. Preparing transparent isolated product assets...');
const exirCam = prep('public/images/CAMERAS_ANALOGIQUES/CAMERAS_ANALOGIQUES__DS-2CE16D0T-EXIPF-3.6mm-O-STD.jpg', 'cam_exir', 170, 130);
const colorvuCam = prep('public/images/CAMERAS_ANALOGIQUES/CAMERAS_ANALOGIQUES__DS-2CE10DF0T-LPFS.jpg', 'cam_colorvu', 170, 130);
const hybridCam = prep('public/images/CAMERAS_ANALOGIQUES/CAMERAS_ANALOGIQUES__DS-2CE16D0T-LPFS.png', 'cam_hybrid', 170, 130);
const ipCam2MP = prep('public/images/CAMERAS_IP/CAMERAS_IP__DS-2CD1023G2-LIU.jpg', 'cam_ip_2mp', 170, 130);
const ipCam4MP = prep('public/images/CAMERAS_IP/CAMERAS_IP__DS-2CD1043G2-LIU.jpg', 'cam_ip_4mp', 170, 130);

const dvr4ch = prep('public/images/DVR/DVR__DS-7204HGHI-M1-T.jpg', 'dvr_4ch', 360, 170);
const dvr8ch = prep('public/images/DVR/DVR__DS-7208HGHI-M1-T.jpg', 'dvr_8ch', 380, 170);
const dvr16ch = prep('public/images/DVR/DVR__DS-7216HGHI-M1-T.jpg', 'dvr_16ch', 400, 170);

const nvr4ch = prep('public/images/NVR/NVR__DS-7104NI-Q1-4P-M.jpg', 'nvr_4ch', 360, 170);
const nvr8ch = prep('public/images/NVR/NVR__DS-7108NI-Q1-8P-M.jpg', 'nvr_8ch', 380, 170);
const nvr16ch = prep('public/images/NVR/NVR__DS-7616NI-Q2-16P.jpg', 'nvr_16ch', 400, 170);

const hdd = prep('public/images/DISQUES_DURS/DISQUES_DURS__A_IDENTIFIER.png', 'hdd', 140, 140);
const psuD4 = prep('public/images/TRANSMISSION_ALIMENTATION/TRANSMISSION_ALIMENTATION__DS-2FA1225-D4-EUR.png', 'psu_d4', 130, 130);
const psuD8 = prep('public/images/TRANSMISSION_ALIMENTATION/TRANSMISSION_ALIMENTATION__DS-2FA1205-D8-EUR.png', 'psu_d8', 130, 130);
const psuC16 = prep('public/images/TRANSMISSION_ALIMENTATION/TRANSMISSION_ALIMENTATION__DS-2FA1208-C16.png', 'psu_c16', 130, 130);

const coaxCable = prep('public/images/ACCESSOIRES/ACCESSOIRES__DS-1LH1SCAM592C-O-STD.png', 'coax', 220, 100);
const cat6Carton = prep('public/images/TRANSMISSION_ALIMENTATION/TRANSMISSION_ALIMENTATION__DS-1LN6U-W-CCA-O-STD.png', 'cat6_carton', 160, 170);
const bncBalun = prep('public/images/TRANSMISSION_ALIMENTATION/TRANSMISSION_ALIMENTATION__DS-1H18S-E-C.jpg', 'bnc_balun', 130, 130);
const rj45Connectors = prep('public/images/ACCESSOIRES/ACCESSOIRES__DS-1NP5EUDC0-E-Orange.png', 'rj45_cords', 130, 130);

/**
 * Compose a visual kit representation using crisp typography
 */
function buildPackImage({
  outFile,
  title,
  subBadge,
  camImage,
  camCount,
  recorderImage,
  recorderName,
  storageText,
  powerOrCableImage,
  powerOrCableText,
  wiringImage,
  wiringText,
  connectorsImage,
  connectorsText,
}) {
  const fullOut = `${PACKS_DIR}/${outFile}`;
  let cmd = `convert -size 1000x750 "radial-gradient:#ffffff-#e2e8f0" `;

  // Card background
  cmd += `-fill "#ffffff" -draw "roundrectangle 16,16 984,734 16,16" `;
  cmd += `-stroke "#cbd5e1" -strokewidth 2 -fill none -draw "roundrectangle 16,16 984,734 16,16" `;

  // Header band
  cmd += `-stroke none -fill "#09090b" -draw "roundrectangle 30,30 970,82 8,8" `;
  // Red logo tag
  cmd += `-fill "#D71920" -draw "roundrectangle 42,39 145,73 4,4" `;
  cmd += `-stroke none -font "${fontBold}" -fill "#ffffff" -pointsize 13 -annotate +54+61 "D SECURE" `;

  // Pack title
  cmd += `-stroke none -font "${fontBold}" -fill "#ffffff" -pointsize 15 -annotate +165+61 "${title}" `;

  // Free installation badge
  cmd += `-fill "#065f46" -draw "roundrectangle 760,39 958,73 4,4" `;
  cmd += `-stroke none -font "${fontBold}" -fill "#34d399" -pointsize 11 -annotate +772+60 "POSE OFFERTE TANA" `;

  // Upper section: Camera Array
  if (camCount === 4) {
    const xs = [60, 280, 510, 740];
    xs.forEach((x) => {
      cmd += `\\( "${camImage}" -resize 170x130 \\) -geometry +${x}+105 -composite `;
    });
  } else if (camCount === 8) {
    const xs = [80, 290, 520, 730];
    xs.forEach((x) => {
      cmd += `\\( "${camImage}" -resize 140x105 \\) -geometry +${x}+95 -composite `;
      cmd += `\\( "${camImage}" -resize 140x105 \\) -geometry +${x}+190 -composite `;
    });
  } else if (camCount === 16) {
    const xs = [40, 160, 280, 400, 520, 640, 760, 860];
    xs.forEach((x) => {
      cmd += `\\( "${camImage}" -resize 100x75 \\) -geometry +${x}+95 -composite `;
      cmd += `\\( "${camImage}" -resize 100x75 \\) -geometry +${x}+175 -composite `;
    });
  }

  // Recorder in center
  const recY = camCount === 16 ? 260 : camCount === 8 ? 300 : 260;
  cmd += `\\( "${recorderImage}" -resize 380x160 \\) -geometry +310+${recY} -composite `;
  cmd += `-stroke none -font "${fontBold}" -fill "#334155" -pointsize 13 -annotate +370+${recY + 175} "${recorderName}" `;

  // Accessories in bottom row
  const botY = 480;
  // 1. HDD
  cmd += `\\( "${hdd}" -resize 140x140 \\) -geometry +70+${botY} -composite `;
  cmd += `-stroke none -font "${fontBold}" -fill "#0f172a" -pointsize 13 -annotate +75+${botY + 175} "${storageText}" `;

  // 2. Power or Cable Carton
  cmd += `\\( "${powerOrCableImage}" -resize 140x140 \\) -geometry +290+${botY} -composite `;
  cmd += `-stroke none -font "${fontBold}" -fill "#0f172a" -pointsize 13 -annotate +295+${botY + 175} "${powerOrCableText}" `;

  // 3. Wiring
  cmd += `\\( "${wiringImage}" -resize 160x140 \\) -geometry +520+${botY} -composite `;
  cmd += `-stroke none -font "${fontBold}" -fill "#0f172a" -pointsize 13 -annotate +525+${botY + 175} "${wiringText}" `;

  // 4. Connectors
  cmd += `\\( "${connectorsImage}" -resize 140x140 \\) -geometry +760+${botY} -composite `;
  cmd += `-stroke none -font "${fontBold}" -fill "#0f172a" -pointsize 13 -annotate +750+${botY + 175} "${connectorsText}" `;

  // Footer bar
  cmd += `-stroke none -fill "#f1f5f9" -draw "roundrectangle 30,690 970,724 6,6" `;
  cmd += `-stroke none -font "${fontBold}" -fill "#D71920" -pointsize 12 -annotate +45+712 "${subBadge}" `;
  cmd += `-stroke none -font "${fontRegular}" -fill "#334155" -pointsize 11 -annotate +420+712 "Matériel certifié Hikvision 100% Original · Garantie officielle D SECURE" `;

  cmd += `-quality 92 "${fullOut}"`;
  execSync(cmd);
  console.log(`Generated: ${outFile} (${fs.statSync(fullOut).size} bytes)`);
}

console.log('2. Generating commercial pack visuals with crisp text...');

// Family 1: EXIR
buildPackImage({
  outFile: 'pack_analog_exir_4.jpg',
  title: 'PACK ANALOGIQUE EXIR 4 CAMÉRAS',
  subBadge: 'TECHNOLOGIE ANALOGIQUE TURBO HD',
  camImage: exirCam,
  camCount: 4,
  recorderImage: dvr4ch,
  recorderName: 'DVR 4 Canaux DS-7204HGHI-M1/T',
  storageText: 'Disque Dur 500 Go',
  powerOrCableImage: psuD4,
  powerOrCableText: 'Bloc Alimentation C4',
  wiringImage: coaxCable,
  wiringText: 'Câble Coaxial 100m',
  connectorsImage: bncBalun,
  connectorsText: '8 BNC + 4 Fiches DC',
});

buildPackImage({
  outFile: 'pack_analog_exir_8.jpg',
  title: 'PACK ANALOGIQUE EXIR 8 CAMÉRAS',
  subBadge: 'TECHNOLOGIE ANALOGIQUE TURBO HD',
  camImage: exirCam,
  camCount: 8,
  recorderImage: dvr8ch,
  recorderName: 'DVR 8 Canaux DS-7208HGHI-M1/T',
  storageText: 'Disque Dur 1 To',
  powerOrCableImage: psuD8,
  powerOrCableText: 'Bloc Alimentation C8',
  wiringImage: coaxCable,
  wiringText: 'Câble Coaxial 200m',
  connectorsImage: bncBalun,
  connectorsText: '16 BNC + 8 Fiches DC',
});

buildPackImage({
  outFile: 'pack_analog_exir_16.jpg',
  title: 'PACK ANALOGIQUE EXIR 16 CAMÉRAS',
  subBadge: 'TECHNOLOGIE ANALOGIQUE TURBO HD',
  camImage: exirCam,
  camCount: 16,
  recorderImage: dvr16ch,
  recorderName: 'DVR 16 Canaux DS-7216HGHI-M1/T',
  storageText: 'Disque Dur 2 To',
  powerOrCableImage: psuC16,
  powerOrCableText: 'Bloc Alimentation C16',
  wiringImage: coaxCable,
  wiringText: 'Câble Coaxial 400m',
  connectorsImage: bncBalun,
  connectorsText: '32 BNC + 16 Fiches DC',
});

// Family 2: ColorVu
buildPackImage({
  outFile: 'pack_analog_colorvu_4.jpg',
  title: 'PACK ANALOGIQUE COLORVU 4 CAMÉRAS',
  subBadge: 'VISION NOCTURNE 24/7 EN COULEUR',
  camImage: colorvuCam,
  camCount: 4,
  recorderImage: dvr4ch,
  recorderName: 'DVR 4 Canaux DS-7204HGHI-M1/T',
  storageText: 'Disque Dur 500 Go',
  powerOrCableImage: psuD4,
  powerOrCableText: 'Bloc Alimentation C4',
  wiringImage: coaxCable,
  wiringText: 'Câble Coaxial 100m',
  connectorsImage: bncBalun,
  connectorsText: '8 BNC + 4 Fiches DC',
});

buildPackImage({
  outFile: 'pack_analog_colorvu_8.jpg',
  title: 'PACK ANALOGIQUE COLORVU 8 CAMÉRAS',
  subBadge: 'VISION NOCTURNE 24/7 EN COULEUR',
  camImage: colorvuCam,
  camCount: 8,
  recorderImage: dvr8ch,
  recorderName: 'DVR 8 Canaux DS-7208HGHI-M1/T',
  storageText: 'Disque Dur 1 To',
  powerOrCableImage: psuD8,
  powerOrCableText: 'Bloc Alimentation C8',
  wiringImage: coaxCable,
  wiringText: 'Câble Coaxial 200m',
  connectorsImage: bncBalun,
  connectorsText: '16 BNC + 8 Fiches DC',
});

buildPackImage({
  outFile: 'pack_analog_colorvu_16.jpg',
  title: 'PACK ANALOGIQUE COLORVU 16 CAMÉRAS',
  subBadge: 'VISION NOCTURNE 24/7 EN COULEUR',
  camImage: colorvuCam,
  camCount: 16,
  recorderImage: dvr16ch,
  recorderName: 'DVR 16 Canaux DS-7216HGHI-M1/T',
  storageText: 'Disque Dur 2 To',
  powerOrCableImage: psuC16,
  powerOrCableText: 'Bloc Alimentation C16',
  wiringImage: coaxCable,
  wiringText: 'Câble Coaxial 400m',
  connectorsImage: bncBalun,
  connectorsText: '32 BNC + 16 Fiches DC',
});

// Family 3: Smart Hybrid Light
buildPackImage({
  outFile: 'pack_analog_hybrid_4.jpg',
  title: 'PACK SMART HYBRID LIGHT 4 CAMÉRAS',
  subBadge: 'ÉCLAIRAGE DOUBLE INTELLIGENT IR + BLANC',
  camImage: hybridCam,
  camCount: 4,
  recorderImage: dvr4ch,
  recorderName: 'DVR 4 Canaux DS-7204HGHI-M1/T',
  storageText: 'Disque Dur 500 Go',
  powerOrCableImage: psuD4,
  powerOrCableText: 'Bloc Alimentation C4',
  wiringImage: coaxCable,
  wiringText: 'Câble Coaxial 100m',
  connectorsImage: bncBalun,
  connectorsText: '8 BNC + 4 Fiches DC',
});

buildPackImage({
  outFile: 'pack_analog_hybrid_8.jpg',
  title: 'PACK SMART HYBRID LIGHT 8 CAMÉRAS',
  subBadge: 'ÉCLAIRAGE DOUBLE INTELLIGENT IR + BLANC',
  camImage: hybridCam,
  camCount: 8,
  recorderImage: dvr8ch,
  recorderName: 'DVR 8 Canaux DS-7208HGHI-M1/T',
  storageText: 'Disque Dur 1 To',
  powerOrCableImage: psuD8,
  powerOrCableText: 'Bloc Alimentation C8',
  wiringImage: coaxCable,
  wiringText: 'Câble Coaxial 200m',
  connectorsImage: bncBalun,
  connectorsText: '16 BNC + 8 Fiches DC',
});

// Family 4: IP PoE Numérique
buildPackImage({
  outFile: 'pack_ip_poe_4.jpg',
  title: 'PACK IP NUMÉRIQUE PoE 4 CAMÉRAS',
  subBadge: 'TECHNOLOGIE IP NUMÉRIQUE PoE HIKVISION',
  camImage: ipCam2MP,
  camCount: 4,
  recorderImage: nvr4ch,
  recorderName: 'NVR 4ch PoE DS-7104NI-Q1/4P/M',
  storageText: 'Disque Dur 500 Go',
  powerOrCableImage: cat6Carton,
  powerOrCableText: 'Carton Câble Cat6 (305m)',
  wiringImage: rj45Connectors,
  wiringText: 'Cordon Patch UTP',
  connectorsImage: rj45Connectors,
  connectorsText: '8 Connecteurs RJ45',
});

buildPackImage({
  outFile: 'pack_ip_poe_8.jpg',
  title: 'PACK IP NUMÉRIQUE PoE 8 CAMÉRAS',
  subBadge: 'TECHNOLOGIE IP NUMÉRIQUE PoE HIKVISION',
  camImage: ipCam2MP,
  camCount: 8,
  recorderImage: nvr8ch,
  recorderName: 'NVR 8ch PoE DS-7108NI-Q1/8P/M',
  storageText: 'Disque Dur 1 To',
  powerOrCableImage: cat6Carton,
  powerOrCableText: 'Carton Câble Cat6 (305m)',
  wiringImage: rj45Connectors,
  wiringText: 'Câblage Réseau PoE',
  connectorsImage: rj45Connectors,
  connectorsText: '16 Connecteurs RJ45',
});

buildPackImage({
  outFile: 'pack_ip_poe_16.jpg',
  title: 'PACK IP NUMÉRIQUE PoE 16 CAMÉRAS',
  subBadge: 'TECHNOLOGIE IP NUMÉRIQUE PoE HIKVISION',
  camImage: ipCam2MP,
  camCount: 16,
  recorderImage: nvr16ch,
  recorderName: 'NVR 16ch PoE DS-7616NI-Q2/16P',
  storageText: 'Disque Dur 2 To',
  powerOrCableImage: cat6Carton,
  powerOrCableText: '2 Cartons Cat6 (610m)',
  wiringImage: rj45Connectors,
  wiringText: 'Câblage Réseau PoE',
  connectorsImage: rj45Connectors,
  connectorsText: '32 Connecteurs RJ45',
});

buildPackImage({
  outFile: 'pack_ip_pro_4mp_4.jpg',
  title: 'PACK IP NUMÉRIQUE PoE PRO 4MP',
  subBadge: 'RÉSOLUTION 4MP ULTRA HD ACUSENSE',
  camImage: ipCam4MP,
  camCount: 4,
  recorderImage: nvr4ch,
  recorderName: 'NVR 4ch PoE DS-7104NI-Q1/4P/M',
  storageText: 'Disque Dur 1 To',
  powerOrCableImage: cat6Carton,
  powerOrCableText: 'Carton Câble Cat6 (305m)',
  wiringImage: rj45Connectors,
  wiringText: 'Câblage Réseau PoE',
  connectorsImage: rj45Connectors,
  connectorsText: '8 Connecteurs RJ45',
});

console.log('ALL 12 PACK VISUALS GENERATED WITH CRISP TEXT!');
