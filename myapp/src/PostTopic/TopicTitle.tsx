import React from "react";
import { TextField } from "@material-ui/core";

interface TopicTitleProps {
  inputTitle: string;
  setInputTitle: (e: any) => void;
}

const inputProps = {
  step: 300,
};

export default function TopicTitle(props: TopicTitleProps) {
  return (
    <TextField
      id="title-form"
      type="textarea"
      variant="outlined"
      fullWidth
      inputProps={inputProps}
      placeholder="話し合いたいトピックのタイトルを記入してください"
      value={props.inputTitle}
      name="title"
      required
      onChange={(e) => {
        props.setInputTitle(e.target.value);
      }}
    />
  );
}
