import React, { useState, useEffect } from 'react';
import { PoliceOfficer, OfficerType, OfficerGender, OfficerStatus } from '../types/police';
import { POLICE_RANKS, RANK_LEVELS, DIVISION_CATEGORIES } from '../data/initialPoliceData';
import { X, Save, UserPlus, Edit3, Shield, AlertCircle } from 'lucide-react';

interface OfficerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (officer: PoliceOfficer) => void;
  initialData?: PoliceOfficer | null;
}

export const OfficerModal: React.FC<OfficerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState<Partial<PoliceOfficer>>({
    posNumber: '',
    bch: 'สกพ.',
    bg: 'สกพ.',
    divisionGroup: 'ผู้บังคับบัญชา สกพ.',
    kk: 'สกพ.',
    groupWork: 'อำนวยการและสนับสนุน',
    lineWork: 'อำนวยการ',
    duty: 'อำนวยการ',
    rankLevel: 'สว.',
    position: 'สว.',
    officerType: 'สัญญาบัตร',
    rank: 'พ.ต.ต.',
    firstName: '',
    lastName: '',
    gender: 'ชาย',
    status: 'ครองตำแหน่ง',
    phone: '',
    email: '',
    remarks: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        posNumber: '',
        bch: 'สกพ.',
        bg: 'สกพ.',
        divisionGroup: 'ผู้บังคับบัญชา สกพ.',
        kk: 'สกพ.',
        groupWork: 'อำนวยการและสนับสนุน',
        lineWork: 'อำนวยการ',
        duty: 'อำนวยการ',
        rankLevel: 'สว.',
        position: 'สว.',
        officerType: 'สัญญาบัตร',
        rank: 'พ.ต.ต.',
        firstName: '',
        lastName: '',
        gender: 'ชาย',
        status: 'ครองตำแหน่ง',
        phone: '',
        email: '',
        remarks: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Auto detect officer type when rank changes
  const handleRankChange = (selectedRank: string) => {
    let type: OfficerType = 'สัญญาบัตร';
    if (['ด.ต.', 'จ.ส.ต.', 'ส.ต.อ.', 'ส.ต.ท.', 'ส.ต.ต.'].includes(selectedRank)) {
      type = 'ประทวน';
    }
    setFormData(prev => ({
      ...prev,
      rank: selectedRank,
      officerType: type
    }));
  };

  const handleDivisionChange = (divGroupName: string) => {
    const divObj = DIVISION_CATEGORIES.find(d => d.name === divGroupName);
    const defaultKk = divObj?.subdivisions[0] || 'สกพ.';
    let defaultBg = 'สกพ.';
    if (divGroupName.includes('อัตรากำลัง')) defaultBg = 'กองอัตรากำลัง สกพ.';
    else if (divGroupName.includes('ทะเบียนพล')) defaultBg = 'กองทะเบียนพล สกพ.';
    else if (divGroupName.includes('สวัสดิการ')) defaultBg = 'กองสวัสดิการ สกพ.';

    setFormData(prev => ({
      ...prev,
      divisionGroup: divGroupName,
      bg: defaultBg,
      kk: defaultKk
    }));
  };

  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};
    if (!formData.posNumber?.trim()) {
      errs.posNumber = 'กรุณาระบุเลขตำแหน่ง';
    }
    if (formData.status === 'ครองตำแหน่ง') {
      if (!formData.firstName?.trim()) {
        errs.firstName = 'กรุณาระบุชื่อ (หรือเลือกสถานะตำแหน่งว่าง)';
      }
      if (!formData.lastName?.trim()) {
        errs.lastName = 'กรุณาระบุนามสกุล';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const officerToSave: PoliceOfficer = {
      id: initialData?.id || `pol-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      posNumber: formData.posNumber?.trim() || '',
      bch: formData.bch || 'สกพ.',
      bg: formData.bg || 'สกพ.',
      divisionGroup: formData.divisionGroup || 'ผู้บังคับบัญชา สกพ.',
      kk: formData.kk || 'สกพ.',
      groupWork: formData.groupWork || 'อำนวยการและสนับสนุน',
      lineWork: formData.lineWork || '',
      duty: formData.duty || '',
      rankLevel: formData.rankLevel || 'สว.',
      position: formData.position || formData.rankLevel || '',
      officerType: formData.officerType || 'สัญญาบัตร',
      rank: formData.status === 'ตำแหน่งว่าง' ? '' : (formData.rank || ''),
      firstName: formData.status === 'ตำแหน่งว่าง' ? '' : (formData.firstName?.trim() || ''),
      lastName: formData.status === 'ตำแหน่งว่าง' ? '' : (formData.lastName?.trim() || ''),
      gender: formData.status === 'ตำแหน่งว่าง' ? '' : (formData.gender as OfficerGender),
      status: formData.status as OfficerStatus,
      phone: formData.phone?.trim() || '',
      email: formData.email?.trim() || '',
      remarks: formData.remarks?.trim() || '',
      updatedAt: new Date().toISOString()
    };

    onSave(officerToSave);
  };

  const currentDivObj = DIVISION_CATEGORIES.find(d => d.name === formData.divisionGroup);
  const currentSubdivisions = currentDivObj?.subdivisions || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl my-8 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-4 flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              {isEditing ? <Edit3 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                {isEditing ? 'แก้ไขข้อมูลข้าราชการตำรวจ' : 'เพิ่มอัตรากำลัง / ข้าราชการตำรวจใหม่'}
              </h3>
              <p className="text-xs text-slate-300">
                ระบบบริหารทำเนียบกำลังพล สำนักงานกำลังพล (สกพ.)
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

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          
          {/* Status & Position Number Row */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                สถานะตำแหน่ง <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center space-x-3 mt-1.5">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="ครองตำแหน่ง"
                    checked={formData.status === 'ครองตำแหน่ง'}
                    onChange={() => setFormData(prev => ({ ...prev, status: 'ครองตำแหน่ง' }))}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-xs font-semibold text-emerald-700">ครองตำแหน่ง (มีผู้ปฏิบัติงาน)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="ตำแหน่งว่าง"
                    checked={formData.status === 'ตำแหน่งว่าง'}
                    onChange={() => setFormData(prev => ({ ...prev, status: 'ตำแหน่งว่าง' }))}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-xs font-semibold text-amber-700">ตำแหน่งว่าง</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                เลขตำแหน่ง <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.posNumber || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, posNumber: e.target.value }))}
                placeholder="เช่น 0400 08305 0071 หรือ สรส.741"
                className={`w-full px-3 py-2 bg-white border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
                  errors.posNumber ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                }`}
              />
              {errors.posNumber && (
                <p className="text-rose-500 text-[11px] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.posNumber}
                </p>
              )}
            </div>

          </div>

          {/* Department Structure: บช. / บก. / กก. */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              โครงสร้างสังกัด (บช. ➔ บก. ➔ กก.)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* บช. */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  1. บช. (กองบัญชาการ) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.bch || 'สกพ.'}
                  onChange={(e) => setFormData(prev => ({ ...prev, bch: e.target.value }))}
                  placeholder="สกพ."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm font-semibold"
                />
              </div>

              {/* บก. */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2. บก. (กองบังคับการ) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.bg || 'สกพ.'}
                  onChange={(e) => {
                    const newBg = e.target.value;
                    let newDiv = 'ผู้บังคับบัญชา สกพ.';
                    if (newBg.includes('อัตรากำลัง')) newDiv = 'กองอัตรากำลัง (อต.)';
                    else if (newBg.includes('ทะเบียนพล')) newDiv = 'กองทะเบียนพล (ทพ.)';
                    else if (newBg.includes('สวัสดิการ')) newDiv = 'กองสวัสดิการ (สก.)';

                    const divObj = DIVISION_CATEGORIES.find(d => d.name === newDiv);
                    const defaultKk = divObj?.subdivisions[0] || newBg;

                    setFormData(prev => ({
                      ...prev,
                      bg: newBg,
                      divisionGroup: newDiv,
                      kk: defaultKk
                    }));
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium"
                >
                  <option value="สกพ.">สกพ. (ส่วนกลาง / ผู้บริหาร / ฝอ.)</option>
                  <option value="กองอัตรากำลัง สกพ.">กองอัตรากำลัง สกพ. (อต.)</option>
                  <option value="กองทะเบียนพล สกพ.">กองทะเบียนพล สกพ. (ทพ.)</option>
                  <option value="กองสวัสดิการ สกพ.">กองสวัสดิการ สกพ. (สก.)</option>
                </select>
              </div>

              {/* กก. */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  3. กก. (ฝ่าย / กลุ่มงาน) <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-1.5">
                  <select
                    value={formData.kk || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, kk: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium"
                  >
                    {currentSubdivisions.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                    <option value="อื่นๆ">อื่นๆ (พิมพ์เอง)</option>
                  </select>
                </div>
                {formData.kk === 'อื่นๆ' && (
                  <input
                    type="text"
                    placeholder="พิมพ์ชื่อ กก. / ฝ่าย"
                    onChange={(e) => setFormData(prev => ({ ...prev, kk: e.target.value }))}
                    className="w-full mt-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Job Line & Duty */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                กลุ่มสายงาน
              </label>
              <input
                type="text"
                value={formData.groupWork || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, groupWork: e.target.value }))}
                placeholder="อำนวยการและสนับสนุน"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                สายงาน
              </label>
              <input
                type="text"
                value={formData.lineWork || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, lineWork: e.target.value }))}
                placeholder="อำนวยการ, ธุรการ, ดุริยางคศิลป์..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                ทำหน้าที่
              </label>
              <input
                type="text"
                value={formData.duty || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, duty: e.target.value }))}
                placeholder="เช่น บริหารงาน, ธุรการ..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Position & Rank Level */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ระดับตำแหน่ง
              </label>
              <select
                value={formData.rankLevel || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, rankLevel: e.target.value, position: prev.position || e.target.value }))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm"
              >
                {RANK_LEVELS.map(rl => (
                  <option key={rl} value={rl}>{rl}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ชื่อตำแหน่ง
              </label>
              <input
                type="text"
                value={formData.position || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                placeholder="ผบช., รอง ผกก., สว., นว.(สบ 2)..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ชั้นยศ
              </label>
              <select
                value={formData.officerType || 'สัญญาบัตร'}
                onChange={(e) => setFormData(prev => ({ ...prev, officerType: e.target.value as OfficerType }))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm"
              >
                <option value="สัญญาบัตร">ชั้นสัญญาบัตร (ร.ต.ต. ขึ้นไป)</option>
                <option value="ประทวน">ชั้นประทวน (ส.ต.ต. - ด.ต.)</option>
              </select>
            </div>
          </div>

          {/* Officer Identity (If Occupied) */}
          {formData.status === 'ครองตำแหน่ง' && (
            <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-200/60 space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 border-b border-amber-200/60 pb-2">
                <Shield className="w-4 h-4 text-amber-600" />
                <span>ข้อมูลผู้ครองตำแหน่ง</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ยศ
                  </label>
                  <select
                    value={formData.rank || ''}
                    onChange={(e) => handleRankChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm font-semibold"
                  >
                    {POLICE_RANKS.map(rk => (
                      <option key={rk} value={rk}>{rk}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ชื่อ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="ชื่อจริง"
                    className={`w-full px-3 py-2 bg-white border rounded-lg text-xs sm:text-sm ${
                      errors.firstName ? 'border-rose-400 bg-rose-50' : 'border-slate-300'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-rose-500 text-[11px] mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    สกุล <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="นามสกุล"
                    className={`w-full px-3 py-2 bg-white border rounded-lg text-xs sm:text-sm ${
                      errors.lastName ? 'border-rose-400 bg-rose-50' : 'border-slate-300'
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-rose-500 text-[11px] mt-1">{errors.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    เพศ
                  </label>
                  <select
                    value={formData.gender || 'ชาย'}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as OfficerGender }))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm"
                  >
                    <option value="ชาย">ชาย</option>
                    <option value="หญิง">หญิง</option>
                  </select>
                </div>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    เบอร์โทรศัพท์ (ภายใน / มือถือ)
                  </label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="เช่น 02-507-8000 หรือ 081-xxx-xxxx"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    อีเมลราชการ
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="เช่น officer@police.go.th"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              หมายเหตุเพิ่มเติม
            </label>
            <textarea
              rows={2}
              value={formData.remarks || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
              placeholder="ระบุคำสั่ง หรือหมายเหตุการปฏิบัติหน้าที่..."
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold shadow-md hover:shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูลกำลังพล'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
