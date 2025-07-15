const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Employee = require('../models/Employee');

// バリデーションルール
const employeeValidation = [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('社員名は1〜100文字で入力してください'),
  body('department').trim().isLength({ min: 1, max: 50 }).withMessage('部署は1〜50文字で入力してください'),
  body('position').trim().isLength({ min: 1, max: 50 }).withMessage('役職は1〜50文字で入力してください'),
  body('email').optional().isEmail().withMessage('有効なメールアドレスを入力してください'),
  body('startDate').isISO8601().withMessage('有効な入社日を入力してください')
];

// 全社員取得
router.get('/', async (req, res) => {
  try {
    const { department, isActive = true, search } = req.query;
    
    let query = {};
    
    // 部署フィルター
    if (department && department !== 'all') {
      query.department = department;
    }
    
    // アクティブ状態フィルター
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    // 検索フィルター
    if (search) {
      query.$text = { $search: search };
    }
    
    const employees = await Employee.find(query)
      .sort({ department: 1, name: 1 });
    
    res.json({
      success: true,
      data: employees,
      total: employees.length
    });
  } catch (error) {
    console.error('社員取得エラー:', error);
    res.status(500).json({
      success: false,
      message: '社員情報の取得に失敗しました',
      error: error.message
    });
  }
});

// 社員詳細取得
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: '指定された社員が見つかりません'
      });
    }
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('社員詳細取得エラー:', error);
    res.status(500).json({
      success: false,
      message: '社員詳細の取得に失敗しました',
      error: error.message
    });
  }
});

// 社員登録
router.post('/', employeeValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'バリデーションエラー',
        errors: errors.array()
      });
    }
    
    const employee = new Employee(req.body);
    await employee.save();
    
    res.status(201).json({
      success: true,
      message: '社員を登録しました',
      data: employee
    });
  } catch (error) {
    console.error('社員登録エラー:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'このメールアドレスは既に登録されています'
      });
    }
    
    res.status(500).json({
      success: false,
      message: '社員の登録に失敗しました',
      error: error.message
    });
  }
});

// 社員情報更新
router.put('/:id', employeeValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'バリデーションエラー',
        errors: errors.array()
      });
    }
    
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: '指定された社員が見つかりません'
      });
    }
    
    res.json({
      success: true,
      message: '社員情報を更新しました',
      data: employee
    });
  } catch (error) {
    console.error('社員更新エラー:', error);
    res.status(500).json({
      success: false,
      message: '社員情報の更新に失敗しました',
      error: error.message
    });
  }
});

// 社員削除（論理削除）
router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: '指定された社員が見つかりません'
      });
    }
    
    res.json({
      success: true,
      message: '社員を削除しました',
      data: employee
    });
  } catch (error) {
    console.error('社員削除エラー:', error);
    res.status(500).json({
      success: false,
      message: '社員の削除に失敗しました',
      error: error.message
    });
  }
});

// 部署一覧取得
router.get('/departments/list', async (req, res) => {
  try {
    const departments = await Employee.distinct('department', { isActive: true });
    
    res.json({
      success: true,
      data: departments.sort()
    });
  } catch (error) {
    console.error('部署一覧取得エラー:', error);
    res.status(500).json({
      success: false,
      message: '部署一覧の取得に失敗しました',
      error: error.message
    });
  }
});

module.exports = router;