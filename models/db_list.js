var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var DbListSchema = new Schema({
	name: String,
	dbx: String,
	echo_server: String,
	echo_port: String,
	icoa: String,
	tz: String,
	utc_offset: String,
	region_city: String
},{ collection: 'db_by_client', versionKey: false });

exports.DbListSchema = DbListSchema;
//module.exports = mongoose.model('users', UserSchema);