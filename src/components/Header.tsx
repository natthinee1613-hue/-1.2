import React from 'react';
import { 
  Shield, 
  UserPlus, 
  Download, 
  Upload, 
  Printer, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  totalOfficers: number;
  onOpenAddModal: () => void;
  onOpenUploadModal: () => void;
  onOpenDownloadModal: () => void;
  onOpenPrintView: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalOfficers,
  onOpenAddModal,
  onOpenUploadModal,
  onOpenDownloadModal,
  onOpenPrintView,
  onResetData
}) => {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white shadow-xl border-b border-amber-500/30 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-slate-900/90 rounded-[10px] flex items-center justify-center">
                  <Shield className="w-6 h-6 text-amber-400" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full flex items-center justify-center" title="ระบบออนไลน์">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">
                  สำนักงานกำลังพล (สกพ.)
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  สำนักงานตำรวจแห่งชาติ
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  เผยแพร่ข้อมูลปัจจุบัน พ.ศ. ๒๕๖๙
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2 mt-0.5">
                ทำเนียบข้าราชการตำรวจ
                <span className="text-xs font-normal text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
                  {totalOfficers.toLocaleString()} อัตรา
                </span>
              </h1>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 shadow-md hover:shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
              title="เพิ่มข้าราชการตำรวจใหม่"
            >
              <UserPlus className="w-4 h-4" />
              <span>เพิ่มกำลังพล</span>
            </button>

            <button
              onClick={onOpenUploadModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all active:scale-95 cursor-pointer shadow-sm"
              title="อัปโหลดไฟล์ Excel / CSV / JSON"
            >
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>อัปโหลด</span>
            </button>

            <button
              onClick={onOpenDownloadModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all active:scale-95 cursor-pointer shadow-sm"
              title="ดาวน์โหลดเป็น Excel / CSV / JSON"
            >
              <Download className="w-4 h-4 text-sky-400" />
              <span>ดาวน์โหลด</span>
            </button>

            <button
              onClick={onOpenPrintView}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all active:scale-95 cursor-pointer shadow-sm"
              title="พิมพ์แบบทำเนียบข้าราชการตำรวจทางการ"
            >
              <Printer className="w-4 h-4 text-purple-400" />
              <span className="hidden sm:inline">พิมพ์รายงาน</span>
            </button>

            <button
              onClick={onResetData}
              className="inline-flex items-center gap-1 p-2 text-xs sm:text-sm font-medium rounded-lg bg-slate-800/80 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 border border-slate-700/60 hover:border-rose-800/60 transition-all cursor-pointer"
              title="รีเซ็ตเป็นข้อมูลตั้งต้น (จากไฟล์เอกสารทางการ 40 หน้า)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
