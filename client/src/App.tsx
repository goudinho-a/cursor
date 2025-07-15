import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ja from 'date-fns/locale/ja';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './App.css';
import { Employee, AttendanceStatus, AttendanceCalendarEvent, StatusType, statusLabels, statusColors } from './types';
import Header from './components/Header';
import EmployeeList from './components/EmployeeList';
import StatusFilter from './components/StatusFilter';

const locales = {
  'ja': ja,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// サンプルデータ
const sampleEmployees: Employee[] = [
  { id: '1', name: '田中太郎', department: '営業部', position: '課長' },
  { id: '2', name: '佐藤花子', department: '開発部', position: 'エンジニア' },
  { id: '3', name: '鈴木次郎', department: '人事部', position: '主任' },
  { id: '4', name: '高橋美穂', department: '開発部', position: 'デザイナー' },
  { id: '5', name: '伊藤健一', department: 'マーケティング部', position: 'マネージャー' },
  { id: '6', name: '渡辺綾子', department: '経理部', position: '経理担当' },
];

const sampleAttendanceData: AttendanceStatus[] = [
  { id: '1', employeeId: '1', date: '2025-01-19', status: 'present', startTime: '09:00', endTime: '18:00' },
  { id: '2', employeeId: '2', date: '2025-01-19', status: 'remote', startTime: '09:00', endTime: '18:00' },
  { id: '3', employeeId: '3', date: '2025-01-19', status: 'vacation' },
  { id: '4', employeeId: '4', date: '2025-01-19', status: 'meeting', startTime: '10:00', endTime: '12:00' },
  { id: '5', employeeId: '5', date: '2025-01-19', status: 'present', startTime: '08:30', endTime: '17:30' },
  { id: '6', employeeId: '6', date: '2025-01-19', status: 'absent' },
];

function App() {
  const [employees, setEmployees] = useState<Employee[]>(sampleEmployees);
  const [attendanceData, setAttendanceData] = useState<AttendanceStatus[]>(sampleAttendanceData);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<StatusType | 'all'>('all');
  const [calendarEvents, setCalendarEvents] = useState<AttendanceCalendarEvent[]>([]);

  // カレンダーイベントを生成
  useEffect(() => {
    const events: AttendanceCalendarEvent[] = attendanceData.map(attendance => {
      const employee = employees.find(emp => emp.id === attendance.employeeId);
      if (!employee) return null;

      const date = new Date(attendance.date);
      return {
        id: attendance.id,
        employee,
        status: attendance,
        title: `${employee.name} - ${statusLabels[attendance.status]}`,
        start: date,
        end: date,
      };
    }).filter(Boolean) as AttendanceCalendarEvent[];

    setCalendarEvents(events);
  }, [employees, attendanceData]);

  const filteredEmployees = employees.filter(emp => {
    if (selectedDepartment !== 'all' && emp.department !== selectedDepartment) {
      return false;
    }
    return true;
  });

  const filteredEvents = calendarEvents.filter(event => {
    if (selectedDepartment !== 'all' && event.employee.department !== selectedDepartment) {
      return false;
    }
    if (selectedStatus !== 'all' && event.status.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  const departments = Array.from(new Set(employees.map(emp => emp.department)));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* サイドバー */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <StatusFilter
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                selectedDepartment={selectedDepartment}
                onDepartmentChange={setSelectedDepartment}
                departments={departments}
              />
              <EmployeeList employees={filteredEmployees} attendanceData={attendanceData} />
            </div>
          </div>

          {/* メインカレンダー */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">在籍カレンダー</h2>
              <div style={{ height: '600px' }}>
                <Calendar
                  localizer={localizer}
                  events={filteredEvents}
                  startAccessor="start"
                  endAccessor="end"
                  views={['month', 'week', 'day']}
                  defaultView="month"
                  culture="ja"
                  messages={{
                    month: '月',
                    week: '週',
                    day: '日',
                    today: '今日',
                    previous: '前へ',
                    next: '次へ',
                    showMore: total => `他 ${total} 件`,
                  }}
                  eventPropGetter={(event) => ({
                    className: `rounded-sm border-l-4 ${statusColors[event.status.status]}`,
                    style: {
                      fontSize: '12px',
                      padding: '2px 6px',
                    },
                  })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
