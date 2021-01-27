const express = require("express");
const router = express.Router();
const mysql = require("mysql2");


// トピックのタイトルと内容を返す
router.post("/:topicID/topic", function (req, res, next) {
  const connection = mysql.createConnection({
    host: "mysql",
    user: "root",
    password: "root",
    database: "ScreenReaderProject",
    port: "3306",
  });
  // "SELECT topic.*, user.username,COUNT(response.id) FROM topic LEFT JOIN response_to_topic as response ON topic.id = response.topic_id  JOIN user ON topic.post_user_id = user.id GROUP BY topic.id ORDER BY topic.created_at DESC",

  connection.query(
    {
      sql: "SELECT topic.*, user.username FROM topic JOIN user ON topic.post_user_id = user.id  WHERE topic.id=?",
      timeout: 40000, // 40s
      values: req.params["topicID"],
    },
    function responseTopic(error, results, fields) {
      if (error != null) {
        console.log(error)
        return res
          .status(500)
          .send({ err: "トピック取得でエラーが発生しました" });
      }
      console.log(results);
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
  // トピックのレスポンスを登録
  connection.query(
    {
      sql: "insert into response_to_topic SET ?",
      timeout: 40000, // 40s
      values: {
        content: req.query["inputValue"],
        topic_id: req.params["topicID"],
        response_user_id: req.query["response_user_id"],
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
      sql: "SELECT response_to_topic.*, user.username FROM response_to_topic JOIN user ON response_to_topic.response_user_id = user.id  WHERE topic_id=?",
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
      sql: "SELECT response_to_topic.*, user.username FROM response_to_topic JOIN user ON response_to_topic.response_user_id = user.id  WHERE topic_id=?",
      timeout: 40000, // 40s
      values: req.params["topicID"],
    },
    function responseTopic(error, results, fields) {
      return res.json(results);
    }
  );
});

router.post("/set-topic-not-active", function (req, res, next) {
  const connection = mysql.createConnection({
    host: "mysql",
    user: "root",
    password: "root",
    database: "ScreenReaderProject",
    port: "3306",
  });
  console.log(req.body, req.body["topic_id"], req);
  connection.query(
    {
      sql: "UPDATE topic SET is_topic_active = 0 WHERE id = ?",
      timeout: 40000, // 40s
      values: req.query["topic_id"],
    },
    function responseSuccessMessage(error, results, fields) {
      if (!error == null) {
        console.log(error);
        return res.status(500).send({ err: err.message });
      }
      console.log(results);

      res.json({ "This topic is closed": true });
    }
  );
});
module.exports = router;
