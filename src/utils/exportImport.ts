import * as XLSX from 'xlsx';
import { PoliceOfficer, OfficerType, OfficerGender, OfficerStatus } from '../types/police';

export interface ExportOptions {
  filename?: string;
  format: 'xlsx' | 'csv' | 'json';
  onlyFiltered?: boolean;
}

export const THAI_HEADER_MAP: { [key in keyof PoliceOfficer]?: string } = {
  posNumber: 'เลขตำแหน่ง',
  bch: 'บช.',
  bg: 'บก.',
  divisionGroup: 'กลุ่มสังกัด',
  kk: 'กก./ฝ่าย',
  groupWork: 'กลุ่มสายงาน',
  lineWork: 'สายงาน',
  duty: 'ทำหน้าที่',
  rankLevel: 'ระดับตำแหน่ง',
  position: 'ตำแหน่ง',
  officerType: 'สัญญาบัตร/ประทวน/นักเรียน',
  rank: 'ยศ',
  firstName: 'ชื่อ',
  lastName: 'สกุล',
  gender: 'เพศ',
  status: 'สถานะ',
  phone: 'เบอร์ติดต่อ',
  email: 'อีเมล',
  remarks: 'หมายเหตุ'
};

export function exportOfficers(officers: PoliceOfficer[], options: ExportOptions) {
  const dateStr = new Date().toISOString().slice(0, 10);
  const baseName = options.filename || `ทำเนียบข้าราชการตำรวจ_สกพ_${dateStr}`;

  if (options.format === 'json') {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(officers, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${baseName}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    return;
  }

  // Format data for Excel / CSV with Thai headers
  const exportRows = officers.map((off, index) => ({
    'ลำดับ': index + 1,
    'เลขตำแหน่ง': off.posNumber || '',
    'บช.': off.bch || 'สกพ.',
    'บก.': off.bg || '',
    'กลุ่มสังกัด': off.divisionGroup || '',
    'กก./ฝ่าย': off.kk || '',
    'กลุ่มสายงาน': off.groupWork || 'อำนวยการและสนับสนุน',
    'สายงาน': off.lineWork || '',
    'ทำหน้าที่': off.duty || '',
    'ระดับตำแหน่ง': off.rankLevel || '',
    'ตำแหน่ง': off.position || '',
    'สัญญาบัตร/ประทวน/นักเรียน': off.officerType || '',
    'ยศ': off.rank || '',
    'ชื่อ': off.firstName || '',
    'สกุล': off.lastName || '',
    'ชื่อ-สกุล': off.firstName ? `${off.rank || ''} ${off.firstName} ${off.lastName}`.trim() : '(ตำแหน่งว่าง)',
    'เพศ': off.gender || '',
    'สถานะ': off.status || 'ครองตำแหน่ง',
    'เบอร์ติดต่อ': off.phone || '',
    'อีเมล': off.email || '',
    'หมายเหตุ': off.remarks || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportRows);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 6 },  // ลำดับ
    { wch: 18 }, // เลขตำแหน่ง
    { wch: 8 },  // บช.
    { wch: 22 }, // บก.
    { wch: 22 }, // กลุ่มสังกัด
    { wch: 26 }, // กก./ฝ่าย
    { wch: 24 }, // กลุ่มสายงาน
    { wch: 26 }, // สายงาน
    { wch: 26 }, // ทำหน้าที่
    { wch: 14 }, // ระดับตำแหน่ง
    { wch: 18 }, // ตำแหน่ง
    { wch: 14 }, // สัญญาบัตร/ประทวน
    { wch: 12 }, // ยศ
    { wch: 18 }, // ชื่อ
    { wch: 20 }, // สกุล
    { wch: 28 }, // ชื่อ-สกุล
    { wch: 8 },  // เพศ
    { wch: 14 }, // สถานะ
    { wch: 14 }, // เบอร์ติดต่อ
    { wch: 24 }, // อีเมล
    { wch: 24 }  // หมายเหตุ
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'ทำเนียบกำลังพล สกพ.');

  if (options.format === 'xlsx') {
    XLSX.writeFile(workbook, `${baseName}.xlsx`);
  } else if (options.format === 'csv') {
    // Generate CSV with UTF-8 BOM
    const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob(['\uFEFF' + csvOutput], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export function parseUploadedFile(file: File): Promise<PoliceOfficer[]> {
  return new Promise((resolve, reject) => {
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            const officers: PoliceOfficer[] = parsed.map((item, idx) => normalizeRawRow(item, idx));
            resolve(officers);
          } else {
            reject(new Error('ไฟล์ JSON ต้องเป็นรายการข้อมูล (Array)'));
          }
        } catch (err: any) {
          reject(new Error('ไม่สามารถอ่านไฟล์ JSON ได้: ' + err.message));
        }
      };
      reader.onerror = () => reject(new Error('เกิดข้อผิดพลาดในการอ่านไฟล์'));
      reader.readAsText(file);
      return;
    }

    // Excel or CSV file
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          reject(new Error('ไม่พบข้อมูลในไฟล์ที่เลือก'));
          return;
        }

        const officers: PoliceOfficer[] = rawJson.map((row, idx) => normalizeRawRow(row, idx));
        resolve(officers);
      } catch (err: any) {
        reject(new Error('ไม่สามารถประมวลผลไฟล์ Excel/CSV ได้: ' + err.message));
      }
    };
    reader.onerror = () => reject(new Error('เกิดข้อผิดพลาดในการอ่านไฟล์'));
    reader.readAsArrayBuffer(file);
  });
}

function normalizeRawRow(row: any, index: number): PoliceOfficer {
  const getVal = (keys: string[]): string => {
    for (const k of keys) {
      if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') {
        return String(row[k]).trim();
      }
    }
    return '';
  };

  const posNumber = getVal(['เลขตำแหน่ง', 'posNumber', 'pos_number', 'positionNumber', 'ลำดับตำแหน่ง']);
  const bch = getVal(['บช.', 'บช', 'bch', 'bureau']) || 'สกพ.';
  const bg = getVal(['บก.', 'บก', 'bg', 'division']) || 'สกพ.';
  const kk = getVal(['กก.', 'กก', 'กก./ฝ่าย', 'ฝ่าย', 'kk', 'subdivision']) || bg;
  const groupWork = getVal(['กลุ่มสายงาน', 'groupWork', 'jobFamily']) || 'อำนวยการและสนับสนุน';
  const lineWork = getVal(['สายงาน', 'lineWork']) || '';
  const duty = getVal(['ทำหน้าที่', 'duty', 'function']) || '';
  const rankLevel = getVal(['ระดับตำแหน่ง', 'rankLevel', 'rank_level']) || '';
  const position = getVal(['ตำแหน่ง', 'position']) || rankLevel;
  const officerTypeVal = getVal(['สัญญาบัตร/ประทวน/นักเรียน', 'officerType', 'ประเภท']) as OfficerType;
  const rank = getVal(['ยศ', 'rank']) || '';
  let firstName = getVal(['ชื่อ', 'firstName', 'name']) || '';
  let lastName = getVal(['สกุล', 'นามสกุล', 'lastName']) || '';
  const genderVal = getVal(['เพศ', 'gender']) as OfficerGender;
  const statusVal = getVal(['สถานะ', 'status']) as OfficerStatus;
  const phone = getVal(['เบอร์ติดต่อ', 'เบอร์โทร', 'โทร', 'phone', 'telephone']);
  const email = getVal(['อีเมล', 'email']);
  const remarks = getVal(['หมายเหตุ', 'remarks', 'note']);

  // Handle combined "ชื่อ สกุล" or "ชื่อ-สกุล"
  const fullName = getVal(['ชื่อ สกุล', 'ชื่อ-สกุล', 'fullName']);
  if (fullName && (!firstName || !lastName)) {
    const parts = fullName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      firstName = parts[0];
      lastName = parts.slice(1).join(' ');
    } else if (parts.length === 1) {
      firstName = parts[0];
    }
  }

  // Derive officer type if not specified
  let officerType: OfficerType = officerTypeVal;
  if (!officerType) {
    if (['พล.ต.อ.', 'พล.ต.ท.', 'พล.ต.ต.', 'พ.ต.อ.', 'พ.ต.ท.', 'พ.ต.ต.', 'ร.ต.อ.', 'ร.ต.ท.', 'ร.ต.ต.'].some(r => rank.includes(r))) {
      officerType = 'สัญญาบัตร';
    } else if (['ด.ต.', 'จ.ส.ต.', 'ส.ต.อ.', 'ส.ต.ท.', 'ส.ต.ต.'].some(r => rank.includes(r))) {
      officerType = 'ประทวน';
    } else {
      officerType = 'สัญญาบัตร';
    }
  }

  // Derive status
  const status: OfficerStatus = statusVal || (firstName ? 'ครองตำแหน่ง' : 'ตำแหน่งว่าง');

  // Derive division group for navigation
  let divisionGroup = getVal(['กลุ่มสังกัด', 'divisionGroup']);
  if (!divisionGroup) {
    if (bg.includes('อัตรากำลัง') || kk.includes('อต.')) {
      divisionGroup = 'กองอัตรากำลัง (อต.)';
    } else if (bg.includes('ทะเบียนพล') || kk.includes('ทพ.')) {
      divisionGroup = 'กองทะเบียนพล (ทพ.)';
    } else if (bg.includes('สวัสดิการ') || kk.includes('สก.')) {
      divisionGroup = 'กองสวัสดิการ (สก.)';
    } else if (kk.includes('กอ.รมน.')) {
      divisionGroup = 'ผู้บังคับบัญชา สกพ.';
    } else {
      divisionGroup = 'ผู้บังคับบัญชา สกพ.';
    }
  }

  return {
    id: `upload-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 7)}`,
    posNumber: posNumber || `0400-${index + 1}`,
    bch,
    bg,
    divisionGroup,
    kk,
    groupWork,
    lineWork,
    duty,
    rankLevel,
    position,
    officerType,
    rank,
    firstName,
    lastName,
    gender: genderVal === 'หญิง' ? 'หญิง' : genderVal === 'ชาย' ? 'ชาย' : '',
    status,
    phone,
    email,
    remarks,
    updatedAt: new Date().toISOString()
  };
}

export function generateTemplate() {
  const sampleData = [
    {
      'เลขตำแหน่ง': '0400 08305 0999',
      'บช.': 'สกพ.',
      'บก.': 'สกพ.',
      'กลุ่มสังกัด': 'ผู้บังคับบัญชา สกพ.',
      'กก./ฝ่าย': 'ฝ่ายอำนวยการ สกพ.',
      'กลุ่มสายงาน': 'อำนวยการและสนับสนุน',
      'สายงาน': 'อำนวยการ',
      'ทำหน้าที่': 'อำนวยการ',
      'ระดับตำแหน่ง': 'สว.',
      'ตำแหน่ง': 'สว.',
      'สัญญาบัตร/ประทวน/นักเรียน': 'สัญญาบัตร',
      'ยศ': 'พ.ต.ต.',
      'ชื่อ': 'สมชาย',
      'สกุล': 'ใจภักดี',
      'เพศ': 'ชาย',
      'สถานะ': 'ครองตำแหน่ง',
      'เบอร์ติดต่อ': '02-507-8888',
      'อีเมล': 'somchai.j@police.go.th',
      'หมายเหตุ': 'ตัวอย่างข้อมูลนำเข้า'
    },
    {
      'เลขตำแหน่ง': '0401 12357 0999',
      'บช.': 'สกพ.',
      'บก.': 'กองอัตรากำลัง สกพ.',
      'กลุ่มสังกัด': 'กองอัตรากำลัง (อต.)',
      'กก./ฝ่าย': 'ฝ่ายควบคุมอัตรากำลัง อต.',
      'กลุ่มสายงาน': 'อำนวยการและสนับสนุน',
      'สายงาน': 'ธุรการ',
      'ทำหน้าที่': 'ธุรการ',
      'ระดับตำแหน่ง': 'ผบ.หมู่',
      'ตำแหน่ง': 'ผบ.หมู่',
      'สัญญาบัตร/ประทวน/นักเรียน': 'ประทวน',
      'ยศ': 'ส.ต.ต.',
      'ชื่อ': 'วิไลวรรณ',
      'สกุล': 'มีสุข',
      'เพศ': 'หญิง',
      'สถานะ': 'ครองตำแหน่ง',
      'เบอร์ติดต่อ': '02-507-8299',
      'อีเมล': 'wilaiwan.m@police.go.th',
      'หมายเหตุ': ''
    }
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template');
  XLSX.writeFile(wb, 'แบบฟอร์มนำเข้า_ทำเนียบข้าราชการตำรวจ.xlsx');
}
