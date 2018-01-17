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

/* GET disclaimer page. */
router.get('/privacy', function(req, res, next) {

    res.render('privacy');

});





module.exports = router;
