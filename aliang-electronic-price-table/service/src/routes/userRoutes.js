const express = require('express');
const UserController = require('../controllers/UserController');
const router = express.Router();

// 登录接口
router.post('/login', UserController.login);

// 验证token接口
router.post('/verify-token', UserController.verifyToken);

// 获取当前用户信息接口
router.get('/me', (req, res) => {
  // 从请求头中获取token
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  // 检查token是否存在
  if (!token) {
    return res.status(401).json({
      success: false,
      message: '未提供访问令牌'
    });
  }
  
  // 验证token
  if (token && token.length === 64) {
    res.json({
      success: true,
      user: {
        id: 1,
        username: process.env.ADMIN_USERNAME || 'admin',
        name: '管理员'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: '令牌无效'
    });
  }
});

// 更新账号密码接口
router.post('/update-account', UserController.updateAccount);

// 重置用户表接口
router.post('/reset-users', UserController.resetUsers);

module.exports = router;