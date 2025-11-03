const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getDatabase, saveDatabase } = require('../config/database');

// 使用与主应用相同的图片目录路径
const uploadDir = path.join(__dirname, '../../data/images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 设置目录权限，确保所有用户都可以读取
try {
  fs.chmodSync(uploadDir, 0o755);
} catch (err) {
  console.log('设置图片目录权限时出错:', err.message);
}

// 配置multer存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 限制文件大小为5MB
  },
  fileFilter: function (req, file, cb) {
    // 只允许图片文件
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件!'));
    }
  }
});

// 处理图片上传
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '没有上传文件' });
    }

    // 设置文件权限，确保可以被读取
    try {
      fs.chmodSync(req.file.path, 0o644);
    } catch (err) {
      console.log('设置文件权限时出错:', err.message);
    }

    // 构建可访问的URL，使用posix格式确保跨平台兼容性
    const imageUrl = path.posix.join('/images', req.file.filename);
    
    res.json({ 
      message: '图片上传成功',
      url: imageUrl,
      filename: req.file.filename
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;