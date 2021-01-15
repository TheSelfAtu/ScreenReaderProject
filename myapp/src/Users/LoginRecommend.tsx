import axios from "axios";
import React, {
  useState,
  useEffect,
  useContext,
  ReactHTMLElement,
  useMemo,
  useCallback,
} from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
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

interface LoginRecommendProps {
  buttonExplanation: string;
}

export default function LoginRecommendForm(props: LoginRecommendProps) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const requestLogin = useCallback(
    (username: string, password: string): Promise<any> => {
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
            resolve(response.data);
          })
          .catch((err) => {
            console.log("error response data", err.response.data);
            setError(err.response.data.err);
          });
      });
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
        <DialogTitle id="form-dialog-title"></DialogTitle>
        <DialogContent>
          <DialogContentText>ログインすることでトピックに回答することができます</DialogContentText>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            戻る
          </Button>
          <Button
            value={inputValue}
            onClick={() => {
              requestLogin(username, password);
              handleClose();
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
