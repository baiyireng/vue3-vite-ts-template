const { getDatabase, saveDatabase } = require('../config/database');

class CategoryModel {
  // 获取所有品类
  static getAllCategories(callback) {
    try {
      const db = getDatabase();
      const stmt = db.prepare('SELECT * FROM categories ORDER BY sort_order ASC');
      // 使用正确的sql.js API获取结果
      const result = [];
      stmt.bind();
      while (stmt.step()) {
        result.push(stmt.getAsObject());
      }
      callback(null, result);
    } catch (err) {
      callback(err, null);
    }
  }

  // 根据ID获取品类详情
  static getCategoryById(id, callback) {
    try {
      const db = getDatabase();
      const stmt = db.prepare('SELECT * FROM categories WHERE id = ?');
      stmt.bind([id]);
      const result = stmt.step() ? stmt.getAsObject() : null;
      callback(null, result);
    } catch (err) {
      callback(err, null);
    }
  }

  // 创建新品类
  static createCategory(category, callback) {
    try {
      const db = getDatabase();
      const stmt = db.prepare('INSERT INTO categories (name, description, icon, detail_image, details, notice, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)');
      stmt.run([
        category.name,
        category.description,
        category.icon,
        category.detail_image,
        category.details,
        category.notice,
        category.sort_order || 0
      ]);
      
      // 获取插入的ID
      const result = db.exec("SELECT last_insert_rowid() as id");
      const lastId = result[0] && result[0].values ? result[0].values[0][0] : 1;
      saveDatabase();
      callback(null, { id: lastId });
    } catch (err) {
      callback(err, null);
    }
  }

  // 更新品类
  static updateCategory(id, category, callback) {
    try {
      const db = getDatabase();
      const stmt = db.prepare('UPDATE categories SET name = ?, description = ?, icon = ?, detail_image = ?, details = ?, notice = ?, sort_order = ? WHERE id = ?');
      stmt.run([
        category.name,
        category.description,
        category.icon,
        category.detail_image,
        category.details,
        category.notice,
        category.sort_order || 0,
        id
      ]);
      
      saveDatabase();
      callback(null, { changes: stmt.getRowsModified ? stmt.getRowsModified() : 1 });
    } catch (err) {
      callback(err, null);
    }
  }

  // 删除品类
  static deleteCategory(id, callback) {
    try {
      const db = getDatabase();
      const stmt = db.prepare('DELETE FROM categories WHERE id = ?');
      stmt.run([id]);
      
      saveDatabase();
      callback(null, { changes: stmt.getRowsModified ? stmt.getRowsModified() : 1 });
    } catch (err) {
      callback(err, null);
    }
  }

  // 更新品类排序
  static updateSortOrder(id, sortOrder, callback) {
    try {
      const db = getDatabase();
      const stmt = db.prepare('UPDATE categories SET sort_order = ? WHERE id = ?');
      stmt.run([sortOrder, id]);
      
      saveDatabase();
      callback(null, { changes: stmt.getRowsModified ? stmt.getRowsModified() : 1 });
    } catch (err) {
      callback(err, null);
    }
  }
}

module.exports = CategoryModel;