const con = require("./connection.js");
const mysql = require("mysql")

function renderingOneweek(date,username,timeTable,whatWanted) {

    //var bookingID = 1;
    var today;
    const tutor = {
        "userName": [username],
        "bookedTime": [],
        "course": [],
        "tutee": [],
        "location": [],
        "availableTime": [],
        "bookingID": [],
    };

    (date === undefined) ? today = new Date() : today = new Date(date);
    var startOfWeek = new Date(today.getFullYear(), today.getMonth(), (today.getDate() - (today.getDay() - 2)-1));
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), (today.getDate() + (7 - today.getDay() + 1)));
    // console.log("Start date: "+ startOfWeek);
    // console.log("End date: "+ endOfWeek);
    const connectNow = con.method();
    const promise = new Promise(function (resolve, reject) {
        connectNow.connect(function (err) {
            if (err) {
                connectNow.end();
                throw err;
            }
            connectNow.query("SELECT "+(String(mysql.escape(whatWanted))).replace(/'/g," ")+" FROM "+(String(mysql.escape(timeTable))).replace(/'/g," ")+" Where timeStart>=? AND timeStart<=? AND username=?", [startOfWeek, endOfWeek,username], function (err, result) {

                if (err) {
                    connectNow.end();
                    throw err;
                } else {
                    rawOject = JSON.parse(JSON.stringify(result));
                    //console.log(rawOject);
                    rawOject.map(function (value) {
                        value.timeStart = new Date(value.timeStart);
                        tutor.availableTime.push(value.timeStart);

                    });
                }

                //console.log("Tutor " + tutor);
            })
            connectNow.query("SELECT tableBooking.tuteeID, tableBooking.courseID, tableBooking.location, tableTime.timeStart, tableTimeOccupation.bookingID  FROM tableBooking, tableTime, tableTimeOccupation WHERE tableTimeOccupation.timeID = tableTime.timeID AND tableTimeOccupation.bookingID = tableBooking.bookingID And tableTime.timeStart>=? AND tableTime.timeStart<=?",[startOfWeek, endOfWeek] ,function (err, result) {
                if (err) {
                    connectNow.end();
                    throw err;
                } else {
                    //console.log(result);
                    rawObject = JSON.parse(JSON.stringify(result));
                    //console.log(rawObject);
                    rawObject.map(function (value) {

                        value.timeStart = new Date(value.timeStart);
                        tutor.bookedTime.push(value.timeStart);
                        tutor.location.push(value.location);
                        tutor.course.push(value.courseID);
                        tutor.tutee.push(value.tuteeID);
                        tutor.bookingID.push(value.bookingID)
                    })
                }
                //console.log("Tutor " + tutor.weekthis + " " + tutor.course +" " + tutor.tutee +" " + tutor.location +" "+ tutor.bookedTime);
                resolve(tutor);
            });
            connectNow.end();
        })
    });
    return promise;
}
function tuteeSQLBookingCall (date,username,timeTable,whatWanted){
        //var bookingID = 1;
        var today;
        const tutor = {
            "userName": [username],
            "bookedTime": [],
            "course": [],
            "tutee": [],
            "location": [],
            "availableTime": [],
            "bookingID": []
        };

        (date === undefined) ? today = new Date() : today = new Date(date);
        var startOfWeek = new Date(today.getFullYear(), today.getMonth(), (today.getDate() - (today.getDay() - 2)-1));
        const endOfWeek = new Date(today.getFullYear(), today.getMonth(), (today.getDate() + (7 - today.getDay() + 1)));
        // console.log("Start date: "+ startOfWeek);
        // console.log("End date: "+ endOfWeek);
        const connectNow = con.method();
        const promise = new Promise(function (resolve, reject) {
            connectNow.connect(function (err) {
                if (err) {
                    connectNow.end();
                    throw err;
                }
                connectNow.query("SELECT tableBooking.tuteeID, tableBooking.courseID, tableBooking.location, tableTime.timeStart, tableTimeOccupation.bookingID  FROM tableBooking, tableTime, tableTimeOccupation WHERE tableTimeOccupation.timeID = tableTime.timeID AND tableTimeOccupation.bookingID = tableBooking.bookingID And tableTime.timeStart>=? AND tableTime.timeStart<=? AND tableBooking.tuteeID=?",[startOfWeek, endOfWeek,username] ,function (err, result) {
                    if (err) {
                        connectNow.end();
                        throw err;
                    } else {
                        //console.log(result);
                        rawObject = JSON.parse(JSON.stringify(result));
                        //console.log(rawObject);
                        rawObject.map(function (value) {

                            value.timeStart = new Date(value.timeStart);
                            tutor.bookedTime.push(value.timeStart);
                            tutor.location.push(value.location);
                            tutor.course.push(value.courseID);
                            tutor.tutee.push(value.tuteeID);
                            tutor.bookingID.push(value.bookingID)
                        })
                    }
                    resolve(tutor);
                });
                connectNow.end();
            })
        });
        return promise;
}
module.exports = {Oneweek: renderingOneweek, tuteeSQLBookingCall: tuteeSQLBookingCall};