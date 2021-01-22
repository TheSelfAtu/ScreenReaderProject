var express = require("express");
var router = express.Router();
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "mysql",
  user: "root",
  password: "root",
  database: "ScreenReaderProject",
  port: "3306",
});

/* post-topicテンプレートを返す*/
router.get("/", function (req, res, next) {
  res.render("post-topic", { title: "トピック投稿" });
});

// 投稿されたトピックを登録する
router.post("/", function insertTopicRecordToDB(req, res, next) {
console.log("req.body post topic",req.body)
  const insertValues = {
    title: req.body.title,
    content: req.body.content,
    post_user_id: req.body.post_user_id,
  };
  connection.query(
    {
      sql: "insert into topic SET ?",
      timeout: 40000, // 40s
      values: insertValues,
    },
    function responseInsertTopicResult(err, results, fields) {
      if (err) {
        console.log("error", err);
        return res.status(500).send({ err: "トピックを投稿できませんでした" });
      }
      console.log("トピックの投稿に成功しました");
      console.log("results", results);
      return res.json({ InsertSucceed: true });
    }
  );
});

module.exports = router;
