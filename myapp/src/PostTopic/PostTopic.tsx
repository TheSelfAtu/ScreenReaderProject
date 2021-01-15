import axios from "axios";
import React, {
  useState,
  useEffect,
  useContext,
  ReactHTMLElement,
  useMemo,
  useCallback,
} from "react";
import LoginRecommendForm from "../Users/LoginRecommend";

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

import TopicTitle from "./TopicTitle";
import TopicContent from "./TopicContent";

interface PostTopicProps {}

export default function PostTopic(props: PostTopicProps) {
  const [inputTitle, setInputTitle] = useState("");
  const [inputContent, setInputContent] = useState("");
  const [hasAccessRight, setAccessRight] = useState(false);

  const checkAccessRight = useCallback((): Promise<any> => {
    return new Promise((resolve, reject) => {
      axios({
        method: "POST",
        url: "/users/checkAccessRight",
        responseType: "json",
      })
        .then((response) => {
          console.log("checkAccessRight ", response.data.hasAccessRight);
          resolve(response.data.hasAccessRight);
        })
        .catch((err) => {
          console.log("err: ", err);
        });
    });
  }, []);

  useEffect(() => {
    const fetchedData = async () => {
      const accessRight = await checkAccessRight();
      setAccessRight(accessRight);
    };
    fetchedData();
  }, []);

  const LoginORSubmitButton = () => {
    if (!hasAccessRight) {
      return (
        <div id="login-wrapper">
          <LoginRecommendForm buttonExplanation="ログインしてトピックを投稿"></LoginRecommendForm>
        </div>
      );
    }
    return (
      <Button type="submit" variant="contained" color="primary">
        トピックを送信
      </Button>
    );
  };

  return (
    <div id="post-topic-wrapper">
      <form action="/insert-topic-record" method="POST">
        <div id="topic-title-wrapper">
          <h3>タイトル</h3>
          <TopicTitle
            inputTitle={inputTitle}
            setInputTitle={setInputTitle}
          ></TopicTitle>
        </div>
        <div id="topic-content-wrapper">
          <h3>内容</h3>
          <TopicContent
            inputContent={inputContent}
            setInputContent={setInputContent}
          ></TopicContent>
        </div>
        {LoginORSubmitButton()}
      </form>
    </div>
  );
}
