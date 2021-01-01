import React, {
    useState,
    useEffect,
    useContext,
    ReactHTMLElement,
  } from "react";
  
  import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
  import ButtonAppBar from "../NavBar";
  
  interface TopicDetailProps {
  }
  
  export default function TopicDetail(props: TopicDetailProps) {
      return (
        <div>
          <div>topicdetail</div>
          <ButtonAppBar></ButtonAppBar>
      </div>
      )
  }
  