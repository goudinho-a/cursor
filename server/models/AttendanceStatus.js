const mongoose = require('mongoose');

const attendanceStatusSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, '社員IDは必須です']
  },
  date: {
    type: Date,
    required: [true, '日付は必須です']
  },
  status: {
    type: String,
    required: [true, 'ステータスは必須です'],
    enum: {
      values: ['present', 'absent', 'meeting', 'remote', 'vacation'],
      message: '有効なステータスを選択してください'
    }
  },
  startTime: {
    type: String,
    validate: {
      validator: function(time) {
        return !time || /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
      },
      message: '開始時間は HH:MM 形式で入力してください'
    }
  },
  endTime: {
    type: String,
    validate: {
      validator: function(time) {
        return !time || /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
      },
      message: '終了時間は HH:MM 形式で入力してください'
    }
  },
  note: {
    type: String,
    maxLength: [500, '備考は500文字以内で入力してください'],
    trim: true
  },
  createdBy: {
    type: String,
    default: 'system'
  },
  updatedBy: {
    type: String,
    default: 'system'
  }
}, {
  timestamps: true
});

// 複合インデックス（同じ社員の同じ日付のレコードは一つまで）
attendanceStatusSchema.index({ employeeId: 1, date: 1 }, { unique: true });

// その他のインデックス
attendanceStatusSchema.index({ date: 1 });
attendanceStatusSchema.index({ status: 1 });
attendanceStatusSchema.index({ employeeId: 1 });

// 仮想フィールド
attendanceStatusSchema.virtual('employee', {
  ref: 'Employee',
  localField: 'employeeId',
  foreignField: '_id',
  justOne: true
});

// JSON変換時に仮想フィールドを含める
attendanceStatusSchema.set('toJSON', { virtuals: true });
attendanceStatusSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('AttendanceStatus', attendanceStatusSchema);