/**
 * Created by Administer on 16/01/2018.
 */
const con = require("../javascript/connection");
const sql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();



router.get('/', function (req, res) {

    const connectNow = con.method();
    connectNow.connect(function (err) {
        if (err) throw err;
        console.log("Connected and online (Tutor Profile)!");
    });
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
    connectNow.query("SELECT tutor.`userName`, tutor.`selfIntroduction`, GROUP_CONCAT(distinct cap.`courseID`) as courses, GROUP_CONCAT( cap.`grade`) as grades, b.rating FROM `tableTutor` as tutor inner join `tableCapabilities` as cap on tutor.`userName` = cap.`userName` join( SELECT a.`userName`, COALESCE(AVG(book.`tuteeRating`),0) as rating FROM `tableTutor` as a join `tableBooking` as book on a.`userName` = book.`tutorID` GROUP BY a.`userName`) as b on tutor.`userName` = b.`userName` GROUP BY  tutor.userName ORDER BY rating DESC LIMIT ?", [limit], function (err, resultTutor) {
            const resultDetails = JSON.parse(JSON.stringify(resultTutor));

            if (err) {
                connectNow.end();
                throw err;
            } else {
                connectNow.query("SELECT * FROM `tableCourseList`", [], function (err, courselist) {
                    connectNow.end();
                    if (err) {
                        throw err;
                    } else {
                        const courses = JSON.parse(JSON.stringify(courselist));
                        res.render("listing", {tutors: resultDetails, courses: courses});
                    }
                });
                // DB connection to get course list to display in dropdown
            }
        });
});

router.get('/search', function (req, res) {

    const id = req.body.search;
    const connectNow = con.method();
    connectNow.connect(function (err) {
        if (err) throw err;
        console.log("Connected and online (Tutor Profile)!");
    });
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
    connectNow.query("SELECT * FROM tableCapabilities LIMIT ?"
        , [limit], function (err, resultTutor) {
            const resultDetails = JSON.parse(JSON.stringify(resultTutor));
            const courses = Array.from(new Set(resultDetails.map(function (p1) { return p1.courseID;  })));
            console.log(courses);
            connectNow.end();
            if (err) {
                throw err;
            } else {
                // DB connection to get course list to display in dropdown
                res.render("listing", {cap: resultDetails, courses: courses});
            }
        });
});


module.exports = router;
