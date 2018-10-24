'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _package = require('../../package.json');

var _express = require('express');

var _facets = require('./facets');

var _facets2 = _interopRequireDefault(_facets);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
	var config = _ref.config,
	    db = _ref.db;

	var api = (0, _express.Router)();

	// mount the facets resource
	api.use('/facets', (0, _facets2.default)({ config: config, db: db }));

	// perhaps expose some API metadata at the root
	api.get('/', function (req, res) {
		res.json({ version: _package.version });
	});

	api.get('/colleges/:state/:city', function (req, res) {

		var q = 'SELECT a.inst_id, a.inst_nm \n\t\tFROM base_college_base a\n\t\tjoin base_college_location b\n\t\ton a.inst_id = b.inst_id\n\t\twhere b.mailing_city=?\n\t\tand b.mailing_state=?\n\t\torder by inst_nm';

		db.query(q, [req.params.city.toUpperCase(), req.params.state.toUpperCase()], function (err, data) {
			if (err) {
				res.json(err);
			} else {
				res.json(data);
			}
		});
	});

	api.get('/schools/:state/:city', function (req, res) {

		var q = 'SELECT a.school_id, school_nm \n\t\tFROM base_school_def a\n\t\tjoin base_school_location b\n\t\ton a.school_id = b.school_id\n\t\tjoin base_school_grades_offered c\n\t\ton a.school_id = c.school_id\n\t\twhere c.g_highest_offered in (\'12\', \'13\', \'UG\', \'AE\')\n\t\tand UPPER(location_city)=?\n\t\tand location_state=?\n\t\torder by school_nm';

		db.query(q, [req.params.city.toUpperCase(), req.params.state.toUpperCase()], function (err, data) {
			if (err) {
				res.json(err);
			} else {
				for (var i = 0; i < data.length; i++) {
					data[i].school_nm = titleCase(data[i].school_nm);
				}
				res.json(data);
			}
		});
	});

	api.get('/states', function (req, res) {

		var q = "select distinct mailing_state from base_college_location order by mailing_state";

		db.query(q, function (err, data) {
			if (err) {
				res.json(err);
			} else {
				if (data) {
					var output = [];
					for (var i = 0; i < data.length; i++) {
						output.push(data[i].mailing_state);
					}
					var jsonOut = {
						'states': output
					};
					res.json(jsonOut);
				} else {
					res.send('No data found');
				}
			}
		});
	});
	return api;
};

function titleCase(str) {
	return str.toLowerCase().split(' ').map(function (word) {
		return word.charAt(0).toUpperCase() + word.slice(1);
	}).join(' ');
}
//# sourceMappingURL=index.js.map