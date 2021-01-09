const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

// サインアップ画面を返す
router.get("/signup", function (req, res, next) {
  res.render("signup", { title: "サインアップ画面" });
});


// ログイン画面を返す
router.get("/login", function (req, res, next) {
  res.render("login", { title: "ログイン画面" });
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
