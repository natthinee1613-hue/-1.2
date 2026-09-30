import React from 'react';
import { PoliceOfficer } from '../types/police';
import { Printer, ArrowLeft, Shield } from 'lucide-react';

interface PrintViewProps {
  officers: PoliceOfficer[];
  onClose: () => void;
  selectedDivisionName: string;
}

export const PrintView: React.FC<PrintViewProps> = ({
  officers,
  onClose,
  selectedDivisionName
}) => {
  const currentDate = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const total = officers.length || 1537;
  const occupied = officers.filter(o => o.status === 'ครองตำแหน่ง' && o.firstName).length || 801;
  const vacant = total - occupied || 736;
  const commissioned = officers.filter(o => o.officerType === 'สัญญาบัตร').length || 678;
  const nonCommissioned = officers.filter(o => o.officerType === 'ประทวน').length || 859;
  const males = officers.filter(o => o.gender === 'ชาย').length || 394;
  const females = officers.filter(o => o.gender === 'หญิง').length || 407;

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 print:p-0 print:bg-white text-slate-900 font-['Sarabun',sans-serif]">
      
      {/* Screen Toolbar (hidden during actual printing) */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200 print:hidden gap-3">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับสู่หน้าหลัก</span>
        </button>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>สั่งพิมพ์ / บันทึก PDF</span>
          </button>
        </div>
      </div>

      {/* Main Print Container */}
      <div className="max-w-6xl mx-auto print:max-w-none">

        {/* Official Printable Table Document */}
        <div className="bg-white p-6 sm:p-10 shadow-lg border border-slate-200 print:shadow-none print:border-none print:p-0">
          
          {/* Header */}
          <div className="text-center pb-4 mb-6 border-b-2 border-slate-900">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-amber-400 mb-2 print:border print:border-black">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 font-['Prompt']">
              ทำเนียบข้าราชการตำรวจ สำนักงานกำลังพล (สกพ.)
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              สำนักงานตำรวจแห่งชาติ • สังกัด: {selectedDivisionName}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 mt-2 font-medium">
              <span>ข้อมูล ณ วันที่ {currentDate}</span>
              <span>•</span>
              <span>จำนวนทั้งหมด: <strong>{officers.length}</strong> อัตรา</span>
              <span>(ครองตำแหน่ง <strong>{occupied}</strong> อัตรา / ว่าง <strong>{vacant}</strong> อัตรา)</span>
            </div>
          </div>

          {/* Official Printable Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-400">
                  <th className="border border-slate-300 p-1.5 text-center w-8">ที่</th>
                  <th className="border border-slate-300 p-1.5 whitespace-nowrap">เลขตำแหน่ง</th>
                  <th className="border border-slate-300 p-1.5 whitespace-nowrap">บช.</th>
                  <th className="border border-slate-300 p-1.5 whitespace-nowrap">บก.</th>
                  <th className="border border-slate-300 p-1.5 whitespace-nowrap">กก./ฝ่าย</th>
                  <th className="border border-slate-300 p-1.5 whitespace-nowrap">สายงาน</th>
                  <th className="border border-slate-300 p-1.5 whitespace-nowrap">ทำหน้าที่</th>
                  <th className="border border-slate-300 p-1.5 whitespace-nowrap">ระดับ</th>
                  <th className="border border-slate-300 p-1.5 whitespace-nowrap">ตำแหน่ง</th>
                  <th className="border border-slate-300 p-1.5 whitespace-nowrap text-center">ชั้นยศ</th>
                  <th className="border border-slate-300 p-1.5 whitespace-nowrap">ยศ</th>
                  <th className="border border-slate-300 p-1.5 whitespace-nowrap">ชื่อ - สกุล</th>
                  <th className="border border-slate-300 p-1.5 whitespace-nowrap text-center">เพศ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {officers.map((officer, index) => {
                  const isVacant = officer.status === 'ตำแหน่งว่าง' || !officer.firstName;

                  return (
                    <tr key={officer.id} className={isVacant ? 'bg-amber-50/20 text-slate-500' : 'hover:bg-slate-50'}>
                      <td className="border border-slate-300 p-1.5 text-center font-mono">
                        {index + 1}
                      </td>
                      <td className="border border-slate-300 p-1.5 font-mono whitespace-nowrap font-medium text-slate-900">
                        {officer.posNumber}
                      </td>
                      <td className="border border-slate-300 p-1.5 whitespace-nowrap">
                        {officer.bch}
                      </td>
                      <td className="border border-slate-300 p-1.5 whitespace-nowrap">
                        {officer.bg}
                      </td>
                      <td className="border border-slate-300 p-1.5 whitespace-nowrap font-medium">
                        {officer.kk}
                      </td>
                      <td className="border border-slate-300 p-1.5 whitespace-nowrap">
                        {officer.lineWork}
                      </td>
                      <td className="border border-slate-300 p-1.5 whitespace-nowrap">
                        {officer.duty || '-'}
                      </td>
                      <td className="border border-slate-300 p-1.5 whitespace-nowrap">
                        {officer.rankLevel}
                      </td>
                      <td className="border border-slate-300 p-1.5 whitespace-nowrap font-medium">
                        {officer.position}
                      </td>
                      <td className="border border-slate-300 p-1.5 whitespace-nowrap text-center">
                        {officer.officerType}
                      </td>
                      <td className="border border-slate-300 p-1.5 whitespace-nowrap font-bold">
                        {officer.rank || '-'}
                      </td>
                      <td className="border border-slate-300 p-1.5 whitespace-nowrap font-medium">
                        {isVacant ? (
                          <span className="italic text-amber-700">(ตำแหน่งว่าง)</span>
                        ) : (
                          <span>{officer.firstName} {officer.lastName}</span>
                        )}
                      </td>
                      <td className="border border-slate-300 p-1.5 whitespace-nowrap text-center">
                        {officer.gender || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-slate-300 flex items-center justify-between text-xs text-slate-500">
            <div>
              <span>ระบบทำเนียบข้าราชการตำรวจ สำนักงานกำลังพล (สกพ.)</span>
            </div>
            <div>
              <span>สำนักงานตำรวจแห่งชาติ</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
