import React from 'react';
import { PoliceOfficer } from '../types/police';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  officer?: PoliceOfficer | null;
  count?: number; // for bulk delete
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  officer,
  count
}) => {
  if (!isOpen) return null;

  const isBulk = typeof count === 'number' && count > 1;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <h3 className="text-base font-bold text-slate-900">
              {isBulk ? `ยืนยันการลบ ${count} รายการ` : 'ยืนยันการลบข้อมูลกำลังพล'}
            </h3>

            {isBulk ? (
              <p className="text-xs text-slate-600 mt-2">
                คุณแน่ใจหรือไม่ว่าต้องการลบรายการข้าราชการตำรวจที่เลือกจำนวน <strong className="text-rose-600">{count} อัตรา</strong> ออกจากระบบ? การกระทำนี้ไม่สามารถยกเลิกได้
              </p>
            ) : officer ? (
              <div className="mt-2 text-xs text-slate-600">
                <p>คุณต้องการลบข้อมูลกำลังพลนี้ใช่หรือไม่?</p>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-2 space-y-1">
                  <div className="font-semibold text-slate-900">
                    {officer.firstName ? `${officer.rank} ${officer.firstName} ${officer.lastName}` : '(ตำแหน่งว่าง)'}
                  </div>
                  <div className="text-slate-500 font-mono text-[11px]">
                    เลขตำแหน่ง: {officer.posNumber}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    สังกัด: {officer.kk} ({officer.bg})
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-5 flex items-center justify-end space-x-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-rose-600/20 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ยืนยันการลบ</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
