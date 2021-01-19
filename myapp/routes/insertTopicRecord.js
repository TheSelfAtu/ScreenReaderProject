const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

const app = express();

const connection = mysql.createConnection({
  host: "mysql",
  user: "root",
  password: "root",
  database: "ScreenReaderProject",
  port: "3306",
});

// middleware that is specific to this router
router.use(function insertTopicRecordToDB(req, res, next) {
  const insertValues = {
    title: req.body.title,
    content: req.body.content,
    post_user_id: req.body.post_user_id,
  };
  console.log("request body", req.body);
  connection.query(
    {
      sql: "insert into topic SET ?",
      timeout: 40000, // 40s
      values: insertValues,
    },
    function showQueryResponse(error, results, fields) {
      console.log("results", results);
      console.log("error", error);
    }
  );
  next();
});



module.exports = router;