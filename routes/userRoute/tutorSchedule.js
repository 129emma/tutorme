const express = require('express');
const router = express.Router();
var app = express();
var server = require('http').Server(app);

const con = require('../../javascript/connection');
const weekly1 = require("../../javascript/tutorSchedule3WeekPreRendering1");
router.get('/', function (req, res) {

    console.log(req.session.userDetails[0]);

    // var promise = weekly.Oneweek(undefined, req.session.userDetails[0].userName,'tableTime','timeStart');
    //
    // promise.then(function (value) {
    //     console.log(value);
    //     res.render("./userView/tutorSchedule.ejs", {value:value, userDetailsName:  req.session.userDetails[0].userName, sess: req.session, userDetails: req.session.userDetails});
    // })
    const listOfPromises = [weekly1.Oneweek, weekly1.tutorbooked];
    const promise = weekly1.joinedScheduleCalls(listOfPromises, undefined, undefined, req.session.userDetails[0].userName, 'tableTime', 'timeStart');
    promise.then(function (value) {
        console.log(value);
        value.userName = req.session.username;
        res.render("./userView/tutorSchedule.ejs", {
            value: value,
            userDetailsName: req.session.userDetails[0].userName,
            sess: req.session,
            userDetails: req.session.userDetails
        });
    });
});

router.get('/booking',function (req, res) {


    console.log(req.query);
    console.log("from listing");
});



module.exports = router;
