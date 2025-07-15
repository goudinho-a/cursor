export interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  avatar?: string;
}

export interface AttendanceStatus {
  id: string;
  employeeId: string;
  date: string;
  status: 'present' | 'absent' | 'meeting' | 'remote' | 'vacation';
  startTime?: string;
  endTime?: string;
  note?: string;
}

export interface AttendanceCalendarEvent {
  id: string;
  employee: Employee;
  status: AttendanceStatus;
  title: string;
  start: Date;
  end: Date;
}

export type StatusType = 'present' | 'absent' | 'meeting' | 'remote' | 'vacation';

export const statusLabels: Record<StatusType, string> = {
  present: '在席',
  absent: '不在',
  meeting: '会議中',
  remote: 'リモート',
  vacation: '休暇'
};

export const statusColors: Record<StatusType, string> = {
  present: 'status-present',
  absent: 'status-absent',
  meeting: 'status-meeting',
  remote: 'status-remote',
  vacation: 'status-vacation'
};