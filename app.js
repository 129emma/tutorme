const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// requiring general prior to login routes.
const index = require('./routes/index');
const users = require('./unused/users');
const registration = require('./routes/registration');
const login = require('./routes/login');

// requiring tutor.js which contains requires to all the tutor specific routes, used below.
const tutor = require('./routes/tutor');

// requiring tutee.js which contains requires to all the tutee specific routes, used below.
const tutee = require('./routes/tutee');

//requiring Mozilla session module
var session = require('express-session');

const tutorSchedule = require('./javascript/tutorSchedule3WeekPreRendering');
const UpdatingTime = require('./javascript/UpdatingTime');



const app = express();

//using the server for socket.io purpose and in general nothing had changed.
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'SOMERANDOMSECRETHERE',
    cookie: {maxAge: 60000}}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/registration', registration);
app.use('/login', login);

//use of tutor routes, see routes/tutorRoute/* for all the different routes inside of tutorRoutes
app.use('/tutor', tutor);

//use of tutee routes, see routes/tuteeRoute/* for all the different routes inside of tutorRoutes
app.use('/tutee', tutee);

app.use(session({
    genid: function (req) {
        return genuuid(); // use UUIDs for session IDs
    },
    secret: 'random_string_goes_here',
}));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

const con = require("./javascript/connection.js");

//The socket's entry point the .on event is based on the other's end .emit event in this given case it is 'hello' from
//the tutorSchedule.ejs. The .on event will be trigger by the .emit events speifically given like an eventListener
io.on('connection', function (socket) {
    console.log("connected");
    //socket itself could be collected to be broadcasted, or there is an function  socket.broadcast.emit to emit to all,
    // apart from itself.
    //msg is the given JSON Object from the emitter.
    socket.on('nextnextweek', function (msg) {
        console.log(typeof msg);
        console.log(msg.userName);
        const presetDate = new Date(msg.day);
        const date = new Date(presetDate.getFullYear(),presetDate.getMonth(),(presetDate.getDate()),-11);
        console.log(date);
        var promise = tutorSchedule.Oneweek(date,String(msg.userName),'tableTime','timeStart');
        promise.then(function (value) {
            console.log("promising");
            console.log(value);
            socket.emit('nextnextweek', value)
        });

    });
    socket.on('lastlastweek', function (msg) {
        console.log(typeof msg);
        const presetDate = new Date(msg.day);
        const date = new Date(presetDate.getFullYear(),presetDate.getMonth(),(presetDate.getDate()),-11);
        console.log(date);
        var promise = tutorSchedule.Oneweek(date,String(msg.userName),'tableTime','timeStart');
        promise.then(function (value) {
            console.log("promising");
            console.log(value);
            socket.emit('lastlastweek', value)
        });
    });
    socket.on('insertTime',function (msg) {
        console.log(msg);
        const day = new Date(msg.date);
        console.log(day);
        var promise = UpdatingTime.Insert(day,String(msg.userName),"tableTime");
        promise.then(function (value) {
            console.log(value);
            socket.emit('insertTime', {id:msg.id, date:value})
        })
    })
    socket.on('deleteTime', function(msg) {
        const day = new Date(msg.date);
        var promise = UpdatingTime.Delete(day,String(msg.userName), "tableTime");
        promise.then(function (value) {
            console.log("delete " + value);
            socket.emit('deleteTime', {id:msg.id});
        })
    })
});

module.exports = app;
