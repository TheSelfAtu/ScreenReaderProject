const express = require("express");
const router = express.Router();
const mysql = require("mysql2");



// 非同期のポストリクエストに対してトピック一覧を返す
router.post("/", function selectTopic(req, res, next) {
  const connection = mysql.createConnection({
    host: "mysql",
    user: "root",
    password: "root",
    database: "ScreenReaderProject",
    port: "3306",
  });

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
  const connection = mysql.createConnection({
    host: "mysql",
    user: "root",
    password: "root",
    database: "ScreenReaderProject",
    port: "3306",
  });

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

module.exports = router;
