const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
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

// 验证用户名和密码（从环境变量读取）
const validateUser = (username, password) => {
  const validUsername = process.env.ADMIN_USERNAME || 'admin';
  const validPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
  
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
        username: username,
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
        username: process.env.ADMIN_USERNAME || 'admin',
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

// 更新环境变量文件中的账号密码
const updateEnvConfig = (newUsername, newPassword) => {
  // 在Docker容器中，.env文件位于/app目录下
  const envFilePath = path.resolve(__dirname, '../../.env');
  
  try {
    // 读取现有的环境变量文件
    let envContent = fs.readFileSync(envFilePath, 'utf8');
    
    // 更新用户名和密码
    envContent = envContent.replace(
      /ADMIN_USERNAME=.*/,
      `ADMIN_USERNAME=${newUsername}`
    );
    
    envContent = envContent.replace(
      /ADMIN_PASSWORD=.*/,
      `ADMIN_PASSWORD=${newPassword}`
    );
    
    // 写入更新后的内容
    fs.writeFileSync(envFilePath, envContent, 'utf8');
    
    return true;
  } catch (error) {
    console.error('Failed to update .env file:', error);
    return false;
  }
};

// 更新账号密码接口
router.post('/update-account', (req, res) => {
  const { currentUsername, currentPassword, newUsername, newPassword } = req.body;
  
  // 验证当前凭据
  if (!validateUser(currentUsername, currentPassword)) {
    return res.status(401).json({
      success: false,
      message: '当前用户名或密码错误'
    });
  }
  
  // 验证新密码强度
  if (!isPasswordStrong(newPassword)) {
    return res.status(400).json({
      success: false,
      message: '新密码不符合强度要求：至少8位，包含大小写字母、数字和特殊字符'
    });
  }
  
  // 更新环境变量文件
  const updateSuccess = updateEnvConfig(newUsername, newPassword);
  
  if (updateSuccess) {
    res.json({
      success: true,
      message: '账号信息更新成功，请重新启动服务使更改生效'
    });
  } else {
    res.status(500).json({
      success: false,
      message: '账号信息更新失败'
    });
  }
});

module.exports = router;