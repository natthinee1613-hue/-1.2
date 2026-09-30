import React from 'react';
import { PoliceOfficer } from '../types/police';
import { Users, UserCheck, AlertCircle, Award, ShieldAlert, Sparkles } from 'lucide-react';

interface StatsOverviewProps {
  officers: PoliceOfficer[];
  filteredCount: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ officers, filteredCount }) => {
  const total = officers.length;
  const occupied = officers.filter(o => o.status === 'ครองตำแหน่ง' && o.firstName).length;
  const vacant = total - occupied;
  const commissioned = officers.filter(o => o.officerType === 'สัญญาบัตร').length;
  const nonCommissioned = officers.filter(o => o.officerType === 'ประทวน').length;
  const males = officers.filter(o => o.gender === 'ชาย').length;
  const females = officers.filter(o => o.gender === 'หญิง').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {/* 1. ทั้งหมด */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">อัตรากำลังทั้งหมด</span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-800 tracking-tight">{total}</span>
          <span className="text-xs text-slate-400">อัตรา</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500">
          แสดงอยู่ {filteredCount} อัตรา
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
      </div>

      {/* 2. ครองตำแหน่ง */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">ครองตำแหน่ง</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-emerald-600 tracking-tight">{occupied}</span>
          <span className="text-xs text-emerald-600/70">นาย</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500">
          {total > 0 ? ((occupied / total) * 100).toFixed(1) : 0}% ของกรอบอัตรา
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
      </div>

      {/* 3. ตำแหน่งว่าง */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">ตำแหน่งว่าง</span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-amber-600 tracking-tight">{vacant}</span>
          <span className="text-xs text-amber-600/70">อัตรา</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500">
          {total > 0 ? ((vacant / total) * 100).toFixed(1) : 0}% รอการบรรจุแต่งตั้ง
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-rose-400" />
      </div>

      {/* 4. สัญญาบัตร */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">ชั้นสัญญาบัตร</span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-indigo-700 tracking-tight">{commissioned}</span>
          <span className="text-xs text-indigo-600/70">อัตรา</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500">
          ร.ต.ต. ขึ้นไป ถึง พล.ต.อ.
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600" />
      </div>

      {/* 5. ประทวน */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">ชั้นประทวน</span>
          <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-cyan-700 tracking-tight">{nonCommissioned}</span>
          <span className="text-xs text-cyan-600/70">อัตรา</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500">
          ส.ต.ต. ถึง ด.ต.
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-sky-600" />
      </div>

      {/* 6. สัดส่วน ชาย / หญิง */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">สัดส่วน ชาย / หญิง</span>
          <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-sm font-semibold text-blue-700">ช {males}</span>
          <span className="text-xs text-slate-300">/</span>
          <span className="text-sm font-semibold text-pink-600">ญ {females}</span>
        </div>
        <div className="mt-1.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden flex">
          <div 
            className="bg-blue-500 h-full" 
            style={{ width: `${males + females > 0 ? (males / (males + females)) * 100 : 50}%` }}
            title={`ชาย ${males}`}
          />
          <div 
            className="bg-pink-400 h-full" 
            style={{ width: `${males + females > 0 ? (females / (males + females)) * 100 : 50}%` }}
            title={`หญิง ${females}`}
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-pink-400" />
      </div>
    </div>
  );
};
