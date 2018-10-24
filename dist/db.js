"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var mysql = require('mysql');
require("dotenv").config();

exports.default = function (callback) {
	var db = mysql.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		port: process.env.PORT,
		database: process.env.DB_NAME
	});
	callback(db);
};
//# sourceMappingURL=db.js.map