import { postFire } from "../Common";
import React from "react";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
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
    marginTop: theme.spacing(3),
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

export default function SignUp() {
  const classes = useStyles();
  const history = useHistory();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const requestSignup = async (
    username: string,
    password: string
  ): Promise<any> => {
    // フォーム入力バリデーション
    if (username == "" || password == "") {
      setError("ユーザ名またはパスワードが入力されていません");
      return;
    }

    // サインアップリクエストを送る
    try {
      await postFire("/users/signup", {
        username: username,
        password: password,
      });
    } catch (e) {
      // トピック投稿に失敗した場合はエラーをセット
      setError("サインアップに失敗しました");
      return;
    }
    history.push("/login");
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          サインアップ
        </Typography>
        <form className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              {/* ユーザー名入力フォーム */}
              <TextField
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                value={username}
                variant="outlined"
                required
                fullWidth
                id="username"
                label="ユーザ名"
                name="username"
                autoComplete="username"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              {/* パスワード入力フォーム */}
              <TextField
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                value={password}
                variant="outlined"
                required
                fullWidth
                name="password"
                label="パスワード"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
          </Grid>
          <div role="alert">
            <span className={classes.error}>{error}</span>
          </div>
          <Button
            type="button"
            onClick={() => {
              requestSignup(username, password);
            }}
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            サインアップ
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                すでにアカウントを持っている場合はログイン画面へ移動
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
