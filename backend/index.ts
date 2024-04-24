import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import db from './database/config/database';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: "GET, POST, PUT, DELETE"
  })
);
app.get('/users', async (req, res) => { 
  try {
    const rows = await db.query('SELECT * FROM Users');
    res.json(rows);     
  } catch (err) {
    res.status(500).send('Failed to get users');
  }
});



 app.listen(PORT, () =>
   console.log(`Server Running on Port: http://localhost:${PORT}`)
 )