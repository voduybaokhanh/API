var express = require('express');
var router = express.Router();

//http://localhost:3000/home
/* GET home page. */
router.get('/home', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
