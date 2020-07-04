/**
 * A js library that provide utltity function to handle Js native data types
 */
var _ = require('lodash');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const multer = require('multer');
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





var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var uploadRouter = require('./routes/upload');

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

/*
app.use(fileUpload({
  createParentPath : true,
  limits:{ 
    fileSize: 2 * 1024 * 1024 * 1024 //2MB max file(s) size
  }
}));
*/
console.log('envirnoment is ' + app.get('env'));



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/upload',uploadRouter);




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

require('events').EventEmitter.prototype._maxListeners = 0;
module.exports = app;
