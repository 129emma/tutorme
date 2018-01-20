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
    const joinedPromises= ListingSQL.joinedSQLListingCall(limit);
    joinedPromises.then(function (value) {
        res.render("listing",value)
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
    const joinedPromises= ListingSQL.joinedSQLListingCall(limit, id);
    joinedPromises.then(function (value) {
        res.render("listing",value)
    })
});

router.get("/booking",function (req, res) {
    console.log(req.query);


        // connectNow = con.method();
        // connectNow.connect(function (err) {
        //     if (err) {
        //         connectNow.end();
        //         throw err;
        //     }
        // });

    const listOfPromises = [weekly1.Oneweek,weekly1.tutorbooked];
    console.log("list of Promises");
    const promise = weekly1.joinedScheduleCalls(listOfPromises, undefined, undefined, req.query.username,'tableTime','timeStart');
    promise.then(function (value) {


        const tutor = {
            "userName": [req.query.username],
            "bookedTime": [],
            "course": [],
            "tutee": [],
            "location": [],
            "availableTime": [],
            "bookingID": []
        };


        for(var i = 0; i< value[0].length;i++){
            tutor.availableTime.push(String(value[0][i].timeStart))
        }
        for(var i = 0; i< value[1].length;i++){
            const numbering = (tutor.availableTime.indexOf(String(value[1][i])));
            tutor.availableTime.splice(numbering, 1);
        }
        //res.render("listing",value);
        console.log(tutor.availableTime);
        console.log("what the fuck man");
        res.render("./userView/tutorSchedule.ejs", {value:tutor, userDetails: req.query.username, sess: req.session});
    });
});

module.exports = router;
