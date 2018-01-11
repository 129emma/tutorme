const express = require('express');
const router = express.Router();
//tutorRoute specific routers below
const home = require('./tuteeRoute/home');
router.use('/home', home);

module.exports = router;