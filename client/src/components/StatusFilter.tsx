import React from 'react';
import { StatusType, statusLabels } from '../types';
import { FunnelIcon } from '@heroicons/react/24/outline';

interface StatusFilterProps {
  selectedStatus: StatusType | 'all';
  onStatusChange: (status: StatusType | 'all') => void;
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
  departments: string[];
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  selectedStatus,
  onStatusChange,
  selectedDepartment,
  onDepartmentChange,
  departments,
}) => {
  const statusOptions: Array<{ value: StatusType | 'all'; label: string }> = [
    { value: 'all', label: 'すべて' },
    { value: 'present', label: statusLabels.present },
    { value: 'absent', label: statusLabels.absent },
    { value: 'meeting', label: statusLabels.meeting },
    { value: 'remote', label: statusLabels.remote },
    { value: 'vacation', label: statusLabels.vacation },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">フィルター</h3>
        </div>
      </div>
      
      <div className="p-4 space-y-6">
        {/* 部署フィルター */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            部署
          </label>
          <select
            value={selectedDepartment}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm"
          >
            <option value="all">すべての部署</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>

        {/* ステータスフィルター */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            在籍状況
          </label>
          <div className="space-y-2">
            {statusOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center cursor-pointer"
              >
                <input
                  type="radio"
                  name="status"
                  value={option.value}
                  checked={selectedStatus === option.value}
                  onChange={(e) => onStatusChange(e.target.value as StatusType | 'all')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 統計情報 */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">統計</h4>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>在席:</span>
              <span className="font-medium text-green-600">3名</span>
            </div>
            <div className="flex justify-between">
              <span>リモート:</span>
              <span className="font-medium text-yellow-600">1名</span>
            </div>
            <div className="flex justify-between">
              <span>会議中:</span>
              <span className="font-medium text-blue-600">1名</span>
            </div>
            <div className="flex justify-between">
              <span>休暇:</span>
              <span className="font-medium text-purple-600">1名</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusFilter;