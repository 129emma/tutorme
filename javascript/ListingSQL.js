const con = require("./connection");

function listingSQLDEC(limit,subject) {

    const connectNow = con.method();
    //the limit for number of display per page
    const promise = new Promise(function (resolve, reject) {
        connectNow.connect(function (err) {
            if (err) {
                connectNow.end();
                throw err;
            }
        });

        var initalQuery = "SELECT tutor.`userName`, tutor.`selfIntroduction`, GROUP_CONCAT(distinct cap.`courseID`) as courses, GROUP_CONCAT( cap.`grade`) as grades, b.rating FROM `tableTutor` as tutor inner join `tableCapabilities` as cap on tutor.`userName` = cap.`userName` join( SELECT a.`userName`, COALESCE(AVG(book.`tuteeRating`),0) as rating FROM `tableTutor` as a join `tableBooking` as book on a.`userName` = book.`tutorID` GROUP BY a.`userName`) as b on tutor.`userName` = b.`userName` GROUP BY  tutor.userName ORDER BY rating DESC LIMIT ?";
        var preparedStatments = [limit];
        if (subject !== undefined){
            initalQuery = "SELECT tutor.`userName`, tutor.`selfIntroduction`, GROUP_CONCAT(distinct cap.`courseID`) as courses, GROUP_CONCAT( cap.`grade`) as grades, b.rating FROM `tableTutor` as tutor inner join `tableCapabilities` as cap on tutor.`userName` = cap.`userName` join( SELECT a.`userName`, COALESCE(AVG(book.`tuteeRating`),0) as rating FROM `tableTutor` as a join `tableBooking` as book on a.`userName` = book.`tutorID` GROUP BY a.`userName`) as b on tutor.`userName` = b.`userName` GROUP BY  tutor.userName ORDER BY rating DESC LIMIT ? WHERE cap.`courseID` = ?";
            preparedStatments =[limit, subject]
        }

        connectNow.query(initalQuery, preparedStatments, function (err, resultTutor) {
            connectNow.end();
            if (err) {
                connectNow.end();
                throw err;
            } else {
                // DB connection to get course list to display in dropdown
                const resultDetails = JSON.parse(JSON.stringify(resultTutor));
                // res.render("listing", {tutors: resultDetails, courses: courses});
                resolve(resultDetails);
            }
        });
    });
    return promise;
}


function allTableCourseListing() {
    const promise = new Promise(function (resolve, reject) {
        const connectNow = con.method();
        connectNow.connect(function (err) {
            if (err) throw err;

        });
        connectNow.query("SELECT * FROM `tableCourseList`", [], function (err, courselist) {
            connectNow.end();
            if (err) {
                throw err;
            } else {
                // DB connection to get course list to display in dropdown
                const courses = JSON.parse(JSON.stringify(courselist));
                // res.render("listing", {tutors: resultDetails, courses: courses});
                resolve(courses);
            }
        });
    });
    return promise;
}

module.exports = {listingSQLDEC: listingSQLDEC, allTableCourses: allTableCourseListing};

