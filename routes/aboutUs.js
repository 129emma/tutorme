
var express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.render('aboutUs');
    //About us page should include the course list which we can get from database

});


module.exports = router;