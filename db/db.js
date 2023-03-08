const { createPool } = require("mysql2")

const db = createPool({
    host: process.env.HOST,
    user: process.env.ROOT,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
  });
  

  function query(string, params, callback) {
	return db.query(string, params, callback);
}


module.exports = { query }