var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('post_topic', { title: '質問投稿' });
});

module.exports = router;
