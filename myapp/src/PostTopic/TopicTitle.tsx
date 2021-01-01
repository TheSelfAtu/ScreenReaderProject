import React, {
    useState,
    useEffect,
    useContext,
    ReactHTMLElement,
  } from "react";
  import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
  
  import { TextField } from "@material-ui/core";
  
  interface TopicTitleProps {}
  
  const inputProps = {
    step: 300,
  };
  
  export default function TopicTitle(props: TopicTitleProps) {
    return <TextField 
    id="" 
    type="textarea" 
    variant="outlined"
    fullWidth  
    inputProps={inputProps} 
    placeholder="話し合いたいトピックのタイトルを記入してください"
    />;
  }
  