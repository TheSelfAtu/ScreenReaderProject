import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

interface FormDialogProps {
  error:string;
  topicTitle: string;
  topicContent: string;
  responseMessage:string;
  setResponseMessage:React.Dispatch<React.SetStateAction<string>>;
  postResopnseToDB: (inputValue: string) => Promise<undefined>;
  requestSuccessMessage: string[];
  setRequestSuccessMessage: React.Dispatch<React.SetStateAction<string[]>>;
}
export default function PostResponseFormDialog(
  props: FormDialogProps
): JSX.Element {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        トピックに返信する
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullScreen
      >
        <DialogTitle id="form-dialog-title">{props.topicTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.topicContent}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            type="textarea"
            fullWidth
            placeholder="トピックへの返信"
            multiline
            required
            value={props.responseMessage}
            onChange={(e) => {
              props.setResponseMessage(e.target.value);
            }}
          />
          <div role="alert">{props.error}</div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            戻る
          </Button>
          <Button
            value={props.responseMessage}
            onClick={async () => {
              await props.postResopnseToDB(props.responseMessage);
              handleClose();
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
