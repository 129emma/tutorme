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
    cookie: {maxAge: 60000}
}));

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
    //console.log("connected");
    //socket itself could be collected to be broadcasted, or there is an function  socket.broadcast.emit to emit to all,
    // apart from itself.
    //msg is the given JSON Object from the emitter.
    socket.on('today', function (msg) {
        console.log("got a message");
        console.log(msg);
        const today = new Date(msg.date);
        console.log(today.getFullYear());

        const connectNow = con.method();
        connectNow.connect(function (err) {
            if (err) throw err;
            console.log("Connected!");
            var startOfWeek;
            var endOfWeek;
            try {
                startOfWeek = new Date(today.getFullYear(), today.getMonth(), (today.getDate() - (today.getDay() - 2)));
                endOfWeek = new Date(today.getFullYear(), today.getMonth(), (today.getDate() + (7 - today.getDay() + 1)));
            }
            catch (e) {
                connectNow.end();
                console.log(e);
            }
            console.log(startOfWeek);
            console.log(endOfWeek);
            connectNow.query("SELECT userName, timeStart, day FROM tableTime Where timeStart>=? AND timeStart<=?", [startOfWeek, endOfWeek], function (err, result) {
                connectNow.end();
                console.log('Yeah');
                if (err) {
                    connectNow.end();
                    throw err;
                } else {
                    rawOject = JSON.parse(JSON.stringify(result));
                    console.log(rawOject);
                    rawOject.map(function (value) {
                        const dateTime = new Date(Date.parse((value.timeStart).replace("T", " ")));
                        // console.log(dateTime.getDay());
                        const returnDate = {
                            year: dateTime.getFullYear(),
                            month: dateTime.getMonth(),
                            date: dateTime.getDate(),
                            day: (dateTime.getDay() == 0 ? 7 : dateTime.getDay()),
                            hour: (dateTime.getHours() == 0 ? 12 : dateTime.getHours())
                        };
                        value.timeStart = returnDate;
                    });
                    //console.log(rawOject);
                    socket.emit('return', rawOject);
                }
            })
        });
        // socket.emit('return', {name:"bye"});
    })
});

module.exports = app;
