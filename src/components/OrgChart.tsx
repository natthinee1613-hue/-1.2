import React, { useState, useMemo } from 'react';
import { PoliceOfficer } from '../types/police';
import { 
  Building2, 
  ChevronDown, 
  ChevronUp, 
  Users, 
  UserCheck, 
  AlertCircle, 
  Search, 
  Check, 
  Sparkles,
  GitBranch,
  Shield,
  Award,
  ArrowRight,
  Filter,
  Maximize2,
  Minimize2,
  ShieldAlert,
  Flame
} from 'lucide-react';
import { OrgChartThemeControl, ChartEffectsState, ChartThemeId } from './OrgChartThemeControl';

interface OrgChartProps {
  officers: PoliceOfficer[];
  filteredCount?: number;
  selectedBch: string;
  selectedBg: string;
  selectedKk: string;
  onSelectBch: (bch: string) => void;
  onSelectBg: (bg: string) => void;
  onSelectKk: (kk: string) => void;
  onResetStructure: () => void;
}

export const OrgChart: React.FC<OrgChartProps> = ({
  officers,
  filteredCount,
  selectedBch,
  selectedBg,
  selectedKk,
  onSelectBch,
  onSelectBg,
  onSelectKk,
  onResetStructure
}) => {
  const [searchKk, setSearchKk] = useState('');
  const [collapsedBgs, setCollapsedBgs] = useState<{ [bgName: string]: boolean }>({});
  const [statusFilter, setStatusFilter] = useState<'all' | 'hasVacant' | 'fullyOccupied'>('all');
  const [isChartCoverEnlarged, setIsChartCoverEnlarged] = useState(true);

  // New: Chart Themes & FX State (มุมล่างขวา)
  const [effects, setEffects] = useState<ChartEffectsState>({
    theme: 'pastel-dream',
    glowAura: true,
    shimmer: true,
    watermark: true,
    zoomScale: 1.0,
    columnsLayout: '4-col'
  });

  const toggleCollapse = (bgName: string) => {
    setCollapsedBgs(prev => ({
      ...prev,
      [bgName]: !prev[bgName]
    }));
  };

  // Structured Organization Hierarchy Data
  const orgData = useMemo(() => {
    // 1. Division definitions with leader positions (เรียงตามลำดับ: อต. ➔ ทพ. ➔ สก. ➔ ส่วนกลาง สกพ.)
    const divisions = [
      {
        id: 'bg-ot',
        bgName: 'กองอัตรากำลัง สกพ.',
        title: 'กองอัตรากำลัง (อต.)',
        shortTitle: 'กองอัตรากำลัง (อต.)',
        code: '0401',
        commanderRank: 'พล.ต.ต.',
        commanderName: 'กรีฑา ตันคณารัตน์',
        commanderPosition: 'ผบก.อต.',
        deputies: [
          'พ.ต.อ. ศักรินทร์ ตันติภัณฑรักษ์ (รอง ผบก.)',
          'พ.ต.อ. ปิยะ ขวัญทอง (รอง ผบก.)',
          'พ.ต.อ. ณัฐ บัณฑุรัตน์ (รอง ผบก.)',
          'พ.ต.อ. โพธิรัตน์ ยิ้มเพชร (รอง ผบก.)',
          'พ.ต.อ. ปราบพาล สันติปรานรนต์ (รอง ผบก.)'
        ],
        subdivisions: [
          { name: 'กองอัตรากำลัง สกพ.', desc: 'ผู้บังคับบัญชา & นายเวร อต.' },
          { name: 'ฝ่ายอำนวยการ อต.', desc: 'อำนวยการ งบประมาณ การเงิน ประมวลผล อต.' },
          { name: 'ฝ่ายควบคุมอัตรากำลัง อต.', desc: 'ควบคุมอัตรากำลังพลและทรัพยากรบุคคล' },
          { name: 'ฝ่ายวิเคราะห์ตำแหน่ง 1 อต.', desc: 'วิเคราะห์โครงสร้างและกรอบตำแหน่ง 1' },
          { name: 'ฝ่ายวิเคราะห์ตำแหน่ง 2 อต.', desc: 'วิเคราะห์โครงสร้างและกรอบตำแหน่ง 2' },
          { name: 'ฝ่ายมาตรฐานตำแหน่ง อต.', desc: 'มาตรฐานตำแหน่งและคุณสมบัติเฉพาะ' },
          { name: 'ฝ่ายเงินเพิ่มและเงินประจำตำแหน่ง อต.', desc: 'เงินเพิ่มและเงินประจำตำแหน่งสายงาน' },
          { name: 'กลุ่มงานวิเคราะห์และพัฒนาระบบงาน อต.', desc: 'วิเคราะห์และพัฒนาระบบงาน อต.' }
        ]
      },
      {
        id: 'bg-tp',
        bgName: 'กองทะเบียนพล สกพ.',
        title: 'กองทะเบียนพล (ทพ.)',
        shortTitle: 'กองทะเบียนพล (ทพ.)',
        code: '0402',
        commanderRank: 'พล.ต.ต.',
        commanderName: 'เฉลิมศักดิ์ สุขสำราญ',
        commanderPosition: 'ผบก.ทพ.',
        deputies: [
          'พ.ต.อ. ถาวร มีขำ (รอง ผบก.)',
          'พ.ต.อ. ธงชัย วิไลพรหม (รอง ผบก.)',
          'พ.ต.อ. ศิระกราน ต้นสงวน (รอง ผบก.)',
          'พ.ต.อ. พัฒนพงษ์ ภูมิเจริญ (รอง ผบก.)',
          'พ.ต.อ. สุรศักดิ์ ยุรชาติ (รอง ผบก.)'
        ],
        subdivisions: [
          { name: 'กองทะเบียนพล สกพ.', desc: 'ผู้บังคับบัญชา & นายเวร ทพ.' },
          { name: 'ฝ่ายอำนวยการ ทพ.', desc: 'อำนวยการ นโยบายแผน การเงิน ประมวลผล ทพ.' },
          { name: 'ฝ่ายประวัติบุคคล ทพ.', desc: 'ประวัติข้าราชการตำรวจและฐานข้อมูลกำลังพล' },
          { name: 'ฝ่ายแต่งตั้ง ทพ.', desc: 'การแต่งตั้ง เลื่อนขั้น โยกย้ายตำแหน่ง' },
          { name: 'ฝ่ายบรรจุ ทพ.', desc: 'การบรรจุ แต่งตั้งใหม่ และรับโอนกำลังพล' },
          { name: 'ฝ่ายความชอบ ทพ.', desc: 'การพิจารณาความชอบ เหรียญตรา และเครื่องราชฯ' },
          { name: 'ฝ่ายประเมินบุคคล ทพ.', desc: 'การประเมินบุคคลและการเลื่อนระดับชั้น' },
          { name: 'กลุ่มงานพัฒนาทรัพยากรบุคคล ทพ.', desc: 'พัฒนาและฝึกอบรมทรัพยากรบุคคล' },
          { name: 'สำรองราชการ กองทะเบียนพล', desc: 'อัตราสำรองราชการ กองทะเบียนพล' }
        ]
      },
      {
        id: 'bg-sk',
        bgName: 'กองสวัสดิการ สกพ.',
        title: 'กองสวัสดิการ (สก.)',
        shortTitle: 'กองสวัสดิการ (สก.)',
        code: '0403',
        commanderRank: 'พล.ต.ต.',
        commanderName: 'ยุทธนา จอนขุน',
        commanderPosition: 'ผบก.สก.',
        deputies: [
          'พ.ต.อ. กล้าหาญ โชคพิพัฒน์ไพบูลย์ (รอง ผบก.)',
          'พ.ต.อ. อิทธิโรจน์ พหลเวชช์ (รอง ผบก.)',
          'พ.ต.อ. ปรีชา กองแก้ว (รอง ผบก.)',
          'พ.ต.อ. มโนเชาว์ นิลนนท์ (รอง ผบก.)'
        ],
        subdivisions: [
          { name: 'กองสวัสดิการ สกพ.', desc: 'ผู้บังคับบัญชา & นายเวร สก.' },
          { name: 'ฝ่ายอำนวยการ สก.', desc: 'อำนวยการ งบประมาณ การเงิน ประมวลผล สก.' },
          { name: 'ฝ่ายการจัดสวัสดิการ สก.', desc: 'การจัดและบริหารสิทธิประโยชน์สวัสดิการ' },
          { name: 'ฝ่ายสวัสดิการการเงิน สก.', desc: 'สวัสดิการเงินกู้ ทุนการศึกษา การเงิน' },
          { name: 'ฝ่ายสวัสดิการบ้านพัก สก.', desc: 'สวัสดิการบ้านพักและอาคารที่พักอาศัย' },
          { name: 'ฝ่ายการฌาปนกิจสงเคราะห์ สก.', desc: 'การฌาปนกิจสงเคราะห์ข้าราชการตำรวจ' },
          { name: 'ฝ่ายสโมสรและสันทนาการ สก.', desc: 'งานสโมสร กิจกรรม และสันทนาการตำรวจ' },
          { name: 'ฝ่ายดนตรี สก.', desc: 'วงดุริยางค์ตำรวจ และงานดุริยางคศิลป์' },
          { name: 'ฝ่ายกีฬา สก.', desc: 'การกีฬาตำรวจ และสุขภาพพลานามัย' },
          { name: 'กลุ่มงานอนุศาสนาจารย์ สก.', desc: 'งานอนุศาสนาจารย์ คุณธรรม จริยธรรม' },
          { name: 'สำรองราชการ กองสวัสดิการ', desc: 'อัตราสำรองราชการ กองสวัสดิการ' }
        ]
      },
      {
        id: 'bg-hq',
        bgName: 'สกพ.',
        title: 'สำนักงานกำลังพล (ส่วนกลาง & ฝอ.สกพ. & กอ.รมน.)',
        shortTitle: 'ส่วนกลาง สกพ.',
        code: '0400',
        commanderRank: 'พล.ต.ท.',
        commanderName: 'ชยัตพ์จน สุวรรณรักษ์',
        commanderPosition: 'ผบช.สกพ.',
        deputies: [
          'พล.ต.ต. จักรกฤษ เครือสุนทรวานิช (รอง ผบช.)',
          'พล.ต.ต. ปรีดา สถาวร (รอง ผบช.)',
          'พล.ต.ต. บริสุทธิ์ นุศรีวอ (รอง ผบช.)'
        ],
        subdivisions: [
          { name: 'สกพ.', desc: 'ผู้บังคับบัญชาระดับสูง & นายเวร สกพ.' },
          { name: 'ฝ่ายอำนวยการ สกพ.', desc: 'อำนวยการ ประมวลผล นโยบายและแผน การเงิน สกพ.' },
          { name: 'กอ.รมน.สกพ.', desc: 'ปฏิบัติงาน กอ.รมน.สกพ.' }
        ]
      }
    ];

    return divisions;
  }, []);

  // Stats calculation functions
  const getSubStats = (bgName: string, kkName: string) => {
    const list = officers.filter(o => (o.bg || 'สกพ.') === bgName && (o.kk || o.bg) === kkName);
    const occupied = list.filter(o => o.status === 'ครองตำแหน่ง' && o.firstName).length;
    const vacant = list.length - occupied;
    return { total: list.length, occupied, vacant };
  };

  const getBgStats = (bgName: string) => {
    const list = officers.filter(o => (o.bg || 'สกพ.') === bgName);
    const occupied = list.filter(o => o.status === 'ครองตำแหน่ง' && o.firstName).length;
    const vacant = list.length - occupied;
    return { total: list.length, occupied, vacant };
  };

  const hqTotal = officers.length;
  const hqOccupied = officers.filter(o => o.status === 'ครองตำแหน่ง' && o.firstName).length;
  const hqVacant = hqTotal - hqOccupied;
  const hqCommissioned = officers.filter(o => o.officerType === 'สัญญาบัตร').length;
  const hqNonCommissioned = officers.filter(o => o.officerType === 'ประทวน').length;
  const hqMales = officers.filter(o => (o.status === 'ครองตำแหน่ง' || o.firstName) && o.gender === 'ชาย').length;
  const hqFemales = officers.filter(o => (o.status === 'ครองตำแหน่ง' || o.firstName) && o.gender === 'หญิง').length;
  const effectiveFilteredCount = filteredCount ?? hqTotal;

  const handleExpandAll = () => {
    setCollapsedBgs({});
  };

  const handleCollapseAll = () => {
    const collapsed: { [k: string]: boolean } = {};
    orgData.forEach(d => {
      collapsed[d.bgName] = true;
    });
    setCollapsedBgs(collapsed);
  };

  const allCollapsed = useMemo(() => {
    return orgData.every(d => collapsedBgs[d.bgName]);
  }, [orgData, collapsedBgs]);

  // ฟังก์ชันกำหนดสีธีมพาสเทลสำหรับกรอบพื้นหลัง บก. ทั้ง 4 กองบังคับการ
  const getPastelDivisionStyle = (divIndex: number, bgName: string) => {
    // 4 distinct pastel color palettes for the 4 Divisions:
    // 0: อต. (กองอัตรากำลัง) -> ฟ้าพาสเทล (Soft Pastel Sky)
    // 1: ทพ. (กองทะเบียนพล) -> ม่วงพาสเทล (Soft Pastel Lavender)
    // 2: สก. (กองสวัสดิการ) -> เขียวมิ้นต์พาสเทล (Soft Pastel Mint)
    // 3: สกพ. (ส่วนกลาง) -> พีชชมพูพาสเทล (Soft Pastel Peach Rose)
    const palettes = [
      {
        name: 'ฟ้าพาสเทล',
        containerBg: 'bg-[#f0f7ff] border-[#b9defc] hover:border-sky-400',
        headerBg: 'bg-[#e0f0fe] hover:bg-[#d0e8fc] border-[#b9defc] text-sky-950',
        tagBg: 'bg-sky-200/90 text-sky-900 border border-sky-300 font-bold',
        iconColor: 'text-sky-600',
        accentColor: 'text-sky-900',
        subcardBg: 'bg-white hover:bg-sky-50/70 border-slate-200 hover:border-sky-300 text-slate-800'
      },
      {
        name: 'ม่วงพาสเทล',
        containerBg: 'bg-[#faf5ff] border-[#ebd5ff] hover:border-purple-400',
        headerBg: 'bg-[#f3e8ff] hover:bg-[#ebd5ff] border-[#ebd5ff] text-purple-950',
        tagBg: 'bg-purple-200/90 text-purple-900 border border-purple-300 font-bold',
        iconColor: 'text-purple-600',
        accentColor: 'text-purple-900',
        subcardBg: 'bg-white hover:bg-purple-50/70 border-slate-200 hover:border-purple-300 text-slate-800'
      },
      {
        name: 'เขียวมิ้นต์พาสเทล',
        containerBg: 'bg-[#f0fdf4] border-[#bbf7d0] hover:border-emerald-400',
        headerBg: 'bg-[#dcfce7] hover:bg-[#cbf7d8] border-[#bbf7d0] text-emerald-950',
        tagBg: 'bg-emerald-200/90 text-emerald-900 border border-emerald-300 font-bold',
        iconColor: 'text-emerald-600',
        accentColor: 'text-emerald-900',
        subcardBg: 'bg-white hover:bg-emerald-50/70 border-slate-200 hover:border-emerald-300 text-slate-800'
      },
      {
        name: 'พีชชมพูพาสเทล',
        containerBg: 'bg-[#fff5f5] border-[#fecdd3] hover:border-rose-400',
        headerBg: 'bg-[#ffe4e6] hover:bg-[#fecdd3] border-[#fecdd3] text-rose-950',
        tagBg: 'bg-rose-200/90 text-rose-900 border border-rose-300 font-bold',
        iconColor: 'text-rose-600',
        accentColor: 'text-rose-900',
        subcardBg: 'bg-white hover:bg-rose-50/70 border-slate-200 hover:border-rose-300 text-slate-800'
      }
    ];

    return palettes[divIndex % palettes.length];
  };

  const themeConfig = useMemo(() => {
    return {
      'pastel-dream': {
        masterBg: 'bg-gradient-to-r from-[#171b2d] via-[#22233f] to-[#1c1d35]',
        masterBorder: 'border-purple-300',
        masterGlow: effects.glowAura ? 'shadow-[0_0_30px_rgba(196,181,253,0.35)] ring-2 ring-purple-300/30' : 'shadow-xl',
        accentGold: 'text-purple-200',
        badgeBg: 'bg-gradient-to-r from-purple-300 to-indigo-300 text-slate-950 font-black',
        badgeBorder: 'border-purple-300',
        lineColor: 'from-purple-400 via-indigo-300 to-sky-300',
        distributorColor: 'bg-purple-200',
        activeBgCard: 'bg-[#1e1b4b] text-white border-purple-300/60 shadow-md',
        activeTag: 'bg-purple-300 text-slate-950 font-black',
        activeSubcard: 'bg-purple-600 text-white border-purple-700 shadow-md ring-2 ring-purple-300/40',
        themeName: 'สีพาสเทลละมุนตา'
      },
      'police-navy': {
        masterBg: 'bg-gradient-to-r from-slate-950 via-[#0b192c] to-[#040e1d]',
        masterBorder: 'border-amber-400',
        masterGlow: effects.glowAura ? 'shadow-[0_0_30px_rgba(245,197,66,0.35)] ring-2 ring-amber-400/30' : 'shadow-xl',
        accentGold: 'text-amber-300',
        badgeBg: 'bg-amber-400 text-slate-950',
        badgeBorder: 'border-amber-400',
        lineColor: 'from-amber-500 to-slate-300',
        distributorColor: 'bg-slate-300',
        activeBgCard: 'bg-slate-900 text-white border-amber-500/50',
        activeTag: 'bg-amber-400 text-slate-950',
        activeSubcard: 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-400/40',
        themeName: 'สีกรมท่า-ทอง'
      },
      'police-maroon': {
        masterBg: 'bg-gradient-to-r from-[#200303] via-[#380707] to-[#1f0303]',
        masterBorder: 'border-rose-400',
        masterGlow: effects.glowAura ? 'shadow-[0_0_30px_rgba(244,63,94,0.35)] ring-2 ring-rose-400/30' : 'shadow-xl',
        accentGold: 'text-rose-300',
        badgeBg: 'bg-rose-500 text-white',
        badgeBorder: 'border-rose-400',
        lineColor: 'from-rose-600 to-amber-400',
        distributorColor: 'bg-rose-300',
        activeBgCard: 'bg-[#2b0606] text-white border-rose-400/60',
        activeTag: 'bg-rose-500 text-white',
        activeSubcard: 'bg-rose-700 text-white border-rose-800 shadow-md ring-2 ring-rose-400/40',
        themeName: 'สีเลือดหมู-ทองพิทักษ์'
      },
      'obsidian-gold': {
        masterBg: 'bg-gradient-to-r from-[#000000] via-[#0a0a0a] to-[#121212]',
        masterBorder: 'border-amber-400',
        masterGlow: effects.glowAura ? 'shadow-[0_0_30px_rgba(255,215,0,0.45)] ring-2 ring-amber-400/40' : 'shadow-xl',
        accentGold: 'text-amber-400',
        badgeBg: 'bg-amber-400 text-black',
        badgeBorder: 'border-amber-400',
        lineColor: 'from-amber-400 to-yellow-500',
        distributorColor: 'bg-amber-400/40',
        activeBgCard: 'bg-black text-white border-amber-400',
        activeTag: 'bg-amber-400 text-black',
        activeSubcard: 'bg-amber-500 text-black border-amber-600 shadow-md ring-2 ring-amber-400/60 font-bold',
        themeName: 'สีดำทองออบซิเดียน'
      },
      'emerald-honor': {
        masterBg: 'bg-gradient-to-r from-[#021f14] via-[#063321] to-[#021f14]',
        masterBorder: 'border-emerald-400',
        masterGlow: effects.glowAura ? 'shadow-[0_0_30px_rgba(52,211,153,0.35)] ring-2 ring-emerald-400/30' : 'shadow-xl',
        accentGold: 'text-emerald-300',
        badgeBg: 'bg-emerald-400 text-slate-950',
        badgeBorder: 'border-emerald-400',
        lineColor: 'from-emerald-500 to-teal-400',
        distributorColor: 'bg-emerald-300',
        activeBgCard: 'bg-[#032417] text-white border-emerald-400/60',
        activeTag: 'bg-emerald-400 text-slate-950',
        activeSubcard: 'bg-emerald-700 text-white border-emerald-800 shadow-md ring-2 ring-emerald-400/40',
        themeName: 'สีเขียวมรกตเกียรติยศ'
      },
      'classic-ivory': {
        masterBg: 'bg-gradient-to-r from-[#faf6eb] via-[#f3ede0] to-[#ece3cf] text-slate-900',
        masterBorder: 'border-amber-700',
        masterGlow: effects.glowAura ? 'shadow-[0_0_25px_rgba(180,83,9,0.25)] ring-2 ring-amber-700/30' : 'shadow-xl',
        accentGold: 'text-amber-900',
        badgeBg: 'bg-amber-800 text-amber-50',
        badgeBorder: 'border-amber-700',
        lineColor: 'from-amber-700 to-amber-500',
        distributorColor: 'bg-amber-300',
        activeBgCard: 'bg-[#f4ebe1] text-slate-900 border-amber-700',
        activeTag: 'bg-amber-800 text-white',
        activeSubcard: 'bg-amber-800 text-white border-amber-900 shadow-md ring-2 ring-amber-600/40',
        themeName: 'สีงาช้างคลาสสิก'
      },
      'cyber-cobalt': {
        masterBg: 'bg-gradient-to-r from-[#04112e] via-[#0b2463] to-[#071742]',
        masterBorder: 'border-cyan-400',
        masterGlow: effects.glowAura ? 'shadow-[0_0_30px_rgba(56,189,248,0.4)] ring-2 ring-cyan-400/30' : 'shadow-xl',
        accentGold: 'text-cyan-300',
        badgeBg: 'bg-cyan-400 text-slate-950',
        badgeBorder: 'border-cyan-400',
        lineColor: 'from-cyan-400 to-blue-500',
        distributorColor: 'bg-cyan-300',
        activeBgCard: 'bg-[#061947] text-white border-cyan-400',
        activeTag: 'bg-cyan-400 text-slate-950',
        activeSubcard: 'bg-cyan-600 text-white border-cyan-700 shadow-md ring-2 ring-cyan-400/40',
        themeName: 'สีน้ำเงินไซเบอร์เทค'
      }
    }[effects.theme];
  }, [effects.theme, effects.glowAura]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-4 sm:p-6 mb-6 overflow-hidden relative">
      
      {/* Background Police Crest Watermark (ลูกเล่นลายน้ำ) */}
      {effects.watermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
          <Shield className="w-[600px] h-[600px] text-slate-900" />
        </div>
      )}

      {/* 1. Header Toolbar of the Chart */}
      <div className="flex flex-wrap items-center justify-between pb-3.5 border-b border-slate-100 gap-3 relative z-10">
        
        {/* Quick Toolbar Actions */}
        <div className="flex items-center space-x-2">
          {/* Toggle Enlarge Chart Cover */}
          <button
            type="button"
            onClick={() => setIsChartCoverEnlarged(!isChartCoverEnlarged)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isChartCoverEnlarged
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
            title="ขยาย/ย่อขนาดปกแผนภูมิโครงสร้าง"
          >
            {isChartCoverEnlarged ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isChartCoverEnlarged ? 'ย่อปกแผนภูมิ' : 'ขยายปกแผนภูมิ'}</span>
          </button>

          {/* Active Theme Indicator Pill */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>ธีม: {themeConfig.themeName}</span>
          </div>
        </div>

        {/* Search & Quick Filter within Chart */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box within Chart */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchKk}
              onChange={(e) => setSearchKk(e.target.value)}
              placeholder="ค้นหาชื่อฝ่าย / กก. ในแผนภูมิ..."
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 w-44 sm:w-52"
            />
            {searchKk && (
              <button
                onClick={() => setSearchKk('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filter: Vacancy status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none cursor-pointer font-medium"
          >
            <option value="all">แสดงทุกอัตรา</option>
            <option value="hasVacant">เฉพาะฝ่ายที่มีตำแหน่งว่าง</option>
            <option value="fullyOccupied">เฉพาะฝ่ายที่ครองเต็ม</option>
          </select>

          {/* Reset button */}
          {(selectedBch !== 'ALL' || selectedBg !== 'ALL' || selectedKk !== 'ALL') && (
            <button
              onClick={onResetStructure}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
            >
              <span>ล้างการเลือก</span>
            </button>
          )}

        </div>

      </div>

      {/* Chart Scalable Body Wrapper with Zoom Effect */}
      <div 
        className="transition-transform duration-300 origin-top relative z-10"
        style={{ transform: `scale(${effects.zoomScale})` }}
      >

        {/* 2. Top-Level Node: บช. สกพ. (Commanding Headquarters Cover Banner) */}
        <div className="pt-6 pb-2 flex flex-col items-center">
          
          {/* Headquarters Box / Chart Cover with Active Theme & Glow Aura */}
          <div 
            onClick={() => {
              onSelectBch('สกพ.');
              onSelectBg('ALL');
              onSelectKk('ALL');
            }}
            className={`w-full transition-all cursor-pointer relative group rounded-2xl border-2 ${
              isChartCoverEnlarged ? 'max-w-4xl lg:max-w-5xl p-5 sm:p-7' : 'max-w-xl p-4 sm:p-5'
            } ${themeConfig.masterGlow} ${
              selectedBch === 'สกพ.' && selectedBg === 'ALL' && selectedKk === 'ALL'
                ? `${themeConfig.masterBg} text-white ${themeConfig.masterBorder} ring-4 ring-amber-400/25`
                : `${themeConfig.masterBg} text-white ${themeConfig.masterBorder}`
            }`}
          >
            {/* Header Strip */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-amber-300/90 font-bold uppercase tracking-widest">
                  ROYAL THAI POLICE • สำนักงานตำรวจแห่งชาติ
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ข้อมูลเผยแพร่เป็นปัจจุบัน พ.ศ. ๒๕๖๙</span>
              </div>
            </div>

            {/* Main Content inside Top Node */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              
              {/* Title & Seal */}
              <div className="flex items-start space-x-4">
                <div className={`rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 flex-shrink-0 shadow-lg ${
                  isChartCoverEnlarged ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-12 h-12'
                }`}>
                  <Shield className={isChartCoverEnlarged ? 'w-10 h-10 sm:w-12 sm:h-12' : 'w-7 h-7'} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-black tracking-tight font-['Prompt'] ${themeConfig.accentGold} ${
                      isChartCoverEnlarged ? 'text-xl sm:text-2xl lg:text-3xl' : 'text-base sm:text-lg'
                    }`}>
                      สำนักงานกำลังพล (สกพ.)
                    </h3>
                  </div>

                  <div className={`font-semibold text-slate-100 flex items-center gap-1.5 ${
                    isChartCoverEnlarged ? 'text-sm sm:text-base' : 'text-xs'
                  }`}>
                    <span className="text-amber-400 font-bold">ผบช.สกพ.:</span>
                    <span className="text-white font-extrabold">พล.ต.ท. ชยัตพ์จน สุวรรณรักษ์</span>
                  </div>

                  <div className={`text-slate-300 ${isChartCoverEnlarged ? 'text-xs sm:text-sm' : 'text-[11px]'}`}>
                    สำนักงานตำรวจแห่งชาติ (Office of Human Resources, Royal Thai Police)
                  </div>

                  {isChartCoverEnlarged && (
                    <div className="pt-2 text-xs text-slate-300 flex flex-wrap gap-x-4 gap-y-1">
                      <div>
                        <span className="text-amber-400 font-bold">รอง ผบช.สกพ.:</span>
                        <span> พล.ต.ต. จักรกฤษ • พล.ต.ต. ปรีดา • พล.ต.ต. บริสุทธิ์</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Expanded Bottom Roster Preview Bar */}
            {isChartCoverEnlarged && (
              <div className="mt-4 pt-3.5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                  <div className="text-[10px] text-amber-300 font-bold">กองอัตรากำลัง (อต.)</div>
                  <div className="font-semibold text-white truncate">พล.ต.ต. กรีฑา ตันคณารัตน์</div>
                </div>
                <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                  <div className="text-[10px] text-amber-300 font-bold">กองทะเบียนพล (ทพ.)</div>
                  <div className="font-semibold text-white truncate">พล.ต.ต. เฉลิมศักดิ์ สุขสำราญ</div>
                </div>
                <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                  <div className="text-[10px] text-amber-300 font-bold">กองสวัสดิการ (สก.)</div>
                  <div className="font-semibold text-white truncate">พล.ต.ต. ยุทธนา จอนขุน</div>
                </div>
                <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                  <div className="text-[10px] text-amber-300 font-bold">บก. สกพ. (ส่วนกลาง)</div>
                  <div className="font-semibold text-white truncate">ผอ.สกพ. & กอ.รมน.</div>
                </div>
              </div>
            )}
          </div>

        {/* --- สรุปข้อมูลภาพรวมอัตรากำลังพล เรียงไว้ใต้ปก เป็นกรอบเล็กๆ 6 กรอบ --- */}
        <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5 w-full mt-3.5 transition-all ${
          isChartCoverEnlarged ? 'max-w-4xl lg:max-w-5xl' : 'max-w-xl'
        }`}>
          {/* 1. อัตรากำลังทั้งหมด */}
          <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-200/90 shadow-xs relative overflow-hidden group hover:border-blue-400 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500">อัตรากำลังทั้งหมด</span>
              <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">{hqTotal.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400">อัตรา</span>
            </div>
            <div className="mt-0.5 text-[10px] text-slate-500 truncate">
              แสดงอยู่ {effectiveFilteredCount.toLocaleString()} อัตรา
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
          </div>

          {/* 2. ครองตำแหน่ง */}
          <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-200/90 shadow-xs relative overflow-hidden group hover:border-emerald-400 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500">ครองตำแหน่ง</span>
              <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-bold text-emerald-600 tracking-tight">{hqOccupied.toLocaleString()}</span>
              <span className="text-[10px] text-emerald-600/70">นาย</span>
            </div>
            <div className="mt-0.5 text-[10px] text-slate-500 truncate">
              {hqTotal > 0 ? ((hqOccupied / hqTotal) * 100).toFixed(1) : 0}% ของกรอบอัตรา
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
          </div>

          {/* 3. ตำแหน่งว่าง */}
          <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-200/90 shadow-xs relative overflow-hidden group hover:border-amber-400 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500">ตำแหน่งว่าง</span>
              <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertCircle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-bold text-amber-600 tracking-tight">{hqVacant.toLocaleString()}</span>
              <span className="text-[10px] text-amber-600/70">อัตรา</span>
            </div>
            <div className="mt-0.5 text-[10px] text-slate-500 truncate">
              {hqTotal > 0 ? ((hqVacant / hqTotal) * 100).toFixed(1) : 0}% รอการบรรจุแต่งตั้ง
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-rose-400" />
          </div>

          {/* 4. ชั้นสัญญาบัตร */}
          <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-200/90 shadow-xs relative overflow-hidden group hover:border-indigo-400 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500">ชั้นสัญญาบัตร</span>
              <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Award className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-bold text-indigo-700 tracking-tight">{hqCommissioned.toLocaleString()}</span>
              <span className="text-[10px] text-indigo-600/70">อัตรา</span>
            </div>
            <div className="mt-0.5 text-[10px] text-slate-500 truncate">
              ร.ต.ต. ขึ้นไป ถึง พล.ต.อ.
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600" />
          </div>

          {/* 5. ชั้นประทวน */}
          <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-200/90 shadow-xs relative overflow-hidden group hover:border-cyan-400 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500">ชั้นประทวน</span>
              <div className="w-6 h-6 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <ShieldAlert className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-bold text-cyan-700 tracking-tight">{hqNonCommissioned.toLocaleString()}</span>
              <span className="text-[10px] text-cyan-600/70">อัตรา</span>
            </div>
            <div className="mt-0.5 text-[10px] text-slate-500 truncate">
              ส.ต.ต. ถึง ด.ต.
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-sky-600" />
          </div>

          {/* 6. สัดส่วน ชาย / หญิง */}
          <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-200/90 shadow-xs relative overflow-hidden group hover:border-pink-400 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500 truncate">สัดส่วน ชาย / หญิง</span>
              <div className="w-6 h-6 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xs font-bold text-blue-700">ช {hqMales}</span>
              <span className="text-[10px] text-slate-300">/</span>
              <span className="text-xs font-bold text-pink-600">ญ {hqFemales}</span>
            </div>
            <div className="mt-1 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden flex">
              <div 
                className="bg-blue-500 h-full" 
                style={{ width: `${hqMales + hqFemales > 0 ? (hqMales / (hqMales + hqFemales)) * 100 : 50}%` }}
                title={`ชาย ${hqMales} นาย`}
              />
              <div 
                className="bg-pink-400 h-full" 
                style={{ width: `${hqMales + hqFemales > 0 ? (hqFemales / (hqMales + hqFemales)) * 100 : 50}%` }}
                title={`หญิง ${hqFemales} นาย`}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-pink-400" />
          </div>
        </div>

        {/* Trunk Connecting Line */}
        <div className={`w-0.5 h-8 bg-gradient-to-b ${themeConfig.lineColor} my-1`} />

        {/* Horizontal Distributor Line */}
        <div className={`hidden lg:block w-[92%] h-0.5 ${themeConfig.distributorColor} relative`}>
          <div className="absolute left-[12.5%] -top-1 w-2.5 h-2.5 rounded-full bg-slate-400" />
          <div className="absolute left-[37.5%] -top-1 w-2.5 h-2.5 rounded-full bg-slate-400" />
          <div className="absolute left-[62.5%] -top-1 w-2.5 h-2.5 rounded-full bg-slate-400" />
          <div className="absolute left-[87.5%] -top-1 w-2.5 h-2.5 rounded-full bg-slate-400" />
        </div>
      </div>

      {/* 3. Level 2 Branches: 4 กองบังคับการ (บก.) Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 pt-3">
        {orgData.map((div, divIndex) => {
          const bgStats = getBgStats(div.bgName);
          const isBgSelected = selectedBg === div.bgName;
          const isCollapsed = collapsedBgs[div.bgName] || false;
          const pastel = getPastelDivisionStyle(divIndex, div.bgName);

          // Filter subdivisions based on search and vacancy status
          const filteredSubdivisions = div.subdivisions.filter(sub => {
            if (searchKk && !sub.name.toLowerCase().includes(searchKk.toLowerCase()) && !sub.desc.toLowerCase().includes(searchKk.toLowerCase())) {
              return false;
            }
            const sStats = getSubStats(div.bgName, sub.name);
            if (statusFilter === 'hasVacant' && sStats.vacant === 0) return false;
            if (statusFilter === 'fullyOccupied' && sStats.vacant > 0) return false;
            return true;
          });

          return (
            <div 
              key={div.id}
              className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                isBgSelected 
                  ? 'border-indigo-600 ring-4 ring-indigo-400/25 ' + pastel.containerBg
                  : pastel.containerBg
              }`}
            >
              
              {/* Level 2 Card Header (บก.) with Pastel Colors */}
              <div 
                className={`p-3.5 border-b transition-colors cursor-pointer ${
                  isBgSelected 
                    ? themeConfig.activeBgCard
                    : pastel.headerBg
                }`}
              >
                {/* Level Tag & Collapse Button */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                    isBgSelected 
                      ? themeConfig.activeTag
                      : pastel.tagBg
                  }`}>
                    ระดับ 2 • บก.
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCollapse(div.bgName);
                    }}
                    className="p-1 text-slate-500 hover:text-slate-800 rounded-md cursor-pointer"
                    title={isCollapsed ? 'ขยายดูทุกฝ่าย' : 'ย่อรายการ'}
                  >
                    {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </button>
                </div>

                {/* Division Title */}
                <div 
                  onClick={() => {
                    onSelectBch('สกพ.');
                    onSelectBg(div.bgName);
                    onSelectKk('ALL');
                  }}
                  className="space-y-1"
                >
                  <h4 className="text-sm font-bold font-['Prompt'] leading-tight flex items-center gap-1.5">
                    <Building2 className={`w-4 h-4 flex-shrink-0 ${isBgSelected ? 'text-amber-400' : pastel.iconColor}`} />
                    <span className="truncate">{div.title}</span>
                  </h4>

                  <div className="text-[11px] font-medium opacity-90 truncate">
                    ผบก.: <span className="font-bold">{div.commanderRank} {div.commanderName}</span>
                  </div>

                  {/* Summary Pills */}
                  <div className="flex items-center justify-between pt-2 text-[11px]">
                    <span className={`font-mono font-bold ${isBgSelected ? 'text-amber-300' : pastel.accentColor}`}>
                      {bgStats.total} อัตรา
                    </span>
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="text-emerald-700 font-semibold">ครอง {bgStats.occupied}</span>
                      <span>•</span>
                      <span className="text-amber-700 font-semibold">ว่าง {bgStats.vacant}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Level 3 Subdivisions List (กก. / ฝ่าย / กลุ่มงาน) */}
              {!isCollapsed && (
                <div className="p-3 space-y-2 flex-1 overflow-y-auto max-h-[460px]">
                  
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>ระดับ 3 • กก./ฝ่าย ({filteredSubdivisions.length})</span>
                    {isBgSelected && selectedKk === 'ALL' && (
                      <span className="text-indigo-700 font-semibold">เลือกทั้ง บก.</span>
                    )}
                  </div>

                  {filteredSubdivisions.map((sub, sIdx) => {
                    const sStats = getSubStats(div.bgName, sub.name);
                    const isKkSelected = isBgSelected && selectedKk === sub.name;

                    return (
                      <div
                        key={sIdx}
                        onClick={() => {
                          onSelectBch('สกพ.');
                          onSelectBg(div.bgName);
                          onSelectKk(sub.name);
                        }}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between group shadow-xs ${
                          isKkSelected
                            ? themeConfig.activeSubcard
                            : pastel.subcardBg
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <span className="text-xs font-bold leading-tight group-hover:text-amber-700 transition-colors">
                            {sub.name}
                          </span>
                          <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full flex-shrink-0 ${
                            isKkSelected 
                              ? 'bg-white/20 text-white' 
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {sStats.total}
                          </span>
                        </div>

                        <p className={`text-[10px] line-clamp-1 mt-1 ${isKkSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                          {sub.desc}
                        </p>

                        <div className={`mt-2 pt-1.5 border-t flex items-center justify-between text-[10px] font-medium ${
                          isKkSelected ? 'border-white/20 text-white' : 'border-slate-100 text-slate-500'
                        }`}>
                          <span className={isKkSelected ? 'text-white' : 'text-emerald-700 font-semibold'}>
                            ครอง {sStats.occupied}
                          </span>
                          {sStats.vacant > 0 ? (
                            <span className={isKkSelected ? 'text-amber-200' : 'text-amber-600 font-bold'}>
                              ว่าง {sStats.vacant}
                            </span>
                          ) : (
                            <span className={isKkSelected ? 'text-emerald-200' : 'text-slate-400'}>
                              เต็ม
                            </span>
                          )}
                        </div>

                      </div>
                    );
                  })}

                  {filteredSubdivisions.length === 0 && (
                    <div className="p-4 text-center text-xs text-slate-400 italic">
                      ไม่พบฝ่ายที่ตรงกับเงื่อนไข
                    </div>
                  )}

                </div>
              )}

            </div>
          );
        })}
      </div>

      </div>

      {/* 4. Floating Theme & Special FX Studio Widget (มุมล่างขวา) */}
      <OrgChartThemeControl
        effects={effects}
        onChangeEffects={setEffects}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        allCollapsed={allCollapsed}
      />

    </div>
  );
};
