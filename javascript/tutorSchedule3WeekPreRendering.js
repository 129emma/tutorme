const con = require("./connection.js");
const mysql = require("mysql")
// function preRendering(date) {
//     const tutor = {
//         "userName": ["Vanie"],
//         "idAvailable": [],
//         "idBooked": [],
//         "course": [],
//         "tutee": [],
//         "location": [],
//         "weekthis": []
//     };
//     var today;
//     (date === undefined) ? today = new Date() : today = new Date(date);
//     console.log("date is " + today)
//     const initial = new Date(today.getFullYear(), today.getMonth(), (today.getDate() - (today.getDay() - 2) - 7), -11);
//     const end = new Date(today.getFullYear(), today.getMonth(), (today.getDate() + (7 - today.getDay() + 1) + 7), -11);
//     const connectNow = con.method();
//     const promise = new Promise(function (resolve, reject) {
//         connectNow.connect(function (err) {
//             if (err) {
//                 connectNow.end();
//                 throw err;
//             }
//             connectNow.query("SELECT userName, timeStart, day FROM tableTime Where timeStart>=? AND timeStart<=?", [initial, end], function (err, result) {
//                 connectNow.end();
//                 console.log('Yeah');
//                 if (err) {
//                     connectNow.end();
//                     throw err;
//                 } else {
//                     rawOject = JSON.parse(JSON.stringify(result));
//                     rawOject.map(function (value) {
//                         value.timeStart = new Date(value.timeStart);
//                         tutor.weekthis.push(value.timeStart)
//                     });
//
//                 }
//                 // console.log(tutor);
//                 resolve(tutor);
//             })
//         })
//
//     });
//     return promise;
// }

function renderingOneweek(date,username,timeTable,whatWanted) {
    // var listing =[];
    var today;
    const tutor = {
        "userName": [username],
        "idAvailable": [],
        "idBooked": [],
        "course": [],
        "tutee": [],
        "location": [],
        "weekthis": []
    };
    (date === undefined) ? today = new Date() : today = new Date(date);
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), (today.getDate() - (today.getDay() - 2)), -11);
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), (today.getDate() + (7 - today.getDay() + 1)), -11);
    const connectNow = con.method();
    const promise = new Promise(function (resolve, reject) {
        connectNow.connect(function (err) {
            if (err) {
                connectNow.end();
                throw err;
            }
            connectNow.query("SELECT "+(String(mysql.escape(whatWanted))).replace(/'/g," ")+" FROM "+(String(mysql.escape(timeTable))).replace(/'/g," ")+" Where timeStart>=? AND timeStart<=? AND username=?", [startOfWeek, endOfWeek,username], function (err, result) {
                connectNow.end();
                console.log('Yeah');
                if (err) {
                    connectNow.end();
                    throw err;
                } else {
                    rawOject = JSON.parse(JSON.stringify(result));
                    rawOject.map(function (value) {
                        value.timeStart = new Date(value.timeStart);
                        // value.timeStart = new Date(value.timeStart);
                        tutor.weekthis.push(value.timeStart)
                    });
                    console.log(rawOject)
                }
                // console.log(tutor);
                resolve(tutor);

            })

        })

    });
    return promise;
}



module.exports = {Oneweek: renderingOneweek};