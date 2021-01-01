import React, {
  useState,
  useEffect,
  useContext,
  ReactHTMLElement,
} from "react";

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import ButtonAppBar from "../NavBar";
import TopicTitle from "./TopicTitle";
import TopicContent from "./TopicContent";


interface PostTopicProps {}

export default function PostTopic(props: PostTopicProps) {
  return (
    <div id="post-topic-wrapper">
      <div id="topic-title">
        <h3>タイトル</h3>
        <TopicTitle></TopicTitle>
      </div>
      <div id="topic-content">
        <h3>内容</h3>
        <TopicContent></TopicContent>
      </div>
    </div>
  );
}
