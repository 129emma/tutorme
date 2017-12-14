const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const users = require('./routes/users');
const registration = require('./routes/registration');
const registerDetails = require('./routes/registerDetails');
const home = require('./routes/home');
const login = require('./routes/login');
const loginPage = require('./routes/loginPage');
const tutorSchedule = require('./routes/schedule');
const tutorAvailableTime = require('./routes/tutorAddAvailableTime');

// const calendar = require('./routes/calendar');

//requiring Mozilla session module
var session = require('express-session');

const app = express();


app.listen(3000);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(session({resave: true, saveUninitialized: true, secret: 'SOMERANDOMSECRETHERE', cookie: {maxAge: 60000}}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/registration', registration);
app.use('/registerDetails', registerDetails);
app.use('/home', home);
app.use('/login', login);
app.use('/loginPage', loginPage);
app.use('/tutorSchedule', tutorSchedule);
app.use('/tutorAvailableTime', tutorAvailableTime);


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

module.exports = app;
