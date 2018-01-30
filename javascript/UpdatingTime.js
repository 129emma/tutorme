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

function bookingAvailableTime(json) {
    const connectNow = con.method();
    console.log("booking an ava time");
    console.log(json);
    const promise = new Promise(function (resolve, reject) {
        connectNow.connect(function (err) {
                if (err) {
                    connectNow.end();
                    throw err;
                }

                connectNow.beginTransaction(function (err) {
                        if (err) {
                            connectNow.end();
                            throw err;
                        }
                        // "INSERT INTO `tableBooking` (`bookingID`, `tuteeID`, `tutorID`, `courseID`, `description`, `location`, `totalPrice`, `complete`, `tutorFeedback`, `tutorRating`, `tuteeFeedback`, `tuteeRating`) VALUES (NULL, ?, ?, ?, NULL, NULL,(SELECT `AUTO_INCREMENT` FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'tableBooking'), 0, NULL, NULL, NULL, NULL);"

                        for (var i = 0; i < json.length; i++) {
                            const jsonObject = JSON.parse(JSON.stringify(json[i]));
                            const time = new Date(jsonObject.time);
                            time.setTime(time.getTime() - time.getTimezoneOffset() * 60 * 1000);
                            delete  jsonObject.time;
                            connectNow.query("INSERT INTO `tableBooking` SET ?", jsonObject, function (error, results, fields) {
                                console.log(results);
                                if (error) {
                                    return connectNow.rollback(function () {
                                        connectNow.end();
                                        throw error;
                                    });
                                }
                            })
                            // date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
                            connectNow.query("INSERT INTO `tableTimeOccupation` (`bookingID`,`timeID`) VALUES(LAST_INSERT_ID(),(SELECT `timeID` FROM tableTime WHERE tableTime.timeStart =? AND tableTime.userName = ?));", [time, jsonObject.tutorID], function (error, results, fields) {
                                if (error) {
                                    console.log(time);
                                    console.log(i);
                                    return connectNow.rollback(function () {
                                        connectNow.end();
                                        throw error;
                                    });
                                }
                            });
                        };
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
                    }
                )
            }
        )
        ;
    })
    return promise;
}

function deleteAppointment(bookID) {
    console.log("delete connection");
    const connectNow = con.method();
    const promise = new Promise(function (resolve, reject) {
        connectNow.connect(function (err) {
            if (err) {
                connectNow.end();
                reject(err);
                throw err;
            }
            connectNow.beginTransaction(function (err) {
                if (err) {
                    connectNow.end();
                    reject(err);
                    throw err;
                }
                connectNow.query("DELETE FROM `tableTimeOccupation` WHERE tableTimeOccupation.bookingID = ?", [bookID], function (error, results, fields) {

                    console.log(results.affectedRows);
                    if (results.affectedRows < 1) {
                        console.log("less than one row is affected");
                        reject("less than one row is affected");
                    }
                    if (error) {
                        return connectNow.rollback(function () {
                            connectNow.end();
                            reject(error);
                            throw error;
                        });
                    }
                    console.log("Q 1");
                    connectNow.query("DELETE FROM `tableBooking` WHERE tableBooking.bookingID = ?;", [bookID], function (error, results, fields) {
                        console.log(results);
                        if (results.affectedRows < 1) {
                            console.log("less than one row is affected");
                            reject("less than one row is affected");
                        }
                        if (error) {
                            return connectNow.rollback(function () {
                                connectNow.end();
                                reject(error);
                                throw error;
                            });
                        }
                    });
                    console.log(results.affectedRows);
                    connectNow.commit(function (err) {
                        if (err) {
                            return connectNow.rollback(function () {
                                connectNow.end();
                                reject(err);
                                throw err;
                            });
                        }
                        console.log("done deleting");
                        connectNow.end();
                        resolve()
                    })
                })
            });
        })
    });
}

function updateAppoint(time, updateJSON, bookingID, tutorID) {
    console.log("update connection");
    console.log(time);
    console.log(bookingID)
    const connectNow = con.method();
    const promise = new Promise(function (resolve, reject) {
        connectNow.connect(function (err) {
            if (err) {
                connectNow.end();
                reject(err);
                throw err;
            }
            connectNow.beginTransaction(function (err) {
                if (err) {
                    connectNow.end();
                    reject(err);
                    throw err;
                }
                connectNow.query("UPDATE `tableTimeOccupation` SET timeID=(SELECT timeID FROM `tableTime` WHERE timeStart=? AND userName=?) WHERE bookingID=?", [time, tutorID, bookingID], function (error, results, fields) {
                    console.log(results);
                    // console.log(results.affectedRows);
                    // if (results.affectedRows < 1){
                    //     console.log("less than one row is affected");
                    //     reject("less than one row is affected");
                    // }
                    if (error) {
                        return connectNow.rollback(function () {
                            connectNow.end();
                            reject(error);
                            throw error;
                        });
                    }
                    console.log("Q 1");
                    connectNow.query("UPDATE `tableBooking` SET ? WHERE bookingID=?", [updateJSON, bookingID], function (error, results, fields) {
                        // console.log(results);
                        // if (results.affectedRows < 1){
                        //     console.log("less than one row is affected");
                        //     reject("less than one row is affected");
                        // }
                        if (error) {
                            return connectNow.rollback(function () {
                                connectNow.end();
                                reject(error);
                                throw error;
                            });
                        }
                    });
                    console.log(results);
                    connectNow.commit(function (err) {
                        if (err) {
                            return connectNow.rollback(function () {
                                connectNow.end();
                                reject(err);
                                throw err;
                            });
                        }
                        console.log("done updating");
                        connectNow.end();
                        resolve();
                    })
                })
            });
        })
    });
    return promise;
}

function convert(date) {
    console.log(date);
    console.log(mysql.escape(date));
    console.log(String(date));
    console.log(mysql.escape(String(date)));
    var Clickdate = date;

    console.log(date);
    console.log(mysql.escape(date));
    console.log(String(date));
    console.log(mysql.escape(String(date)));
}

module.exports = {
    Insert: insertDate,
    Delete: deleteDate,
    bookingAvailableTime: bookingAvailableTime,
    deleteAppointment: deleteAppointment,
    updateAppointment: updateAppoint
};