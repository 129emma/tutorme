const con = require("./connection");
const mysql = require("mysql");
function insertDate(date,username,timeTable) {
    const connectNow = con.method();
    const promise = new Promise(function (resolve, reject) {
        connectNow.connect(function (err) {
            if (err) {
                connectNow.end();
                throw err;
            }
            const ListToInsert = [];
            for(var i = 0; i< date.length; i++){
                const oneObject = [username, date[i],0,0,1];
                ListToInsert.push(oneObject);
            }
            console.log(ListToInsert);
            connectNow.query("INSERT INTO "+(String(mysql.escape(timeTable))).replace(/'/g," ")+ " (userName, timeStart, day, occupation, bookingID) VALUES ?", [ListToInsert], function (err, result) {
                connectNow.end();
                console.log('Yeah');
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
            for(var i = 0; i < date.length; i++) {
                const oneObject = [username, date[i]];
                ListToDelete.push(oneObject)
            }

            connectNow.query(" DELETE FROM " + timeTable + " WHERE (username, timeStart) IN (?)", [ListToDelete], function(err, result) {
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

module.exports = {Insert: insertDate, Delete: deleteDate};