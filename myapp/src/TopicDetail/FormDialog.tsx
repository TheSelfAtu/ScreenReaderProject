import axios from "axios";
import React from "react";
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
}
export default function FormDialog(props: FormDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

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
            onClick={() => {
              postResponseToDB(inputValue);
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

function postResponseToDB(inputValue: string) {
  if (inputValue === "") {
    return false;
  }
  console.log(inputValue);
  const params = new URLSearchParams();
  params.append("inputValue", inputValue);

  axios
    .post(document.location + "/postResponse", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
    .then((response) => {
      console.log("axios response data", response.data);
    })
    .catch((err) => {
      console.log("err: ", err);
    });
}
