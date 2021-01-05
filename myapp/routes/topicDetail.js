const express = require("express");
const router = express.Router();
const mysql = require("mysql");


/* GET home page. */
router.get("/:topicID", function (req, res, next) {
  const connection = mysql.createConnection({
    host: "mysql",
    user: "root",
    password: "root",
    database: "ScreenReaderProject",
    port: "3306",
  });

  connection.query(
    {
      sql: "SELECT * FROM topic WHERE id=?",
      timeout: 40000, // 40s
      values: req.params["topicID"],
    },
    function responseTopic(error, results, fields) {
      console.log(results)
      res.render("topic-detail", {
        title: "質問詳細",
        topicTitle: results[0].title,
        topicContent: results[0].content,
        topicID: req.params["topicID"],
      });
    }
  );
});

module.exports = router;
