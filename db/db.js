const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});


function query(string, params, callback) {
	return client.query(string, params, callback);
}

module.exports = { query };