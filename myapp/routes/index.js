const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

// 非同期のポストリクエストに対してトピック一覧を返す
router.post("/",function selectTopic(req, res, next) {
  const connection = mysql.createConnection({
    host: "mysql",
    user: "root",
    password: "root",
    database: "ScreenReaderProject",
    port: "3306",
  });

  connection.query(
    {
      sql: "SELECT * FROM topic",
      timeout: 40000, // 40s
    },
    function responseTopic(error, results, fields) {
      res.json(results);
    }
  );
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("topic-list", { title: "スクリーンリーダープログラミング" });
});

module.exports = router;
