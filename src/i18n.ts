// Copyrights © 2026 by Worajedt Sitthidumrong

import type { PageKey } from './core/types';

export type Language = 'en' | 'th';

export const pageTitles: Record<Language, Record<PageKey, string>> = {
  en: {
    exposure: 'Exposure Triangle',
    perspective: 'Perspective Compression',
    depth: 'Depth Diagram',
    liveview: 'Liveview Simulation',
    sensorCrop: 'Sensor Crop Comparison',
    bokeh: 'Bokeh Shape Simulator',
    zoneFocus: 'Focus Plane / Zone Focus',
    lensDistortion: 'Lens Distortion',
  },
  th: {
    exposure: 'สามเหลี่ยมค่าแสง',
    perspective: 'การบีบอัดเปอร์สเปคทีฟ',
    depth: 'แผนภาพระยะชัดลึก',
    liveview: 'จำลองภาพไลฟ์วิว',
    sensorCrop: 'เปรียบเทียบครอปเซนเซอร์',
    bokeh: 'จำลองรูปทรงโบเก้',
    zoneFocus: 'โซนโฟกัส',
    lensDistortion: 'ความบิดเบี้ยวของเลนส์',
  },
};

export const pageSummaries: Record<Language, Record<PageKey, string>> = {
  en: {
    exposure: 'Aperture, shutter speed, ISO, brightness, motion blur, and noise.',
    perspective: 'Camera distance, focal length, subject scale, and background compression.',
    depth: 'Top-down optical depth-of-field geometry.',
    liveview: 'Forward-facing camera preview using the same optical settings.',
    sensorCrop: 'Full frame, APS-C, and Micro Four Thirds framing comparison.',
    bokeh: 'Aperture blades, highlight shape, and blur disc behavior.',
    zoneFocus: 'Near/far sharpness zone and hyperfocal focusing.',
    lensDistortion: 'Wide-angle distortion, telephoto flattening, and portrait/grid comparison.',
  },
  th: {
    exposure: 'รูรับแสง ความเร็วชัตเตอร์ ความไวแสง ISO ความสว่าง ภาพเบลอจากการเคลื่อนไหว และจุดรบกวน',
    perspective: 'ระยะกล้อง ความยาวโฟกัส ขนาดตัวแบบ และการบีบอัดฉากหลัง',
    depth: 'เรขาคณิตระยะชัดลึกของกล้องจากมุมมองด้านบน',
    liveview: 'ภาพจำลองช่องมองภาพจากค่ากล้องชุดเดียวกัน',
    sensorCrop: 'เปรียบเทียบกรอบภาพฟูลเฟรม APS-C และ Micro Four Thirds',
    bokeh: 'ใบรูรับแสง รูปทรงไฮไลต์ และพฤติกรรมวงพร่ามัว',
    zoneFocus: 'ช่วงระยะชัดใกล้/ไกล และระยะไฮเปอร์โฟคอล',
    lensDistortion: 'ความบิดเบี้ยวของเลนส์มุมกว้าง การบีบอัดของเลนส์เทเล และการเทียบภาพบุคคล/กริด',
  },
};

const labels = {
  en: {
    topView: 'Top View',
    language: 'Language',
  },
  th: {
    topView: 'มุมมองด้านบน',
    language: 'ภาษา',
  },
} satisfies Record<Language, Record<string, string>>;

export function label(language: Language, key: keyof typeof labels.en) {
  return labels[language][key];
}

const terms = {
  en: {
    aperture: 'Aperture',
    apertureBlades: 'Aperture blades',
    actualDof: 'Actual DOF',
    background: 'Background',
    backgroundDefocus: 'Background defocus',
    backgroundScale: 'Background scale',
    blades: 'Blades',
    cameraDistance: 'Camera distance',
    cameraCutaway: 'Camera cutaway',
    compression: 'Compression',
    evAtIso100: 'EV at ISO 100',
    exposureBias: 'Exposure bias',
    farLimit: 'Far limit',
    fStop: 'F-stop',
    focalLength: 'Focal length',
    focus: 'Focus',
    focusDistance: 'Focus distance',
    fieldOfView: 'Field of view',
    fullFrameFov: 'Full frame FOV',
    highlightSize: 'Highlight size',
    hyperfocal: 'Hyperfocal',
    iso: 'ISO',
    lens: 'Lens',
    lensStaysSame: 'Lens stays same',
    model: 'Model',
    motionBlur: 'Motion blur',
    nearLimit: 'Near limit',
    note: 'Note',
    rendering: 'Rendering',
    sensor: 'Sensor',
    sensorToLensFront: 'Sensor to lens front',
    sensorToSubject: 'Sensor to subject',
    shape: 'Shape',
    sharpZone: 'Sharp zone',
    shutter: 'Shutter',
    shutterSpeed: 'Shutter speed',
    soft: 'Soft',
    status: 'Status',
    subject: 'Subject',
    subjectToBackground: 'Subject to background',
    subjectDistance: 'Subject distance',
    subjectHeight: 'Subject height',
    tele: 'Tele',
    teleFlattening: 'Tele flattening',
    wide: 'Wide',
    wideEmphasis: 'Wide emphasis',
  },
  th: {
    aperture: 'รูรับแสง',
    apertureBlades: 'ใบรูรับแสง',
    actualDof: 'ระยะชัดลึกจริง',
    background: 'ฉากหลัง',
    backgroundDefocus: 'ความพร่ามัวของฉากหลัง',
    backgroundScale: 'สเกลฉากหลัง',
    blades: 'จำนวนใบรูรับแสง',
    cameraDistance: 'ระยะกล้อง',
    cameraCutaway: 'ภาพตัดกล้อง',
    compression: 'การบีบอัดเปอร์สเปคทีฟ',
    evAtIso100: 'EV ที่ ISO 100',
    exposureBias: 'ชดเชยค่าแสง',
    farLimit: 'ขอบเขตชัดไกล',
    fStop: 'ค่า F',
    focalLength: 'ความยาวโฟกัส',
    focus: 'โฟกัส',
    focusDistance: 'ระยะโฟกัส',
    fieldOfView: 'มุมมองภาพ',
    fullFrameFov: 'มุมมองภาพฟูลเฟรม',
    highlightSize: 'ขนาดไฮไลต์',
    hyperfocal: 'ไฮเปอร์โฟคอล',
    iso: 'ความไวแสง ISO',
    lens: 'เลนส์',
    lensStaysSame: 'เลนส์เดิม',
    model: 'แบบจำลอง',
    motionBlur: 'ภาพเบลอจากการเคลื่อนไหว',
    nearLimit: 'ขอบเขตชัดใกล้',
    note: 'หมายเหตุ',
    rendering: 'ลักษณะภาพ',
    sensor: 'เซนเซอร์ภาพ',
    sensorToLensFront: 'เซนเซอร์ถึงหน้าเลนส์',
    sensorToSubject: 'เซนเซอร์ถึงตัวแบบ',
    shape: 'รูปทรง',
    sharpZone: 'อยู่ในช่วงชัด',
    shutter: 'ชัตเตอร์',
    shutterSpeed: 'ความเร็วชัตเตอร์',
    soft: 'อยู่นอกช่วงชัด',
    status: 'สถานะ',
    subject: 'ตัวแบบ',
    subjectToBackground: 'ตัวแบบถึงฉากหลัง',
    subjectDistance: 'ระยะตัวแบบ',
    subjectHeight: 'ความสูงตัวแบบ',
    tele: 'เทเล',
    teleFlattening: 'การบีบอัดของเทเล',
    wide: 'มุมกว้าง',
    wideEmphasis: 'ผลของมุมกว้าง',
  },
} satisfies Record<Language, Record<string, string>>;

export function term(language: Language, key: keyof typeof terms.en) {
  return terms[language][key];
}
