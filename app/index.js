import dotenv from 'dotenv/config'
import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST, 
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD, 
    port: 5432,
    ssl : true, 
});

client.connect();

const res = await client.query("SELECT * FROM users");
client.end()
console.log(res.rows[0]); 