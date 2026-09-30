import React, { useState, useRef } from 'react';
import { PoliceOfficer } from '../types/police';
import { parseUploadedFile, generateTemplate } from '../utils/exportImport';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  PlusCircle,
  Replace
} from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newOfficers: PoliceOfficer[], mode: 'append' | 'replace') => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onImport
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<PoliceOfficer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setIsLoading(true);

    try {
      const records = await parseUploadedFile(selectedFile);
      setParsedData(records);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการประมวลผลไฟล์');
      setParsedData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleConfirmImport = () => {
    if (parsedData.length === 0) return;
    onImport(parsedData, importMode);
    onClose();
  };

  const handleReset = () => {
    setFile(null);
    setParsedData([]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                อัปโหลดไฟล์ข้อมูลกำลังพล
              </h3>
              <p className="text-xs text-slate-300">
                รองรับไฟล์ Excel (.xlsx, .xls), CSV, และ JSON
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
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          
          {/* Template Download Section */}
          <div className="bg-sky-50/70 border border-sky-200/80 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileSpreadsheet className="w-6 h-6 text-sky-600 flex-shrink-0" />
              <div>
                <span className="font-bold text-sky-950 block">ยังไม่มีไฟล์รูปแบบมาตรฐาน?</span>
                <span className="text-xs text-sky-700">ดาวน์โหลดเทมเพลต Excel ตัวอย่างพร้อมหัวตารางภาษาไทย</span>
              </div>
            </div>
            <button
              onClick={() => generateTemplate()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ดาวน์โหลดเทมเพลต</span>
            </button>
          </div>

          {/* Upload Drop Zone */}
          {!file && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50/70 hover:bg-amber-50/20 rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3"
            >
              <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">
                  ลากไฟล์มาวางที่นี่ หรือ <span className="text-amber-600 underline">คลิกเพื่อเลือกไฟล์</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  รองรับ Excel (.xlsx, .xls), CSV (UTF-8), หรือ JSON
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv,.json"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-start gap-2.5 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">ไม่สามารถนำเข้าข้อมูลได้:</strong>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Parsed Preview Section */}
          {file && !error && (
            <div className="space-y-4">
              
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block truncate max-w-xs">{file.name}</span>
                    <span className="text-xs text-slate-500">
                      พบข้อมูลทั้งหมด <strong className="text-emerald-600 font-bold">{parsedData.length}</strong> รายการ
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  เลือกไฟล์อื่น
                </button>
              </div>

              {/* Mode Selection */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  เลือกรูปแบบการนำเข้า:
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className={`flex items-start space-x-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                    importMode === 'append' ? 'bg-amber-50/70 border-amber-400 text-amber-950' : 'bg-white border-slate-200 text-slate-700'
                  }`}>
                    <input
                      type="radio"
                      name="importMode"
                      value="append"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="mt-0.5 text-amber-600 focus:ring-amber-500"
                    />
                    <div>
                      <span className="font-bold text-xs flex items-center gap-1">
                        <PlusCircle className="w-3.5 h-3.5 text-amber-600" />
                        เพิ่มต่อจากข้อมูลเดิม
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        เก็บข้อมูลปัจจุบันไว้ และเพิ่มรายการใหม่เข้าไป
                      </span>
                    </div>
                  </label>

                  <label className={`flex items-start space-x-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                    importMode === 'replace' ? 'bg-rose-50/70 border-rose-400 text-rose-950' : 'bg-white border-slate-200 text-slate-700'
                  }`}>
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="mt-0.5 text-rose-600 focus:ring-rose-500"
                    />
                    <div>
                      <span className="font-bold text-xs flex items-center gap-1 text-rose-700">
                        <Replace className="w-3.5 h-3.5" />
                        แทนที่ข้อมูลทั้งหมด
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        ลบข้อมูลเดิม และใช้ข้อมูลจากไฟล์นี้เป็นชุดใหม่
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Data Preview (First 4 rows) */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1.5">
                  ตัวอย่างข้อมูลที่ตรวจพบ (4 รายการแรก):
                </span>
                <div className="border border-slate-200 rounded-xl overflow-x-auto text-[11px]">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2">เลขตำแหน่ง</th>
                        <th className="p-2">สังกัด (กก./ฝ่าย)</th>
                        <th className="p-2">ตำแหน่ง</th>
                        <th className="p-2">ยศ ชื่อ สกุล</th>
                        <th className="p-2">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parsedData.slice(0, 4).map((off, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2 font-mono">{off.posNumber}</td>
                          <td className="p-2">{off.kk || off.bg}</td>
                          <td className="p-2">{off.position || off.rankLevel}</td>
                          <td className="p-2 font-medium">
                            {off.firstName ? `${off.rank} ${off.firstName} ${off.lastName}` : '(ตำแหน่งว่าง)'}
                          </td>
                          <td className="p-2">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                              off.status === 'ครองตำแหน่ง' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {off.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-3.5 flex items-center justify-end space-x-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 text-xs font-semibold cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            disabled={parsedData.length === 0 || isLoading}
            onClick={handleConfirmImport}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>นำเข้าข้อมูล ({parsedData.length} รายการ)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
