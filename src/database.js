const mysql = require('mysql')

const SQL_DB = {
  connectionLimit: 10,
  host: process.env.SQL_HOST,
  port: process.env.SQL_PORT,
  user: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE
}

// this way we can query from pool with pool.query(string, callback)
module.exports = mysql.createPool(SQL_DB)
