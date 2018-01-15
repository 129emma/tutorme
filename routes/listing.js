/**
 * Created by Administer on 16/01/2018.
 */
const con = require("../javascript/connection");
const sql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();


router.post('/', function (req, res) {

    const connectMethod = con.method();
    connectMethod.connect(function (err) {
        if (err) throw err;
        console.log("Connected and online!");
    });


    const query = req.body.query;
    console.log(query);
    connectMethod.query(query, [], function (err, result) {
        connectMethod.end();
        if (err) {
            throw err
        } else {
            const resultPack = JSON.stringify(result);
            res.send(resultPack);
        }
    });
});

module.exports = router;
