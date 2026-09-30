import React from 'react';
import { FilterOptions } from '../types/police';
import { RANK_LEVELS } from '../data/initialPoliceData';
import { Search, SlidersHorizontal, Table, LayoutGrid, X } from 'lucide-react';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: Partial<FilterOptions>) => void;
  onResetFilters: () => void;
  viewMode: 'table' | 'grid';
  onToggleViewMode: (mode: 'table' | 'grid') => void;
  totalFiltered: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  viewMode,
  onToggleViewMode,
  totalFiltered
}) => {
  const hasActiveFilters = 
    filters.searchQuery ||
    filters.selectedRankLevel !== 'ALL' ||
    filters.selectedOfficerType !== 'ALL' ||
    filters.selectedGender !== 'ALL' ||
    filters.selectedStatus !== 'ALL';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="ค้นหาตามชื่อ-สกุล, เลขตำแหน่ง, ยศ, ทำหน้าที่, กก./ฝ่าย..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-slate-800 placeholder-slate-400"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-1.5 self-end md:self-auto bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => onToggleViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="แสดงแบบตาราง (เป็นทางการ)"
          >
            <Table className="w-3.5 h-3.5" />
            <span>ตาราง</span>
          </button>
          <button
            onClick={() => onToggleViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="แสดงแบบการ์ดประวัติ"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>การ์ด</span>
          </button>
        </div>

      </div>

      {/* Filter Dropdowns */}
      <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
        <div className="flex items-center gap-1 text-slate-500 font-medium mr-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>ตัวกรอง:</span>
        </div>

        {/* 1. ระดับตำแหน่ง */}
        <select
          value={filters.selectedRankLevel}
          onChange={(e) => onFilterChange({ selectedRankLevel: e.target.value })}
          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
        >
          <option value="ALL">ระดับตำแหน่ง (ทั้งหมด)</option>
          {RANK_LEVELS.map(rl => (
            <option key={rl} value={rl}>{rl}</option>
          ))}
        </select>

        {/* 2. ชั้นสัญญาบัตร / ประทวน */}
        <select
          value={filters.selectedOfficerType}
          onChange={(e) => onFilterChange({ selectedOfficerType: e.target.value })}
          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
        >
          <option value="ALL">ชั้นยศ (ทั้งหมด)</option>
          <option value="สัญญาบัตร">ชั้นสัญญาบัตร</option>
          <option value="ประทวน">ชั้นประทวน</option>
        </select>

        {/* 3. สถานะ */}
        <select
          value={filters.selectedStatus}
          onChange={(e) => onFilterChange({ selectedStatus: e.target.value })}
          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
        >
          <option value="ALL">สถานะ (ทั้งหมด)</option>
          <option value="ครองตำแหน่ง">มีผู้ครองตำแหน่ง</option>
          <option value="ตำแหน่งว่าง">ตำแหน่งว่าง</option>
        </select>

        {/* 4. เพศ */}
        <select
          value={filters.selectedGender}
          onChange={(e) => onFilterChange({ selectedGender: e.target.value })}
          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
        >
          <option value="ALL">เพศ (ทั้งหมด)</option>
          <option value="ชาย">ชาย</option>
          <option value="หญิง">หญิง</option>
        </select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer ml-auto"
          >
            <X className="w-3.5 h-3.5" />
            <span>ล้างตัวกรอง</span>
          </button>
        )}
      </div>

    </div>
  );
};
