"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var mysql = require('mysql');
require("dotenv").config();

exports.default = function (callback) {
	var db = mysql.createConnection(process.env.JAWSDB_URL);
	callback(db);
};
//# sourceMappingURL=db.js.map