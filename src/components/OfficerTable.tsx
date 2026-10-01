import React, { useState } from 'react';
import { PoliceOfficer } from '../types/police';
import { 
  Edit3, 
  Trash2, 
  Eye, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  UserX, 
  CheckSquare, 
  Square,
  ChevronLeft,
  ChevronRight,
  Shield,
  Phone
} from 'lucide-react';

interface OfficerTableProps {
  officers: PoliceOfficer[];
  onEdit: (officer: PoliceOfficer) => void;
  onDelete: (officer: PoliceOfficer) => void;
  onViewDetail: (officer: PoliceOfficer) => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onBulkDelete: () => void;
}

type SortField = 'posNumber' | 'rankLevel' | 'rank' | 'firstName' | 'kk' | 'duty' | 'status';

export const OfficerTable: React.FC<OfficerTableProps> = ({
  officers,
  onEdit,
  onDelete,
  onViewDetail,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onBulkDelete
}) => {
  const [sortField, setSortField] = useState<SortField>('posNumber');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Sort officers
  const sortedOfficers = React.useMemo(() => {
    return [...officers].sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';
      const cmp = String(valA).localeCompare(String(valB), 'th');
      return sortAsc ? cmp : -cmp;
    });
  }, [officers, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(sortedOfficers.length / pageSize) || 1;
  const currentOfficers = React.useMemo(() => {
    if (pageSize === -1) return sortedOfficers;
    const start = (page - 1) * pageSize;
    return sortedOfficers.slice(start, start + pageSize);
  }, [sortedOfficers, page, pageSize]);

  const allCurrentSelected = currentOfficers.length > 0 && currentOfficers.every(o => selectedIds.includes(o.id));

  const handleSelectAllCurrent = () => {
    if (allCurrentSelected) {
      const currentIds = new Set(currentOfficers.map(o => o.id));
      onSelectAll(selectedIds.filter(id => !currentIds.has(id)));
    } else {
      const newIds = new Set([...selectedIds, ...currentOfficers.map(o => o.id)]);
      onSelectAll(Array.from(newIds));
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60" />;
    return sortAsc ? <ArrowUp className="w-3.5 h-3.5 text-amber-500" /> : <ArrowDown className="w-3.5 h-3.5 text-amber-500" />;
  };

  if (officers.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-12 text-center">
        <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <UserX className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-800">ไม่พบข้อมูลข้าราชการตำรวจ</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหาหรือตัวกรองที่เลือก ลองเปลี่ยนตัวกรองหรือเพิ่มข้อมูลใหม่
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
      
      {/* Table Status & Publication Bar */}
      <div className="bg-slate-50 border-b border-slate-200/90 px-4 py-2.5 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-slate-800">ตารางทำเนียบข้าราชการตำรวจ สำนักงานกำลังพล (สกพ.)</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600">แสดงผล {sortedOfficers.length.toLocaleString()} อัตรา</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
            สถานะ: เผยแพร่อัปเดตเป็นปัจจุบัน
          </span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-slate-500 hidden sm:inline">คลิกหัวตารางเพื่อเรียงลำดับ</span>
        </div>
      </div>

      {/* Top Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-amber-900 font-medium">
            <CheckSquare className="w-4 h-4 text-amber-600" />
            <span>เลือกแล้ว {selectedIds.length} รายการ</span>
          </div>
          <button
            onClick={onBulkDelete}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>ลบรายการที่เลือก ({selectedIds.length})</span>
          </button>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900 text-slate-200 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-800">
              <th className="py-3 px-3 w-10 text-center">
                <button 
                  onClick={handleSelectAllCurrent}
                  className="cursor-pointer text-slate-300 hover:text-white"
                  title="เลือกทั้งหมดในหน้านี้"
                >
                  {allCurrentSelected ? (
                    <CheckSquare className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              
              <th 
                onClick={() => handleSort('posNumber')} 
                className="py-3 px-3 cursor-pointer hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>เลขตำแหน่ง</span>
                  {renderSortIcon('posNumber')}
                </div>
              </th>

              <th className="py-3 px-2 whitespace-nowrap">บช.</th>
              <th className="py-3 px-3 whitespace-nowrap">บก.</th>
              
              <th 
                onClick={() => handleSort('kk')} 
                className="py-3 px-3 cursor-pointer hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>กก. / ฝ่าย</span>
                  {renderSortIcon('kk')}
                </div>
              </th>

              <th 
                onClick={() => handleSort('duty')} 
                className="py-3 px-3 cursor-pointer hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>ทำหน้าที่</span>
                  {renderSortIcon('duty')}
                </div>
              </th>

              <th 
                onClick={() => handleSort('rankLevel')} 
                className="py-3 px-2 cursor-pointer hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>ระดับ</span>
                  {renderSortIcon('rankLevel')}
                </div>
              </th>

              <th className="py-3 px-2 whitespace-nowrap">ชั้นยศ</th>

              <th 
                onClick={() => handleSort('rank')} 
                className="py-3 px-2 cursor-pointer hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>ยศ</span>
                  {renderSortIcon('rank')}
                </div>
              </th>

              <th 
                onClick={() => handleSort('firstName')} 
                className="py-3 px-3 cursor-pointer hover:bg-slate-800 transition-colors min-w-[140px]"
              >
                <div className="flex items-center gap-1">
                  <span>ชื่อ - สกุล</span>
                  {renderSortIcon('firstName')}
                </div>
              </th>

              <th className="py-3 px-2 whitespace-nowrap text-center">เพศ</th>
              <th className="py-3 px-2 whitespace-nowrap text-center">สถานะ</th>
              <th className="py-3 px-3 whitespace-nowrap text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {currentOfficers.map((officer, idx) => {
              const isSelected = selectedIds.includes(officer.id);
              const isVacant = officer.status === 'ตำแหน่งว่าง' || !officer.firstName;

              return (
                <tr 
                  key={officer.id}
                  className={`transition-colors hover:bg-amber-50/40 ${
                    isSelected ? 'bg-amber-50/70' : (idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50')
                  } ${isVacant ? 'opacity-85' : ''}`}
                >
                  {/* Select Checkbox */}
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => onToggleSelect(officer.id)}
                      className="cursor-pointer text-slate-400 hover:text-amber-600"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-amber-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </td>

                  {/* เลขตำแหน่ง */}
                  <td className="py-2.5 px-3 font-mono font-medium text-slate-900 whitespace-nowrap">
                    <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                      {officer.posNumber}
                    </span>
                  </td>

                  {/* บช. */}
                  <td className="py-2.5 px-2 text-slate-600 whitespace-nowrap">
                    {officer.bch}
                  </td>

                  {/* บก. */}
                  <td className="py-2.5 px-3 font-medium text-slate-800 whitespace-nowrap">
                    {officer.bg}
                  </td>

                  {/* กก./ฝ่าย */}
                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                    <span className="font-medium text-sky-950">{officer.kk}</span>
                  </td>

                  {/* ทำหน้าที่ */}
                  <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap max-w-[200px] truncate" title={officer.duty}>
                    {officer.duty || '-'}
                  </td>

                  {/* ระดับตำแหน่ง */}
                  <td className="py-2.5 px-2 whitespace-nowrap font-medium text-slate-900">
                    <span className="bg-slate-200/80 px-2 py-0.5 rounded text-[11px]">
                      {officer.rankLevel || officer.position}
                    </span>
                  </td>

                  {/* ชั้นยศ (สัญญาบัตร / ประทวน) */}
                  <td className="py-2.5 px-2 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      officer.officerType === 'สัญญาบัตร'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {officer.officerType || 'สัญญาบัตร'}
                    </span>
                  </td>

                  {/* ยศ */}
                  <td className="py-2.5 px-2 font-bold text-slate-800 whitespace-nowrap">
                    {officer.rank || '-'}
                  </td>

                  {/* ชื่อ - สกุล */}
                  <td className="py-2.5 px-3 font-medium whitespace-nowrap">
                    {isVacant ? (
                      <span className="inline-flex items-center gap-1 text-amber-700 italic bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                        (ตำแหน่งว่าง)
                      </span>
                    ) : (
                      <button
                        onClick={() => onViewDetail(officer)}
                        className="text-left font-semibold text-slate-900 hover:text-amber-600 transition-colors cursor-pointer group flex items-center gap-1"
                      >
                        <span>{officer.firstName} {officer.lastName}</span>
                        {officer.phone && (
                          <span title={officer.phone} className="text-slate-400 group-hover:text-amber-500">
                            <Phone className="w-3 h-3" />
                          </span>
                        )}
                      </button>
                    )}
                  </td>

                  {/* เพศ */}
                  <td className="py-2.5 px-2 whitespace-nowrap text-center">
                    {officer.gender === 'ชาย' ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        ชาย
                      </span>
                    ) : officer.gender === 'หญิง' ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-pink-50 text-pink-700 border border-pink-200">
                        หญิง
                      </span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>

                  {/* สถานะ */}
                  <td className="py-2.5 px-2 whitespace-nowrap text-center">
                    {isVacant ? (
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400" title="ตำแหน่งว่าง" />
                    ) : (
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" title="ครองตำแหน่ง" />
                    )}
                  </td>

                  {/* จัดการ (Actions) */}
                  <td className="py-2.5 px-3 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        onClick={() => onViewDetail(officer)}
                        className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                        title="ดูประวัติ / รายละเอียด"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEdit(officer)}
                        className="p-1 text-sky-600 hover:text-sky-900 hover:bg-sky-50 rounded-md transition-colors cursor-pointer"
                        title="แก้ไขข้อมูลกำลังพล"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(officer)}
                        className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                        title="ลบข้อมูล"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span>แสดง</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="bg-white border border-slate-200 rounded-md px-2 py-1 text-xs cursor-pointer focus:outline-none"
          >
            <option value={25}>25 รายการ</option>
            <option value={50}>50 รายการ</option>
            <option value={100}>100 รายการ</option>
            <option value={-1}>ทั้งหมด ({sortedOfficers.length})</option>
          </select>
          <span>จากทั้งหมด {sortedOfficers.length.toLocaleString()} รายการ</span>
        </div>

        {pageSize !== -1 && totalPages > 1 && (
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5 inline" />
            </button>
            <span className="px-3 py-1 font-medium text-slate-800">
              หน้า {page} จาก {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5 inline" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
