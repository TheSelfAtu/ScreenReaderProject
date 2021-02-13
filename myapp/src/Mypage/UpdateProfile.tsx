import axios from "axios";
import React, { useState, useCallback, useRef } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { postFire } from "../Common";

interface UpdateProfileProps {
  profileUserID: string;
  userStatus: {
    userId: string;
    userName: string;
    session: boolean;
    comment: string;
  };

  requestSuccessMessage: string[];
  setRequestSuccessMessage: React.Dispatch<React.SetStateAction<string[]>>;
}
export default function UpdateProfile(props: UpdateProfileProps) {
  const prevMessageRef = useRef(props.requestSuccessMessage);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(props.userStatus.comment);
  const [error, setError] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const updateUserProfile = useCallback(
    async (inputValue: string): Promise<any> => {
      // プロフィールを変更します
      try {
        await postFire("/users/update-profile", {
          inputValue: inputValue,
          user_id: props.userStatus.userId,
        });
      } catch (e) {
        // プロフィール変更に失敗した場合はエラーをセット
        setError("プロフィール変更に失敗しました");
        return;
      }
      // トピック投稿に成功した場合はトピックリスト画面に遷移
      props.setRequestSuccessMessage(
        prevMessageRef.current.concat(["プロフィールを変更しました"])
      );

      handleClose();
    },
    [props.userStatus]
  );

  return (
    <div>
      <div className="update-profile-button">
        <Button variant="outlined" color="default" onClick={handleClickOpen}>
          プロフィールを更新
        </Button>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullScreen
      >
        <DialogTitle id="form-dialog-title">プロフィールを更新</DialogTitle>
        <DialogContent aria-describedby="profile-form">
          <DialogContentText>
            公開するプロフィールを記述してください
          </DialogContentText>
          {/* プロフィール記入フォーム */}
          <TextField
            autoFocus
            margin="dense"
            id="profile-form"
            type="textarea"
            fullWidth
            placeholder="プロフィールを記入"
            multiline
            required
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />

          {/* エラーメッセージを表示 */}
          <div role="alert">
            <span id="update-profile-error">{error}</span>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            戻る
          </Button>

          <Button
            onClick={async () => {
              updateUserProfile(inputValue);
            }}
            color="primary"
          >
            送信
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
