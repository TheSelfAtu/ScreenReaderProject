var express = require('express');
var router = express.Router();

// middleware that is specific to this router
router.use(function createTopicRecordToDB (req, res, next) {

    next()
  })


/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('router get')
    res.render('post_topic', { title: '質問投稿' });
});


module.exports = router;
