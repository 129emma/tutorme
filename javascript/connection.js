// getting the MySQL functionality
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "db.sporadic.nz",
    port: 3306,
    user: "tutorme",
    password: "changeme",
    database: "tutorme",
});

module.exports = con;
