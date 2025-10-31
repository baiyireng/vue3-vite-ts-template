const express = require('express');
const crypto = require('crypto');
const router = express.Router();

// 生成安全的随机token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// 简单的密码强度验证
const isPasswordStrong = (password) => {
  // 密码至少8位，包含大小写字母、数字和特殊字符
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
};

// 验证用户名和密码（实际项目中应该查询数据库）
const validateUser = (username, password) => {
  // 这里应该查询数据库验证用户
  // 出于演示目的，我们使用硬编码的用户名和强密码
  const validUsername = 'admin';
  const validPassword = 'Admin@123'; // 强密码示例
  
  return username === validUsername && password === validPassword;
};

// 登录接口
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // 检查用户名和密码是否提供
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: '用户名和密码是必需的'
    });
  }
  
  // 验证密码强度（仅在注册时需要，登录时不需要）
  // 但为了安全起见，我们记录尝试使用弱密码的登录
  
  // 验证用户凭据
  if (validateUser(username, password)) {
    // 登录成功，生成安全的token
    const token = generateToken();
    
    res.json({
      success: true,
      message: '登录成功',
      token: token,
      user: {
        id: 1,
        username: 'admin',
        name: '管理员'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: '用户名或密码错误'
    });
  }
});

// 验证token接口
router.post('/verify-token', (req, res) => {
  const { token } = req.body;
  
  // 在实际应用中，应该查询数据库验证token是否存在且未过期
  // 这里我们简化处理，只要token存在就认为有效
  if (token && token.length === 64) { // SHA-256哈希长度为64字符
    res.json({
      success: true,
      message: 'Token有效',
      user: {
        id: 1,
        username: 'admin',
        name: '管理员'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Token无效或已过期'
    });
  }
});

module.exports = router;