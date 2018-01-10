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
            const ListingOfInformation = [];
            for(var i = 0; i< date.length; i++){
                const oneObject = [username, date[i],0,0];
                ListingOfInformation.push(oneObject);
            }
            console.log(ListingOfInformation);
            connectNow.query("INSERT INTO "+(String(mysql.escape(timeTable))).replace(/'/g," ")+ " (userName, timeStart, day, occupation) VALUES ?", [ListingOfInformation], function (err, result) {
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
            const ListToDelete =[];
            for(var i=0; i< date.length; i++){
                const oneObject = [username, date[i]];
                ListToDelete.push(oneObject);
            }
            connectNow.query(" DELETE FROM " + timeTable + " WHERE (username,timeStart)IN (?)", [ListToDelete], function(err, result) {
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