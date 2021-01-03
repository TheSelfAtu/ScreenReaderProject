import React, {
  useState,
  useEffect,
  useContext,
  ReactHTMLElement,
} from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

import { TextField } from "@material-ui/core";

interface TopicContentProps {
  inputContent: string
  setInputContent: (e:any)=> void
}

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
  rows="7" 
  inputProps={inputProps} 
  value={props.inputContent}
  name="content"
  onChange={(e)=>{
    props.setInputContent(e.target.value);
  }}
  />;

}
