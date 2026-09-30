import React, { useState } from 'react';
import { 
  Palette, 
  Sparkles, 
  Eye, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Check, 
  X, 
  Layers, 
  Sun, 
  Moon, 
  Sliders, 
  Shuffle, 
  Flame, 
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export type ChartThemeId = 
  | 'pastel-dream'
  | 'police-navy' 
  | 'police-maroon' 
  | 'obsidian-gold' 
  | 'emerald-honor' 
  | 'classic-ivory' 
  | 'cyber-cobalt';

export interface ChartEffectsState {
  theme: ChartThemeId;
  glowAura: boolean;
  shimmer: boolean;
  watermark: boolean;
  zoomScale: number; // 0.85 | 1.0 | 1.15
  columnsLayout: '4-col' | '2-col';
}

interface OrgChartThemeControlProps {
  effects: ChartEffectsState;
  onChangeEffects: (updater: (prev: ChartEffectsState) => ChartEffectsState) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  allCollapsed: boolean;
}

export const OrgChartThemeControl: React.FC<OrgChartThemeControlProps> = ({
  effects,
  onChangeEffects,
  onExpandAll,
  onCollapseAll,
  allCollapsed
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'themes' | 'fx'>('themes');

  const themeOptions: {
    id: ChartThemeId;
    name: string;
    subName: string;
    badgeColor: string;
    gradient: string;
    border: string;
  }[] = [
    {
      id: 'pastel-dream',
      name: 'สีพาสเทลละมุนตา (Pastel Soft)',
      subName: 'กรอบพื้นหลัง บก. สีพาสเทลแยก 4 กอง',
      badgeColor: '#a78bfa',
      gradient: 'from-[#1e1e38] via-[#2d2a4a] to-[#252243]',
      border: 'border-purple-300'
    },
    {
      id: 'police-navy',
      name: 'สีกรมท่า-ทองคำเปลว',
      subName: 'ระเบียบสารบรรณตำรวจ',
      badgeColor: '#f5c542',
      gradient: 'from-[#061121] via-[#0b192c] to-[#040e1d]',
      border: 'border-[#f5c542]'
    },
    {
      id: 'police-maroon',
      name: 'สีเลือดหมู-ทองพิทักษ์',
      subName: 'สีประจำข้าราชการตำรวจ',
      badgeColor: '#f59e0b',
      gradient: 'from-[#2b0505] via-[#450a0a] to-[#200303]',
      border: 'border-rose-400'
    },
    {
      id: 'obsidian-gold',
      name: 'สีดำทองออบซิเดียน',
      subName: 'หรูหรา สง่างามเข้มขลัง',
      badgeColor: '#ffd700',
      gradient: 'from-[#000000] via-[#0a0a0a] to-[#121212]',
      border: 'border-amber-400'
    },
    {
      id: 'emerald-honor',
      name: 'สีเขียวมรกตเกียรติยศ',
      subName: 'เกียรติยศและศักดิ์ศรี',
      badgeColor: '#34d399',
      gradient: 'from-[#021f14] via-[#063321] to-[#021f14]',
      border: 'border-emerald-400'
    },
    {
      id: 'classic-ivory',
      name: 'สีงาช้างคลาสสิก',
      subName: 'กระดาษพระราชทานหรูหรา',
      badgeColor: '#b45309',
      gradient: 'from-[#fffef7] via-[#f7f2e4] to-[#ede3cb]',
      border: 'border-amber-700'
    },
    {
      id: 'cyber-cobalt',
      name: 'สีน้ำเงินไซเบอร์เทค',
      subName: 'ทันสมัย คมชัดสากล',
      badgeColor: '#38bdf8',
      gradient: 'from-[#04112e] via-[#0b2463] to-[#071742]',
      border: 'border-cyan-400'
    }
  ];

  const handleRandomize = () => {
    const randomTheme = themeOptions[Math.floor(Math.random() * themeOptions.length)].id;
    onChangeEffects(prev => ({
      ...prev,
      theme: randomTheme,
      glowAura: Math.random() > 0.3,
      shimmer: Math.random() > 0.4
    }));
  };

  const handleReset = () => {
    onChangeEffects(() => ({
      theme: 'police-navy',
      glowAura: true,
      shimmer: true,
      watermark: true,
      zoomScale: 1.0,
      columnsLayout: '4-col'
    }));
  };

  return (
    <>
      {/* 1. Floating Launcher Button (มุมล่างขวา) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 select-none">
        
        {/* Tooltip prompt when collapsed */}
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 text-amber-300 text-[11px] font-bold shadow-lg border border-amber-500/30 backdrop-blur-xs animate-bounce pointer-events-none">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>เปลี่ยนสีธีม & ลูกเล่นแผนภูมิ</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`group relative p-3 sm:p-3.5 rounded-2xl shadow-2xl transition-all duration-300 flex items-center justify-center cursor-pointer ${
            isOpen
              ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-400/30 rotate-90 scale-105'
              : 'bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 text-amber-400 border-2 border-amber-500/60 hover:border-amber-400 hover:scale-110 hover:shadow-amber-500/20'
          }`}
          title="คลิกเพื่อเปิดเครื่องมือปรับสีธีมและลูกเล่นแผนภูมิ (มุมล่างขวา)"
        >
          {isOpen ? (
            <X className="w-6 h-6 stroke-[2.5]" />
          ) : (
            <div className="relative">
              <Palette className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full" />
            </div>
          )}
        </button>
      </div>

      {/* 2. Floating Popover Control Hub (มุมล่างขวา) */}
      {isOpen && (
        <div 
          className="fixed bottom-20 right-4 sm:right-6 z-40 w-[92vw] sm:w-96 max-h-[82vh] bg-slate-950/95 backdrop-blur-md text-white border-2 border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 px-4 py-3 border-b border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-amber-300 font-['Prompt']">
                  สตูดิโอธีม & ลูกเล่นแผนภูมิ
                </h4>
                <p className="text-[10px] text-slate-300">
                  ปรับสีและเอฟเฟกต์แผนภูมิมุมมองพิเศษ
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-900/80 border-b border-white/10 text-xs font-bold">
            <button
              onClick={() => setActiveTab('themes')}
              className={`py-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'themes'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>โทนสีธีม ({themeOptions.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('fx')}
              className={`py-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'fx'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ลูกเล่น & เอฟเฟกต์</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="p-3.5 overflow-y-auto space-y-4 flex-1 text-xs">
            
            {/* TAB 1: THEMES */}
            {activeTab === 'themes' && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-amber-300 block mb-1">
                  เลือกสไตล์สีแผนภูมิสายการบังคับบัญชา:
                </span>

                <div className="grid grid-cols-1 gap-2">
                  {themeOptions.map((t) => {
                    const isSelected = effects.theme === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => onChangeEffects(prev => ({ ...prev, theme: t.id }))}
                        className={`p-2.5 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between group ${
                          isSelected
                            ? 'bg-gradient-to-r ' + t.gradient + ' border-amber-400 ring-2 ring-amber-400/40 shadow-md'
                            : 'bg-slate-900/80 hover:bg-slate-800 border-white/10 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-7 h-7 rounded-xl border flex items-center justify-center flex-shrink-0 shadow-inner"
                            style={{ backgroundColor: t.badgeColor, borderColor: '#ffffff40' }}
                          >
                            {isSelected && <Check className="w-4 h-4 text-slate-950 stroke-[3]" />}
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs group-hover:text-amber-300 transition-colors">
                              {t.name}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {t.subName}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-xs">
                            ใช้งานอยู่
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: SPECIAL EFFECTS & GADGETS */}
            {activeTab === 'fx' && (
              <div className="space-y-3.5">
                
                {/* 1. Glow Aura Switch */}
                <div className="bg-slate-900/80 p-3 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-white block">แสงออร่าเรืองแสง (Glow Aura)</span>
                      <span className="text-[10px] text-slate-400">รัศมีแสงเรืองรองรอบปกและกรอบ</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onChangeEffects(prev => ({ ...prev, glowAura: !prev.glowAura }))}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      effects.glowAura ? 'bg-amber-500' : 'bg-slate-700'
                    }`}
                  >
                    <span 
                      className={`block w-4 h-4 rounded-full bg-white shadow-md transform transition-transform absolute top-1 ${
                        effects.glowAura ? 'left-6' : 'left-1'
                      }`} 
                    />
                  </button>
                </div>

                {/* 2. Shimmer & Sparkles Switch */}
                <div className="bg-slate-900/80 p-3 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-white block">ประกายชิมเมอร์ (Sparkles FX)</span>
                      <span className="text-[10px] text-slate-400">คลื่นประกายแสงสะท้อนบนเหรียญตรา</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onChangeEffects(prev => ({ ...prev, shimmer: !prev.shimmer }))}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      effects.shimmer ? 'bg-amber-500' : 'bg-slate-700'
                    }`}
                  >
                    <span 
                      className={`block w-4 h-4 rounded-full bg-white shadow-md transform transition-transform absolute top-1 ${
                        effects.shimmer ? 'left-6' : 'left-1'
                      }`} 
                    />
                  </button>
                </div>

                {/* 3. Watermark Crest Switch */}
                <div className="bg-slate-900/80 p-3 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-white block">ลายน้ำตราโล่เขนตำรวจ</span>
                      <span className="text-[10px] text-slate-400">แสดงภาพลายน้ำตราแผ่นดินพื้นหลัง</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onChangeEffects(prev => ({ ...prev, watermark: !prev.watermark }))}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      effects.watermark ? 'bg-amber-500' : 'bg-slate-700'
                    }`}
                  >
                    <span 
                      className={`block w-4 h-4 rounded-full bg-white shadow-md transform transition-transform absolute top-1 ${
                        effects.watermark ? 'left-6' : 'left-1'
                      }`} 
                    />
                  </button>
                </div>

                {/* 4. Zoom Scale Controller */}
                <div className="bg-slate-900/80 p-3 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                      <span>สเกลขนาดแผนภูมิ:</span>
                    </span>
                    <span className="font-mono text-amber-400 font-bold">
                      {Math.round(effects.zoomScale * 100)}%
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => onChangeEffects(prev => ({ ...prev, zoomScale: 0.88 }))}
                      className={`py-1.5 rounded-xl font-bold cursor-pointer transition-all ${
                        effects.zoomScale === 0.88 
                          ? 'bg-amber-500 text-slate-950 font-black' 
                          : 'bg-white/5 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      กะทัดรัด (88%)
                    </button>
                    <button
                      type="button"
                      onClick={() => onChangeEffects(prev => ({ ...prev, zoomScale: 1.0 }))}
                      className={`py-1.5 rounded-xl font-bold cursor-pointer transition-all ${
                        effects.zoomScale === 1.0 
                          ? 'bg-amber-500 text-slate-950 font-black' 
                          : 'bg-white/5 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      มาตรฐาน (100%)
                    </button>
                    <button
                      type="button"
                      onClick={() => onChangeEffects(prev => ({ ...prev, zoomScale: 1.12 }))}
                      className={`py-1.5 rounded-xl font-bold cursor-pointer transition-all ${
                        effects.zoomScale === 1.12 
                          ? 'bg-amber-500 text-slate-950 font-black' 
                          : 'bg-white/5 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      ใหญ่พิเศษ (112%)
                    </button>
                  </div>
                </div>

                {/* 5. Quick All Divisions Expand / Collapse */}
                <div className="bg-slate-900/80 p-3 rounded-2xl border border-white/10 space-y-2">
                  <span className="font-bold text-white block">การจัดมุมมองสายงาน (บก.):</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={onExpandAll}
                      className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
                      <span>ขยายดูทุกฝ่าย</span>
                    </button>
                    <button
                      type="button"
                      onClick={onCollapseAll}
                      className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <ChevronUp className="w-3.5 h-3.5 text-rose-400" />
                      <span>ย่อเก็บทุกฝ่าย</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Footer with Reset & Randomize */}
          <div className="bg-slate-900 px-4 py-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={handleRandomize}
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>สุ่มธีมและลูกเล่น</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>คืนค่าเริ่มต้น</span>
            </button>
          </div>

        </div>
      )}
    </>
  );
};
