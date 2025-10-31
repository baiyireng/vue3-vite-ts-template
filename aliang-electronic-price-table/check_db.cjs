const fs = require('fs');
const initSqlJs = require('sql.js');

async function checkDatabase() {
  try {
    const SQL = await initSqlJs();
    const fileBuffer = fs.readFileSync('database.sqlite');
    const db = new SQL.Database(fileBuffer);
    
    console.log('Tables in database:');
    const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
    console.log(tables);
    
    console.log('\nHome images:');
    const images = db.exec('SELECT * FROM home_images');
    if (images.length > 0) {
      console.log('Columns:', images[0].columns);
      images[0].values.forEach((row, index) => {
        console.log(`Row ${index}:`, row);
      });
    } else {
      console.log('No data found');
    }
    
    console.log('\nTitles:');
    const titles = db.exec('SELECT * FROM titles');
    if (titles.length > 0) {
      console.log('Columns:', titles[0].columns);
      titles[0].values.forEach((row, index) => {
        console.log(`Row ${index}:`, row);
      });
    } else {
      console.log('No data found');
    }
    
    console.log('\nCategories:');
    const categories = db.exec('SELECT * FROM categories');
    if (categories.length > 0) {
      console.log('Columns:', categories[0].columns);
      categories[0].values.forEach((row, index) => {
        console.log(`Row ${index}:`, row);
      });
    } else {
      console.log('No data found');
    }
    
    console.log('\nOrder notices:');
    const notices = db.exec('SELECT * FROM order_notices');
    if (notices.length > 0) {
      console.log('Columns:', notices[0].columns);
      notices[0].values.forEach((row, index) => {
        console.log(`Row ${index}:`, row);
      });
    } else {
      console.log('No data found');
    }
    
    db.close();
  } catch (err) {
    console.error('Error reading database:', err);
  }
}

checkDatabase();