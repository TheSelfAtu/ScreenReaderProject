var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('topicDetail', { title: '質問詳細' });
});



module.exports = router;
