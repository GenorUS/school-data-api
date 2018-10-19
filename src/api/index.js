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

	api.get('/test', (req, res) => {

		let q = "select s.school_id, school_nm, school_level, is_private, location_city, location_state, location_zip from base_school_def s inner join base_school_grades_offered o	on s.school_id = o.school_id inner join base_school_location l on s.school_id = l.school_id	where o.g_highest_offered in ('12', '13', 'AE')"

		db.query(q, (err, data) => {
			if (err) {
				res.json(err)
			}
			res.json(data);
		});
		
	})
	return api;
}
