import React, {
  useState,
  useEffect,
  useContext,
  ReactHTMLElement,
} from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

import { TextField } from "@material-ui/core";

interface TopicContentProps {}

const inputProps = {
  step: 300,
};

export default function TopicContent(props: TopicContentProps) {
  return <TextField 
  id="" 
  type="textarea"
  variant="outlined"
  placeholder="トピックの内容を記述してください"
  fullWidth 
  multiline 
  rows="5" 
  inputProps={inputProps} />;

}
