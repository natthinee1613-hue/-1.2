import React from 'react';
import { PoliceOfficer } from '../types/police';
import { 
  X, 
  Shield, 
  Building2, 
  Phone, 
  Mail, 
  Edit3, 
  Trash2, 
  UserCheck, 
  AlertCircle, 
  FileText,
  Briefcase
} from 'lucide-react';

interface OfficerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  officer: PoliceOfficer | null;
  onEdit: (officer: PoliceOfficer) => void;
  onDelete: (officer: PoliceOfficer) => void;
}

export const OfficerDetailModal: React.FC<OfficerDetailModalProps> = ({
  isOpen,
  onClose,
  officer,
  onEdit,
  onDelete
}) => {
  if (!isOpen || !officer) return null;

  const isVacant = officer.status === 'ตำแหน่งว่าง' || !officer.firstName;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Officer Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg border-2 ${
              isVacant 
                ? 'bg-amber-100 text-amber-800 border-amber-300' 
                : officer.officerType === 'สัญญาบัตร'
                  ? 'bg-gradient-to-br from-indigo-600 to-slate-900 text-amber-300 border-amber-500/40 shadow-indigo-500/30'
                  : 'bg-gradient-to-br from-emerald-600 to-teal-900 text-emerald-100 border-emerald-400/40 shadow-emerald-500/30'
            }`}>
              {isVacant ? <Shield className="w-8 h-8 text-amber-600" /> : officer.rank || 'ตร.'}
            </div>

            <div className="flex-1 min-w-0">
              <span className="font-mono text-xs font-semibold bg-slate-800 text-amber-400 px-2 py-0.5 rounded border border-slate-700">
                เลขตำแหน่ง: {officer.posNumber}
              </span>
              <h3 className="text-lg font-bold text-white mt-1 truncate">
                {isVacant ? '(ตำแหน่งว่าง)' : `${officer.rank} ${officer.firstName} ${officer.lastName}`}
              </h3>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                <span>{officer.position || officer.rankLevel}</span>
                <span>•</span>
                <span>{officer.officerType}</span>
                {officer.gender && <span>• เพศ{officer.gender}</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Details Body */}
        <div className="p-6 space-y-4 text-xs sm:text-sm">
          
          {/* Status Badge */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">สถานะอัตรากำลัง:</span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              isVacant
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            }`}>
              {isVacant ? <AlertCircle className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
              <span>{officer.status}</span>
            </span>
          </div>

          {/* Department Information */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              <span>สังกัด / หน่วยงาน</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[11px]">กองบัญชาการ (บช.):</span>
                <span className="font-semibold text-slate-800">{officer.bch || 'สกพ.'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">กองบังคับการ (บก.):</span>
                <span className="font-semibold text-slate-800">{officer.bg}</span>
              </div>
              <div className="col-span-2 pt-1 border-t border-slate-200/60">
                <span className="text-slate-400 block text-[11px]">ฝ่าย / กลุ่มงาน (กก.):</span>
                <span className="font-bold text-slate-900 text-sm">{officer.kk}</span>
              </div>
            </div>
          </div>

          {/* Roles & Function */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5 text-amber-600" />
              <span>สายงาน และการปฏิบัติหน้าที่</span>
            </div>

            <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">กลุ่มสายงาน:</span>
                <span className="font-medium text-slate-800">{officer.groupWork || '-'}</span>
              </div>
              <div className="flex justify-between py-0.5 border-t border-slate-200/60">
                <span className="text-slate-500">สายงาน:</span>
                <span className="font-medium text-slate-800">{officer.lineWork || '-'}</span>
              </div>
              <div className="flex justify-between py-0.5 border-t border-slate-200/60">
                <span className="text-slate-500">ทำหน้าที่:</span>
                <span className="font-bold text-sky-950">{officer.duty || '-'}</span>
              </div>
              <div className="flex justify-between py-0.5 border-t border-slate-200/60">
                <span className="text-slate-500">ระดับตำแหน่ง:</span>
                <span className="font-semibold text-slate-800">{officer.rankLevel || officer.position}</span>
              </div>
            </div>
          </div>

          {/* Contact & Remarks */}
          {(officer.phone || officer.email || officer.remarks) && (
            <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
              {officer.phone && (
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>เบอร์ติดต่อ: <strong className="text-slate-900">{officer.phone}</strong></span>
                </div>
              )}
              {officer.email && (
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>อีเมล: <strong className="text-slate-900">{officer.email}</strong></span>
                </div>
              )}
              {officer.remarks && (
                <div className="flex items-start gap-2 text-slate-700 pt-1 border-t border-slate-200/60">
                  <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <span>หมายเหตุ: {officer.remarks}</span>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Actions */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onDelete(officer);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-100/60 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>ลบข้อมูลนี้</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-200 text-xs font-medium transition-colors cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(officer);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>แก้ไขข้อมูล</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
