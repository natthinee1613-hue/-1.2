import React from 'react';
import { PoliceOfficer } from '../types/police';
import { Shield, Phone, Mail, Edit3, Trash2, Eye, Building2, UserX } from 'lucide-react';

interface OfficerCardGridProps {
  officers: PoliceOfficer[];
  onEdit: (officer: PoliceOfficer) => void;
  onDelete: (officer: PoliceOfficer) => void;
  onViewDetail: (officer: PoliceOfficer) => void;
}

export const OfficerCardGrid: React.FC<OfficerCardGridProps> = ({
  officers,
  onEdit,
  onDelete,
  onViewDetail
}) => {
  if (officers.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-12 text-center">
        <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <UserX className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-800">ไม่พบข้อมูลข้าราชการตำรวจ</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหาหรือตัวกรองที่เลือก
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {officers.map(officer => {
        const isVacant = officer.status === 'ตำแหน่งว่าง' || !officer.firstName;

        return (
          <div
            key={officer.id}
            className={`bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden relative group ${
              isVacant ? 'bg-amber-50/20 border-dashed border-amber-300' : ''
            }`}
          >
            {/* Top Color Accent */}
            <div className={`h-1.5 w-full ${
              isVacant 
                ? 'bg-amber-400' 
                : officer.officerType === 'สัญญาบัตร' 
                  ? 'bg-indigo-600' 
                  : 'bg-emerald-600'
            }`} />

            <div className="p-4 flex-1">
              
              {/* Header: Pos number & Status badge */}
              <div className="flex items-center justify-between gap-1 mb-2.5">
                <span className="font-mono text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                  {officer.posNumber}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  isVacant 
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}>
                  {isVacant ? 'ตำแหน่งว่าง' : 'ครองตำแหน่ง'}
                </span>
              </div>

              {/* Avatar + Name & Rank */}
              <div className="flex items-start space-x-3 mb-3">
                <div className={`w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-sm shadow-xs ${
                  isVacant
                    ? 'bg-amber-100 text-amber-700 border border-amber-300'
                    : officer.officerType === 'สัญญาบัตร'
                      ? 'bg-gradient-to-br from-indigo-700 to-slate-900 text-white shadow-indigo-500/20'
                      : 'bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-emerald-500/20'
                }`}>
                  {isVacant ? (
                    <Shield className="w-5 h-5 text-amber-600" />
                  ) : (
                    <span>{officer.rank || 'ตร.'}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {isVacant ? (
                    <div className="text-sm font-bold text-amber-800 italic">
                      (ตำแหน่งว่างรอการบรรจุ)
                    </div>
                  ) : (
                    <div 
                      onClick={() => onViewDetail(officer)}
                      className="text-sm font-bold text-slate-900 hover:text-amber-600 transition-colors truncate cursor-pointer"
                      title={`${officer.rank} ${officer.firstName} ${officer.lastName}`}
                    >
                      {officer.rank} {officer.firstName} {officer.lastName}
                    </div>
                  )}
                  <div className="text-xs text-slate-500 font-medium truncate mt-0.5">
                    ระดับ: <span className="text-slate-800 font-semibold">{officer.rankLevel || officer.position}</span>
                    {officer.officerType && (
                      <span className="text-[10px] text-slate-400 ml-1.5">({officer.officerType})</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Department & Duties */}
              <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 mb-3">
                <div className="flex items-center gap-1.5 text-slate-800 font-medium truncate" title={officer.kk}>
                  <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{officer.kk || officer.bg}</span>
                </div>
                {officer.duty && (
                  <div className="text-slate-500 text-[11px] truncate" title={officer.duty}>
                    หน้าที่: {officer.duty}
                  </div>
                )}
              </div>

              {/* Contact info if available */}
              {(officer.phone || officer.email) && (
                <div className="space-y-1 text-[11px] text-slate-500 mb-2">
                  {officer.phone && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{officer.phone}</span>
                    </div>
                  )}
                  {officer.email && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{officer.email}</span>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Bottom Card Actions */}
            <div className="border-t border-slate-100 bg-slate-50/50 px-3 py-2 flex items-center justify-between">
              <button
                onClick={() => onViewDetail(officer)}
                className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>ดูรายละเอียด</span>
              </button>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onEdit(officer)}
                  className="p-1.5 text-sky-600 hover:text-sky-800 hover:bg-sky-100 rounded-lg transition-colors cursor-pointer"
                  title="แก้ไขข้อมูล"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(officer)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                  title="ลบข้อมูล"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
};
