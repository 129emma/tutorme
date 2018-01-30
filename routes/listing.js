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
        res.render("listing", {value: value, userDetails: req.session.userDetails})
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
        res.render("listing", {value: value, userDetails: req.session.userDetails})
    })
});

router.get("/booking", function (req, res) {
    console.log("joined booking and listing");
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
        console.log(value);

        value.userName = req.session.username;
        res.render("./userView/tuteeBooking.ejs", {
            value: value,
            userDetailsName: req.query.username,
            sess: req.session,
            subject: req.query.capability
            , userDetails: req.session.userDetails,
            tutor: req.query.username
        });
    });
});

router.get("/booking/modal", function (req, res) {
    console.log(req.query);
    console.log(req.session.userDetails[0].userName);
    var Clickdate = new Date(req.query.time);

    console.log(Clickdate);
    Clickdate = new Date(Clickdate);
    Clickdate.setTime(Clickdate.getTime() + Clickdate.getTimezoneOffset() * 60 * 1000);
    console.log(Clickdate);
    res.render("./userView/tuteeBooking", {
        userDetailsName: req.session.userDetails[0],
        subject: req.query.subject,
        time: Clickdate,
        tutor: req.query.username,
        userDetails: req.session.userDetails
    });
});
router.get("/booking/confirm", function (req, res) {
    console.log("booking confirm");
    console.log(req.query);
    if (req.query.time >0){
    // const Clickdate = new Date(req.query.time);
    const item  =[];
    req.query.time.map(function (value) {
        const json = JSON.parse(JSON.stringify(req.query));
        json.time = value;
        item.push(json);
    });
    const promise = updateTime.bookingAvailableTime(item);
    promise.then(function (value) {
        console.log("Added to database plz check");
        resp.json({name: "booked"});
    })}
    else{
        resp.json({name:"fucking empty"})
    }
});

module.exports = router;
