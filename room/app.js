var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var http = require('http');
var socket = require('socket.io');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

//port setup
app.set('port', process.env.PORT || 3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

var io = socket.listen(server);

io.on('connection', function(socket){
    socket.on('join', function(data){
        console.log('user: ' + data.userid + '/ room:' + data.room_name);
        socket.join(data.room_name);
        socket.userid = data.userid;
        socket.room = data.room_name;
        //socket.broadcast.emit('msg', '* 채널:'+socket.room+' - '+socket.userid + '님이 접속하셨습니다.');
        //socket.emit('msg', '* 채널:'+socket.room+' - '+socket.userid + '님이 접속하셨습니다.');
        io.to(socket.room).emit('msg', '* 채널:'+socket.room+' - '+socket.userid + '님이 접속하셨습니다.');

    });

    socket.on('msg', function(data){
       console.log(' - '+socket.userid+' : ' + data.msg);
        //socket.broadcast.emit('msg', '['+socket.userid+']'+data.msg);
        //socket.emit('msg', '[나]'+data.msg);
        io.to(socket.room).emit('msg', '['+socket.userid+']'+data.msg);
    });
});



module.exports = app;
