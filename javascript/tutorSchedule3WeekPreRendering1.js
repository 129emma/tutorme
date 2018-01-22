const con = require("./connection.js");
const mysql = require("mysql");

function renderingOneweek(connectNow, startOfWeek, endOfWeek, username, timeTable, whatWanted) {
    var connection = false;
    if (connectNow === undefined) {
        console.log("making connection in one week");
        connectNow = con.method();
        connectNow.connect(function (err) {
            if (err) {
                connectNow.end();
                throw err;
            }
        });
        connection = true;
    }
    console.log("one week");
    var today;
    // (date === undefined) ? today = new Date() : today = new Date(date);
    // var startOfWeek = new Date(today.getFullYear(), today.getMonth(), (today.getDate() - (today.getDay() - 2) - 1));
    // const endOfWeek = new Date(today.getFullYear(), today.getMonth(), (today.getDate() + (7 - today.getDay() + 1)));
    // console.log("Start date: "+ startOfWeek);
    // console.log("End date: "+ endOfWeek);
    const promise = new Promise(function (resolve, reject) {
        connectNow.query("SELECT " + (String(mysql.escape(whatWanted))).replace(/'/g, " ") + " FROM " + (String(mysql.escape(timeTable))).replace(/'/g, " ") + " Where timeStart>=? AND timeStart<=? AND username=?", [startOfWeek, endOfWeek, username], function (err, result) {
            if (connection) {
                connectNow.end();
            }
            if (err) {
                connectNow.end();
                throw err;
            } else {
                rawOject = JSON.parse(JSON.stringify(result));
                //console.log(rawOject);
                rawOject.map(function (value) {
                    value.timeStart = new Date(value.timeStart);
                });
                // console.log(rawOject);
                resolve(rawOject);
            }
        })
    });
    //console.log("Tutor " + tutor);
    return promise;
};

function tutorBooked(connectNow, startOfWeek, endOfWeek, username, timeTable, whatWanted) {
    var connection = false;
    if (connectNow === undefined) {
        connectNow = con.method();
        connectNow.connect(function (err) {

            if (err) {
                connectNow.end();
                throw err;
            }
        });
        console.log("tutor booked connection");
        connection = true;
    }
    console.log("tutor booked");
    const promise = new Promise(function (resolve, reject) {
        connectNow.query("SELECT tableBooking.tuteeID, tableBooking.tutorID, tableBooking.courseID, tableBooking.location, tableTime.timeStart, tableTimeOccupation.bookingID  FROM tableBooking, tableTime, tableTimeOccupation WHERE tableTimeOccupation.timeID = tableTime.timeID AND tableTimeOccupation.bookingID = tableBooking.bookingID And tableTime.timeStart>=? AND tableTime.timeStart<=? AND tableTime.username=?", [startOfWeek, endOfWeek, username], function (err, result) {
            if (connection) {
                connectNow.end();
            }
            if (err) {
                connectNow.end();
                throw err;
            } else {
                //console.log(result);
                rawObject = JSON.parse(JSON.stringify(result));
                //console.log(rawObject);
                rawObject.map(function (value) {
                    value.timeStart = new Date(value.timeStart);
                });
                //console.log(rawObject);
                resolve(rawObject)
            }
        })
    });
    return promise;
};

function tuteeSQLBookingCall(connectNow, startOfWeek, endOfWeek, username, timeTable, whatWanted) {
    //var bookingID = 1;
    var connection = false;
    if (connectNow === undefined) {
        connectNow = con.method();
        connectNow.connect(function (err) {
            if (err) {
                connectNow.end();
                throw err;
            }
        });
        connection = true;
    }
    ;
    var today;
    console.log("tuteeSQL");
    // (date === undefined) ? today = new Date() : today = new Date(date);
    // var startOfWeek = new Date(today.getFullYear(), today.getMonth(), (today.getDate() - (today.getDay() - 2) - 1));
    // const endOfWeek = new Date(today.getFullYear(), today.getMonth(), (today.getDate() + (7 - today.getDay() + 1)));
    // console.log("Start date: "+ startOfWeek);
    // console.log("End date: "+ endOfWeek);
    const promise = new Promise(function (resolve, reject) {
        connectNow.query("SELECT tableBooking.tuteeID, tableBooking.tutorID, tableBooking.courseID, tableBooking.location, tableTime.timeStart, tableTimeOccupation.bookingID  FROM tableBooking, tableTime, tableTimeOccupation WHERE tableTimeOccupation.timeID = tableTime.timeID AND tableTimeOccupation.bookingID = tableBooking.bookingID And tableTime.timeStart>=? AND tableTime.timeStart<=? AND tableBooking.tuteeID=?", [startOfWeek, endOfWeek, username], function (err, result) {
            if (connection) {
                connectNow.end();
            }
            if (err) {
                connectNow.end();
                throw err;
            } else {
                //console.log(result);
                rawObject = JSON.parse(JSON.stringify(result));
                //console.log(rawObject);
                rawObject.map(function (value) {
                    value.timeStart = new Date(value.timeStart);
                })
            }
            //console.log(rawOject);
            resolve(rawObject);
        });
    });
    return promise;
}


function JoinedScheduleCalls(ListOfPromises, connectNow, date, username, timeTable, whatWanted) {
    console.log(ListOfPromises.length);
    console.log("joined");
    (date === undefined) ? today = new Date() : today = new Date(date);
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), (today.getDate() - (today.getDay() - 2) - 1));
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), (today.getDate() + (7 - today.getDay() + 1)));
    console.log(startOfWeek);
    console.log(endOfWeek);
    for (var i = 0; i < ListOfPromises.length; i++) {
        ListOfPromises[i] = ListOfPromises[i](connectNow, startOfWeek, endOfWeek, username, timeTable, whatWanted);
        console.log(typeof ListOfPromises[i]);
    }
    ;
    console.log(ListOfPromises);
    const promise = new Promise(function (resolve, reject) {
        Promise.all(ListOfPromises).then(function (value) {
            console.log(value)
            if (connectNow !== undefined) {
                connectNow.end();
            }
            console.log("joined done!!");
            console.log(value);
            const tutor = {
                "userName": [],
                "bookedTime": [],
                "course": [],
                "tutee": [],
                "tutor": [],
                "location": [],
                "availableTime": [],
                "bookingID": []
            };

            for (var i = 0; i < value[0].length; i++) {
                tutor.availableTime.push(String(value[0][i].timeStart))
            }
            if (value.length > 1) {
                for (var i = 0; i < value[1].length; i++) {
                    const numbering = (tutor.availableTime.indexOf(String(value[1][i].timeStart)));
                    tutor.availableTime.splice(numbering, 1);
                }
                value[1].map(function (value) {
                    tutor.bookedTime.push(value.timeStart);
                    tutor.location.push(value.location);
                    tutor.course.push(value.courseID);
                    tutor.tutor.push(value.tutorID);
                    tutor.tutee.push(value.tuteeID);
                    tutor.bookingID.push(value.bookingID)
                });
            }
            console.log("rendering of tutor");
            resolve(tutor);
        });
    });
    return promise;
}

module.exports = {
    Oneweek: renderingOneweek,
    tutorbooked: tutorBooked,
    tuteeSQLBookingCall: tuteeSQLBookingCall,
    joinedScheduleCalls: JoinedScheduleCalls
};