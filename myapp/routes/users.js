const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const crypto = require("crypto");
const passport = require("passport");

// サインアップ画面を返す
router.get("/signup", function (req, res, next) {
  res.render("signup", { title: "サインアップ画面" });
});

// 新しいユーザーを追加する
router.post("/signup", function (req, res, next) {
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
        username: req.body["username"],
        password: crypto
          .createHash("sha256")
          .update(req.body["password"])
          .digest("hex"),
      },
    },
    function redirectToLogin(error, results, fields) {
      if (error != null) {
        console.log("エラーが発生しました");
        res.render("signup", { title: "サインアップ画面" ,error:"エラーが発生しました"});
      }
      console.log("results", results);
      console.log("error", error);
      res.render("login", { title: "ログイン画面" });
    }
  );
});

// ログイン画面を返す
router.get("/login", function (req, res, next) {
  res.render("login", { title: "ログイン画面" });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
  })
);

// ログアウト時にセッションの情報を破棄
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
