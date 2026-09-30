import React, { useState, useMemo } from 'react';
import { PoliceOfficer } from '../types/police';
import { 
  Building2, 
  Layers, 
  ChevronRight, 
  FolderTree, 
  GitBranch, 
  Shield, 
  Check, 
  X,
  Users,
  ChevronDown
} from 'lucide-react';

interface SubdivisionNavProps {
  officers: PoliceOfficer[];
  selectedBch: string;
  selectedBg: string;
  selectedKk: string;
  onSelectBch: (bch: string) => void;
  onSelectBg: (bg: string) => void;
  onSelectKk: (kk: string) => void;
  onResetStructure: () => void;
}

export const SubdivisionNav: React.FC<SubdivisionNavProps> = ({
  officers,
  selectedBch,
  selectedBg,
  selectedKk,
  onSelectBch,
  onSelectBg,
  onSelectKk,
  onResetStructure
}) => {
  const [viewMode, setViewMode] = useState<'cascade' | 'tree'>('cascade');

  // 1. Extract all unique บช.
  const bchList = useMemo(() => {
    const map = new Map<string, { total: number; occupied: number; vacant: number }>();
    officers.forEach(o => {
      const bch = o.bch || 'สกพ.';
      const current = map.get(bch) || { total: 0, occupied: 0, vacant: 0 };
      current.total += 1;
      if (o.status === 'ครองตำแหน่ง' && o.firstName) {
        current.occupied += 1;
      } else {
        current.vacant += 1;
      }
      map.set(bch, current);
    });
    return Array.from(map.entries()).map(([name, stats]) => ({ name, ...stats }));
  }, [officers]);

  // 2. Extract all unique บก. (under selected บช.)
  const bgList = useMemo(() => {
    const map = new Map<string, { total: number; occupied: number; vacant: number }>();
    const filtered = selectedBch === 'ALL' ? officers : officers.filter(o => (o.bch || 'สกพ.') === selectedBch);

    filtered.forEach(o => {
      const bg = o.bg || 'สกพ.';
      const current = map.get(bg) || { total: 0, occupied: 0, vacant: 0 };
      current.total += 1;
      if (o.status === 'ครองตำแหน่ง' && o.firstName) {
        current.occupied += 1;
      } else {
        current.vacant += 1;
      }
      map.set(bg, current);
    });

    // Sort order: สกพ., กองอัตรากำลัง สกพ., กองทะเบียนพล สกพ., กองสวัสดิการ สกพ.
    const priority = ['สกพ.', 'กองอัตรากำลัง สกพ.', 'กองทะเบียนพล สกพ.', 'กองสวัสดิการ สกพ.'];
    return Array.from(map.entries())
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => {
        const idxA = priority.indexOf(a.name);
        const idxB = priority.indexOf(b.name);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.name.localeCompare(b.name, 'th');
      });
  }, [officers, selectedBch]);

  // 3. Extract all unique กก. (under selected บก.)
  const kkList = useMemo(() => {
    const map = new Map<string, { total: number; occupied: number; vacant: number }>();
    let filtered = officers;
    if (selectedBch !== 'ALL') {
      filtered = filtered.filter(o => (o.bch || 'สกพ.') === selectedBch);
    }
    if (selectedBg !== 'ALL') {
      filtered = filtered.filter(o => (o.bg || 'สกพ.') === selectedBg);
    }

    filtered.forEach(o => {
      const kk = o.kk || o.bg || 'สกพ.';
      const current = map.get(kk) || { total: 0, occupied: 0, vacant: 0 };
      current.total += 1;
      if (o.status === 'ครองตำแหน่ง' && o.firstName) {
        current.occupied += 1;
      } else {
        current.vacant += 1;
      }
      map.set(kk, current);
    });

    return Array.from(map.entries())
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => a.name.localeCompare(b.name, 'th'));
  }, [officers, selectedBch, selectedBg]);

  // Full organizational tree structure for the tree view
  const fullTree = useMemo(() => {
    // Group: บช. -> บก. -> กก.
    const tree: {
      [bch: string]: {
        [bg: string]: {
          [kk: string]: { total: number; occupied: number; vacant: number }
        }
      }
    } = {};

    officers.forEach(o => {
      const bch = o.bch || 'สกพ.';
      const bg = o.bg || 'สกพ.';
      const kk = o.kk || bg;

      if (!tree[bch]) tree[bch] = {};
      if (!tree[bch][bg]) tree[bch][bg] = {};
      if (!tree[bch][bg][kk]) {
        tree[bch][bg][kk] = { total: 0, occupied: 0, vacant: 0 };
      }

      tree[bch][bg][kk].total += 1;
      if (o.status === 'ครองตำแหน่ง' && o.firstName) {
        tree[bch][bg][kk].occupied += 1;
      } else {
        tree[bch][bg][kk].vacant += 1;
      }
    });

    return tree;
  }, [officers]);

  const hasFilter = selectedBch !== 'ALL' || selectedBg !== 'ALL' || selectedKk !== 'ALL';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 mb-6">
      
      {/* 1. Header & Breadcrumb & View Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-3.5 mb-4 border-b border-slate-100 gap-3">
        
        {/* Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center shadow-xs flex-shrink-0">
            <FolderTree className="w-5 h-5 font-bold" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              แบ่งตามโครงสร้างหน่วยงาน
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-900 text-amber-400">
                บช. ➔ บก. ➔ กก.
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              กองบัญชาการ • กองบังคับการ • กองกำกับการ (ฝ่าย / กลุ่มงาน)
            </p>
          </div>
        </div>

        {/* View Mode Toggle & Reset */}
        <div className="flex items-center flex-wrap gap-2 self-start lg:self-auto">
          {hasFilter && (
            <button
              onClick={onResetStructure}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 transition-colors cursor-pointer"
              title="ล้างการเลือก บช. บก. กก. ทั้งหมด"
            >
              <X className="w-3.5 h-3.5" />
              <span>แสดงทุกหน่วยงาน</span>
            </button>
          )}

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('cascade')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'cascade'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>เลือกแบบลำดับขั้น</span>
            </button>
            <button
              onClick={() => setViewMode('tree')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'tree'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 text-indigo-600" />
              <span>ผังโครงสร้างรวม (Tree)</span>
            </button>
          </div>
        </div>

      </div>

      {/* Breadcrumb Path Banner */}
      <div className="bg-slate-50 rounded-xl px-3.5 py-2 border border-slate-200/80 flex flex-wrap items-center gap-1.5 text-xs text-slate-700 mb-4 font-medium">
        <span className="text-slate-400 text-[11px] font-semibold uppercase">เส้นทางสังกัด:</span>

        {/* Level 1: บช. */}
        <span className={`px-2 py-0.5 rounded-md ${
          selectedBch !== 'ALL' ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300' : 'bg-slate-200 text-slate-700'
        }`}>
          บช.: {selectedBch === 'ALL' ? 'ทุกกองบัญชาการ' : selectedBch}
        </span>

        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />

        {/* Level 2: บก. */}
        <span className={`px-2 py-0.5 rounded-md ${
          selectedBg !== 'ALL' ? 'bg-indigo-100 text-indigo-900 font-bold border border-indigo-300' : 'bg-slate-200 text-slate-700'
        }`}>
          บก.: {selectedBg === 'ALL' ? 'ทุกกองบังคับการ' : selectedBg}
        </span>

        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />

        {/* Level 3: กก. */}
        <span className={`px-2 py-0.5 rounded-md ${
          selectedKk !== 'ALL' ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300' : 'bg-slate-200 text-slate-700'
        }`}>
          กก./ฝ่าย: {selectedKk === 'ALL' ? 'ทุกฝ่าย' : selectedKk}
        </span>

        {hasFilter && (
          <button
            onClick={onResetStructure}
            className="ml-auto text-[11px] text-slate-400 hover:text-rose-600 cursor-pointer underline"
          >
            ล้างตัวกรอง
          </button>
        )}
      </div>

      {/* View 1: Cascade Filter (3-tier Tabs) */}
      {viewMode === 'cascade' ? (
        <div className="space-y-4">
          
          {/* TIER 1: บช. (กองบัญชาการ / สำนักงาน) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[11px] font-black flex items-center justify-center">1</span>
                ระดับ บช. (กองบัญชาการ / สำนักงาน):
              </span>
              <span className="text-[11px] text-slate-400">
                {bchList.length} กองบัญชาการ
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  onSelectBch('ALL');
                  onSelectBg('ALL');
                  onSelectKk('ALL');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedBch === 'ALL'
                    ? 'bg-slate-900 text-amber-400 shadow-sm ring-2 ring-amber-400/40'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>ทุก บช.</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  selectedBch === 'ALL' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-200 text-slate-600'
                }`}>
                  {officers.length}
                </span>
              </button>

              {bchList.map(bch => {
                const isSelected = selectedBch === bch.name;
                return (
                  <button
                    key={bch.name}
                    onClick={() => {
                      onSelectBch(bch.name);
                      onSelectBg('ALL');
                      onSelectKk('ALL');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-slate-900 text-amber-400 shadow-sm ring-2 ring-amber-400/40'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 text-amber-500" />
                    <span>บช. {bch.name} (สำนักงานกำลังพล)</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isSelected ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {bch.total}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TIER 2: บก. (กองบังคับการ) */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-black flex items-center justify-center">2</span>
                ระดับ บก. (กองบังคับการ):
              </span>
              <span className="text-[11px] text-slate-400">
                {bgList.length} กองบังคับการในสังกัด
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
              <button
                onClick={() => {
                  onSelectBg('ALL');
                  onSelectKk('ALL');
                }}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedBg === 'ALL'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-950 ring-1 ring-indigo-500/30 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">ทุก บก. ในสังกัด</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-md font-bold">
                    {officers.length}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  รวมทุกกองบังคับการ
                </span>
              </button>

              {bgList.map(bg => {
                const isSelected = selectedBg === bg.name;
                const shortLabel = bg.name.includes('อัตรากำลัง') 
                  ? 'กองอัตรากำลัง (อต.)' 
                  : bg.name.includes('ทะเบียนพล') 
                    ? 'กองทะเบียนพล (ทพ.)' 
                    : bg.name.includes('สวัสดิการ') 
                      ? 'กองสวัสดิการ (สก.)' 
                      : 'สกพ. (ส่วนกลาง / ฝอ. / กอ.รมน.)';

                return (
                  <button
                    key={bg.name}
                    onClick={() => {
                      onSelectBg(bg.name);
                      onSelectKk('ALL');
                    }}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-900 border-amber-500 text-amber-400 ring-2 ring-amber-400/40 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate pr-1">บก. {shortLabel}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                        isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {bg.total}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                      <span className={isSelected ? 'text-amber-200/80' : 'text-emerald-700'}>
                        ครอง: {bg.occupied}
                      </span>
                      <span>•</span>
                      <span className={isSelected ? 'text-rose-300' : 'text-amber-700'}>
                        ว่าง: {bg.vacant}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TIER 3: กก. (กองกำกับการ / ฝ่าย / กลุ่มงาน) */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-black flex items-center justify-center">3</span>
                ระดับ กก. (กองกำกับการ / ฝ่าย / กลุ่มงาน):
                {selectedBg !== 'ALL' && (
                  <span className="text-xs font-normal text-indigo-700">
                    ภายใต้ [บก. {selectedBg}]
                  </span>
                )}
              </span>
              <span className="text-[11px] text-slate-400">
                {kkList.length} ฝ่าย/กลุ่มงาน
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <button
                onClick={() => onSelectKk('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedKk === 'ALL'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>ทุก กก./ฝ่าย</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedKk === 'ALL' ? 'bg-white/20 text-white font-bold' : 'bg-slate-200 text-slate-700'
                }`}>
                  {kkList.reduce((acc, k) => acc + k.total, 0)}
                </span>
              </button>

              {kkList.map(kk => {
                const isSelected = selectedKk === kk.name;
                return (
                  <button
                    key={kk.name}
                    onClick={() => onSelectKk(kk.name)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <span>กก. {kk.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white font-bold' : 'bg-slate-200/80 text-slate-700'
                    }`}>
                      {kk.total}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      ) : (
        /* View 2: Full Organization Tree View (ผังโครงสร้างรวม) */
        <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
          <div className="text-xs text-slate-600 flex items-center gap-2 mb-2 font-medium">
            <GitBranch className="w-4 h-4 text-indigo-600" />
            <span>คลิกที่กล่องหน่วยงานใดก็ได้ในผัง เพื่อกรองข้อมูลของหน่วยงานนั้นทันที:</span>
          </div>

          {Object.entries(fullTree).map(([bchName, bgs]) => (
            <div key={bchName} className="space-y-3">
              
              {/* Level 1 Node: บช. */}
              <div 
                onClick={() => {
                  onSelectBch(bchName);
                  onSelectBg('ALL');
                  onSelectKk('ALL');
                }}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedBch === bchName && selectedBg === 'ALL' && selectedKk === 'ALL'
                    ? 'bg-slate-900 text-amber-400 border-amber-500 shadow-md ring-2 ring-amber-400/40'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Shield className="w-5 h-5 text-amber-400" />
                  <div>
                    <span className="font-bold text-sm block">บช. {bchName} (สำนักงานกำลังพล)</span>
                    <span className="text-[11px] text-slate-400">หน่วยงานระดับกองบัญชาการ</span>
                  </div>
                </div>
                <div className="text-xs font-semibold bg-slate-800 text-amber-300 px-2.5 py-1 rounded-lg">
                  {officers.length} อัตรา
                </div>
              </div>

              {/* Level 2 Nodes: บก. Cards Grid */}
              <div className="pl-4 sm:pl-6 border-l-2 border-dashed border-slate-300 space-y-3">
                {Object.entries(bgs).map(([bgName, kks]) => {
                  const bgTotal = Object.values(kks).reduce((sum, k) => sum + k.total, 0);
                  const isBgSelected = selectedBg === bgName;

                  return (
                    <div key={bgName} className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
                      
                      {/* บก. Header */}
                      <div 
                        onClick={() => {
                          onSelectBch(bchName);
                          onSelectBg(bgName);
                          onSelectKk('ALL');
                        }}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                          isBgSelected && selectedKk === 'ALL'
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'hover:bg-slate-100 text-slate-900'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Building2 className={`w-4 h-4 ${isBgSelected ? 'text-white' : 'text-indigo-600'}`} />
                          <span className="font-bold text-xs sm:text-sm">บก. {bgName}</span>
                        </div>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                          isBgSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {bgTotal} อัตรา
                        </span>
                      </div>

                      {/* Level 3: กก. Pills inside this บก. */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                        {Object.entries(kks).map(([kkName, kkStats]) => {
                          const isKkSelected = selectedBg === bgName && selectedKk === kkName;

                          return (
                            <button
                              key={kkName}
                              onClick={() => {
                                onSelectBch(bchName);
                                onSelectBg(bgName);
                                onSelectKk(kkName);
                              }}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer ${
                                isKkSelected
                                  ? 'bg-emerald-600 text-white font-bold shadow-xs ring-1 ring-emerald-400'
                                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              <span>กก. {kkName}</span>
                              <span className={`px-1 rounded-full text-[9px] ${
                                isKkSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600 font-bold'
                              }`}>
                                {kkStats.total}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
