import mysql from 'mysql2/promise';
import 'dotenv/config';

const sqldb = mysql.createPool({
  host: process.env.MYSQL_URI,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: false, // Set to true if your RDS requires SSL
});

async function verifyMysqlConnection() {
    try {
      const [rows] = await sqldb.query('SELECT NOW() AS time');
      console.log('✅ MySQL is connected. Current time:', rows[0].time);
    } catch (err) {
      console.error('❌ Error connecting to MySQL:', err.message);
      process.exit(1); // Exit if DB connection fails
    }
  }


  export {sqldb,verifyMysqlConnection} ;