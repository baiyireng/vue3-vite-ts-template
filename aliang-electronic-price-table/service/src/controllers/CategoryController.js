const CategoryModel = require('../models/CategoryModel');

class CategoryController {
  // 获取所有品类
  static getAllCategories(req, res) {
    CategoryModel.getAllCategories((err, categories) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ categories });
      }
    });
  }

  // 根据ID获取品类详情
  static getCategoryById(req, res) {
    const { id } = req.params;
    CategoryModel.getCategoryById(id, (err, category) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (!category) {
        res.status(404).json({ error: 'Category not found' });
      } else {
        res.json({ category });
      }
    });
  }

  // 创建新品类
  static createCategory(req, res) {
    const categoryData = req.body;
    CategoryModel.createCategory(categoryData, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ message: 'Category created successfully', categoryId: result.id });
      }
    });
  }

  // 更新品类
  static updateCategory(req, res) {
    const { id } = req.params;
    const categoryData = req.body;
    CategoryModel.updateCategory(id, categoryData, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (result.changes === 0) {
        res.status(404).json({ error: 'Category not found' });
      } else {
        res.json({ message: 'Category updated successfully' });
      }
    });
  }

  // 删除品类
  static deleteCategory(req, res) {
    const { id } = req.params;
    CategoryModel.deleteCategory(id, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (result.changes === 0) {
        res.status(404).json({ error: 'Category not found' });
      } else {
        res.json({ message: 'Category deleted successfully' });
      }
    });
  }

  // 更新品类排序
  static updateSortOrder(req, res) {
    const { id } = req.params;
    const { sort_order } = req.body;
    CategoryModel.updateSortOrder(id, sort_order, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (result.changes === 0) {
        res.status(404).json({ error: 'Category not found' });
      } else {
        res.json({ message: 'Category sort order updated successfully' });
      }
    });
  }
}

module.exports = CategoryController;