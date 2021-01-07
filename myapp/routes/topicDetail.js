const express = require("express");
const router = express.Router();
const mysql = require("mysql");

// app.use(express.json())
// app.use(express.urlencoded({ extended: true }));

/* GET home page. */
// テンプレートを返す
router.get("/:topicID", function (req, res, next) {
  res.render("topic-detail", { title: "トピック詳細" });
});

// トピックのタイトルと内容を返す
router.post("/:topicID/topic", function (req, res, next) {
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
      res.json(results[0]);
    }
  );
});

router.post("/:topicID/postResponse", function (req, res, next) {
  const connection = mysql.createConnection({
    host: "mysql",
    user: "root",
    password: "root",
    database: "ScreenReaderProject",
    port: "3306",
  });

  // トピックのレスポンスを登録
  connection.query(
    {
      sql: "insert into response_to_topic SET ?",
      timeout: 40000, // 40s
      values: {
        content: req.body["inputValue"],
        topic_id: req.params["topicID"],
      },
    },
    function showQueryResponse(error, results, fields) {
      console.log("results", results);
      console.log("error", error);
    }
  );

  // トピックに対するレスポンスデータを返却
  connection.query(
    {
      sql: "SELECT * FROM response_to_topic WHERE topic_id=?",
      timeout: 40000, // 40s
      values: req.params["topicID"],
    },
    function responseTopic(error, results, fields) {
      console.log("resultsdayo",results);
      res.json(results);
    }
  );
});

router.post("/:topicID/getAllResponseToTopic", function (req, res, next) {
  const connection = mysql.createConnection({
    host: "mysql",
    user: "root",
    password: "root",
    database: "ScreenReaderProject",
    port: "3306",
  });

  // トピックに対するレスポンスデータを返却
  connection.query(
    {
      sql: "SELECT * FROM response_to_topic WHERE topic_id=?",
      timeout: 40000, // 40s
      values: req.params["topicID"],
    },
    function responseTopic(error, results, fields) {
      console.log("resultsdayo",results);
      res.json(results);
    }
  );
});

module.exports = router;


function getAllResopnseToTopic(){

}