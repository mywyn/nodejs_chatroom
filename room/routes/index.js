var express = require('express');
var io = require('socket.io');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Room Chat!' });
});

module.exports = router;
