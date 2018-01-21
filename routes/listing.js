/**
 * Created by Administer on 16/01/2018.
 */
const con = require("../javascript/connection");
const sql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const ListingSQL = require("../javascript/ListingSQL");
//const weekly = require("../../javascript/tutorSchedule3WeekPreRendering");
const weekly1 = require("../javascript/tutorSchedule3WeekPreRendering1");
const updateTime = require("../javascript/UpdatingTime");
router.get('/', function (req, res) {
    console.log("listing");
    //the limit for number of display per page
    const limit = 10;
    const tutorUsername = req.session.userDetails[0].userName;
    /*JSON Template
     retrieval sorted data:
     tutors = [{
     {
     userName:xxx,
     selfIntroduction:"I am a boss",
     courses: "LAW 101,PSYCH109",
     grades: "A+,B-"
     rating: 1,
     }
     }]
     */
    // const connectNow = con.method();
    // connectNow.connect(function (err) {
    //     if (err) {
    //         connectNow.end();
    //         throw err
    //     }
    // });
    const joinedPromises = ListingSQL.joinedSQLListingCall(limit);
    joinedPromises.then(function (value) {
        res.render("listing", value)
    })

});

router.get('/search', function (req, res) {
    console.log("searching");
    const id = req.query.search;
    console.log(id);
    //the limit for number of display per page
    const limit = 10;
    const tutorUsername = req.session.userDetails[0].userName;
    /*JSON Template
     retrieval sorted data:
     data = [{
     {
     tutorId:xxx,
     Courses:[law 101, psy103],
     Rating: 4.5,
     Available hours: 3,
     },

     {
     tutorId:xxx,
     Courses:[law 101, psy103],
     Rating: 4.5,
     Available hours: 3,
     },
     {
     tutorId:xxx,
     Courses:[law 101, psy103],
     Rating: 4.5,
     Available hours: 3,
     }
     }]
     */
    const joinedPromises = ListingSQL.joinedSQLListingCall(limit, id);
    joinedPromises.then(function (value) {
        res.render("listing", value)
    })
});

router.get("/booking", function (req, res) {
    console.log(req.query);


    // connectNow = con.method();
    // connectNow.connect(function (err) {
    //     if (err) {
    //         connectNow.end();
    //         throw err;
    //     }
    // });

    const listOfPromises = [weekly1.Oneweek, weekly1.tutorbooked];
    const promise = weekly1.joinedScheduleCalls(listOfPromises, undefined, undefined, req.query.username, 'tableTime', 'timeStart');
    promise.then(function (value) {
        console.log(value.availableTime);
        value.userName = req.session.username;
        res.render("./userView/tutorScheduleBooking.ejs", {
            value: value,
            userDetails: req.query.username,
            sess: req.session,
            subject: req.query.subject
        });
    });
});

router.get("/booking/modal", function (req, res) {
    console.log(req.query);
    console.log(req.session.userDetails[0].userName);
    var Clickdate = new Date(req.query.time);

    // console.log(Clickdate)
    // Clickdate = new Date(Clickdate);
    Clickdate.setTime(Clickdate.getTime() + Clickdate.getTimezoneOffset() * 60 * 1000);
    console.log(Clickdate);
    res.render("./userView/tuteeBooking", {
        userDetails: req.session.userDetails[0],
        subject: req.query.subject,
        time: Clickdate,
        tutor: req.query.username
    });
});
router.get("/booking/confirm", function (req, res) {
    console.log("booking confirm");
    console.log(req.query);
    const Clickdate = new Date(req.query.time);
    Clickdate.setTime(Clickdate.getTime() + Clickdate.getTimezoneOffset() * 60 * 1000);
//    console.log(req.query.time);
    console.log(Clickdate);
//    updateTime.convert(Clickdate)
    const promise = updateTime.bookingAvailableTime(Clickdate,req.query.tutee,req.query.tutor,req.query.subject);
    promise.then(function (value) {
        console.log("Added to database plz check");
    })
});

module.exports = router;
