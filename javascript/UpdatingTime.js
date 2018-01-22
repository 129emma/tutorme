const con = require("./connection");
const mysql = require("mysql");

function insertDate(date, username, timeTable) {
    const connectNow = con.method();
    const promise = new Promise(function (resolve, reject) {
        connectNow.connect(function (err) {
            if (err) {
                connectNow.end();
                throw err;
            }
            const ListingOfInformation = [];
            for (var i = 0; i < date.length; i++) {
                const oneObject = [username, date[i], 0, 0];
                ListingOfInformation.push(oneObject);
            }
            console.log(ListingOfInformation);
            connectNow.query("INSERT INTO " + (String(mysql.escape(timeTable))).replace(/'/g, " ") + " (userName, timeStart, day, occupation) VALUES ?", [ListingOfInformation], function (err, result) {
                connectNow.end();

                if (err) {
                    connectNow.end();
                    throw err;
                } else {
                    console.log(result)
                }
                // console.log(tutor);
                resolve(result);

            })

        })

    });
    return promise;
};

function deleteDate(date, username, timeTable) {
    const connectNow = con.method();
    const promise = new Promise(function (resolve, reject) {
        connectNow.connect(function (err) {
            if (err) {
                connectNow.end();
                throw err;
            }
            const ListToDelete = [];
            for (var i = 0; i < date.length; i++) {
                const oneObject = [username, date[i]];
                ListToDelete.push(oneObject);
            }
            connectNow.query(" DELETE FROM " + timeTable + " WHERE (username,timeStart)IN (?)", [ListToDelete], function (err, result) {
                connectNow.end();
                if (err) {

                    connectNow.end();
                    throw err;
                } else {
                    console.log(result);
                }
                resolve(result);
            })
        })
    })
    return promise;
};

function bookingAvailableTime(date, tutee, tutor, course) {
    const connectNow = con.method();
    const promise = new Promise(function (resolve, reject) {
        connectNow.connect(function (err) {
            if (err) {
                connectNow.end();
                throw err;
            }

            // BEGIN; INSERT INTO `tableBooking` (`bookingID`, `tuteeID`, `tutorID`, `courseID`, `description`, `location`, `totalPrice`, `complete`, `tutorFeedback`, `tutorRating`, `tuteeFeedback`, `tuteeRating`) VALUES (NULL, tutee, tutor, course, NULL, NULL,(SELECT `AUTO_INCREMENT` FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'tableBooking'), '0', NULL, NULL, NULL, NULL); INSERT INTO `tableTimeOccupation` (`timeID`,`bookingID`) VALUES(418,LAST_INSERT_ID()); COMMIT;

//BEGIN; INSERT INTO `tableBooking` (`bookingID`, `tuteeID`, `tutorID`, `courseID`, `description`, `location`, `totalPrice`, `complete`, `tutorFeedback`, `tutorRating`, `tuteeFeedback`, `tuteeRating`) VALUES (NULL, "1", "jojo", "LAW 121", NULL, NULL,(SELECT `AUTO_INCREMENT` FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'tableBooking'), '0', NULL, NULL, NULL, NULL); INSERT INTO `tableTimeOccupation` (`timeID`,`bookingID`) VALUES(418,LAST_INSERT_ID()); COMMIT;
            //BEGIN; INSERT INTO `tableBooking` (`bookingID`, `tuteeID`, `tutorID`, `courseID`, `description`, `location`, `totalPrice`, `complete`, `tutorFeedback`, `tutorRating`, `tuteeFeedback`, `tuteeRating`) VALUES (NULL, ?, "jojo", "LAW 121", NULL, NULL,(SELECT `AUTO_INCREMENT` FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'tableBooking'), '0', NULL, NULL, NULL, NULL); INSERT INTO `tableTimeOccupation` (`timeID`,`bookingID`) VALUES((SELECT `timeID` FROM tableTime WHERE timeStart = "2018-01-24 14:00:00"),LAST_INSERT_ID()); COMMIT;

            connectNow.beginTransaction(function (err) {
                if (err) {
                    connectNow.end();
                    throw err;
                }
                connectNow.query("INSERT INTO `tableBooking` (`bookingID`, `tuteeID`, `tutorID`, `courseID`, `description`, `location`, `totalPrice`, `complete`, `tutorFeedback`, `tutorRating`, `tuteeFeedback`, `tuteeRating`) VALUES (NULL, ?, ?, ?, NULL, NULL,(SELECT `AUTO_INCREMENT` FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'tableBooking'), 0, NULL, NULL, NULL, NULL);", [tutee, tutor, course], function (error, results, fields) {
                    if (error) {
                        return connectNow.rollback(function () {
                            connectNow.end();
                            throw error;
                        });
                    }
                    date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
                    connectNow.query("INSERT INTO `tableTimeOccupation` (`bookingID`,`timeID`) VALUES(LAST_INSERT_ID(),(SELECT `timeID` FROM tableTime WHERE timeStart ="+ mysql.escape(date)+" AND tableTime.userName = ?));",[tutor], function (error, results, fields) {
                        if (error) {
                            return connectNow.rollback(function () {
                                connectNow.end();
                                throw error;
                            });
                        }
                    });
                    connectNow.commit(function (err) {
                        if (err) {
                            return connectNow.rollback(function () {
                                connectNow.end();
                                throw err;
                            });
                        }
                        console.log("done");
                        connectNow.end();
                        resolve()
                    })
                    })
                });
            })
        });
}
function convert(date) {
    console.log(date);
    console.log(mysql.escape(date));
    console.log(String(date));
    console.log(mysql.escape(String(date)));
    var  Clickdate = date;

    console.log(date);
    console.log(mysql.escape(date));
    console.log(String(date));
    console.log(mysql.escape(String(date)));
}
module.exports = {Insert: insertDate, Delete: deleteDate, bookingAvailableTime: bookingAvailableTime, convert:convert};