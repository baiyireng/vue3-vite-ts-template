const express = require('express');
const router = express.Router();
const HomeController = require('../controllers/HomeController');

// 首页图片相关路由
router.get('/images', HomeController.getAllImages);
router.put('/images', HomeController.updateImage);

// 标题相关路由
router.get('/titles', HomeController.getAllTitles);
router.put('/titles', HomeController.updateTitle);

// 下单须知相关路由
router.get('/order-notice', HomeController.getOrderNotice);
router.put('/order-notice', HomeController.updateOrderNotice);

module.exports = router;