import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import Button from "@material-ui/core/Button";
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

interface SetTopicNotActiveButtonProps {
  topicId: string;
}

export default function SetTopicNotActiveButton(
  props: SetTopicNotActiveButtonProps
) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const setTopicNotActive = useCallback((topicId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const urlParams = new URLSearchParams();
      urlParams.append("topic_id", topicId);
      urlParams.append("is_topic_active", "0");
      axios({
        method: "POST",
        url: "/topic-detail/set-topic-not-active",
        responseType: "json",
        params: urlParams,
      })
        .then((response) => {
          console.log("axios is_topic_active set 0", response.data);
          resolve(true);
          //   return true;
        })
        .catch((err) => {
          console.log("error response data", err.response.data);
          setError(err.response.data.err);
        });
    });
  }, []);

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        回答を締め切る
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          <span>
            回答を締め切るとユーザーがトピックに回答することが出来なくなります
          </span>
        </DialogTitle>
        <DialogContent>
          {/* エラーメッセージを表示 */}
          <div>
            <span className={classes.error}>{error}</span>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            戻る
          </Button>
          <Button
            onClick={async () => {
              const isSetTopicNotActiveSuccess = await setTopicNotActive(
                props.topicId
              );
              if (isSetTopicNotActiveSuccess) {
                handleClose();
                location.replace(location.href);
              }
            }}
            color="primary"
          >
            回答を締め切る
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
