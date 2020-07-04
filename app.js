var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
/**
 * Middleware for logging HTTP Requests
 */
var logger = require('morgan');
/**
 * Body-parser is a node.js middleware parse the incoming request body before handle and make 
 * avaialable in req.body object.basically this simplifies the incoming request
 */
const bodyParser = require('body-parser');

/**
 * handle the cross origin resource sharing request
 */
const cors = require('cors');
/**
 * expres-fileupload is node.js middleware to handle multipart form data extract the files if avaiable
 * and make available in req.files same this simplfies the incoming request
 */

const fileUpload = require('express-fileupload');

/**
 * A js library that provide utltity function to handle Js native data types
 */

const _ = require('lodash');




var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(fileUpload({
  createParentPath : true,
}));
console.log('envirnoment is ' + app.get('env'));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
