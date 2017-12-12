var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Tutorme' });

    // console.log(req.session);
    //
    // req.session.fullname = 'hello';
    //
    // console.log(req.session.fullname);

});


//
// router.get('/registration', function(req, res) {
//     res.render("registration");
// });

module.exports = router;
