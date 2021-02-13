import React, { useState, useCallback } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import { postFire } from "../Common";

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
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // 投稿の受付を締め切る機能
  const setTopicNotActive = useCallback(async (): Promise<any> => {
    try {
      await postFire("/topic-detail/set-topic-not-active", {
        topic_id: props.topicId,
        is_topic_active: "0",
      });
    } catch (e) {
      // 投稿締め切りに失敗した場合はエラーをセット
      setError("投稿締め切りに失敗しました");
      return;
    }

    // 投稿締め切りに成功した場合にダイアログを閉じる
    handleClose();
    location.replace(location.href);
  }, [props.topicId]);

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
              setTopicNotActive();
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
