const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

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

// トピックに対する回答を登録する
router.post("/:topicID/postResponse", function (req, res, next) {
  const connection = mysql.createConnection({
    host: "mysql",
    user: "root",
    password: "root",
    database: "ScreenReaderProject",
    port: "3306",
  });
console.log("response_userid ",req.body)
console.log("response_userid ",req.body.response_user_id)
  // トピックのレスポンスを登録
  connection.query(
    {
      sql: "insert into response_to_topic SET ?",
      timeout: 40000, // 40s
      values: {
        content: req.body["inputValue"],
        topic_id: req.params["topicID"],
        response_user_id: req.body["response_user_id"],
      },
    },
    function responseInsertResponseToTopic(err, results, fields) {
      if (err) {
        console.log("error", err);
        return res
          .status(500)
          .send({ err: "トピックの回答を投稿できませんでした" });
      }
      console.log("トピックの回答の投稿に成功しました");
      console.log("results", results);
    }
  );

  // トピックに対するレスポンスデータを返却
  connection.query(
    {
      sql: "SELECT * FROM response_to_topic WHERE topic_id=?",
      timeout: 40000, // 40s
      values: req.params["topicID"],
    },
    function responseToTopic(error, results, fields) {
      return res.json(results);
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
      return res.json(results);
    }
  );
});

module.exports = router;