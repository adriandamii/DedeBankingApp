import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({
   host: process.env.HOST_MYSQL,
   user: process.env.USER_MYSQL,
   database: process.env.DATABASE_MYSQL,
   password: process.env.PASSWORD_MYSQL
});

db.getConnection((err, connection) => {
   if (err) {
     console.error("Error connecting to the database: ", err);
     return;
   }
   connection.release();
 });

export default db.promise();
