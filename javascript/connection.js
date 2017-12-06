// getting the MySQL functionality
var mysql = require('mysql');

// var con = mysql.createConnection({
//     host: "db.sporadic.nz",
//     port: 3306,
//     user: "tutorme",
//     password: "changeme",
//     database: "tutorme",
// });

function connectNow () {
    const con = mysql.createConnection({
        host: "db.sporadic.nz",
        port: 3306,
        user: "tutorme",
        password: "changeme",
        database: "tutorme",
    });
    return con;
}

module.exports = {
    // "connection": con,
    "method": connectNow
};
