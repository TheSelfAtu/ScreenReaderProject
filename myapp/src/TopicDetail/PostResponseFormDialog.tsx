import axios from "axios";
import React, {
  useState,
  useEffect,

} from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

interface FormDialogProps {
  topicTitle: string;
  topicContent: string;
  postResopnseToDB: (inputValue: string) => Promise<any>;
  requestSuccessMessage: string[];
  setRequestSuccessMessage: React.Dispatch<React.SetStateAction<string[]>>;
}
export default function PostResponseFormDialog(props: FormDialogProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
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
            value={inputValue}
            onClick={async () => {
              const postResponseSuccess = await props.postResopnseToDB(
                inputValue
              );
              setInputValue("");
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
