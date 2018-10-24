var mysql = require('mysql');
require("dotenv").config();

export default callback => {
	var db = mysql.createConnection(process.env.JAWSDB_URL);
	callback(db);
}
