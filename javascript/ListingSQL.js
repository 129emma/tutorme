const con = require("./connection");

function listingSQLDEC(connectNow,limit,subject) {
    var connection= false;
    if (connectNow === undefined){
        console.log("No connection, now making one");
        const connectNow = con.method();
        connectNow.connect(function (err) {
            if (err) {
                connectNow.end();
                throw err
            }
            connection = true
        });
    }
    //the limit for number of display per page
    const promise = new Promise(function (resolve, reject) {
        var initalQuery = "SELECT tutor.`userName`, tutor.`selfIntroduction`, GROUP_CONCAT(distinct cap.`courseID`) as courses, GROUP_CONCAT( cap.`grade`) as grades, b.rating FROM `tableTutor` as tutor inner join `tableCapabilities` as cap on tutor.`userName` = cap.`userName` join( SELECT a.`userName`, COALESCE(AVG(book.`tuteeRating`),0) as rating FROM `tableTutor` as a join `tableBooking` as book on a.`userName` = book.`tutorID` GROUP BY a.`userName`) as b on tutor.`userName` = b.`userName` GROUP BY  tutor.userName ORDER BY rating DESC LIMIT ?";
        var preparedStatments = [limit];
        if (subject !== undefined && subject !== null && subject !==""){
            console.log("there is an subject");
            initalQuery = "SELECT tutor.`userName`, tutor.`selfIntroduction`, GROUP_CONCAT(distinct cap.`courseID`) as courses, GROUP_CONCAT( cap.`grade`) as grades, b.rating FROM `tableTutor` as tutor inner join `tableCapabilities` as cap on tutor.`userName` = cap.`userName` join( SELECT a.`userName`, COALESCE(AVG(book.`tuteeRating`),0) as rating FROM `tableTutor` as a join `tableBooking` as book on a.`userName` = book.`tutorID` GROUP BY a.`userName`) as b on tutor.`userName` = b.`userName` WHERE cap.`courseID` = ? GROUP BY  tutor.userName ORDER BY rating DESC LIMIT ?";
            preparedStatments =[subject, limit]
        }

        connectNow.query(initalQuery, preparedStatments, function (err, resultTutor) {
            if (connection){
                connectNow.end()
            }
            if (err) {
                connectNow.end();
                throw err;
            } else {
                // DB connection to get course list to display in dropdown
                const resultDetails = JSON.parse(JSON.stringify(resultTutor));
                // res.render("listing", {tutors: resultDetails, courses: courses});
                console.log(resultDetails);
                resolve(resultDetails);
            }
        });
    });
    return promise;
}


function allTableCourseListing(connectNow) {
    var connection= false;
    if (connectNow === undefined){
        console.log("No connection, now making one");
        const connectNow = con.method();
        connectNow.connect(function (err) {
            if (err) {
                connectNow.end();
                throw err
            }
        });
        connection = true
    }
    const promise = new Promise(function (resolve, reject) {
        connectNow.query("SELECT * FROM `tableCourseList`", [], function (err, courselist) {
            if (connection){
                connectNow.end()
            }
            if (err) {
                connectNow.end();
                throw err;
            } else {

                // DB connection to get course list to display in dropdown
                const courses = JSON.parse(JSON.stringify(courselist));
                // res.render("listing", {tutors: resultDetails, courses: courses});
                console.log(courses);
                resolve(courses);
            }
        });
    });
    return promise;
}
function joinedSQLListingCall(limit, subject) {
    const connectNow = con.method();
    connectNow.connect(function (err) {
        if (err) {
            connectNow.end();
            throw err
        }
    });
    const promise = new Promise(function (resolve, reject) {
        const promiseForListing = listingSQLDEC(connectNow, limit,subject);
        const promiseForAllcourses =allTableCourseListing(connectNow);
        Promise.all([promiseForListing, promiseForAllcourses]).then(function (value) {
            connectNow.end();
            // res.render("listing", {tutors: value[0], courses: value[1]});
            console.log("resolved");
            resolve({tutors: value[0], courses: value[1]});
        });
    });
    return promise;
}

function singleCap(connectNow , username) {
    var connection= false;
    if (connectNow === undefined){
        console.log("No connection, now making one");
        connectNow = con.method();
        connectNow.connect(function (err) {
            if (err) {
                connectNow.end();
                throw err
            }
        });
        connection = true
    }
    const promise = new Promise(function (resolve, reject) {
        connectNow.query("SELECT courseID FROM `tableCapabilities` WHERE username = ?", [username], function (err, courselist) {
            if (connection){
                connectNow.end()
            }
            if (err) {
                connectNow.end();
                throw err;
            } else {

                // DB connection to get course list to display in dropdown
                const courses = JSON.parse(JSON.stringify(courselist));
                // res.render("listing", {tutors: resultDetails, courses: courses});
                console.log(courses);
                resolve(courses);
            }
        });
    });
    return promise;
}

module.exports = {listingSQLDEC: listingSQLDEC, allTableCourses: allTableCourseListing, joinedSQLListingCall : joinedSQLListingCall, singleTutorCap : singleCap};

