var mongoose = require('mongoose'),
	express = require('express'),
	config = require('./config/config.json'),
	path = require('path'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	app_busdata = require('./models/app_busdata'),
	busData = require('./models/busdata'),
	db_list = require('./models/db_list');

var index = require('./routes/index');
var users = require('./routes/users');
var connectionArray = [];

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes dependencies
app.use('/', index);
app.use('/users', users);

// Set up 4 Mongoose connections with Mongodb and register models to them
urb_sense = mongoose.createConnection(config.urb_sense),
dbList = urb_sense.model('db_by_client', db_list.DbListSchema);

/*novas = mongoose.createConnection(config.novas);
NovasAppData = novas.model('app_busdata', app_busdata.AppBus);
NovasBusData = novas.model('busdata', busData.BusData);

inari = mongoose.createConnection(config.inari);
inariAppData = inari.model('app_busdata', app_busdata.AppBus);
inariBusData = inari.model('busdata', busData.BusData);

mahendra = mongoose.createConnection(config.mahendra);
mahendraAppData = mahendra.model('app_busdata', app_busdata.AppBus);
mahendraBusData = mahendra.model('busdata', busData.BusData);*/

urb_sense.on('open', function(){
	console.log('\nMongo1 set up (Urb_sense)');
})

/*novas.on('open', function(){
	console.log("\nMongo2 set up (Novas_vn)");
});


inari.on('open', function(){
	console.log("\nMongo3 set up (inari_library)");		
});

mahendra.on('open', function(){
	console.log("\nMongo4 set up (mahendra)");
});*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Function to be called to generate a custom connection
exports.generateConnection = function(dbname){
	var urlPrefix = "mongodb://Peter:Biodata01@cluster0-shard-00-00-7kwa9.mongodb.net:27017,cluster0-shard-00-01-7kwa9.mongodb.net:27017,cluster0-shard-00-02-7kwa9.mongodb.net:27017/";
	var urlSuffix = "?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";
	var url = urlPrefix + dbname + urlSuffix;
	
/*	var model = connection.model('app_busdata', app_busdata.AppBus);
	var model2 = connection.model('busdata', busData.BusData);*/

	if(connectionArray.length == 0){
		var conn = mongoose.createConnection(url);
		conn.on('open', function(){
			console.log("\nMongo set up :" + dbname);
		});
		connectionArray.push(conn);
		return conn;
	}else if(connectionArray.length > 0){
		for (i = 0; i < connectionArray.length; i++) {
	    	if(connectionArray[i].name == dbname){
	    		return connectionArray[i];
	    	}else{
	    		var conn = mongoose.createConnection(url);
				conn.on('open', function(){
					console.log("\nMongo set up :" + dbname);
				});
				connectionArray.push(conn);
	    	}
	    }
	}
}
// App port is 3000

module.exports = app;
exports.dbList = dbList;
/*exports.NovasAppData = NovasAppData;
exports.NovasBusData = NovasBusData;
exports.inariAppData = inariAppData;
exports.inariBusData = inariBusData;
exports.mahendraAppData = mahendraAppData;
exports.mahendraBusData = mahendraBusData;*/