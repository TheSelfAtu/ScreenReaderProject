import axios from "axios";
import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
  ReactHTMLElement,
} from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

interface UpdateProfileProps {
profileUserID:string
    userStatus: {
    userId: string;
    userName: string;
    session: boolean;
    comment: string;
  };
  requestToApiServer: (
    endpoint: string,
    user_id: string,
    topic_id: string,
    inputValue: string
  ) => Promise<any>;

  requestSuccessMessage: string[];
  setRequestSuccessMessage: React.Dispatch<React.SetStateAction<string[]>>;
}
export default function UpdateProfile(props: UpdateProfileProps) {
  const prevProfileRef = useRef(props.userStatus.comment);
  const prevMessageRef = useRef(props.requestSuccessMessage);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(props.userStatus.comment);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  console.log("user id",props.userStatus.userId,"pro",props.profileUserID)
  if(props.userStatus.userId!=props.profileUserID){
      return null
  }

  return (
    <div>
      <Button variant="outlined" color="default" onClick={handleClickOpen}>
        プロフィールを更新
      </Button>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            戻る
          </Button>

          <Button
            onClick={async () => {
              const postResponseSuccess = await props.requestToApiServer(
                "/users/update-profile",
                props.userStatus.userId,
                "",
                inputValue
              );
              console.log("update profile", postResponseSuccess);
              if (postResponseSuccess) {
                console.log("update profile daze");
                setInputValue("");
                props.setRequestSuccessMessage(
                  prevMessageRef.current.concat(["プロフィールを更新しました"])
                );

                handleClose();
              }
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
