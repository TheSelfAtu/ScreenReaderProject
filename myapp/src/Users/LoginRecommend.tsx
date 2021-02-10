import { PostFire } from "../Common";
import React, { useState, useCallback } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";

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
  error: {
    display: "block",
    textAlign: "center",
    color: "red",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface LoginRecommendProps {
  dialogTitle: string;
  buttonExplanation: string;
  fetchUserStatus: any;
}

export default function LoginRecommendForm(props: LoginRecommendProps) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const requestLogin = useCallback(
    async (username: string, password: string): Promise<any> => {
      // フォーム入力バリデーション
      if (username == "" || password == "") {
        setError("ユーザ名またはパスワードが入力されていません");
        return;
      }
      // ログインリクエストを送る
      try {
        await PostFire("/users/login", {
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
      // ダイアログを閉じる
      handleClose();
    },
    []
  );

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        {props.buttonExplanation}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{props.dialogTitle}</DialogTitle>
        <DialogContent>
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
          <div role="alert">
            <span className={classes.error}>{error}</span>
          </div>
        </DialogContent>
        <DialogActions>
          {/* 戻るボタン */}
          <Button onClick={handleClose} color="primary">
            戻る
          </Button>
          <Button
            onClick={async () => {
              requestLogin(username, password);
            }}
            color="primary"
          >
            ログイン
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
