const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// requiring general prior to login routes.
const index = require('./routes/index');
const registration = require('./routes/registration');
const login = require('./routes/login');
const user = require('./routes/user');
const listing = require('./routes/listing');
const publicProfile = require('./routes/publicProfile');

const aboutUs = require('./routes/aboutUs');
const contactUs = require('./routes/contactUs');

//requiring Mozilla session module
var session = require('express-session');

//require ajaxexpresso
const ajaxhandler = require('./routes/ajaxhandler');

// Lamlam and Vanie needs to add comments
const tutorSchedule = require('./javascript/tutorSchedule3WeekPreRendering1');
const UpdatingTime = require('./javascript/UpdatingTime');



const app = express();

//using the server for socket.io purpose and in general nothing had changed.
var server = require('http').Server(app);
var io = require('socket.io')(server);

//Setup to listen to port 3000
server.listen(process.env.port || 3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//Setting up session
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'SOMERANDOMSECRETHERE',
    cookie: {maxAge: 6000000}}));

app.use(express.static(path.join(__dirname, 'public')));

// Setting up routes and connections to url's
app.use('/', index);
app.use('/registration', registration);
app.use('/login', login);
// user routes, see routes/userRoutes/* for all the various specific end routes.
app.use('/user', user);
app.use('/listing', listing);
app.use('/publicProfile', publicProfile);

app.use('/aboutus', aboutUs);
app.use('/contactus', contactUs);

//ajax handler router
app.use('/ajaxhandler', ajaxhandler);


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
    socket.on('nextnextweek', function (msg) {
        //console.log(typeof msg);
        //console.log(msg.userName);
        const presetDate = new Date(msg.day);
        console.log(presetDate);
        const date = new Date(presetDate.getFullYear(),presetDate.getMonth(),(presetDate.getDate()),-11);
        console.log(date);
        console.log(msg)
        console.log("after dates");
        console.log(String(msg.userName));
        console.log("Is this tutee: "+ msg.tuteeBoolean + " "+ (typeof msg.tuteeBoolean));
        var promise;
        if (msg.tuteeBoolean){
            promise = tutorSchedule.joinedScheduleCalls([tutorSchedule.tutorbooked], undefined, date, String(msg.userName), 'tableTime', 'timeStart');
        }else{
            promise = tutorSchedule.joinedScheduleCalls([tutorSchedule.Oneweek,tutorSchedule.tutorbooked], undefined, date, String(msg.userName), 'tableTime', 'timeStart');
        }
        promise.then(function (value) {
            //console.log("promising");
            console.log(value);
            socket.emit('nextnextweek', value)
        });

    });
    socket.on('lastlastweek', function (msg) {
        //console.log(typeof msg);
        const presetDate = new Date(msg.day);
        const date = new Date(presetDate.getFullYear(),presetDate.getMonth(),(presetDate.getDate()),-11);
        console.log(date);

        console.log(String(msg.userName));
        var promise;
        if (msg.tuteeBoolean){
            promise = tutorSchedule.joinedScheduleCalls([tutorSchedule.tutorbooked], undefined, date, String(msg.userName), 'tableTime', 'timeStart');
        }else{
            promise = tutorSchedule.joinedScheduleCalls([tutorSchedule.Oneweek,tutorSchedule.tutorbooked], undefined, date, String(msg.userName), 'tableTime', 'timeStart');
        }
        promise.then(function (value) {
            //console.log("promising");
            console.log(value);
            socket.emit('lastlastweek', value)
        });
    });
    socket.on('insertTime',function (msg) {
        //console.log(msg);

        for (var i = 0; i< msg.date.length; i++){
            msg.date[i] = new Date(msg.date[i]);
        }
        // const day = new Date(msg.date);

        var promise = UpdatingTime.Insert(msg.date,String(msg.userName),"tableTime");
        promise.then(function (value) {
            //console.log(value);
            socket.emit('insertTime', {})
        })
    });
    socket.on('deleteTime', function(msg) {
        for (var i = 0; i< msg.date.length; i++){
            msg.date[i] = new Date(msg.date[i]);
        }
        var promise = UpdatingTime.Delete(msg.date,String(msg.userName), "tableTime");
        promise.then(function (value) {
            //console.log("delete " + value);
            socket.emit('deleteTime', {});
        })
    })
});

module.exports = app;
