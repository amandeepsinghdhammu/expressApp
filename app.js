var createError = require('http-errors');
var express = require('express');
var socket_io = require('socket.io');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var spawn = require('child_process').spawn,
    ls    = spawn('python', ['test.py']);


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Socket.io
var io = socket_io();
app.io = io;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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

io.on('connection', function(socket){
  console.log('a user connected');

  ls.stdout.on('data', function (gdata) {
    //socket.emit('message', gdata.toString());
    socket.emit('message', ['1234567890','7894561230']);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});


module.exports = app;
