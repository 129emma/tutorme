/**
 * Created by Administer on 16/01/2018.
 */
const con = require("../javascript/connection");
const sql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();


router.get('/', function (req, res) {


    console.log("reach listing");
    res.render("listing");
});

module.exports = router;
