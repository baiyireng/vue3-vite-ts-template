const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// 初始化数据库
const { initDatabase, getDatabase } = require('./config/database');

// 路由
const homeRoutes = require('./routes/homeRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// API路由
app.use('/api/home', homeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);

// 初始化数据库并启动服务器
initDatabase().then(() => {
  // 添加调试信息
  const db = getDatabase();
  const images = db.exec('SELECT * FROM home_images');
  console.log('Database images table content:', images);
  
  const titles = db.exec('SELECT * FROM titles');
  console.log('Database titles table content:', titles);
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

module.exports = app;