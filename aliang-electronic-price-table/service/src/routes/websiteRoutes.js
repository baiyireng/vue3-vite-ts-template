const express = require('express');
const router = express.Router();
const { getDatabase, saveDatabase } = require('../config/database');

// 获取网站设置
router.get('/', (req, res) => {
  try {
    const db = getDatabase();
    
    // 获取网站标题
    const titleResult = db.exec("SELECT title FROM titles WHERE section = 'website'");
    const websiteTitle = titleResult[0] ? titleResult[0].values[0][0] : '电商价格表';
    
    // 获取favicon
    const faviconResult = db.exec("SELECT url FROM home_images WHERE name = 'favicon'");
    const faviconUrl = faviconResult[0] ? faviconResult[0].values[0][0] : '';
    
    // 获取背景图
    const backgroundResult = db.exec("SELECT url FROM home_images WHERE name = 'background'");
    const backgroundUrl = backgroundResult[0] ? backgroundResult[0].values[0][0] : '';
    
    res.json({
      title: websiteTitle,
      favicon: faviconUrl,
      background: backgroundUrl
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 更新网站设置
router.put('/', (req, res) => {
  try {
    const { title, favicon, background } = req.body;
    const db = getDatabase();
    
    // 更新网站标题
    let stmt = db.prepare("INSERT OR REPLACE INTO titles (section, title) VALUES ('website', ?)");
    stmt.run([title]);
    
    // 更新favicon
    stmt = db.prepare("INSERT OR REPLACE INTO home_images (name, url, label) VALUES ('favicon', ?, '网站图标')");
    stmt.run([favicon]);
    
    // 更新背景图
    stmt = db.prepare("INSERT OR REPLACE INTO home_images (name, url, label) VALUES ('background', ?, '首页背景图')");
    stmt.run([background]);
    
    saveDatabase();
    res.json({ message: '网站设置更新成功' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;