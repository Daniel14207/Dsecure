/**
 * D SECURE - Cartographie Officielle des Photographies Produits
 * 
 * Ce fichier établit la correspondance stricte et vérifiée entre chaque référence
 * de matériel Hikvision et le chemin exact de sa photographie originale issue du catalogue.
 * 
 * RÈGLES STRICTES :
 * 1. Unicité 1-pour-1 absolue : aucune image n'est partagée entre plusieurs produits.
 * 2. Aucune image inventée ou générée artificiellement.
 * 3. Seules les photographies réelles du dossier public/assets sont exploitées.
 * 4. Si un produit ne possède pas encore de photo dans public/assets, sa valeur est null.
 */

export interface ProductPhotoMapping {
  id: string;
  reference: string;
  name: string;
  category: string;
  sourceSheet: string;
  sourceRow: string;
  imagePath: string;
}

export const OFFICIAL_PRODUCT_PHOTO_LIST: ProductPhotoMapping[] = [
  {
    "id": "surveillance-analog-2",
    "reference": "DS-2CE16D0T-EXIPF(3.6mm)(O-STD)",
    "name": "DS-2CE16D0T-EXIPF(3.6mm)(O-STD)",
    "category": "Caméras analogiques",
    "sourceSheet": "Analog",
    "sourceRow": "2",
    "imagePath": "/assets/aistudio/analog_r2_c1_9_58c86f3f.jpg"
  },
  {
    "id": "surveillance-analog-5",
    "reference": "DS-2CE76U0T-ITMF 2.8MM (new)",
    "name": "DS-2CE76U0T-ITMF 2.8MM (new)",
    "category": "Caméras analogiques",
    "sourceSheet": "Analog",
    "sourceRow": "5",
    "imagePath": "/assets/aistudio/analog_r5_c1_13_7cef10b3.png"
  },
  {
    "id": "surveillance-analog-10",
    "reference": "DS-2CE16D0T-LPXTS 3.6MM",
    "name": "DS-2CE16D0T-LPXTS 3.6MM",
    "category": "Caméras analogiques",
    "sourceSheet": "Analog",
    "sourceRow": "10",
    "imagePath": "/assets/aistudio/analog_r10_c1_3_5408bd81.png"
  },
  {
    "id": "surveillance-analog-23",
    "reference": "DS-2CE76K0T-LPFS 2.8mm (new)",
    "name": "DS-2CE76K0T-LPFS 2.8mm (new)",
    "category": "Caméras analogiques",
    "sourceSheet": "Analog",
    "sourceRow": "23",
    "imagePath": "/assets/aistudio/analog_r23_c1_17_2896f0f9.jpg"
  },
  {
    "id": "surveillance-analog-24",
    "reference": "DS-2CE16K0T-LFS 3.6MM (new)",
    "name": "DS-2CE16K0T-LFS 3.6MM (new)",
    "category": "Caméras analogiques",
    "sourceSheet": "Analog",
    "sourceRow": "24",
    "imagePath": "/assets/aistudio/analog_r24_c1_11_c40cf9f9.png"
  },
  {
    "id": "surveillance-dvr-16",
    "reference": "DS-E04HGHI-B",
    "name": "DS-E04HGHI-B",
    "category": "Enregistreurs DVR (Turbo HD)",
    "sourceSheet": "DVR",
    "sourceRow": "16",
    "imagePath": "/assets/aistudio/dvr_r16_c1_9_4cf29d1c.jpg"
  },
  {
    "id": "surveillance-hikvision-kit-3",
    "reference": "DS-J142I/7204HGHI-M1+2+2CAM/HYBRID",
    "name": "DS-J142I/7204HGHI-M1+2+2CAM/HYBRID",
    "category": "Kits vidéosurveillance",
    "sourceSheet": "Hikvision KIT",
    "sourceRow": "3",
    "imagePath": "/assets/aistudio/hikvision-kit_r3_c1_1_295ddbc1.jpg"
  },
  {
    "id": "surveillance-ip-2-0-5",
    "reference": "DS-2CD2083G2-I(4mm)(O-STD)",
    "name": "DS-2CD2083G2-I(4mm)(O-STD)",
    "category": "Caméras IP",
    "sourceSheet": "IP 2.0",
    "sourceRow": "5",
    "imagePath": "/assets/aistudio/ip-2-0_r5_c1_8_8b064d4a.jpg"
  },
  {
    "id": "surveillance-ip-2-0-9",
    "reference": "DS-2TD2617-3/QA(O-STD)",
    "name": "DS-2TD2617-3/QA(O-STD)",
    "category": "Caméras IP",
    "sourceSheet": "IP 2.0",
    "sourceRow": "9",
    "imagePath": "/assets/aistudio/ip-2-0_r9_c1_10_980b1157.png"
  },
  {
    "id": "surveillance-ip-2-0-11",
    "reference": "DS-2CD2935FWD-IS(1.16mm)(O-STD)",
    "name": "DS-2CD2935FWD-IS(1.16mm)(O-STD)",
    "category": "Caméras IP",
    "sourceSheet": "IP 2.0",
    "sourceRow": "11",
    "imagePath": "/assets/aistudio/ip-2-0_r11_c1_4_3d61c4be.jpg"
  },
  {
    "id": "surveillance-ip-1-0-3",
    "reference": "DS-2CD1021G0-I 4MM T",
    "name": "DS-2CD1021G0-I 4MM T",
    "category": "Caméras IP",
    "sourceSheet": "IP 1.0",
    "sourceRow": "3",
    "imagePath": "/assets/aistudio/ip-1-0_r3_c1_32_eef30959.jpg"
  },
  {
    "id": "surveillance-ip-1-0-4",
    "reference": "DS-2CD1321G0-I 2.8MM T",
    "name": "DS-2CD1321G0-I 2.8MM T",
    "category": "Caméras IP",
    "sourceSheet": "IP 1.0",
    "sourceRow": "4",
    "imagePath": "/assets/aistudio/ip-1-0_r4_c1_33_11f56b3a.jpg"
  },
  {
    "id": "surveillance-ip-1-0-9",
    "reference": "DS-2CD1143G2-LIU 2.8MM （new)",
    "name": "DS-2CD1143G2-LIU 2.8MM （new)",
    "category": "Caméras IP",
    "sourceSheet": "IP 1.0",
    "sourceRow": "9",
    "imagePath": "/assets/aistudio/ip-1-0_r9_c1_17_6189ab9a.jpg"
  },
  {
    "id": "surveillance-ip-1-0-11",
    "reference": "DS-2CD1027G2H-LIUF/SL(4mm)",
    "name": "DS-2CD1027G2H-LIUF/SL(4mm)",
    "category": "Caméras IP",
    "sourceSheet": "IP 1.0",
    "sourceRow": "11",
    "imagePath": "/assets/aistudio/ip-1-0_r11_c1_27_dac66d1d.png"
  },
  {
    "id": "surveillance-ip-1-0-14",
    "reference": "DS-2CD1047G2H-LIUF/SL(4mm)(O-STD)",
    "name": "DS-2CD1047G2H-LIUF/SL(4mm)(O-STD)",
    "category": "Caméras IP",
    "sourceSheet": "IP 1.0",
    "sourceRow": "14",
    "imagePath": "/assets/aistudio/ip-1-0_r14_c1_30_dac66d1d.png"
  },
  {
    "id": "surveillance-ip-1-0-17",
    "reference": "DS-2CD1T47G3-LIU/LSRB 4MM",
    "name": "DS-2CD1T47G3-LIU/LSRB 4MM",
    "category": "Caméras IP",
    "sourceSheet": "IP 1.0",
    "sourceRow": "17",
    "imagePath": "/assets/aistudio/ip-1-0_r17_c1_34_a560fce1.jpg"
  },
  {
    "id": "surveillance-ip-1-0-18",
    "reference": "DS-2CD1T27G3-LIU/LSRB 4MM",
    "name": "DS-2CD1T27G3-LIU/LSRB 4MM",
    "category": "Caméras IP",
    "sourceSheet": "IP 1.0",
    "sourceRow": "18",
    "imagePath": "/assets/aistudio/ip-1-0_r18_c1_35_a560fce1.jpg"
  },
  {
    "id": "surveillance-ip-1-0-22",
    "reference": "DS-2CD1083G2-LIU(4mm)(O-STD)",
    "name": "DS-2CD1083G2-LIU(4mm)(O-STD)",
    "category": "Caméras IP",
    "sourceSheet": "IP 1.0",
    "sourceRow": "22",
    "imagePath": "/assets/aistudio/ip-1-0_r22_c1_22_feccad00.jpg"
  },
  {
    "id": "surveillance-ip-1-0-27",
    "reference": "DS-2CD1153G0-I(2.8mm)(C)(O-STD)",
    "name": "DS-2CD1153G0-I(2.8mm)(C)(O-STD)",
    "category": "Caméras IP",
    "sourceSheet": "IP 1.0",
    "sourceRow": "27",
    "imagePath": "/assets/aistudio/ip-1-0_r27_c1_10_2d61c6cf.jpg"
  },
  {
    "id": "surveillance-ip-1-0-38",
    "reference": "DS-2CD1027G2-LUF(4mm)(O-STD)（new)",
    "name": "DS-2CD1027G2-LUF(4mm)(O-STD)（new)",
    "category": "Caméras IP",
    "sourceSheet": "IP 1.0",
    "sourceRow": "38",
    "imagePath": "/assets/aistudio/ip-1-0_r38_c1_19_caf4277b.jpg"
  },
  {
    "id": "surveillance-ip-1-0-41",
    "reference": "DS-2CD1047G2-LUF(4mm)(O-STD)（new)",
    "name": "DS-2CD1047G2-LUF(4mm)(O-STD)（new)",
    "category": "Caméras IP",
    "sourceSheet": "IP 1.0",
    "sourceRow": "41",
    "imagePath": "/assets/aistudio/ip-1-0_r41_c1_12_caf4277b.jpg"
  },
  {
    "id": "surveillance-ip-1-0-46",
    "reference": "DS-2CD1T47G2-LUF 4MM （new)",
    "name": "DS-2CD1T47G2-LUF 4MM （new)",
    "category": "Caméras IP",
    "sourceSheet": "IP 1.0",
    "sourceRow": "46",
    "imagePath": "/assets/aistudio/ip-1-0_r46_c1_18_9897ae6b.jpg"
  },
  {
    "id": "surveillance-ptz-7",
    "reference": "DS-2SE4C415MWG-E/14(F0)",
    "name": "DS-2SE4C415MWG-E/14(F0)",
    "category": "Caméras PTZ motorisées",
    "sourceSheet": "PTZ",
    "sourceRow": "7",
    "imagePath": "/assets/aistudio/ptz_r7_c1_5_a6c9b58f.jpg"
  },
  {
    "id": "surveillance-solar-powered-security-camera-3",
    "reference": "DS-2XS2T41G0-ID(W)(/4G)/C04S05",
    "name": "DS-2XS2T41G0-ID(W)(/4G)/C04S05",
    "category": "Caméras solaires 4G",
    "sourceSheet": "Solar-powered Security camera",
    "sourceRow": "3",
    "imagePath": "/assets/aistudio/solar-powered-security-camera_r3_c2_1_8c4d9aec.jpg"
  },
  {
    "id": "surveillance-monitor-5",
    "reference": "DS-D5032QE",
    "name": "DS-D5032QE",
    "category": "Moniteurs de surveillance",
    "sourceSheet": "MONITOR",
    "sourceRow": "5",
    "imagePath": "/assets/aistudio/monitor_r5_c1_2_a0c80a70.jpg"
  },
  {
    "id": "surveillance-monitor-6",
    "reference": "DS-D5027FN01",
    "name": "DS-D5027FN01",
    "category": "Moniteurs de surveillance",
    "sourceSheet": "MONITOR",
    "sourceRow": "6",
    "imagePath": "/assets/aistudio/monitor_r6_c1_10_872cbb3f.jpg"
  },
  {
    "id": "surveillance-monitor-12",
    "reference": "DS-D5SC3B-B (Wireless Dongle)",
    "name": "DS-D5SC3B-B (Wireless Dongle)",
    "category": "Moniteurs de surveillance",
    "sourceSheet": "MONITOR",
    "sourceRow": "12",
    "imagePath": "/assets/aistudio/monitor_r12_c1_13_624f6e33.jpg"
  },
  {
    "id": "surveillance-monitor-13",
    "reference": "DS-D5SC3B-W (Wireless Dongle)",
    "name": "DS-D5SC3B-W (Wireless Dongle)",
    "category": "Moniteurs de surveillance",
    "sourceSheet": "MONITOR",
    "sourceRow": "13",
    "imagePath": "/assets/aistudio/monitor_r13_c1_14_044c0312.jpg"
  },
  {
    "id": "surveillance-monitor-14",
    "reference": "DS-D5AC11T5-8S2",
    "name": "DS-D5AC11T5-8S2",
    "category": "Moniteurs de surveillance",
    "sourceSheet": "MONITOR",
    "sourceRow": "14",
    "imagePath": "/assets/aistudio/monitor_r14_c1_5_ec2c97c4.jpg"
  },
  {
    "id": "surveillance-hdd-3",
    "reference": "HDD",
    "name": "ST2000VX012",
    "category": "Disques durs de surveillance",
    "sourceSheet": "HDD",
    "sourceRow": "3",
    "imagePath": "/assets/aistudio/hdd_r3_c3_1_99ab58a0.png"
  },
  {
    "id": "surveillance-hdd-5",
    "reference": "HDD",
    "name": "ST6000VX001",
    "category": "Disques durs de surveillance",
    "sourceSheet": "HDD",
    "sourceRow": "5",
    "imagePath": "/assets/aistudio/hdd_r5_c3_4_99ab58a0.png"
  },
  {
    "id": "surveillance-nvr-2",
    "reference": "DS-7608NXI-K1(E)",
    "name": "DS-7608NXI-K1(E)",
    "category": "Enregistreurs NVR (Réseau IP)",
    "sourceSheet": "NVR",
    "sourceRow": "2",
    "imagePath": "/assets/aistudio/nvr_r2_c1_1_607b2ad6.png"
  },
  {
    "id": "surveillance-nvr-4",
    "reference": "DS-7632NXI-K2",
    "name": "DS-7632NXI-K2",
    "category": "Enregistreurs NVR (Réseau IP)",
    "sourceSheet": "NVR",
    "sourceRow": "4",
    "imagePath": "/assets/aistudio/nvr_r4_c1_9_365fded7.jpg"
  },
  {
    "id": "surveillance-nvr-5",
    "reference": "DS-7732NXI-K4",
    "name": "DS-7732NXI-K4",
    "category": "Enregistreurs NVR (Réseau IP)",
    "sourceSheet": "NVR",
    "sourceRow": "5",
    "imagePath": "/assets/aistudio/nvr_r5_c1_2_d98d7f69.png"
  },
  {
    "id": "surveillance-nvr-6",
    "reference": "DS-7732NI-K4/16P",
    "name": "DS-7732NI-K4/16P",
    "category": "Enregistreurs NVR (Réseau IP)",
    "sourceSheet": "NVR",
    "sourceRow": "6",
    "imagePath": "/assets/aistudio/nvr_r6_c1_8_d5977e04.jpg"
  },
  {
    "id": "surveillance-transmission-7",
    "reference": "DS-1M02",
    "name": "DS-1M02",
    "category": "Transmission vidéo & Baluns",
    "sourceSheet": "Transmission",
    "sourceRow": "7",
    "imagePath": "/assets/aistudio/transmission_r7_c1_1_ac08cd3b.png"
  },
  {
    "id": "surveillance-transmission-17",
    "reference": "DS-2FA1205-D8(EUR)",
    "name": "DS-2FA1205-D8(EUR)",
    "category": "Transmission vidéo & Baluns",
    "sourceSheet": "Transmission",
    "sourceRow": "17",
    "imagePath": "/assets/aistudio/transmission_r17_c1_4_4d17fbe8.png"
  },
  {
    "id": "surveillance-transmission-18",
    "reference": "DS-2FA1208-C16",
    "name": "DS-2FA1208-C16",
    "category": "Transmission vidéo & Baluns",
    "sourceSheet": "Transmission",
    "sourceRow": "18",
    "imagePath": "/assets/aistudio/transmission_r18_c1_5_5a3ba2d4.png"
  },
  {
    "id": "surveillance-switch-3",
    "reference": "DS-3E0505D-E",
    "name": "DS-3E0505D-E",
    "category": "Switchs PoE réseau",
    "sourceSheet": "Switch",
    "sourceRow": "3",
    "imagePath": "/assets/aistudio/switch_r3_c1_1_72f74e66.jpg"
  },
  {
    "id": "surveillance-switch-12",
    "reference": "DS-3E1505P-EI/M(O-STD)",
    "name": "DS-3E1505P-EI/M(O-STD)",
    "category": "Switchs PoE réseau",
    "sourceSheet": "Switch",
    "sourceRow": "12",
    "imagePath": "/assets/aistudio/switch_r12_c1_7_4844c0a5.png"
  },
  {
    "id": "surveillance-switch-14",
    "reference": "DS-3E1526P-EI/M(O-STD)",
    "name": "DS-3E1526P-EI/M(O-STD)",
    "category": "Switchs PoE réseau",
    "sourceSheet": "Switch",
    "sourceRow": "14",
    "imagePath": "/assets/aistudio/switch_r14_c1_6_503775f0.jpg"
  },
  {
    "id": "surveillance-switch-15",
    "reference": "DS-3E1528P-EI",
    "name": "DS-3E1528P-EI",
    "category": "Switchs PoE réseau",
    "sourceSheet": "Switch",
    "sourceRow": "15",
    "imagePath": "/assets/aistudio/switch_r15_c1_15_44ab7a87.png"
  },
  {
    "id": "surveillance-switch-18",
    "reference": "DS-3E0510P-E/M",
    "name": "DS-3E0510P-E/M",
    "category": "Switchs PoE réseau",
    "sourceSheet": "Switch",
    "sourceRow": "18",
    "imagePath": "/assets/aistudio/switch_r18_c1_8_4dc4aa65.png"
  },
  {
    "id": "surveillance-switch-20",
    "reference": "DS-3E0526P-E/M (B)",
    "name": "DS-3E0526P-E/M (B)",
    "category": "Switchs PoE réseau",
    "sourceSheet": "Switch",
    "sourceRow": "20",
    "imagePath": "/assets/aistudio/switch_r20_c1_12_84190b01.png"
  },
  {
    "id": "surveillance-cabinet-4",
    "reference": "DS-XS6409-S/B",
    "name": "DS-XS6409-S/B",
    "category": "Baies & coffrets muraux",
    "sourceSheet": "Cabinet",
    "sourceRow": "4",
    "imagePath": "/assets/aistudio/cabinet_r4_c1_3_db5fdb85.png"
  },
  {
    "id": "surveillance-cabinet-9",
    "reference": "FD1238A2",
    "name": "FD1238A2",
    "category": "Baies & coffrets muraux",
    "sourceSheet": "Cabinet",
    "sourceRow": "9",
    "imagePath": "/assets/aistudio/cabinet_r9_c1_6_42cb49a0.jpg"
  },
  {
    "id": "surveillance-accessories-5",
    "reference": "DS-1280ZJ-DM46",
    "name": "DS-1280ZJ-DM46",
    "category": "Accessoires de fixation & Câblage",
    "sourceSheet": "Accessories",
    "sourceRow": "5",
    "imagePath": "/assets/aistudio/accessories_r5_c1_3_73f60160.jpg"
  },
  {
    "id": "surveillance-ac-router-ap-3",
    "reference": "DS-3WAP521-SI (In-Wall AP)",
    "name": "Wi-Fi 5 1200M In-Wall Access Point",
    "category": "Points d accès & Routeurs AC",
    "sourceSheet": "AC Router&AP",
    "sourceRow": "3",
    "imagePath": "/assets/aistudio/ac-router-ap_r3_c2_2_3cbaa76f.png"
  },
  {
    "id": "surveillance-wireless-router-3",
    "reference": "DS-3WRE3N",
    "name": "11N 300M",
    "category": "Routeurs Wi-Fi 6",
    "sourceSheet": "Wireless Router",
    "sourceRow": "3",
    "imagePath": "/assets/aistudio/wireless-router_r3_c1_8_3ab1a39b.png"
  },
  {
    "id": "surveillance-wireless-router-6",
    "reference": "DS-3WR12C",
    "name": "AC 1200M",
    "category": "Routeurs Wi-Fi 6",
    "sourceSheet": "Wireless Router",
    "sourceRow": "6",
    "imagePath": "/assets/aistudio/wireless-router_r6_c1_7_7fc0b986.jpg"
  },
  {
    "id": "surveillance-wireless-router-15",
    "reference": "AC 1200M Mesh \n3 Pack",
    "name": "AC 1200M Mesh \n3 Pack",
    "category": "Routeurs Wi-Fi 6",
    "sourceSheet": "Wireless Router",
    "sourceRow": "15",
    "imagePath": "/assets/aistudio/wireless-router_r15_c2_12_431dc4d2.png"
  },
  {
    "id": "surveillance-wireless-router-17",
    "reference": "DS-3WF02C-5AC/O",
    "name": "Wireless Devices",
    "category": "Routeurs Wi-Fi 6",
    "sourceSheet": "Wireless Router",
    "sourceRow": "17",
    "imagePath": "/assets/aistudio/wireless-router_r17_c1_1_aef31f44.jpg"
  },
  {
    "id": "surveillance-wireless-router-19",
    "reference": "DS-3WF0AC-2NT",
    "name": "Wireless Devices",
    "category": "Routeurs Wi-Fi 6",
    "sourceSheet": "Wireless Router",
    "sourceRow": "19",
    "imagePath": "/assets/aistudio/wireless-router_r19_c1_3_65442cf8.jpg"
  },
  {
    "id": "surveillance-accessory-4",
    "reference": "HDMI Cable, 4K30Hz, 2m, Gray,",
    "name": "HDMI Cable, 4K30Hz, 2m, Gray,",
    "category": "Accessoires de fixation & Câblage",
    "sourceSheet": "Accessory",
    "sourceRow": "4",
    "imagePath": "/assets/aistudio/accessory_r4_c1_1_9ce7f5b0.png"
  },
  {
    "id": "surveillance-accessory-27",
    "reference": "DS-1LH1SCAM592C(O-STD) 90m",
    "name": "Coaxial Cable with power",
    "category": "Accessoires de fixation & Câblage",
    "sourceSheet": "Accessory",
    "sourceRow": "27",
    "imagePath": "/assets/aistudio/accessory_r27_c1_4_f4c17122.png"
  },
  {
    "id": "surveillance-accessory-28",
    "reference": "DS-1LH1SCAM592C(O-STD) 180m",
    "name": "DS-1LH1SCAM592C(O-STD) 180m",
    "category": "Accessoires de fixation & Câblage",
    "sourceSheet": "Accessory",
    "sourceRow": "28",
    "imagePath": "/assets/aistudio/accessory_r28_c1_5_7074a455.png"
  },
  {
    "id": "surveillance-accessory-31",
    "reference": "DS-1T03/E",
    "name": "Cable clamp",
    "category": "Accessoires de fixation & Câblage",
    "sourceSheet": "Accessory",
    "sourceRow": "31",
    "imagePath": "/assets/aistudio/accessory_r31_c1_6_b6503b8c.png"
  },
  {
    "id": "alarms-wireless-intrusion-alarm-11",
    "reference": "DS-PDMC-EG2-WB(O-STD)",
    "name": "Wireless Magnetic Contact",
    "category": "Systèmes d alarme sans fil AX PRO",
    "sourceSheet": "Wireless Intrusion Alarm",
    "sourceRow": "11",
    "imagePath": "/assets/aistudio/wireless-intrusion-alarm_r11_c3_6_01a14db1.jpg"
  },
  {
    "id": "alarms-wireless-intrusion-alarm-22",
    "reference": "DS-PM1-O1L-WB",
    "name": "Wireless I&O Expander",
    "category": "Systèmes d alarme sans fil AX PRO",
    "sourceSheet": "Wireless Intrusion Alarm",
    "sourceRow": "22",
    "imagePath": "/assets/aistudio/wireless-intrusion-alarm_r22_c3_23_431cb522.jpg"
  },
  {
    "id": "alarms-wireless-intrusion-alarm-24",
    "reference": "DS-PDSMK-S-WB(O-STD)",
    "name": "Wireless Photoelectric Smoke Detector",
    "category": "Systèmes d alarme sans fil AX PRO",
    "sourceSheet": "Wireless Intrusion Alarm",
    "sourceRow": "24",
    "imagePath": "/assets/aistudio/wireless-intrusion-alarm_r24_c3_8_a85d89bb.jpg"
  },
  {
    "id": "alarms-wired-intrusion-alarm-7",
    "reference": "DS-PS1-R",
    "name": "Wired External Sounder",
    "category": "Systèmes d alarme filaires",
    "sourceSheet": "Wired Intrusion Alarm",
    "sourceRow": "7",
    "imagePath": "/assets/aistudio/wired-intrusion-alarm_r7_c3_5_d5abe121.jpg"
  },
  {
    "id": "alarms-wired-intrusion-alarm-9",
    "reference": "DS-PM2-G",
    "name": "Communication Module",
    "category": "Systèmes d alarme filaires",
    "sourceSheet": "Wired Intrusion Alarm",
    "sourceRow": "9",
    "imagePath": "/assets/aistudio/wired-intrusion-alarm_r9_c3_6_6ca72311.jpg"
  },
  {
    "id": "alarms-wired-intrusion-alarm-20",
    "reference": "DS-PD1-MC-WS",
    "name": "Wired Magnetic Contact",
    "category": "Systèmes d alarme filaires",
    "sourceSheet": "Wired Intrusion Alarm",
    "sourceRow": "20",
    "imagePath": "/assets/aistudio/wired-intrusion-alarm_r20_c3_16_f91306d0.jpg"
  },
  {
    "id": "alarms-wired-intrusion-alarm-21",
    "reference": "DS-PDB-IN-Ceilingbracket",
    "name": "Internal Detector Accessory",
    "category": "Systèmes d alarme filaires",
    "sourceSheet": "Wired Intrusion Alarm",
    "sourceRow": "21",
    "imagePath": "/assets/aistudio/wired-intrusion-alarm_r21_c3_17_d3cc7b4b.jpg"
  }
];

export const PRODUCT_IMAGE_BY_ID: Record<string, string> = {
  "surveillance-analog-2": "/assets/aistudio/analog_r2_c1_9_58c86f3f.jpg",
  "surveillance-analog-5": "/assets/aistudio/analog_r5_c1_13_7cef10b3.png",
  "surveillance-analog-10": "/assets/aistudio/analog_r10_c1_3_5408bd81.png",
  "surveillance-analog-23": "/assets/aistudio/analog_r23_c1_17_2896f0f9.jpg",
  "surveillance-analog-24": "/assets/aistudio/analog_r24_c1_11_c40cf9f9.png",
  "surveillance-dvr-16": "/assets/aistudio/dvr_r16_c1_9_4cf29d1c.jpg",
  "surveillance-hikvision-kit-3": "/assets/aistudio/hikvision-kit_r3_c1_1_295ddbc1.jpg",
  "surveillance-ip-2-0-5": "/assets/aistudio/ip-2-0_r5_c1_8_8b064d4a.jpg",
  "surveillance-ip-2-0-9": "/assets/aistudio/ip-2-0_r9_c1_10_980b1157.png",
  "surveillance-ip-2-0-11": "/assets/aistudio/ip-2-0_r11_c1_4_3d61c4be.jpg",
  "surveillance-ip-1-0-3": "/assets/aistudio/ip-1-0_r3_c1_32_eef30959.jpg",
  "surveillance-ip-1-0-4": "/assets/aistudio/ip-1-0_r4_c1_33_11f56b3a.jpg",
  "surveillance-ip-1-0-9": "/assets/aistudio/ip-1-0_r9_c1_17_6189ab9a.jpg",
  "surveillance-ip-1-0-11": "/assets/aistudio/ip-1-0_r11_c1_27_dac66d1d.png",
  "surveillance-ip-1-0-14": "/assets/aistudio/ip-1-0_r14_c1_30_dac66d1d.png",
  "surveillance-ip-1-0-17": "/assets/aistudio/ip-1-0_r17_c1_34_a560fce1.jpg",
  "surveillance-ip-1-0-18": "/assets/aistudio/ip-1-0_r18_c1_35_a560fce1.jpg",
  "surveillance-ip-1-0-22": "/assets/aistudio/ip-1-0_r22_c1_22_feccad00.jpg",
  "surveillance-ip-1-0-27": "/assets/aistudio/ip-1-0_r27_c1_10_2d61c6cf.jpg",
  "surveillance-ip-1-0-38": "/assets/aistudio/ip-1-0_r38_c1_19_caf4277b.jpg",
  "surveillance-ip-1-0-41": "/assets/aistudio/ip-1-0_r41_c1_12_caf4277b.jpg",
  "surveillance-ip-1-0-46": "/assets/aistudio/ip-1-0_r46_c1_18_9897ae6b.jpg",
  "surveillance-ptz-7": "/assets/aistudio/ptz_r7_c1_5_a6c9b58f.jpg",
  "surveillance-solar-powered-security-camera-3": "/assets/aistudio/solar-powered-security-camera_r3_c2_1_8c4d9aec.jpg",
  "surveillance-monitor-5": "/assets/aistudio/monitor_r5_c1_2_a0c80a70.jpg",
  "surveillance-monitor-6": "/assets/aistudio/monitor_r6_c1_10_872cbb3f.jpg",
  "surveillance-monitor-12": "/assets/aistudio/monitor_r12_c1_13_624f6e33.jpg",
  "surveillance-monitor-13": "/assets/aistudio/monitor_r13_c1_14_044c0312.jpg",
  "surveillance-monitor-14": "/assets/aistudio/monitor_r14_c1_5_ec2c97c4.jpg",
  "surveillance-hdd-3": "/assets/aistudio/hdd_r3_c3_1_99ab58a0.png",
  "surveillance-hdd-5": "/assets/aistudio/hdd_r5_c3_4_99ab58a0.png",
  "surveillance-nvr-2": "/assets/aistudio/nvr_r2_c1_1_607b2ad6.png",
  "surveillance-nvr-4": "/assets/aistudio/nvr_r4_c1_9_365fded7.jpg",
  "surveillance-nvr-5": "/assets/aistudio/nvr_r5_c1_2_d98d7f69.png",
  "surveillance-nvr-6": "/assets/aistudio/nvr_r6_c1_8_d5977e04.jpg",
  "surveillance-transmission-7": "/assets/aistudio/transmission_r7_c1_1_ac08cd3b.png",
  "surveillance-transmission-17": "/assets/aistudio/transmission_r17_c1_4_4d17fbe8.png",
  "surveillance-transmission-18": "/assets/aistudio/transmission_r18_c1_5_5a3ba2d4.png",
  "surveillance-switch-3": "/assets/aistudio/switch_r3_c1_1_72f74e66.jpg",
  "surveillance-switch-12": "/assets/aistudio/switch_r12_c1_7_4844c0a5.png",
  "surveillance-switch-14": "/assets/aistudio/switch_r14_c1_6_503775f0.jpg",
  "surveillance-switch-15": "/assets/aistudio/switch_r15_c1_15_44ab7a87.png",
  "surveillance-switch-18": "/assets/aistudio/switch_r18_c1_8_4dc4aa65.png",
  "surveillance-switch-20": "/assets/aistudio/switch_r20_c1_12_84190b01.png",
  "surveillance-cabinet-4": "/assets/aistudio/cabinet_r4_c1_3_db5fdb85.png",
  "surveillance-cabinet-9": "/assets/aistudio/cabinet_r9_c1_6_42cb49a0.jpg",
  "surveillance-accessories-5": "/assets/aistudio/accessories_r5_c1_3_73f60160.jpg",
  "surveillance-ac-router-ap-3": "/assets/aistudio/ac-router-ap_r3_c2_2_3cbaa76f.png",
  "surveillance-wireless-router-3": "/assets/aistudio/wireless-router_r3_c1_8_3ab1a39b.png",
  "surveillance-wireless-router-6": "/assets/aistudio/wireless-router_r6_c1_7_7fc0b986.jpg",
  "surveillance-wireless-router-15": "/assets/aistudio/wireless-router_r15_c2_12_431dc4d2.png",
  "surveillance-wireless-router-17": "/assets/aistudio/wireless-router_r17_c1_1_aef31f44.jpg",
  "surveillance-wireless-router-19": "/assets/aistudio/wireless-router_r19_c1_3_65442cf8.jpg",
  "surveillance-accessory-4": "/assets/aistudio/accessory_r4_c1_1_9ce7f5b0.png",
  "surveillance-accessory-27": "/assets/aistudio/accessory_r27_c1_4_f4c17122.png",
  "surveillance-accessory-28": "/assets/aistudio/accessory_r28_c1_5_7074a455.png",
  "surveillance-accessory-31": "/assets/aistudio/accessory_r31_c1_6_b6503b8c.png",
  "alarms-wireless-intrusion-alarm-11": "/assets/aistudio/wireless-intrusion-alarm_r11_c3_6_01a14db1.jpg",
  "alarms-wireless-intrusion-alarm-22": "/assets/aistudio/wireless-intrusion-alarm_r22_c3_23_431cb522.jpg",
  "alarms-wireless-intrusion-alarm-24": "/assets/aistudio/wireless-intrusion-alarm_r24_c3_8_a85d89bb.jpg",
  "alarms-wired-intrusion-alarm-7": "/assets/aistudio/wired-intrusion-alarm_r7_c3_5_d5abe121.jpg",
  "alarms-wired-intrusion-alarm-9": "/assets/aistudio/wired-intrusion-alarm_r9_c3_6_6ca72311.jpg",
  "alarms-wired-intrusion-alarm-20": "/assets/aistudio/wired-intrusion-alarm_r20_c3_16_f91306d0.jpg",
  "alarms-wired-intrusion-alarm-21": "/assets/aistudio/wired-intrusion-alarm_r21_c3_17_d3cc7b4b.jpg",
};

export const PRODUCT_IMAGE_BY_REFERENCE: Record<string, string> = {
  "DS-2CE16D0T-EXIPF(3.6mm)(O-STD)": "/assets/aistudio/analog_r2_c1_9_58c86f3f.jpg",
  "DS-2CE76U0T-ITMF 2.8MM (new)": "/assets/aistudio/analog_r5_c1_13_7cef10b3.png",
  "DS-2CE16D0T-LPXTS 3.6MM": "/assets/aistudio/analog_r10_c1_3_5408bd81.png",
  "DS-2CE76K0T-LPFS 2.8mm (new)": "/assets/aistudio/analog_r23_c1_17_2896f0f9.jpg",
  "DS-2CE16K0T-LFS 3.6MM (new)": "/assets/aistudio/analog_r24_c1_11_c40cf9f9.png",
  "DS-E04HGHI-B": "/assets/aistudio/dvr_r16_c1_9_4cf29d1c.jpg",
  "DS-J142I/7204HGHI-M1+2+2CAM/HYBRID": "/assets/aistudio/hikvision-kit_r3_c1_1_295ddbc1.jpg",
  "DS-2CD2083G2-I(4mm)(O-STD)": "/assets/aistudio/ip-2-0_r5_c1_8_8b064d4a.jpg",
  "DS-2TD2617-3/QA(O-STD)": "/assets/aistudio/ip-2-0_r9_c1_10_980b1157.png",
  "DS-2CD2935FWD-IS(1.16mm)(O-STD)": "/assets/aistudio/ip-2-0_r11_c1_4_3d61c4be.jpg",
  "DS-2CD1021G0-I 4MM T": "/assets/aistudio/ip-1-0_r3_c1_32_eef30959.jpg",
  "DS-2CD1321G0-I 2.8MM T": "/assets/aistudio/ip-1-0_r4_c1_33_11f56b3a.jpg",
  "DS-2CD1143G2-LIU 2.8MM （new)": "/assets/aistudio/ip-1-0_r9_c1_17_6189ab9a.jpg",
  "DS-2CD1027G2H-LIUF/SL(4mm)": "/assets/aistudio/ip-1-0_r11_c1_27_dac66d1d.png",
  "DS-2CD1047G2H-LIUF/SL(4mm)(O-STD)": "/assets/aistudio/ip-1-0_r14_c1_30_dac66d1d.png",
  "DS-2CD1T47G3-LIU/LSRB 4MM": "/assets/aistudio/ip-1-0_r17_c1_34_a560fce1.jpg",
  "DS-2CD1T27G3-LIU/LSRB 4MM": "/assets/aistudio/ip-1-0_r18_c1_35_a560fce1.jpg",
  "DS-2CD1083G2-LIU(4mm)(O-STD)": "/assets/aistudio/ip-1-0_r22_c1_22_feccad00.jpg",
  "DS-2CD1153G0-I(2.8mm)(C)(O-STD)": "/assets/aistudio/ip-1-0_r27_c1_10_2d61c6cf.jpg",
  "DS-2CD1027G2-LUF(4mm)(O-STD)（new)": "/assets/aistudio/ip-1-0_r38_c1_19_caf4277b.jpg",
  "DS-2CD1047G2-LUF(4mm)(O-STD)（new)": "/assets/aistudio/ip-1-0_r41_c1_12_caf4277b.jpg",
  "DS-2CD1T47G2-LUF 4MM （new)": "/assets/aistudio/ip-1-0_r46_c1_18_9897ae6b.jpg",
  "DS-2SE4C415MWG-E/14(F0)": "/assets/aistudio/ptz_r7_c1_5_a6c9b58f.jpg",
  "DS-2XS2T41G0-ID(W)(/4G)/C04S05": "/assets/aistudio/solar-powered-security-camera_r3_c2_1_8c4d9aec.jpg",
  "DS-D5032QE": "/assets/aistudio/monitor_r5_c1_2_a0c80a70.jpg",
  "DS-D5027FN01": "/assets/aistudio/monitor_r6_c1_10_872cbb3f.jpg",
  "DS-D5SC3B-B (Wireless Dongle)": "/assets/aistudio/monitor_r12_c1_13_624f6e33.jpg",
  "DS-D5SC3B-W (Wireless Dongle)": "/assets/aistudio/monitor_r13_c1_14_044c0312.jpg",
  "DS-D5AC11T5-8S2": "/assets/aistudio/monitor_r14_c1_5_ec2c97c4.jpg",
  "HDD": "/assets/aistudio/hdd_r3_c3_1_99ab58a0.png",
  "ST6000VX001": "/assets/aistudio/hdd_r5_c3_4_99ab58a0.png",
  "DS-7608NXI-K1(E)": "/assets/aistudio/nvr_r2_c1_1_607b2ad6.png",
  "DS-7632NXI-K2": "/assets/aistudio/nvr_r4_c1_9_365fded7.jpg",
  "DS-7732NXI-K4": "/assets/aistudio/nvr_r5_c1_2_d98d7f69.png",
  "DS-7732NI-K4/16P": "/assets/aistudio/nvr_r6_c1_8_d5977e04.jpg",
  "DS-1M02": "/assets/aistudio/transmission_r7_c1_1_ac08cd3b.png",
  "DS-2FA1205-D8(EUR)": "/assets/aistudio/transmission_r17_c1_4_4d17fbe8.png",
  "DS-2FA1208-C16": "/assets/aistudio/transmission_r18_c1_5_5a3ba2d4.png",
  "DS-3E0505D-E": "/assets/aistudio/switch_r3_c1_1_72f74e66.jpg",
  "DS-3E1505P-EI/M(O-STD)": "/assets/aistudio/switch_r12_c1_7_4844c0a5.png",
  "DS-3E1526P-EI/M(O-STD)": "/assets/aistudio/switch_r14_c1_6_503775f0.jpg",
  "DS-3E1528P-EI": "/assets/aistudio/switch_r15_c1_15_44ab7a87.png",
  "DS-3E0510P-E/M": "/assets/aistudio/switch_r18_c1_8_4dc4aa65.png",
  "DS-3E0526P-E/M (B)": "/assets/aistudio/switch_r20_c1_12_84190b01.png",
  "DS-XS6409-S/B": "/assets/aistudio/cabinet_r4_c1_3_db5fdb85.png",
  "FD1238A2": "/assets/aistudio/cabinet_r9_c1_6_42cb49a0.jpg",
  "DS-1280ZJ-DM46": "/assets/aistudio/accessories_r5_c1_3_73f60160.jpg",
  "DS-3WAP521-SI (In-Wall AP)": "/assets/aistudio/ac-router-ap_r3_c2_2_3cbaa76f.png",
  "DS-3WRE3N": "/assets/aistudio/wireless-router_r3_c1_8_3ab1a39b.png",
  "DS-3WR12C": "/assets/aistudio/wireless-router_r6_c1_7_7fc0b986.jpg",
  "AC 1200M Mesh \n3 Pack": "/assets/aistudio/wireless-router_r15_c2_12_431dc4d2.png",
  "DS-3WF02C-5AC/O": "/assets/aistudio/wireless-router_r17_c1_1_aef31f44.jpg",
  "DS-3WF0AC-2NT": "/assets/aistudio/wireless-router_r19_c1_3_65442cf8.jpg",
  "HDMI Cable, 4K30Hz, 2m, Gray,": "/assets/aistudio/accessory_r4_c1_1_9ce7f5b0.png",
  "DS-1LH1SCAM592C(O-STD) 90m": "/assets/aistudio/accessory_r27_c1_4_f4c17122.png",
  "DS-1LH1SCAM592C(O-STD) 180m": "/assets/aistudio/accessory_r28_c1_5_7074a455.png",
  "DS-1T03/E": "/assets/aistudio/accessory_r31_c1_6_b6503b8c.png",
  "DS-PDMC-EG2-WB(O-STD)": "/assets/aistudio/wireless-intrusion-alarm_r11_c3_6_01a14db1.jpg",
  "DS-PM1-O1L-WB": "/assets/aistudio/wireless-intrusion-alarm_r22_c3_23_431cb522.jpg",
  "DS-PDSMK-S-WB(O-STD)": "/assets/aistudio/wireless-intrusion-alarm_r24_c3_8_a85d89bb.jpg",
  "DS-PS1-R": "/assets/aistudio/wired-intrusion-alarm_r7_c3_5_d5abe121.jpg",
  "DS-PM2-G": "/assets/aistudio/wired-intrusion-alarm_r9_c3_6_6ca72311.jpg",
  "DS-PD1-MC-WS": "/assets/aistudio/wired-intrusion-alarm_r20_c3_16_f91306d0.jpg",
  "DS-PDB-IN-Ceilingbracket": "/assets/aistudio/wired-intrusion-alarm_r21_c3_17_d3cc7b4b.jpg",
};

/**
 * Retourne la véritable photographie officielle du produit si elle existe dans public/assets.
 * Retourne null si le matériel n'a pas de photographie originale correspondante.
 */
export function getProductAuthenticImage(reference: string, id?: string): string | null {
  if (id && PRODUCT_IMAGE_BY_ID[id]) {
    return PRODUCT_IMAGE_BY_ID[id];
  }
  if (reference && PRODUCT_IMAGE_BY_REFERENCE[reference]) {
    return PRODUCT_IMAGE_BY_REFERENCE[reference];
  }
  return null;
}
