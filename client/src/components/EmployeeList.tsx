import React from 'react';
import { Employee, AttendanceStatus, statusLabels, statusColors } from '../types';

interface EmployeeListProps {
  employees: Employee[];
  attendanceData: AttendanceStatus[];
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, attendanceData }) => {
  const getTodayAttendance = (employeeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return attendanceData.find(
      attendance => attendance.employeeId === employeeId && attendance.date === today
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">社員一覧</h3>
        <p className="text-sm text-gray-600 mt-1">本日の在籍状況</p>
      </div>
      
      <div className="p-4">
        <div className="space-y-3">
          {employees.map((employee) => {
            const attendance = getTodayAttendance(employee.id);
            const status = attendance?.status || 'absent';
            
            return (
              <div
                key={employee.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-sm font-medium">
                        {employee.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {employee.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {employee.department} - {employee.position}
                    </p>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[status]}`}
                  >
                    {statusLabels[status]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        {employees.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">該当する社員がいません</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;