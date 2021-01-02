import React, {
  useState,
  useEffect,
  useContext,
  ReactHTMLElement,
} from "react";

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Button } from '@material-ui/core';

import TopicTitle from "./TopicTitle";
import TopicContent from "./TopicContent";

interface PostTopicProps {}

export default function PostTopic(props: PostTopicProps) {
  const [inputTitle, setInputTitle] = useState("");
  const [inputContent, setInputContent] = useState("");

  return (
    <div id="post-topic-wrapper">
      <form action="/postDetail">
        <div id="topic-title">
          <h3>タイトル</h3>
          <TopicTitle
            inputTitle={inputTitle}
            setInputTitle={setInputTitle}
          ></TopicTitle>
        </div>
        <div id="topic-content">
          <h3>内容</h3>
          <TopicContent
            inputContent={inputContent}
            setInputContent={setInputContent}
          ></TopicContent>
        </div>
        <Button variant="contained" color="primary">
          トピックを送信</Button>
      </form>
    </div>
  );
}
