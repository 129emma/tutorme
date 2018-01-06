const express = require('express');
const router = express.Router();

router.get('/', function (req, res){




    res.render("./tutorView/feedback");

})
;

module.exports = router;
