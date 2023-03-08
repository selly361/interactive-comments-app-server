const { Pool } = require("pg");

const	options = {
		connectionString: process.env.DATABASE_URL,
		ssl: {
			rejectUnauthorized: false,
		},
	};
const pool = new Pool(options);

function query(string, params, callback) {
	return pool.query(string, params, callback);
}

module.exports = { query };