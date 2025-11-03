const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

// 确保日志目录存在，并设置权限
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// 确保数据目录存在，并设置权限
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 确保图片目录存在，并设置权限
const imagesDir = path.join(__dirname, 'data/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// 设置目录权限，确保所有用户都可以读取
try {
  fs.chmodSync(dataDir, 0o755);
  fs.chmodSync(imagesDir, 0o755);
} catch (err) {
  console.log('设置目录权限时出错:', err.message);
}

// 路由
const homeRoutes = require('./routes/homeRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes'); // 添加用户路由
const websiteRoutes = require('./routes/websiteRoutes'); // 添加网站设置路由
const uploadRoutes = require('./routes/uploadRoutes'); // 添加上传路由

// 数据库初始化
const { initDatabase, saveDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
// 增加请求体大小限制
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 初始化数据库
initDatabase().then(() => {
  console.log('Database initialized successfully');
}).catch(err => {
  console.error('Failed to initialize database:', err);
});

// 路由
app.use('/api/home', homeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', userRoutes); // 添加用户路由
app.use('/api/website', websiteRoutes); // 添加网站设置路由
app.use('/api/upload', uploadRoutes); // 添加上传路由

// 提供图片访问服务
app.use('/images', express.static(path.join(__dirname, '../data/images')));

// 服务器启动时打印数据库内容
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
  // 打印数据库内容
  setTimeout(() => {
    try {
      const { getDatabase } = require('./config/database');
      const db = getDatabase();
      
      // 查询所有表
      const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
      console.log('Database tables:', tables);
      
      // 查询home_images表内容
      const images = db.exec('SELECT * FROM home_images');
      console.log('Database images table content:', images);
      
      // 查询titles表内容
      const titles = db.exec('SELECT * FROM titles');
      console.log('Database titles table content:', titles);
      
      // 查询users表内容
      const users = db.exec('SELECT * FROM users');
      console.log('Database users table content:', users);
    } catch (err) {
      console.error('Error querying database:', err);
    }
  }, 1000);
});

// 在进程退出时保存数据库
process.on('exit', () => {
  saveDatabase();
});

// 监听SIGINT和SIGTERM信号，确保在进程被终止时保存数据库
process.on('SIGINT', () => {
  saveDatabase();
  process.exit(0);
});

process.on('SIGTERM', () => {
  saveDatabase();
  process.exit(0);
});