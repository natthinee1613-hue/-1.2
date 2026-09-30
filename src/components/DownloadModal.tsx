import React, { useState } from 'react';
import { PoliceOfficer } from '../types/police';
import { exportOfficers } from '../utils/exportImport';
import { 
  X, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Code, 
  Printer, 
  CheckCircle2, 
  Filter,
  BookOpen
} from 'lucide-react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  allOfficers: PoliceOfficer[];
  filteredOfficers: PoliceOfficer[];
  onOpenPrint: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  allOfficers,
  filteredOfficers,
  onOpenPrint
}) => {
  const [exportScope, setExportScope] = useState<'filtered' | 'all'>('filtered');
  const [filename, setFilename] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const dataToExport = exportScope === 'filtered' ? filteredOfficers : allOfficers;

  const handleExport = (format: 'xlsx' | 'csv' | 'json') => {
    const defaultName = filename.trim() || `ทำเนียบข้าราชการตำรวจ_สกพ_${new Date().toISOString().slice(0, 10)}`;
    exportOfficers(dataToExport, {
      filename: defaultName,
      format
    });

    setDownloadSuccess(`ส่งออกไฟล์รูปแบบ .${format.toUpperCase()} เรียบร้อยแล้ว (${dataToExport.length} รายการ)`);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                ดาวน์โหลดทำเนียบกำลังพล
              </h3>
              <p className="text-xs text-slate-300">
                ส่งออกข้อมูลไปยัง Excel, CSV, JSON หรือพิมพ์รายงาน
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs sm:text-sm">
          
          {/* Notification */}
          {downloadSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{downloadSuccess}</span>
            </div>
          )}

          {/* Scope Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              ขอบเขตข้อมูลที่ต้องการดาวน์โหลด:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setExportScope('filtered')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  exportScope === 'filtered'
                    ? 'bg-amber-50/70 border-amber-500 text-slate-900 ring-1 ring-amber-500/30'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-amber-600" />
                    เฉพาะรายการที่กรอง
                  </span>
                  <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    {filteredOfficers.length}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">
                  ตามหมวดหมู่และคำค้นหาปัจจุบัน
                </span>
              </button>

              <button
                type="button"
                onClick={() => setExportScope('all')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  exportScope === 'all'
                    ? 'bg-amber-50/70 border-amber-500 text-slate-900 ring-1 ring-amber-500/30'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">ข้อมูลทั้งหมด</span>
                  <span className="text-xs font-extrabold text-slate-800 bg-slate-200 px-2 py-0.5 rounded-full">
                    {allOfficers.length}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">
                  ทุกกองบังคับการและทุกฝ่าย
                </span>
              </button>
            </div>
          </div>

          {/* Filename Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ชื่อไฟล์ (เว้นว่างไว้จะใช้ชื่ออัตโนมัติตามวันที่):
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder={`ทำเนียบข้าราชการตำรวจ_สกพ_${new Date().toISOString().slice(0, 10)}`}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Export Formats Grid */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              เลือกรูปแบบไฟล์ที่ต้องการ:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              {/* Excel */}
              <button
                type="button"
                onClick={() => handleExport('xlsx')}
                className="flex items-center space-x-3 p-3 rounded-xl border border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 hover:border-emerald-400 text-slate-800 transition-all cursor-pointer group text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Excel Spreadsheet (.xlsx)</span>
                  <span className="text-[11px] text-slate-500">รูปแบบตารางมาตรฐานสำหรับ MS Excel</span>
                </div>
              </button>

              {/* CSV */}
              <button
                type="button"
                onClick={() => handleExport('csv')}
                className="flex items-center space-x-3 p-3 rounded-xl border border-sky-200 bg-sky-50/40 hover:bg-sky-50 hover:border-sky-400 text-slate-800 transition-all cursor-pointer group text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-sky-600 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">CSV File (.csv)</span>
                  <span className="text-[11px] text-slate-500">รองรับภาษาไทย UTF-8 BOM ไม่เป็นภาษาต่างดาว</span>
                </div>
              </button>

              {/* JSON */}
              <button
                type="button"
                onClick={() => handleExport('json')}
                className="flex items-center space-x-3 p-3 rounded-xl border border-purple-200 bg-purple-50/40 hover:bg-purple-50 hover:border-purple-400 text-slate-800 transition-all cursor-pointer group text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">JSON Data (.json)</span>
                  <span className="text-[11px] text-slate-500">สำหรับสำรองข้อมูลและนำเข้าระบบอื่น</span>
                </div>
              </button>

              {/* Print View */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPrint();
                }}
                className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-300 text-slate-800 transition-all cursor-pointer group text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-800 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">พิมพ์รายงานทางการ (A4)</span>
                  <span className="text-[11px] text-slate-500">รูปแบบหนังสือราชการ พิมพ์หรือบันทึก PDF</span>
                </div>
              </button>

            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-3.5 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 text-xs font-semibold cursor-pointer"
          >
            ปิด
          </button>
        </div>

      </div>
    </div>
  );
};
