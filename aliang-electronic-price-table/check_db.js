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
    console.log(images);
    
    console.log('\nTitles:');
    const titles = db.exec('SELECT * FROM titles');
    console.log(titles);
    
    console.log('\nCategories:');
    const categories = db.exec('SELECT * FROM categories');
    console.log(categories);
    
    db.close();
  } catch (err) {
    console.error('Error reading database:', err);
  }
}

checkDatabase();