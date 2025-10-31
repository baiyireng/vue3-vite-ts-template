const UserModel = require('../models/UserModel');

class UserController {
  // 登录接口
  static async login(req, res) {
    try {
      const { username, password } = req.body;
      
      // 检查用户名和密码是否提供
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: '用户名和密码是必需的'
        });
      }
      
      // 验证用户凭据
      const user = await UserModel.validateUser(username, password);
      
      if (user) {
        // 登录成功，生成安全的token
        const token = UserModel.generateToken();
        
        res.json({
          success: true,
          message: '登录成功',
          token: token,
          user: user
        });
      } else {
        res.status(401).json({
          success: false,
          message: '用户名或密码错误'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: '登录失败，请稍后重试'
      });
    }
  }

  // 验证token接口
  static async verifyToken(req, res) {
    try {
      const { token } = req.body;
      
      // 在实际应用中，应该查询数据库验证token是否存在且未过期
      // 这里我们简化处理，只要token存在就认为有效
      if (token && token.length === 64) { // SHA-256哈希长度为64字符
        // 获取用户信息（这里简化处理，实际应该从token中解析用户信息）
        const users = await UserModel.getAllUsers();
        if (users.length > 0) {
          res.json({
            success: true,
            message: 'Token有效',
            user: users[0] // 简化处理，返回第一个用户
          });
        } else {
          res.status(401).json({
            success: false,
            message: '用户不存在'
          });
        }
      } else {
        res.status(401).json({
          success: false,
          message: 'Token无效或已过期'
        });
      }
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(500).json({
        success: false,
        message: '验证失败，请稍后重试'
      });
    }
  }

  // 更新账号密码接口
  static async updateAccount(req, res) {
    try {
      const { currentUsername, currentPassword, newUsername, newPassword } = req.body;
      
      // 验证当前凭据
      const currentUser = await UserModel.validateUser(currentUsername, currentPassword);
      if (!currentUser) {
        return res.status(401).json({
          success: false,
          message: '当前用户名或密码错误'
        });
      }
      
      // 验证新密码强度
      if (!UserModel.isPasswordStrong(newPassword)) {
        return res.status(400).json({
          success: false,
          message: '新密码不符合强度要求：至少8位，包含大小写字母、数字和特殊字符'
        });
      }
      
      // 更新用户信息
      const success = await UserModel.updateUserAccount(currentUser.id, newUsername, newPassword);
      
      if (success) {
        res.json({
          success: true,
          message: '账号信息更新成功'
        });
      } else {
        res.status(500).json({
          success: false,
          message: '账号信息更新失败'
        });
      }
    } catch (error) {
      console.error('Account update error:', error);
      if (error.message === '用户名已存在') {
        res.status(400).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: '账号信息更新失败'
        });
      }
    }
  }

  // 重置用户表接口
  static async resetUsers(req, res) {
    try {
      // 重置用户表
      await UserModel.resetUsers();
      
      res.json({
        success: true,
        message: '用户表已重置，下次登录时将使用环境变量中的默认账号'
      });
    } catch (error) {
      console.error('User reset error:', error);
      res.status(500).json({
        success: false,
        message: '重置失败，请稍后重试'
      });
    }
  }
}

module.exports = UserController;