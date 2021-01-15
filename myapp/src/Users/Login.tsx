import axios from "axios";
import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {
  const classes = useStyles();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const requestLogin = (username: string, password: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const urlParams = new URLSearchParams();
      urlParams.append("username", username);
      urlParams.append("password", password);
      axios({
        method: "POST",
        url: "/users/login",
        responseType: "json",
        params: urlParams,
      })
        .then((response) => {
          console.log("axios response data", response.data);
          location.href = "/";
          resolve(response.data);
        })
        .catch((err) => {
          console.log("error response data", err.response.data);

          setError(err.response.data.err);
        });
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          ログイン
        </Typography>
        <form className={classes.form}>
        <TextField
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          value={username}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="ユーザー名"
          name="username"
          autoComplete="username"
          autoFocus
        />
        <TextField
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="パスワード"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        {/* エラーメッセージを表示 */}
        {error}
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
      </div>
    </Container>
  );
}
