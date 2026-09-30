export type OfficerType = 'สัญญาบัตร' | 'ประทวน' | 'นักเรียน' | '';
export type OfficerGender = 'ชาย' | 'หญิง' | '';
export type OfficerStatus = 'ครองตำแหน่ง' | 'ตำแหน่งว่าง';

export interface PoliceOfficer {
  id: string;
  posNumber: string;       // เลขตำแหน่ง เช่น 0400 04301 0001
  bch: string;             // บช. เช่น สกพ.
  bg: string;              // บก. เช่น สกพ., กองอัตรากำลัง สกพ., กองทะเบียนพล สกพ., กองสวัสดิการ สกพ.
  divisionGroup: string;   // กลุ่มหน่วยงานหลัก (สำหรับจัดหมวดหมู่)
  kk: string;              // กก./ฝ่าย เช่น ฝ่ายอำนวยการ, กอ.รมน.สกพ., ฝ่ายแต่งตั้ง ทพ.
  groupWork: string;       // กลุ่มสายงาน เช่น อำนวยการและสนับสนุน
  lineWork: string;        // สายงาน เช่น บริหารงานอำนวยการและสนับสนุน, ทรัพยากรบุคคล
  duty: string;            // ทำหน้าที่ เช่น บริหารงานอำนวยการและสนับสนุน, ปฏิบัติงาน กอ.รมน.
  rankLevel: string;       // ระดับตำแหน่ง เช่น ผบช., ผบก., ผกก., รอง ผกก., สว., รอง สว., ผบ.หมู่
  position: string;        // ตำแหน่ง เช่น ผบช., รอง ผบช., ผกก., สว., รอง สว., นว.(สบ 2)
  officerType: OfficerType;// สัญญาบัตร / ประทวน
  rank: string;            // ยศ เช่น พล.ต.ท., พล.ต.ต., พ.ต.อ., ร.ต.อ., ส.ต.ต.
  firstName: string;       // ชื่อ
  lastName: string;        // สกุล
  gender: OfficerGender;   // เพศ ชาย / หญิง
  status: OfficerStatus;   // ครองตำแหน่ง / ตำแหน่งว่าง
  phone?: string;          // เบอร์โทรศัพท์ภายใน / มือถือ
  email?: string;          // อีเมลราชการ
  remarks?: string;        // หมายเหตุ
  updatedAt?: string;
}

export interface DivisionCategory {
  id: string;
  name: string;
  shortName: string;
  code: string;
  description: string;
  subdivisions: string[];
}

export interface FilterOptions {
  searchQuery: string;
  selectedBch: string; // 'ALL' or specific บช. เช่น สกพ.
  selectedBg: string;  // 'ALL' or specific บก. เช่น กองทะเบียนพล สกพ.
  selectedKk: string;  // 'ALL' or specific กก./ฝ่าย เช่น ฝ่ายแต่งตั้ง ทพ.
  selectedRankLevel: string;
  selectedOfficerType: string;
  selectedGender: string;
  selectedStatus: string;
}
