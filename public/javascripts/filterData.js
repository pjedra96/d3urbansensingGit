var init_flag = false;

function ajaxCall(){
	var dayFrom = $('#date-from').val();
	var monthFrom = $('#month-from').val();
	var yearFrom = $('#year-from').val();

	var dateFrom = yearFrom + '/' + monthFrom + '/' + dayFrom;

	var dayTo = $('#date-to').val();
	var monthTo = $('#month-to').val();
	var yearTo = $('#year-to').val();

	var dateTo = yearTo + '/' + monthTo + '/' + dayTo;

	var database = $('#operators').val();
	var busId = (($('#bus-id').val()) ? $('#bus-id').val() : 'No value');

	var filters = { busId: busId, date_from: dateFrom, date_to: dateTo, dbname: database };

	$.ajax({
		type: 'POST',
		url: '/data',
		data: filters,
		async: true,
		success: function(data){
			if(init_flag){
				updateGraph(combineTotal(data));
			}else{
				render(combineTotal(data));
				init_flag = true;
			}

			toggleOff();
			
		},
		error: function(){
			console.log('No data');
		}
	});

}

function combineTotal(data){
	var result = [];
	var cumulativeData = {};
	var collections = [];
	var combinedAppData = [];
	var combinedBusData = [];

	var cumulativeAppData = {};
	var cumulativeBusData = {};

/*	for(var i = 0; i < data.appData.length; i++){		
		collections.push(data.appData[i]);
	}
	
	for(var j = 0; j < data.busData.length; j++){
		collections.push(data.busData[j]);
	}*/
	
	for(var i = 0; i < data.appData.length; i++){
		if(!cumulativeAppData.hasOwnProperty(data.appData[i].stopDate)){
			cumulativeAppData[data.appData[i].stopDate] = parseInt(data.appData[i].totalIn);
		}else{
			cumulativeAppData[data.appData[i].stopDate] += parseInt(data.appData[i].totalIn);
		}
	}

	for(var i = 0; i < data.busData.length; i++){
		if(!cumulativeBusData.hasOwnProperty(data.busData[i].stopDate)){
			cumulativeBusData[data.busData[i].stopDate] = parseInt(data.busData[i].totalIn);
		}else{
			cumulativeBusData[data.busData[i].stopDate] += parseInt(data.busData[i].totalIn);
		}
	}

	if(data.appData.length < 1){
		cumulativeAppData["01-01-70"] = 0;
	}

	for(var key in cumulativeAppData){
		combinedAppData.push({
			date: key,
			totalIn: cumulativeAppData[key]
		});
	}

	if(data.busData.length < 1){
		cumulativeBusData["01-01-70"] = 0;
	}

	for(var key in cumulativeBusData){
		combinedBusData.push({
			date: key,
			totalIn: cumulativeBusData[key]
		});
	}

	// DATES SECTION
	var dateFrom = $('#date-from').val();
	var monthFrom = $('#month-from').val();
	var yearFrom = $('#year-from').val();
	var dateFromString = yearFrom + '/' + monthFrom + '/' + dateFrom;
	var startDate = new Date(dateFromString);

	var dateTo = $('#date-to').val();
	var monthTo = $('#month-to').val();
	var yearTo = $('#year-to').val();
	var dateToString = yearTo + '/' + monthTo + '/' + dateTo;
	var endDate = new Date(dateToString);

	var dates = getDates(startDate, endDate);
	var dateStrings = [];
	for(var i = 0; i < dates.length; i++){
		var yy = dates[i].getFullYear().toString().substring(2, 4);
		var mm = dates[i].getMonth()+1;
		var dd = dates[i].getDate();
		var date = moment(mm + '/' + dd + '/' + yy).format('DD-MM-YY');

		dateStrings.push(date);
	}

	if(combinedAppData.length < dateStrings.length && combinedAppData.length){
		var apploopLength = Math.abs(dateStrings.length - combinedAppData.length);
		for(var k = 0; k < apploopLength ; k++){
			combinedAppData.push({
				date: "01-01-70",
				totalIn: 0
			});
		}
		console.log(dateStrings);
		console.log(combinedAppData);
		for(var j = 0; j < dateStrings.length; j++){
			if(Date.parse(parseISO(dateStrings[j])) < Date.parse(parseISO(combinedAppData[j].date))){
				combinedAppData.splice(j , 0, {
					date: dateStrings[j],
					totalIn: 0
				});
			}
		}

		for(var i = combinedAppData.length-1; i >= 0; i--){
			if(combinedAppData[i].date == "01-01-70"){
				combinedAppData.splice(i, 1);
			}
		}
	}

	if(combinedBusData.length < dateStrings.length && combinedBusData.length){
		var busloopLength = Math.abs(dateStrings.length - combinedBusData.length);
		for(var k = 0; k < busloopLength; k++){
			combinedBusData.push({
				date: "01-01-70",
				totalIn: 0
			});
		}
		for(var j = 0; j <dateStrings.length; j++){
			if(Date.parse(parseISO(dateStrings[j])) < Date.parse(parseISO(combinedBusData[j].date))){
				combinedBusData.splice(j , 0, {
					date: dateStrings[j],
					totalIn: 0
				});
			}
		}
		for(var i =combinedBusData.length-1; i >= 0 ; i--){
			if(combinedBusData[i].date == "01-01-70"){
				combinedBusData.splice(i, 1);
			}
		}
	}

	return [combinedAppData, combinedBusData];
}

function parseISO(string) {
	var YYYY = "20" + string.substring(6, 8);
	var MM = string.substring(3, 5);
	var DD = string.substring(0, 2);
	return YYYY + "/" + MM + "/" + DD;
}

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
