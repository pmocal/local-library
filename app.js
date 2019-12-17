var nconf = require('nconf');
nconf.argv()
  .env()
  .file({ file: 'config.json' });

var createError = require('http-errors');
var express = require('express');
var mongoose = require('mongoose');
var hbs = require('hbs');

var mongoDB = "mongodb+srv://" + nconf.get('user') + ":" +
  nconf.get('password') + "@" + nconf.get('host') + "/local_library?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: false });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog'); //import routes from catalog file

var app = express();

// view engine setup
hbs.registerPartials(path.join(__dirname, 'views'));
hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
	return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper('ifNotEquals', function(arg1, arg2, options) {
	return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper( 'toString', function returnToString( x ){
	return ( x === void 0 ) ? 'undefined' : x.toString();
} );
hbs.registerHelper( 'get_Id', function(x){
  return ( x === void 0 ) ? 'undefined' : x._id();
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter); //add catalog routes to middleware chain

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
