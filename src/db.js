var mysql = require('mysql');
require("dotenv").config();

export default callback => {
	var db = mysql.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		port: process.env.PORT,
		database: process.env.DB_NAME
	});
	callback(db);
}
