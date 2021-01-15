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



// middleware that is specific to this router
// router.use(function checkAuthority(req, res, next) {
//   if (req.user) {
//     next();
//   } else {
//     res.redirect("/users/login");
//   }
// });

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("post-topic", { title: "質問投稿" });
});

module.exports = router;
