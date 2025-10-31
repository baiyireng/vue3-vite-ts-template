const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

// 数据库文件路径
const dbPath = path.join(__dirname, 'service/data/database.sqlite');

async function checkDatabase() {
  try {
    const SQL = await initSqlJs();
    
    // 检查数据库文件是否存在
    if (!fs.existsSync(dbPath)) {
      console.log('Database file not found');
      return;
    }
    
    // 加载数据库
    const fileBuffer = fs.readFileSync(dbPath);
    const db = new SQL.Database(fileBuffer);
    
    // 查询所有表
    const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('Tables in database:');
    console.log(tables);
    
    // 查询home_images表
    try {
      const homeImages = db.exec('SELECT * FROM home_images');
      console.log('\nHome images:');
      if (homeImages.length > 0) {
        console.log('Columns:', homeImages[0].columns);
        homeImages[0].values.forEach((row, index) => {
          console.log(`Row ${index}:`, row);
        });
      }
    } catch (err) {
      console.log('Error querying home_images:', err.message);
    }
    
    // 查询titles表
    try {
      const titles = db.exec('SELECT * FROM titles');
      console.log('\nTitles:');
      if (titles.length > 0) {
        console.log('Columns:', titles[0].columns);
        titles[0].values.forEach((row, index) => {
          console.log(`Row ${index}:`, row);
        });
      }
    } catch (err) {
      console.log('Error querying titles:', err.message);
    }
    
    // 查询categories表结构
    try {
      const categoriesStructure = db.exec("PRAGMA table_info(categories)");
      console.log('\nCategories table structure:');
      if (categoriesStructure.length > 0) {
        console.log('Columns:', categoriesStructure[0].columns);
        categoriesStructure[0].values.forEach((row, index) => {
          console.log(`Column ${index}:`, row);
        });
      }
    } catch (err) {
      console.log('Error querying categories structure:', err.message);
    }
    
    // 查询categories表数据
    try {
      const categories = db.exec('SELECT * FROM categories');
      console.log('\nCategories:');
      if (categories.length > 0) {
        console.log('Columns:', categories[0].columns);
        categories[0].values.forEach((row, index) => {
          console.log(`Row ${index}:`, row);
        });
      } else {
        console.log('No data found');
      }
    } catch (err) {
      console.log('Error querying categories:', err.message);
    }
    
    // 查询order_notices表
    try {
      const orderNotices = db.exec('SELECT * FROM order_notices');
      console.log('\nOrder notices:');
      if (orderNotices.length > 0) {
        console.log('Columns:', orderNotices[0].columns);
        orderNotices[0].values.forEach((row, index) => {
          console.log(`Row ${index}:`, row);
        });
      }
    } catch (err) {
      console.log('Error querying order_notices:', err.message);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkDatabase();