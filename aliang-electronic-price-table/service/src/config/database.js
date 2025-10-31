const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

// 确保data目录存在
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 数据库文件路径
const dbPath = path.join(__dirname, '../../data/database.sqlite');

let dbInstance = null;

// 初始化数据库
async function initDatabase() {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    const SQL = await initSqlJs();
    
    // 如果数据库文件存在，则加载它
    if (fs.existsSync(dbPath)) {
      const fileBuffer = fs.readFileSync(dbPath);
      dbInstance = new SQL.Database(fileBuffer);
    } else {
      // 否则创建新数据库
      dbInstance = new SQL.Database();
      
      // 创建数据表
      dbInstance.run(`CREATE TABLE home_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        url TEXT NOT NULL,
        label TEXT NOT NULL
      )`);
      
      dbInstance.run(`CREATE TABLE titles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        section TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL
      )`);
      
      dbInstance.run(`CREATE TABLE categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        icon TEXT,
        detail_image TEXT,
        details TEXT,
        notice TEXT,
        sort_order INTEGER DEFAULT 0
      )`);
      
      dbInstance.run(`CREATE TABLE order_notices (
        id INTEGER PRIMARY KEY,
        notice TEXT
      )`);
      
      dbInstance.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
      
      // 插入默认数据
      dbInstance.run(`INSERT OR IGNORE INTO home_images (name, url, label) VALUES ('banner', '', '首页横幅图片')`);
      dbInstance.run(`INSERT OR IGNORE INTO home_images (name, url, label) VALUES ('orderNotice', '', '下单须知图片')`);
      dbInstance.run(`INSERT OR IGNORE INTO home_images (name, url, label) VALUES ('contactInfo', '', '联系方式图片')`);
      
      dbInstance.run(`INSERT OR IGNORE INTO titles (section, title) VALUES ('categorySection', '阿良电竞各品类价格表（点击图标查看）')`);
      dbInstance.run(`INSERT OR IGNORE INTO titles (section, title) VALUES ('orderSection', '阿良电竞 | 下单价格')`);
      
      // 插入 order_notices 默认数据（如果不存在）
      dbInstance.run(`INSERT OR IGNORE INTO order_notices (id, notice) VALUES (1, '暂无下单须知')`);
      
      // 保存数据库到文件
      saveDatabase();
    }
    
    // 检查并确保默认数据存在
    ensureDefaultData();
    
    return dbInstance;
  } catch (err) {
    console.error('Failed to initialize database:', err);
    throw err;
  }
}

// 确保默认数据存在
function ensureDefaultData() {
  if (!dbInstance) return;
  
  // 检查home_images表中的默认数据
  const homeImagesResult = dbInstance.exec("SELECT COUNT(*) as count FROM home_images");
  const homeImages = homeImagesResult.length > 0 ? homeImagesResult[0].values[0][0] : 0;
  if (homeImages === 0) {
    dbInstance.run(`INSERT INTO home_images (name, url, label) VALUES ('banner', '', '首页横幅图片')`);
    dbInstance.run(`INSERT INTO home_images (name, url, label) VALUES ('orderNotice', '', '下单须知图片')`);
    dbInstance.run(`INSERT INTO home_images (name, url, label) VALUES ('contactInfo', '', '联系方式图片')`);
  }
  
  // 检查titles表中的默认数据
  const titlesResult = dbInstance.exec("SELECT COUNT(*) as count FROM titles");
  const titles = titlesResult.length > 0 ? titlesResult[0].values[0][0] : 0;
  if (titles === 0) {
    dbInstance.run(`INSERT INTO titles (section, title) VALUES ('categorySection', '阿良电竞各品类价格表（点击图标查看）')`);
    dbInstance.run(`INSERT INTO titles (section, title) VALUES ('orderSection', '阿良电竞 | 下单价格')`);
  }
  
  // 检查order_notices表中的默认数据
  const orderNoticesResult = dbInstance.exec("SELECT COUNT(*) as count FROM order_notices");
  const orderNotices = orderNoticesResult.length > 0 ? orderNoticesResult[0].values[0][0] : 0;
  if (orderNotices === 0) {
    dbInstance.run(`INSERT INTO order_notices (id, notice) VALUES (1, '暂无下单须知')`);
  }
  
  // 检查users表中的默认数据
  const usersResult = dbInstance.exec("SELECT COUNT(*) as count FROM users");
  const users = usersResult.length > 0 ? usersResult[0].values[0][0] : 0;
  if (users === 0) {
    // 从环境变量获取默认用户名和密码
    const defaultUsername = process.env.ADMIN_USERNAME || 'admin';
    const defaultPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    dbInstance.run(`INSERT INTO users (username, password, name) VALUES (?, ?, ?)`, 
      [defaultUsername, defaultPassword, '管理员']);
  }
  
  // 保存更改
  saveDatabase();
}

// 保存数据库到文件
function saveDatabase() {
  if (dbInstance) {
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

// 获取数据库实例
function getDatabase() {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return dbInstance;
}

module.exports = {
  initDatabase,
  getDatabase,
  saveDatabase
};