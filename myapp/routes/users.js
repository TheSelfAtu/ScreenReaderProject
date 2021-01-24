const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const crypto = require("crypto");
const passport = require("passport");

// ユーザーのステータスを返す
// {"session":false, "userId":string, "userName":string}
router.post("/responseUserStatus", (req, res, next) => {
  if (!req.user) {
    return res.json({"session":false, "userId":"", "userName":""});
  }
  if (req.user) {
    const connection = mysql.createConnection({
      host: "mysql",
      user: "root",
      password: "root",
      database: "ScreenReaderProject",
      port: "3306",
    });

    connection.query(
      {
        sql: "SELECT * FROM user WHERE username =  ?",
        timeout: 40000, // 40s
        values: req.user.username,
      },
      function responseUserStatus(err, results, fields) {
        if (err) {
          return res.json(err);
        }        
        console.log("results",results)
        return res.json({"session":true, "userId":results[0].id, "userName":results[0].username});
      }
    );
  }
});

// 新しいユーザーを追加する
router.post("/signup", function (req, res, next) {
  // リクエストバリデーション
  if(req.query.username=="" || req.query.password==""){
    return res
    .status(500)
    .send({ err: "サインアップでエラーが発生しました" });
  }

  const connection = mysql.createConnection({
    host: "mysql",
    user: "root",
    password: "root",
    database: "ScreenReaderProject",
    port: "3306",
  });

  connection.query(
    {
      sql: "insert into user SET ?",
      timeout: 40000, // 40s
      values: {
        username: req.query.username,
        password: crypto
          .createHash("sha256")
          .update(req.query.password)
          .digest("hex"),
      },
    },
    function ResponseSignUpResult(err, results, fields) {
      if (err != null) {
        console.log("サインアップでエラーが発生しました");
        return res
          .status(500)
          .send({ err: "サインアップでエラーが発生しました" });
      }
      console.log("results", results);
      return res.json({ サインアップに成功しました: true });
    }
  );
});

// ログインリクエストに対して認証を実行
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    // 認証でのエラーを返す
    if (err) {
      console.log("error", err);
      return res.status(500).send({ err: err.message });
    }
    // 認証に成功した場合セッションに認証用ユーザ名を埋め込む
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.json(err);
      }
      res.json({ "login successed": "yes" });
    });
  })(req, res, next);
});

// ログアウト時にセッションの情報を破棄
router.post("/logout", function (req, res) {
  req.logout();
  res.json({"logout":true});
});

// ユーザのブックマークを登録
router.post("/bookmark/register", (req, res) => {
  console.log("req",req.query,req.query.user_id,req.query.topic_id)
  const connection = mysql.createConnection({
    host: "mysql",
    user: "root",
    password: "root",
    database: "ScreenReaderProject",
    port: "3306",
  });  

  connection.query(
    {
      sql: "insert into bookmark_topic SET ?",
      timeout: 40000, // 40s
      values: {
        user_id: req.query.user_id,
        topic_id: req.query.topic_id,
      },
    },
    function ResponseSignUpResult(err, results, fields) {
      if (err != null) {
        console.log(err)
        return res
          .status(500)
          .send({ err: "ブックマークでエラーが発生しました" });
      }
      console.log("results", results);
      return res.json({"トピックをブックマークしました": true });
    }
  );
})

router.post("/fetch-bookmark-topic", (req, res) => {
  console.log("fetch-bookmark",req.query,req.query.user_id,req.query.topic_id)
  const connection = mysql.createConnection({
    host: "mysql",
    user: "root",
    password: "root",
    database: "ScreenReaderProject",
    port: "3306",
  });  

  connection.query(
    {
      sql: "SELECT * FROM bookmark_topic WHERE user_id =  ?",
      timeout: 40000, // 40s
      values: req.query.user_id,
    },
    function ResponseResult(err, results, fields) {
      if (err != null) {
        console.log(err)
        return res
          .status(500)
          .send({ err: "ブックマークしたトピックを取得できません" });
      }
      console.log("results", results);
      return res.json(results);
    }
  );
})

// トピックのブックマークを解除する
router.post("/bookmark/drop", (req, res) => {
  const connection = mysql.createConnection({
    host: "mysql",
    user: "root",
    password: "root",
    database: "ScreenReaderProject",
    port: "3306",
  });  

  connection.query(
    {
      sql: "DELETE FROM bookmark WHERE user_id = ? AND topic_id = ?",
      timeout: 40000, // 40s
      values: {
        user_id: req.query.user_id,
        topic_id: req.query.topic_id,
      },
    },
    function ResponseDropBookMarkResult(err, results, fields) {
      if (err != null) {
        console.log("ブックマーク解除でエラーが発生しました");
        return res
          .status(500)
          .send({ err: "ブックマーク解除でエラーが発生しました" });
      }
      console.log("results", results);
      return res.json({"Drop BookMark": true });
    }
  );
})

module.exports = router;
