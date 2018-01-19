/**
 * Created by Administer on 16/01/2018.
 */
const con = require("../javascript/connection");
const sql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const ListingSQL = require("../javascript/ListingSQL");


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
    const promiseForListing = ListingSQL.listingSQLDEC(limit);
    const promiseForAllcourses = ListingSQL.allTableCourses();
    Promise.all([promiseForListing,promiseForAllcourses]).then(function (value) {
        res.render("listing", {tutors: value[0], courses: value[1]});
    });

});

router.get('/search', function (req, res) {
    console.log("searching");
    const id = req.body.search;
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
    // connectNow.query("SELECT * FROM tableCapabilities LIMIT ?"
    //     , [limit], function (err, resultTutor) {
    //         const resultDetails = JSON.parse(JSON.stringify(resultTutor));
    //         const courses = Array.from(new Set(resultDetails.map(function (p1) { return p1.courseID;  })));
    //         console.log(courses);
    //         connectNow.end();
    //         if (err) {
    //             throw err;
    //         } else {
    //             // DB connection to get course list to display in dropdown
    //             console.log("this is going back to the listing");
    //             res.render("listing", {cap: resultDetails, courses: courses});
    //         }
    //     });

    const promiseForSelection = ListingSQL.listingSQLDEC(limit,id);
    const promiseForAllcourses = ListingSQL.allTableCourses();
    Promise.all([promiseForSelection,promiseForAllcourses]).then(function (value) {
        res.render("listing", {tutors: value[0], courses: value[1]});
    });
});


module.exports = router;
