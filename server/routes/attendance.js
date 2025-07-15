const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const AttendanceStatus = require('../models/AttendanceStatus');
const Employee = require('../models/Employee');
const { startOfDay, endOfDay, parseISO, format } = require('date-fns');

// バリデーションルール
const attendanceValidation = [
  body('employeeId').isMongoId().withMessage('有効な社員IDを指定してください'),
  body('date').isISO8601().withMessage('有効な日付を入力してください'),
  body('status').isIn(['present', 'absent', 'meeting', 'remote', 'vacation']).withMessage('有効なステータスを選択してください'),
  body('startTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('開始時間は HH:MM 形式で入力してください'),
  body('endTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('終了時間は HH:MM 形式で入力してください'),
  body('note').optional().isLength({ max: 500 }).withMessage('備考は500文字以内で入力してください')
];

// 在籍状況取得
router.get('/', async (req, res) => {
  try {
    const { 
      date, 
      startDate, 
      endDate, 
      employeeId, 
      department, 
      status 
    } = req.query;
    
    let query = {};
    
    // 日付フィルター
    if (date) {
      const targetDate = parseISO(date);
      query.date = {
        $gte: startOfDay(targetDate),
        $lte: endOfDay(targetDate)
      };
    } else if (startDate && endDate) {
      query.date = {
        $gte: startOfDay(parseISO(startDate)),
        $lte: endOfDay(parseISO(endDate))
      };
    }
    
    // 社員IDフィルター
    if (employeeId) {
      query.employeeId = employeeId;
    }
    
    // ステータスフィルター
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // 部署フィルター（Aggregation使用）
    let attendanceData;
    
    if (department && department !== 'all') {
      attendanceData = await AttendanceStatus.aggregate([
        { $match: query },
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
        { $sort: { date: -1, 'employee.name': 1 } }
      ]);
    } else {
      attendanceData = await AttendanceStatus.find(query)
        .populate({
          path: 'employeeId',
          match: { isActive: true },
          select: 'name department position'
        })
        .sort({ date: -1, employeeId: 1 });
      
      // null の employee を除外
      attendanceData = attendanceData.filter(item => item.employeeId);
    }
    
    res.json({
      success: true,
      data: attendanceData,
      total: attendanceData.length
    });
  } catch (error) {
    console.error('在籍状況取得エラー:', error);
    res.status(500).json({
      success: false,
      message: '在籍状況の取得に失敗しました',
      error: error.message
    });
  }
});

// 特定日の在籍状況取得
router.get('/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const targetDate = parseISO(date);
    
    const attendanceData = await AttendanceStatus.find({
      date: {
        $gte: startOfDay(targetDate),
        $lte: endOfDay(targetDate)
      }
    })
    .populate({
      path: 'employeeId',
      match: { isActive: true },
      select: 'name department position'
    })
    .sort({ 'employeeId.department': 1, 'employeeId.name': 1 });
    
    // null の employee を除外
    const filteredData = attendanceData.filter(item => item.employeeId);
    
    res.json({
      success: true,
      data: filteredData,
      total: filteredData.length,
      date: format(targetDate, 'yyyy-MM-dd')
    });
  } catch (error) {
    console.error('特定日在籍状況取得エラー:', error);
    res.status(500).json({
      success: false,
      message: '在籍状況の取得に失敗しました',
      error: error.message
    });
  }
});

// 在籍状況登録・更新
router.post('/', attendanceValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'バリデーションエラー',
        errors: errors.array()
      });
    }
    
    const { employeeId, date } = req.body;
    
    // 社員存在確認
    const employee = await Employee.findById(employeeId);
    if (!employee || !employee.isActive) {
      return res.status(404).json({
        success: false,
        message: '指定された社員が見つかりません'
      });
    }
    
    // 同じ日付のレコードがあるかチェック
    const targetDate = parseISO(date);
    const existingRecord = await AttendanceStatus.findOne({
      employeeId,
      date: {
        $gte: startOfDay(targetDate),
        $lte: endOfDay(targetDate)
      }
    });
    
    let attendanceStatus;
    
    if (existingRecord) {
      // 更新
      attendanceStatus = await AttendanceStatus.findByIdAndUpdate(
        existingRecord._id,
        { ...req.body, updatedBy: req.body.updatedBy || 'system' },
        { new: true, runValidators: true }
      ).populate('employeeId', 'name department position');
    } else {
      // 新規作成
      attendanceStatus = new AttendanceStatus({
        ...req.body,
        date: targetDate,
        createdBy: req.body.createdBy || 'system'
      });
      
      await attendanceStatus.save();
      attendanceStatus = await AttendanceStatus.findById(attendanceStatus._id)
        .populate('employeeId', 'name department position');
    }
    
    res.status(existingRecord ? 200 : 201).json({
      success: true,
      message: existingRecord ? '在籍状況を更新しました' : '在籍状況を登録しました',
      data: attendanceStatus
    });
  } catch (error) {
    console.error('在籍状況登録・更新エラー:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'この社員の同じ日付のレコードが既に存在します'
      });
    }
    
    res.status(500).json({
      success: false,
      message: '在籍状況の登録・更新に失敗しました',
      error: error.message
    });
  }
});

// 在籍状況更新
router.put('/:id', attendanceValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'バリデーションエラー',
        errors: errors.array()
      });
    }
    
    const attendanceStatus = await AttendanceStatus.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.body.updatedBy || 'system' },
      { new: true, runValidators: true }
    ).populate('employeeId', 'name department position');
    
    if (!attendanceStatus) {
      return res.status(404).json({
        success: false,
        message: '指定された在籍記録が見つかりません'
      });
    }
    
    res.json({
      success: true,
      message: '在籍状況を更新しました',
      data: attendanceStatus
    });
  } catch (error) {
    console.error('在籍状況更新エラー:', error);
    res.status(500).json({
      success: false,
      message: '在籍状況の更新に失敗しました',
      error: error.message
    });
  }
});

// 在籍状況削除
router.delete('/:id', async (req, res) => {
  try {
    const attendanceStatus = await AttendanceStatus.findByIdAndDelete(req.params.id);
    
    if (!attendanceStatus) {
      return res.status(404).json({
        success: false,
        message: '指定された在籍記録が見つかりません'
      });
    }
    
    res.json({
      success: true,
      message: '在籍記録を削除しました',
      data: attendanceStatus
    });
  } catch (error) {
    console.error('在籍状況削除エラー:', error);
    res.status(500).json({
      success: false,
      message: '在籍記録の削除に失敗しました',
      error: error.message
    });
  }
});

// 一括登録・更新
router.post('/bulk', async (req, res) => {
  try {
    const { attendanceList } = req.body;
    
    if (!Array.isArray(attendanceList) || attendanceList.length === 0) {
      return res.status(400).json({
        success: false,
        message: '在籍データの配列を指定してください'
      });
    }
    
    const results = [];
    const errors = [];
    
    for (const attendanceData of attendanceList) {
      try {
        const { employeeId, date } = attendanceData;
        const targetDate = parseISO(date);
        
        const existingRecord = await AttendanceStatus.findOne({
          employeeId,
          date: {
            $gte: startOfDay(targetDate),
            $lte: endOfDay(targetDate)
          }
        });
        
        let result;
        if (existingRecord) {
          result = await AttendanceStatus.findByIdAndUpdate(
            existingRecord._id,
            attendanceData,
            { new: true, runValidators: true }
          );
        } else {
          const newRecord = new AttendanceStatus({
            ...attendanceData,
            date: targetDate
          });
          result = await newRecord.save();
        }
        
        results.push(result);
      } catch (error) {
        errors.push({
          data: attendanceData,
          error: error.message
        });
      }
    }
    
    res.json({
      success: errors.length === 0,
      message: `${results.length}件処理しました`,
      data: results,
      errors: errors
    });
  } catch (error) {
    console.error('一括処理エラー:', error);
    res.status(500).json({
      success: false,
      message: '一括処理に失敗しました',
      error: error.message
    });
  }
});

module.exports = router;