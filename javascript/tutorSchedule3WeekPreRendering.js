const con = require("./connection.js");
const mysql = require("mysql")

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
    var startOfWeek = new Date(today.getFullYear(), today.getMonth(), (today.getDate() - (today.getDay() - 2)-1));
    // startOfWeek.setTime( startOfWeek.getTime() - startOfWeek.getTimezoneOffset()*60*1000 );
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), (today.getDate() + (7 - today.getDay() + 1)));
    console.log("Start date: "+ startOfWeek);
    console.log("End date: "+ endOfWeek);
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
                    // console.log(rawOject)
                }
                // console.log(tutor);
                resolve(tutor);

            })

        })

    });
    return promise;
}



module.exports = {Oneweek: renderingOneweek};