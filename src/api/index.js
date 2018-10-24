import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	api.get('/colleges/:state/:city', (req, res) => {
		
		let q = `SELECT a.inst_id, a.inst_nm 
		FROM base_college_base a
		join base_college_location b
		on a.inst_id = b.inst_id
		where b.mailing_city=?
		and b.mailing_state=?
		order by inst_nm`

		db.query(q,[ req.params.city.toUpperCase(), req.params.state.toUpperCase() ], (err, data) => {
			if (err) {
				res.json(err);
			} else {
				res.json(data);
			}
		});
	});

	api.get('/schools/:state/:city', (req, res) => {
		
		let q = `SELECT a.school_id, school_nm 
		FROM base_school_def a
		join base_school_location b
		on a.school_id = b.school_id
		join base_school_grades_offered c
		on a.school_id = c.school_id
		where c.g_highest_offered in ('12', '13', 'UG', 'AE')
		and UPPER(location_city)=?
		and location_state=?
		order by school_nm`

		db.query(q,[ req.params.city.toUpperCase(), req.params.state.toUpperCase() ], (err, data) => {
			if (err) {
				res.json(err);
			} else {
				for (let i = 0; i < data.length; i++) {
					data[i].school_nm = titleCase(data[i].school_nm);
				}
				res.json(data);
			}
		});
	});

	api.get('/states', (req, res) => {

		let q = "select distinct mailing_state from base_college_location order by mailing_state"

		db.query(q, (err, data) => {
			if (err) {
				res.json(err)
			} else {
				if (data) {
					let output = [];
					for (let i = 0; i < data.length; i++) {
						output.push(data[i].mailing_state);
					}
					let jsonOut = {
						'states': output
					}
					res.json(jsonOut);
				} else {
					res.send('No data found')
				}

				
			}
		});
	})
	return api;
}

function titleCase(str) {
	return str.toLowerCase().split(' ').map(function(word) {
	  return (word.charAt(0).toUpperCase() + word.slice(1));
	}).join(' ');
  }
