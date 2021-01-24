import axios from "axios";
import { useHistory } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";
import LoginRecommendForm from "../Users/LoginRecommend";
import { Button } from "@material-ui/core";

import TopicTitle from "./TopicTitle";
import TopicContent from "./TopicContent";

interface PostTopicProps {
  userStatus: {
    userId: string;
    userName: string;
    session: boolean;
  };
  fetchUserStatus: () => Promise<any>;
}

export default function PostTopic(props: PostTopicProps) {
  const history = useHistory();
  const [inputTitle, setInputTitle] = useState("");
  const [inputContent, setInputContent] = useState("");
  const [error, setError] = useState("");
  const postTopicToDB = useCallback(
    (
      inputTitle: string,
      inputContent: string,
      postUserID: string
    ): Promise<any> => {
      return new Promise((resolve, reject) => {
        if (inputTitle == "") {
          setError("タイトルを記入してください");
          return;
        }
        if (inputContent == "") {
          setError("内容を記入してください");
          return;
        }
        const params = new URLSearchParams();
        params.append("title", inputTitle);
        params.append("content", inputContent);
        params.append("post_user_id", postUserID);

        axios
          .post("/post-topic", params, {})
          .then((response) => {
            console.log("postTopicResponse axios response data", response.data);
            history.push("/");
          })
          .catch((err) => {
            console.log("err: ", err);
            setError(err.response.data.err);
          });
      });
    },
    []
  );

  const LoginORSubmitButton = () => {
    if (!props.userStatus.session) {
      return (
        <div id="login-wrapper">
          <LoginRecommendForm
            fetchUserStatus={props.fetchUserStatus}
            dialogTitle="ログインすることでトピックの投稿ができます"
            buttonExplanation="ログインしてトピックを投稿"
          ></LoginRecommendForm>
        </div>
      );
    }
    return (
      <Button
        onClick={() => {
          postTopicToDB(inputTitle, inputContent, props.userStatus.userId);
        }}
        type="submit"
        variant="contained"
        color="primary"
      >
        トピックを送信
      </Button>
    );
  };

  useEffect(() => {
    const fetchedData = async () => {
      props.fetchUserStatus();
    };
    fetchedData();
  }, []);

  return (
    <div id="post-topic-wrapper">
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
      <div>
        <span>{error}</span>
      </div>
      {LoginORSubmitButton()}
    </div>
  );
}
