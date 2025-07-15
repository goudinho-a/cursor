const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '社員名は必須です'],
    trim: true,
    maxLength: [100, '社員名は100文字以内で入力してください']
  },
  department: {
    type: String,
    required: [true, '部署は必須です'],
    trim: true,
    maxLength: [50, '部署名は50文字以内で入力してください']
  },
  position: {
    type: String,
    required: [true, '役職は必須です'],
    trim: true,
    maxLength: [50, '役職は50文字以内で入力してください']
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
      },
      message: '有効なメールアドレスを入力してください'
    }
  },
  avatar: {
    type: String,
    default: null
  },
  startDate: {
    type: Date,
    required: [true, '入社日は必須です']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// インデックス
employeeSchema.index({ department: 1 });
employeeSchema.index({ isActive: 1 });
employeeSchema.index({ name: 'text', department: 'text' });

module.exports = mongoose.model('Employee', employeeSchema);