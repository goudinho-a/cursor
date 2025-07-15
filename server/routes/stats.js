const express = require('express');
const router = express.Router();
const AttendanceStatus = require('../models/AttendanceStatus');
const Employee = require('../models/Employee');
const { startOfDay, endOfDay, parseISO, format, subDays, startOfMonth, endOfMonth } = require('date-fns');

// 今日の統計情報取得
router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);
    
    // 今日の在籍状況を取得
    const todayAttendance = await AttendanceStatus.find({
      date: { $gte: todayStart, $lte: todayEnd }
    }).populate('employeeId', 'name department position');
    
    // 全社員数を取得
    const totalEmployees = await Employee.countDocuments({ isActive: true });
    
    // ステータス別の集計
    const statusCounts = {
      present: 0,
      absent: 0,
      meeting: 0,
      remote: 0,
      vacation: 0
    };
    
    todayAttendance.forEach(record => {
      if (record.employeeId && statusCounts.hasOwnProperty(record.status)) {
        statusCounts[record.status]++;
      }
    });
    
    // 記録されていない社員は不在扱い
    const recordedEmployees = todayAttendance.length;
    statusCounts.absent += (totalEmployees - recordedEmployees);
    
    // 部署別の統計
    const departmentStats = await AttendanceStatus.aggregate([
      { $match: { date: { $gte: todayStart, $lte: todayEnd } } },
      {
        $lookup: {
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employee'
        }
      },
      { $unwind: '$employee' },
      { $match: { 'employee.isActive': true } },
      {
        $group: {
          _id: {
            department: '$employee.department',
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.department',
          statuses: {
            $push: {
              status: '$_id.status',
              count: '$count'
            }
          },
          total: { $sum: '$count' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        date: format(today, 'yyyy-MM-dd'),
        totalEmployees,
        recordedEmployees,
        statusCounts,
        departmentStats
      }
    });
  } catch (error) {
    console.error('今日の統計取得エラー:', error);
    res.status(500).json({
      success: false,
      message: '統計情報の取得に失敗しました',
      error: error.message
    });
  }
});

// 特定日の統計情報取得
router.get('/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const targetDate = parseISO(date);
    const dateStart = startOfDay(targetDate);
    const dateEnd = endOfDay(targetDate);
    
    const attendance = await AttendanceStatus.find({
      date: { $gte: dateStart, $lte: dateEnd }
    }).populate('employeeId', 'name department position');
    
    const totalEmployees = await Employee.countDocuments({ isActive: true });
    
    const statusCounts = {
      present: 0,
      absent: 0,
      meeting: 0,
      remote: 0,
      vacation: 0
    };
    
    attendance.forEach(record => {
      if (record.employeeId && statusCounts.hasOwnProperty(record.status)) {
        statusCounts[record.status]++;
      }
    });
    
    const recordedEmployees = attendance.length;
    statusCounts.absent += (totalEmployees - recordedEmployees);
    
    res.json({
      success: true,
      data: {
        date: format(targetDate, 'yyyy-MM-dd'),
        totalEmployees,
        recordedEmployees,
        statusCounts
      }
    });
  } catch (error) {
    console.error('特定日統計取得エラー:', error);
    res.status(500).json({
      success: false,
      message: '統計情報の取得に失敗しました',
      error: error.message
    });
  }
});

// 週間統計
router.get('/weekly', async (req, res) => {
  try {
    const { startDate } = req.query;
    const weekStart = startDate ? parseISO(startDate) : subDays(new Date(), 6);
    const weekEnd = endOfDay(new Date());
    
    const weeklyStats = await AttendanceStatus.aggregate([
      { $match: { date: { $gte: startOfDay(weekStart), $lte: weekEnd } } },
      {
        $lookup: {
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employee'
        }
      },
      { $unwind: '$employee' },
      { $match: { 'employee.isActive': true } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          statuses: {
            $push: {
              status: '$_id.status',
              count: '$count'
            }
          },
          total: { $sum: '$count' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        period: {
          start: format(weekStart, 'yyyy-MM-dd'),
          end: format(weekEnd, 'yyyy-MM-dd')
        },
        weeklyStats
      }
    });
  } catch (error) {
    console.error('週間統計取得エラー:', error);
    res.status(500).json({
      success: false,
      message: '週間統計の取得に失敗しました',
      error: error.message
    });
  }
});

// 月間統計
router.get('/monthly', async (req, res) => {
  try {
    const { year, month } = req.query;
    const targetDate = year && month ? new Date(year, month - 1, 1) : new Date();
    const monthStart = startOfMonth(targetDate);
    const monthEnd = endOfMonth(targetDate);
    
    const monthlyStats = await AttendanceStatus.aggregate([
      { $match: { date: { $gte: monthStart, $lte: monthEnd } } },
      {
        $lookup: {
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employee'
        }
      },
      { $unwind: '$employee' },
      { $match: { 'employee.isActive': true } },
      {
        $group: {
          _id: {
            employee: '$employee.name',
            department: '$employee.department',
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: {
            employee: '$_id.employee',
            department: '$_id.department'
          },
          statuses: {
            $push: {
              status: '$_id.status',
              count: '$count'
            }
          },
          totalDays: { $sum: '$count' }
        }
      },
      {
        $group: {
          _id: '$_id.department',
          employees: {
            $push: {
              name: '$_id.employee',
              statuses: '$statuses',
              totalDays: '$totalDays'
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        period: {
          year: targetDate.getFullYear(),
          month: targetDate.getMonth() + 1,
          start: format(monthStart, 'yyyy-MM-dd'),
          end: format(monthEnd, 'yyyy-MM-dd')
        },
        monthlyStats
      }
    });
  } catch (error) {
    console.error('月間統計取得エラー:', error);
    res.status(500).json({
      success: false,
      message: '月間統計の取得に失敗しました',
      error: error.message
    });
  }
});

// 部署別統計
router.get('/departments', async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? parseISO(date) : new Date();
    const dateStart = startOfDay(targetDate);
    const dateEnd = endOfDay(targetDate);
    
    // 全部署を取得
    const departments = await Employee.distinct('department', { isActive: true });
    
    const departmentStats = [];
    
    for (const department of departments) {
      // 部署の全社員数
      const totalInDept = await Employee.countDocuments({ 
        department, 
        isActive: true 
      });
      
      // 部署の在籍記録を取得
      const deptAttendance = await AttendanceStatus.aggregate([
        { $match: { date: { $gte: dateStart, $lte: dateEnd } } },
        {
          $lookup: {
            from: 'employees',
            localField: 'employeeId',
            foreignField: '_id',
            as: 'employee'
          }
        },
        { $unwind: '$employee' },
        { $match: { 'employee.department': department, 'employee.isActive': true } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);
      
      const statusCounts = {
        present: 0,
        absent: 0,
        meeting: 0,
        remote: 0,
        vacation: 0
      };
      
      deptAttendance.forEach(item => {
        statusCounts[item._id] = item.count;
      });
      
      // 記録されていない社員は不在扱い
      const recordedInDept = deptAttendance.reduce((sum, item) => sum + item.count, 0);
      statusCounts.absent += (totalInDept - recordedInDept);
      
      departmentStats.push({
        department,
        totalEmployees: totalInDept,
        recordedEmployees: recordedInDept,
        statusCounts,
        attendanceRate: totalInDept > 0 ? 
          Math.round(((statusCounts.present + statusCounts.meeting + statusCounts.remote) / totalInDept) * 100) : 0
      });
    }
    
    res.json({
      success: true,
      data: {
        date: format(targetDate, 'yyyy-MM-dd'),
        departmentStats
      }
    });
  } catch (error) {
    console.error('部署別統計取得エラー:', error);
    res.status(500).json({
      success: false,
      message: '部署別統計の取得に失敗しました',
      error: error.message
    });
  }
});

module.exports = router;