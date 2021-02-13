import { postFire } from "../Common";
import React from "react";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  error: {
    display: "block",
    textAlign: "center",
    color: "red",
  },
}));

interface LoginProps {
  fetchUserStatus: () => Promise<any>;
}

export default function Login(props: LoginProps) {
  const classes = useStyles();
  const history = useHistory();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const requestLogin = async (
    username: string,
    password: string
  ): Promise<any> => {
    // フォーム入力バリデーション
    if (username == "" || password == "") {
      setError("ユーザ名またはパスワードが入力されていません");
      return;
    }
    // ログインリクエストを送る
    try {
      await postFire("/users/login", {
        username: username,
        password: password,
      });
    } catch (e) {
      // ログインに失敗した場合はエラーをセット
      setError("ログインに失敗しました");
      return;
    }
    // ユーザー情報を再取得
    props.fetchUserStatus();
    history.push("/");
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          ログイン
        </Typography>
        <form className={classes.form}>
          {/* ユーザー名入力フォーム */}
          <TextField
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            value={username}
            variant="outlined"
            margin="normal"
            required
            aria-required
            fullWidth
            id="username"
            label="ユーザー名"
            name="username"
            autoComplete="username"
            autoFocus
            aria-describedby="login-error"
          />
          {/* パスワード入力フォーム */}
          <TextField
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
            variant="outlined"
            margin="normal"
            required
            aria-required
            fullWidth
            name="password"
            label="パスワード"
            type="password"
            id="password"
            autoComplete="current-password"
            aria-describedby="login-error"
          />
          {/* エラーメッセージを表示 */}
          <div role="alert">
            <span id="login-error" className={classes.error}>
              {error}
            </span>
          </div>
          {/* ログインボタン */}
          <Button
            onClick={() => {
              requestLogin(username, password);
            }}
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            ログイン
          </Button>
        </form>

        <Link href="/signup" variant="body2">
          アカウントがない場合はサインアップ画面へ移動
        </Link>
      </div>
    </Container>
  );
}
