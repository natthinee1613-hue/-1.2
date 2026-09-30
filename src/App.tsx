/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { PoliceOfficer, FilterOptions } from './types/police';
import { 
  loadOfficersFromStorage, 
  saveOfficersToStorage, 
  resetOfficersToDefault 
} from './utils/storage';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { SubdivisionNav } from './components/SubdivisionNav';
import { OrgChart } from './components/OrgChart';
import { FilterBar } from './components/FilterBar';
import { OfficerTable } from './components/OfficerTable';
import { OfficerCardGrid } from './components/OfficerCardGrid';
import { OfficerModal } from './components/OfficerModal';
import { OfficerDetailModal } from './components/OfficerDetailModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { UploadModal } from './components/UploadModal';
import { DownloadModal } from './components/DownloadModal';
import { PrintView } from './components/PrintView';
import { CheckCircle2, AlertCircle, GitBranch, Layers } from 'lucide-react';

export default function App() {
  // Main Data State
  const [officers, setOfficers] = useState<PoliceOfficer[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Filters State
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    selectedBch: 'ALL',
    selectedBg: 'ALL',
    selectedKk: 'ALL',
    selectedRankLevel: 'ALL',
    selectedOfficerType: 'ALL',
    selectedGender: 'ALL',
    selectedStatus: 'ALL'
  });

  // UI State
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [structureMode, setStructureMode] = useState<'chart' | 'cascade'>('chart');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Modal States
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState<PoliceOfficer | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingOfficer, setViewingOfficer] = useState<PoliceOfficer | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingOfficer, setDeletingOfficer] = useState<PoliceOfficer | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isPrintViewOpen, setIsPrintViewOpen] = useState(false);

  // Load Initial Data on Mount
  useEffect(() => {
    const loaded = loadOfficersFromStorage();
    setOfficers(loaded);
    setIsLoaded(true);
  }, []);

  // Save changes to LocalStorage
  const updateOfficers = (newList: PoliceOfficer[], message?: string) => {
    setOfficers(newList);
    saveOfficersToStorage(newList);
    if (message) {
      showToast(message, 'success');
    }
  };

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Filter & Search Logic
  const filteredOfficers = useMemo(() => {
    return officers.filter(officer => {
      // 1. บช. (กองบัญชาการ) filter
      if (filters.selectedBch !== 'ALL' && (officer.bch || 'สกพ.') !== filters.selectedBch) {
        return false;
      }

      // 2. บก. (กองบังคับการ) filter
      if (filters.selectedBg !== 'ALL' && (officer.bg || 'สกพ.') !== filters.selectedBg) {
        return false;
      }

      // 3. กก. (ฝ่าย/กลุ่มงาน) filter
      if (filters.selectedKk !== 'ALL' && (officer.kk || officer.bg || 'สกพ.') !== filters.selectedKk) {
        return false;
      }

      // 3. Rank Level filter
      if (filters.selectedRankLevel !== 'ALL' && officer.rankLevel !== filters.selectedRankLevel && officer.position !== filters.selectedRankLevel) {
        return false;
      }

      // 4. Officer Type filter (สัญญาบัตร / ประทวน)
      if (filters.selectedOfficerType !== 'ALL' && officer.officerType !== filters.selectedOfficerType) {
        return false;
      }

      // 5. Gender filter
      if (filters.selectedGender !== 'ALL' && officer.gender !== filters.selectedGender) {
        return false;
      }

      // 6. Status filter
      if (filters.selectedStatus !== 'ALL') {
        const isVacant = officer.status === 'ตำแหน่งว่าง' || !officer.firstName;
        if (filters.selectedStatus === 'ตำแหน่งว่าง' && !isVacant) return false;
        if (filters.selectedStatus === 'ครองตำแหน่ง' && isVacant) return false;
      }

      // 7. Search query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchName = `${officer.rank || ''} ${officer.firstName || ''} ${officer.lastName || ''}`.toLowerCase().includes(query);
        const matchPosNumber = (officer.posNumber || '').toLowerCase().includes(query);
        const matchDuty = (officer.duty || '').toLowerCase().includes(query);
        const matchKk = (officer.kk || '').toLowerCase().includes(query);
        const matchBg = (officer.bg || '').toLowerCase().includes(query);
        const matchLine = (officer.lineWork || '').toLowerCase().includes(query);

        if (!matchName && !matchPosNumber && !matchDuty && !matchKk && !matchBg && !matchLine) {
          return false;
        }
      }

      return true;
    });
  }, [officers, filters]);

  // CRUD Handlers
  const handleOpenAddModal = () => {
    setEditingOfficer(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (officer: PoliceOfficer) => {
    setEditingOfficer(officer);
    setIsAddEditModalOpen(true);
  };

  const handleSaveOfficer = (officerToSave: PoliceOfficer) => {
    const exists = officers.some(o => o.id === officerToSave.id);
    let updated: PoliceOfficer[];

    if (exists) {
      updated = officers.map(o => o.id === officerToSave.id ? officerToSave : o);
      updateOfficers(updated, `แก้ไขข้อมูล ${officerToSave.firstName ? officerToSave.rank + ' ' + officerToSave.firstName : officerToSave.posNumber} เรียบร้อยแล้ว`);
    } else {
      updated = [officerToSave, ...officers];
      updateOfficers(updated, `เพิ่มข้อมูล ${officerToSave.firstName ? officerToSave.rank + ' ' + officerToSave.firstName : officerToSave.posNumber} เรียบร้อยแล้ว`);
    }

    setIsAddEditModalOpen(false);
    setEditingOfficer(null);
  };

  const handleOpenDelete = (officer: PoliceOfficer) => {
    setDeletingOfficer(officer);
    setIsBulkDelete(false);
    setIsDeleteModalOpen(true);
  };

  const handleOpenBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setDeletingOfficer(null);
    setIsBulkDelete(true);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (isBulkDelete) {
      const idsSet = new Set(selectedIds);
      const remaining = officers.filter(o => !idsSet.has(o.id));
      updateOfficers(remaining, `ลบข้อมูลที่เลือกจำนวน ${selectedIds.length} รายการ เรียบร้อยแล้ว`);
      setSelectedIds([]);
    } else if (deletingOfficer) {
      const remaining = officers.filter(o => o.id !== deletingOfficer.id);
      updateOfficers(remaining, `ลบข้อมูล ${deletingOfficer.firstName ? deletingOfficer.rank + ' ' + deletingOfficer.firstName : deletingOfficer.posNumber} เรียบร้อยแล้ว`);
      setDeletingOfficer(null);
    }
  };

  const handleResetData = () => {
    if (window.confirm('คุณต้องการรีเซ็ตข้อมูลเป็นชุดข้อมูลเริ่มต้นจากเอกสารทางการ 40 หน้า ใช่หรือไม่?')) {
      const def = resetOfficersToDefault();
      setOfficers(def);
      setSelectedIds([]);
      showToast('รีเซ็ตข้อมูลเป็นชุดมาตรฐานสำเร็จ', 'info');
    }
  };

  const handleImport = (newOfficers: PoliceOfficer[], mode: 'append' | 'replace') => {
    if (mode === 'replace') {
      updateOfficers(newOfficers, `นำเข้าและแทนที่ข้อมูลเรียบร้อยแล้ว (${newOfficers.length} รายการ)`);
      setSelectedIds([]);
    } else {
      // Append mode: merge avoiding identical ids
      const existingIds = new Set(officers.map(o => o.id));
      const filteredNew = newOfficers.filter(o => !existingIds.has(o.id));
      const merged = [...filteredNew, ...officers];
      updateOfficers(merged, `เพิ่มข้อมูลจากการนำเข้าเรียบร้อยแล้ว (${newOfficers.length} รายการ)`);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (ids: string[]) => {
    setSelectedIds(ids);
  };

  const activeStructureLabel = 
    filters.selectedKk !== 'ALL' ? `กก. ${filters.selectedKk} (${filters.selectedBg})` :
    filters.selectedBg !== 'ALL' ? `บก. ${filters.selectedBg}` :
    filters.selectedBch !== 'ALL' ? `บช. ${filters.selectedBch}` : 'ทุกหน่วยงาน';

  // If in Print View mode
  if (isPrintViewOpen) {
    return (
      <PrintView
        officers={filteredOfficers}
        selectedDivisionName={activeStructureLabel}
        onClose={() => setIsPrintViewOpen(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Sarabun',sans-serif]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className={`px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold flex items-center space-x-2.5 ${
            toastMessage.type === 'success' 
              ? 'bg-slate-900 text-emerald-400 border-emerald-500/40' 
              : toastMessage.type === 'error'
                ? 'bg-slate-900 text-rose-400 border-rose-500/40'
                : 'bg-slate-900 text-sky-400 border-sky-500/40'
          }`}>
            {toastMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {toastMessage.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <Header
        totalOfficers={officers.length}
        onOpenAddModal={handleOpenAddModal}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
        onOpenPrintView={() => setIsPrintViewOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Structure View Switcher (แผนภูมิโครงสร้าง vs ตัวเลือกด่วน) */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              รูปแบบโครงสร้างหน่วยงาน:
            </span>
          </div>

          <div className="flex items-center bg-slate-200/80 p-1 rounded-2xl border border-slate-300/80">
            <button
              onClick={() => setStructureMode('chart')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                structureMode === 'chart'
                  ? 'bg-slate-900 text-amber-400 shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 text-amber-400" />
              <span>แผนภูมิโครงสร้างองค์กร (Org Chart)</span>
            </button>
            <button
              onClick={() => setStructureMode('cascade')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                structureMode === 'cascade'
                  ? 'bg-slate-900 text-amber-400 shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>เลือกสังกัด บช. ➔ บก. ➔ กก.</span>
            </button>
          </div>
        </div>

        {/* Structure Component Rendering */}
        {structureMode === 'chart' ? (
          <OrgChart
            officers={officers}
            filteredCount={filteredOfficers.length}
            selectedBch={filters.selectedBch}
            selectedBg={filters.selectedBg}
            selectedKk={filters.selectedKk}
            onSelectBch={(bch) => setFilters(prev => ({ ...prev, selectedBch: bch, selectedBg: 'ALL', selectedKk: 'ALL' }))}
            onSelectBg={(bg) => setFilters(prev => ({ ...prev, selectedBg: bg, selectedKk: 'ALL' }))}
            onSelectKk={(kk) => setFilters(prev => ({ ...prev, selectedKk: kk }))}
            onResetStructure={() => setFilters(prev => ({ ...prev, selectedBch: 'ALL', selectedBg: 'ALL', selectedKk: 'ALL' }))}
          />
        ) : (
          <div className="space-y-4 mb-6">
            <SubdivisionNav
              officers={officers}
              selectedBch={filters.selectedBch}
              selectedBg={filters.selectedBg}
              selectedKk={filters.selectedKk}
              onSelectBch={(bch) => setFilters(prev => ({ ...prev, selectedBch: bch, selectedBg: 'ALL', selectedKk: 'ALL' }))}
              onSelectBg={(bg) => setFilters(prev => ({ ...prev, selectedBg: bg, selectedKk: 'ALL' }))}
              onSelectKk={(kk) => setFilters(prev => ({ ...prev, selectedKk: kk }))}
              onResetStructure={() => setFilters(prev => ({ ...prev, selectedBch: 'ALL', selectedBg: 'ALL', selectedKk: 'ALL' }))}
            />
            {/* Compact Stats in Cascade Mode */}
            <StatsOverview
              officers={officers}
              filteredCount={filteredOfficers.length}
            />
          </div>
        )}

        {/* Filter and Search Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
          onResetFilters={() => setFilters({
            searchQuery: '',
            selectedBch: 'ALL',
            selectedBg: 'ALL',
            selectedKk: 'ALL',
            selectedRankLevel: 'ALL',
            selectedOfficerType: 'ALL',
            selectedGender: 'ALL',
            selectedStatus: 'ALL'
          })}
          viewMode={viewMode}
          onToggleViewMode={setViewMode}
          totalFiltered={filteredOfficers.length}
        />

        {/* Content View: Table or Card Grid */}
        {viewMode === 'table' ? (
          <OfficerTable
            officers={filteredOfficers}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDelete}
            onViewDetail={(officer) => {
              setViewingOfficer(officer);
              setIsDetailModalOpen(true);
            }}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            onBulkDelete={handleOpenBulkDelete}
          />
        ) : (
          <OfficerCardGrid
            officers={filteredOfficers}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDelete}
            onViewDetail={(officer) => {
              setViewingOfficer(officer);
              setIsDetailModalOpen(true);
            }}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-300">
            ระบบบริหารทำเนียบข้าราชการตำรวจ สำนักงานกำลังพล (สกพ.)
          </p>
          <p className="text-slate-500">
            รองรับการแบ่งหมวดหมู่หน่วยงาน การเพิ่ม แก้ไข ลบ ค้นหา และส่งออกข้อมูล Excel/CSV/JSON
          </p>
        </div>
      </footer>

      {/* Add / Edit Modal */}
      <OfficerModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setEditingOfficer(null);
        }}
        onSave={handleSaveOfficer}
        initialData={editingOfficer}
      />

      {/* Detail Modal */}
      <OfficerDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setViewingOfficer(null);
        }}
        officer={viewingOfficer}
        onEdit={(officer) => {
          setIsDetailModalOpen(false);
          handleOpenEditModal(officer);
        }}
        onDelete={(officer) => {
          setIsDetailModalOpen(false);
          handleOpenDelete(officer);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingOfficer(null);
        }}
        onConfirm={handleConfirmDelete}
        officer={deletingOfficer}
        count={isBulkDelete ? selectedIds.length : undefined}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onImport={handleImport}
      />

      {/* Download Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        allOfficers={officers}
        filteredOfficers={filteredOfficers}
        onOpenPrint={() => {
          setIsDownloadModalOpen(false);
          setIsPrintViewOpen(true);
        }}
      />

    </div>
  );
}
