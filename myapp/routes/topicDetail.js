const express = require('express');
const router = express.Router();
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "mysql",
    user: "root",
    password: "root",
    database: "ScreenReaderProject",
    port: "3306",
  });

  router.use("/:topicID",function responseTopicDetail(req, res, next) {
    console.log("topicID",req.params["topicID"])
    connection.query(
      {
        sql: "SELECT * FROM topic WHERE id=?",
        timeout: 40000, // 40s
        values: req.params["topicID"],
      },
      function showQueryResponse(error, results, fields) {
        console.log("results",results);
        console.log("error",error);
      }
    );
    next();
  })

/* GET home page. */
router.get('/:topicID', function(req, res, next) {
    console.log(req.params["topicID"])
    res.render('topic-detail', { title: '質問詳細' , topicID:req.params["topicID"]});
});



module.exports = router;
