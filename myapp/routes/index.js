const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const app_exports = require("../app");
const connection = app_exports.connection;

// 非同期のポストリクエストに対してトピック一覧を返す
router.post("/", function selectTopic(req, res, next) {
  connection.query(
    {
      sql:
        "SELECT topic.*, user.username,COUNT(response.id) FROM topic LEFT JOIN response_to_topic as response ON topic.id = response.topic_id  JOIN user ON topic.post_user_id = user.id GROUP BY topic.id ORDER BY topic.created_at DESC",
      timeout: 40000, // 40s
    },
    function responseTopic(error, results, fields) {
      console.log(error);
      res.json(results);
    }
  );
});

router.post("/count-response-to-topic", (req, res, next) => {
  const insertValues = {
    topic_id: req.body.topic_id,
  };

  connection.query(
    {
      sql: "SELECT * FROM response_to_topic WHERE topic_id",
      timeout: 40000, // 40s,
      values: insertValues,
    },
    function responseTopic(error, results, fields) {
      res.json(results.length);
    }
  );
});

router.post("/delete-topic", (req, res, next) => {
  // トピックに対するブックマークを削除
  connection.query(
    {
      sql: "Delete  FROM bookmark_topic WHERE topic_id = ?",
      timeout: 40000, // 40s,
      values: req.body.topic_id,
    },
    (error, results, fields) => {
      if (error != null) {
        console.log(error);
        return res
          .status(500)
          .send({ err: "ブックマークの削除でエラーが発生しました" });
      }
      console.log(results);
    }
  );
  // トピックに対する回答を削除
  connection.query(
    {
      sql: "Delete FROM response_to_topic WHERE topic_id = ?",
      timeout: 40000, // 40s,
      values: req.body.topic_id,
    },
    (error, results, fields) => {
      if (error != null) {
        console.log(error);
        return res
          .status(500)
          .send({ err: "トピックに対する回答の削除でエラーが発生しました" });
      }
      console.log(results);
    }
  );
  // トピックを削除
  connection.query(
    {
      sql: "Delete FROM topic WHERE id = ?",
      timeout: 40000, // 40s,
      values: req.body.topic_id,
    },
    function responseTopic(error, results, fields) {
      if (error != null) {
        console.log(error);
        return res
          .status(500)
          .send({ err: "トピック削除でエラーが発生しました" });
      }
      res.json(results);
    }
  );
});

module.exports = router;
