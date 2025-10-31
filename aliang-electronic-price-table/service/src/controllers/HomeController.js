const HomeModel = require('../models/HomeModel');

class HomeController {
  // 获取所有首页图片
  static getAllImages(req, res) {
    HomeModel.getAllImages((err, images) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ images });
      }
    });
  }

  // 更新图片
  static updateImage(req, res) {
    const { name, url } = req.body;
    HomeModel.updateImage(name, url, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: 'Image updated successfully', result });
      }
    });
  }

  // 获取所有标题
  static getAllTitles(req, res) {
    HomeModel.getAllTitles((err, titles) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        const titlesObj = {};
        titles.forEach(title => {
          titlesObj[title.section] = title.title;
        });
        res.json({ titles: titlesObj });
      }
    });
  }

  // 更新标题
  static updateTitle(req, res) {
    const { section, title } = req.body;
    HomeModel.updateTitle(section, title, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: 'Title updated successfully', result });
      }
    });
  }

  // 获取下单须知文本
  static getOrderNotice(req, res) {
    HomeModel.getOrderNotice((err, notice) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ notice: notice.notice });
      }
    });
  }

  // 更新下单须知文本
  static updateOrderNotice(req, res) {
    const { notice } = req.body;
    HomeModel.updateOrderNotice(notice, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: 'Order notice updated successfully', result });
      }
    });
  }
}

module.exports = HomeController;