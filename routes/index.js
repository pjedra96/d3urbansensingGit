var moment = require('moment');
var express = require('express');
var router = express.Router();

var app_busdata = require('../models/app_busdata');
var busData = require('../models/busdata');

var server = require('../app');

/* GET home page. */
router.get('/', function(req, res, next) {
	// MongoDb query (database list)
	server.dbList.find({},  function(err, operators){
		if(err){
			return res.json({ "success": false, "msg": "Error while searching for operators", "error": err });
		}
		res.render('index', { title: 'Express', dbList: JSON.stringify(operators)});
	});
});
/* GET Data from DBs */
router.post('/data', function(req,res){
	var busID = req.body.busId + "";
	var dbname = req.body.dbname;
	var dateFrom = req.body.date_from;			
	var dateTo = req.body.date_to;

	var start = moment(dateFrom, "YYYY/MM/DD");
	var end = moment(dateTo, "YYYY/MM/DD");
	var diff = Math.abs(start.diff(end, 'days'))+1;
	console.log(diff);

	Date.prototype.addDays = function(days) {
		var dat = new Date(this.valueOf());
		dat.setDate(dat.getDate() + days);
		return dat;
	}

	function getDates(start, end){
		var dateArray = [];
		var currentDate = start;
		while(currentDate <= end){
			dateArray.push(currentDate);
			currentDate = currentDate.addDays(1);
		}
		return dateArray;
	}

	var dates = getDates(new Date(dateFrom), new Date(dateTo));
	var dateStrings = [];
	for(var i = 0; i < dates.length; i++){
		var yy = dates[i].getFullYear().toString().substring(2, 4);
		var mm = dates[i].getMonth()+1;
		var dd = dates[i].getDate();
		var date = moment(mm + '/' + dd + '/' + yy).format('DD-MM-YY');

		dateStrings.push(date);
	}
	console.log(dateStrings);
	console.log(busID);
	var model;
	var model2;

/*	switch(dbname){
		case "Novas_vn":
			model = server.NovasAppData;
			model2 = server.NovasBusData;
			break;
		case "inari_library":
			model = server.inariAppData;
			model2 = server.inariBusData;
			break;
		case "mahendra":
			model = server.mahendraAppData;
			model2 = server.mahendraBusData;
			break;
	}*/

	// Generates connections & assigns models to them
	var connection = server.generateConnection(dbname);
	model = connection.model('app_busdata', app_busdata.AppBus);
	model2 = connection.model('busdata', busData.BusData);

	if(busID != 'No value'){
		model.find({bus_id: busID, stopDate: dateStrings}, function (err, appData) {
			if (err) {
				return res.json({ "success": false, "msg": "Error while searching for a list of buses", "error": err });
			}

			model2.find({bus_id: busID, stopDate: dateStrings}, function (err, busData) {
				if (err) {
					return res.json({ "success": false, "msg": "Error while searching for a list of buses", "error": err });
				}
				//return res.status(200).json({ "success": true, appData: JSON.stringify(appData), busData: JSON.stringify(busData)});
				res.json({appData: appData, busData: busData});
			});
		});
	}else{
		model.find({stopDate: dateStrings}, function (err, appData) {
			if (err) {
				return res.json({ "success": false, "msg": "Error while searching for a list of buses", "error": err });
			}

			model2.find({stopDate: dateStrings}, function (err, busData) {
				if (err) {
					return res.json({ "success": false, "msg": "Error while searching for a list of buses", "error": err });
				}
				//return res.status(200).json({ "success": true, appData: JSON.stringify(appData), busData: JSON.stringify(busData)});
				res.json({appData: appData, busData: busData});
			});
		});
	}
});

module.exports = router;