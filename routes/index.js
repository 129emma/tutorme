var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  if (typeof req.session.userDetails !== 'undefined') {
    console.log("YES" + req.session.userDetails);
    res.redirect('/tutor/home');
      // res.render('index', { title: 'Tutorme' });

  } else {
      console.log("NO!" + req.session.userDetails);
      res.render('index', { title: 'Tutorme' });
  }

});


//
// router.get('/registration', function(req, res) {
//     res.render("registration");
// });

module.exports = router;
