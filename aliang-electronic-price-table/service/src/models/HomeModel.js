const { getDatabase, saveDatabase } = require('../config/database');

class HomeModel {
  // 获取所有首页图片
  static getAllImages(callback) {
    try {
      const db = getDatabase();
      const stmt = db.prepare('SELECT * FROM home_images');
      // 使用正确的sql.js API获取结果
      const result = [];
      stmt.bind();
      while (stmt.step()) {
        result.push(stmt.getAsObject());
      }
      console.log('getAllImages result:', result); // 调试信息
      callback(null, result);
    } catch (err) {
      console.error('getAllImages error:', err); // 调试信息
      callback(err, null);
    }
  }

  // 更新图片URL
  static updateImage(name, url, callback) {
    try {
      const db = getDatabase();
      const stmt = db.prepare('UPDATE home_images SET url = ? WHERE name = ?');
      stmt.run([url, name]);
      saveDatabase();
      callback(null, { changes: stmt.getRowsModified ? stmt.getRowsModified() : 1 });
    } catch (err) {
      callback(err, null);
    }
  }

  // 获取所有标题
  static getAllTitles(callback) {
    try {
      const db = getDatabase();
      const stmt = db.prepare('SELECT * FROM titles');
      // 使用正确的sql.js API获取结果
      const result = [];
      stmt.bind();
      while (stmt.step()) {
        result.push(stmt.getAsObject());
      }
      console.log('getAllTitles result:', result); // 调试信息
      callback(null, result);
    } catch (err) {
      console.error('getAllTitles error:', err); // 调试信息
      callback(err, null);
    }
  }

  // 更新标题
  static updateTitle(section, title, callback) {
    try {
      const db = getDatabase();
      const stmt = db.prepare('UPDATE titles SET title = ? WHERE section = ?');
      stmt.run([title, section]);
      saveDatabase();
      callback(null, { changes: stmt.getRowsModified ? stmt.getRowsModified() : 1 });
    } catch (err) {
      callback(err, null);
    }
  }

  // 获取下单须知文本
  static getOrderNotice(callback) {
    try {
      const db = getDatabase();
      const stmt = db.prepare('SELECT notice FROM order_notices WHERE id = 1');
      // 使用正确的sql.js API获取结果
      const result = [];
      stmt.bind();
      while (stmt.step()) {
        result.push(stmt.getAsObject());
      }
      console.log('getOrderNotice result:', result); // 调试信息
      
      // 如果没有记录，返回默认值
      if (result.length === 0) {
        callback(null, { notice: '<p>尊敬的贵宾，欢迎来到阿良电竞端游价格表！</p><p>如需专属陪玩服务，请到公众号【阿良电竞】【我要下单】选择【我要下单】，联系客服微信为您量身定制！</p><p>如有售后问题请直接添加下方微信号，专属售后24h为您服务～</p><p>争做一个有高度，有温度，有态度的电竞俱乐部！</p><p>阿良电竞愿您生活美满，事业步步高升，游戏场场凯旋！</p>' });
      } else {
        callback(null, result[0]);
      }
    } catch (err) {
      console.error('getOrderNotice error:', err); // 调试信息
      callback(err, null);
    }
  }

  // 更新下单须知文本
  static updateOrderNotice(notice, callback) {
    try {
      const db = getDatabase();
      // 先检查是否存在记录
      const checkStmt = db.prepare('SELECT id FROM order_notices WHERE id = 1');
      const checkResult = [];
      checkStmt.bind();
      while (checkStmt.step()) {
        checkResult.push(checkStmt.getAsObject());
      }

      if (checkResult.length > 0) {
        // 更新记录
        const updateStmt = db.prepare('UPDATE order_notices SET notice = ? WHERE id = 1');
        updateStmt.run([notice]);
      } else {
        // 插入新记录
        const insertStmt = db.prepare('INSERT INTO order_notices (id, notice) VALUES (1, ?)');
        insertStmt.run([notice]);
      }

      saveDatabase();
      callback(null, { message: 'Order notice updated successfully' });
    } catch (err) {
      callback(err, null);
    }
  }
}

module.exports = HomeModel;