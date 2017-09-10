var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var BusData = new Schema({
	bus_id: String,
	stopDate: String,
	stopTime: String,
	totalOut: String,
	totalIn: String,
	lat: String,
	lng: String
},{ collection: 'busdata', versionKey: false });

exports.BusData = BusData;