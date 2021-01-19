var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const passport = require("passport"); // 追記
const mysql = require("mysql2");
const crypto = require("crypto");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const postTopicRouter = require("./routes/postTopic");
const topicDetailRouter = require("./routes/topicDetail");
const insertTopicRecordRouter = require("./routes/insertTopicRecord");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// セッションミドルウェア設定
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const LocalStrategy = require("passport-local").Strategy;
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      session: true,
    },
    function (username, password, done) {
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
          values: username,
        },
        (error, results, fields) => {
          if (error != null) {
            console.log("query error", error);
            return done(error);
          }
          if (results.length === 0) {
            console.log("ユーザーが存在しません ");
            return done(new Error('ユーザー名またはパスワードが違います'));
          }

          console.log("ユーザー名による検索結果", results);
          const sendPassword = crypto
            .createHash("sha256")
            .update(password)
            .digest("hex");

            if(results[0].password !== sendPassword) {
              console.log("パスワードが違います");
              return done(new Error('ユーザー名またはパスワードがちがいます'));
            }

          if (results[0].password == sendPassword) {
            console.log("ユーザー認証に成功", username);
            return done(null, { username: username });
          }

          console.log("login error");
          // throw new Error('BROKEN') // Express will catch this on its own.
return(new Error('"new" キーワードによって生成されました。'))
          return done(null, false, {
            message: "パスワードが正しくありません。",
          });
        }
      );
    }
  )
);

passport.serializeUser((username, done) => {
  done(null, username);
}); // ユニークユーザー識別子からユーザーデータを取り出す
passport.deserializeUser((username, done) => {
  done(null, username);
});

app.use("/", indexRouter);
app.use("/post-topic", postTopicRouter);
app.use("/topic-detail/", topicDetailRouter);
app.use("/insert-topic-record", insertTopicRecordRouter);

app.use("/users/", usersRouter);

// 静的ファイル bundleされたjsを読み込めるようにする
app.use("/bundle", express.static("./bundle/"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;