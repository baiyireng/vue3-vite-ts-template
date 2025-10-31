const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');

// 品类相关路由
router.get('/', CategoryController.getAllCategories);
router.post('/', CategoryController.createCategory);
router.get('/:id', CategoryController.getCategoryById);
router.put('/:id', CategoryController.updateCategory);
router.delete('/:id', CategoryController.deleteCategory);
router.put('/:id/sort', CategoryController.updateSortOrder);

module.exports = router;