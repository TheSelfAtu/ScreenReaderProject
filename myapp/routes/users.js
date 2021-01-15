const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const crypto = require("crypto");
const passport = require("passport");

// サインアップ画面を返す
router.get("/signup", function (req, res, next) {
  res.render("signup", { title: "サインアップ画面" });
});

router.post("/checkAccessRight", (req, res, next) => {
  console.log("req.user",req.user)
  if (req.user) {
    return res.json({ hasAccessRight: true });
  } else {
    return res.json({ hasAccessRight: false });
  }
});

// 新しいユーザーを追加する
router.post("/signup", function (req, res, next) {
  console.log("signup start");
  console.log("req.body username", req);
  console.log("req query", req.query);
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
      console.log("sign up result or err", err, results);
      if (err != null) {
        console.log("サインアップでエラーが発生しました");
        return res.status(500).send({ err: err.message });
      }
      console.log("results", results);
      return res.json({ "login successed": "yes" });
    }
  );
});

// ログイン画面を返す
router.get("/login", function (req, res, next) {
  res.render("login", { title: "ログイン画面" });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    // 認証でのエラーを返す
    if (err) {
      console.log("error", err);
      console.log("error message", err.message);
      return res.status(500).send({ err: err.message });
    }
    // セッションに認証用ユーザ名を埋め込む
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
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/users/login");
});

module.exports = router;
