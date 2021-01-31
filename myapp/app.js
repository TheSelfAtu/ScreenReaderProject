var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const passport = require("passport"); // 追記
const mysql = require("mysql2");
const crypto = require("crypto");

const dbConfig = {
  host: "mysql", //接続先ホスト
  user: "root", //ユーザー名
  password: "root", //パスワード
  database: "ScreenReaderProject", //DB名
  port: "3306",
};

let connection;

function handleDisconnect() {
  console.log("create mysql connection");
  connection = mysql.createConnection(dbConfig); //接続する準備

  //接続
  connection.connect(function (err) {
    if (err) {
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 2000); //2秒待ってから処理
    }
  });

  //error時の処理
  connection.on("error", function (err) {
    console.log("db error then connection will destroy", err);
    connection.destroy();
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect();
    } else {
      throw err;
      
    }
  });

  exports.connection = connection; //connectionを(他のファイルから)requireで呼び出せるようにする
}

handleDisconnect();

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const postTopicRouter = require("./routes/postTopic");
const topicDetailRouter = require("./routes/topicDetail");

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
            return done(new Error("ユーザー名またはパスワードが違います"));
          }

          console.log("ユーザー名による検索結果", results);
          const sendPassword = crypto
            .createHash("sha256")
            .update(password)
            .digest("hex");

          if (results[0].password !== sendPassword) {
            console.log("パスワードが違います");
            return done(new Error("ユーザー名またはパスワードがちがいます"));
          }

          if (results[0].password == sendPassword) {
            console.log("ユーザー認証に成功", username);
            return done(null, { username: username });
          }
          return new Error('"new" キーワードによって生成されました。');
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

// 静的ファイル bundleされたjsを読み込めるようにする
app.use("/bundle", express.static("./bundle/"));

app.get(`*`, (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.use(`/`, indexRouter);
app.use("/post-topic", postTopicRouter);
app.use("/topic-detail/", topicDetailRouter);
app.use("/users/", usersRouter);

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

exports.app = app;
