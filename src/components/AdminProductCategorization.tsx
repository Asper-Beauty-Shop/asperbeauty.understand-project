import React, { useState } from 'react';

interface AdminProductCategorizationProps {
  selectedConcerns: string[];
  onChange: (concerns: string[]) => void;
}

const allConcerns = [
  'Anti-Aging', 'Hydration', 'Acne Control', 'Barrier Repair', 
  'Pigmentation', 'Redness', 'Sun Protection'
];

export const AdminProductCategorization: React.FC<AdminProductCategorizationProps> = ({ selectedConcerns, onChange }) => {
  const handleToggle = (concern: string) => {
    if (selectedConcerns.includes(concern)) {
      onChange(selectedConcerns.filter(c => c !== concern));
    } else if (selectedConcerns.length < 3) {
      onChange([...selectedConcerns, concern]);
    }
  };

  return (
    <div className="w-full p-4 bg-[#F8F8FF] rounded-xl shadow-sm border border-gray-200">
      <div className="mb-4 border-b border-gray-200 pb-3">
        <h3 className="text-sm font-bold text-[#800020] uppercase tracking-wider">Taxonomy Matrix</h3>
        <p className="text-xs text-gray-500 mt-1">Enforce product routing. Maximum 3 concern tags allowed.</p>
      </div>

      {/* Constrained Many-to-Many Pill Grid */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-xs font-semibold text-gray-700">Target Concerns</label>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${selectedConcerns.length >= 3 ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-700'}`}>
            {selectedConcerns.length} / 3 Selected
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {allConcerns.map((concern) => {
            const isSelected = selectedConcerns.includes(concern);
            const isDisabled = !isSelected && selectedConcerns.length >= 3;
            
            return (
              <button
                key={concern}
                type="button"
                onClick={() => handleToggle(concern)}
                disabled={isDisabled}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 border 
                  ${isSelected 
                    ? 'bg-[#800020] text-white border-[#800020] shadow-md' 
                    : 'bg-white text-gray-600 border-gray-300 hover:border-[#800020] hover:text-[#800020]'}
                  ${isDisabled ? 'opacity-50 cursor-not-allowed hover:border-gray-300 hover:text-gray-600' : 'cursor-pointer'}
                `}
              >
                {concern}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
