import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import LoginRecommendForm from "../Users/LoginRecommend";
import { Button } from "@material-ui/core";

import TopicTitle from "./TopicTitle";
import TopicContent from "./TopicContent";

interface PostTopicProps {}

export default function PostTopic(props: PostTopicProps) {
  const [inputTitle, setInputTitle] = useState("");
  const [inputContent, setInputContent] = useState("");
  const [error, setError] = useState(null);
  const [userStatus, setUserStatus] = useState({
    userId: "",
    userName: "",
    session: false,
  });

  const fetchUserStatus = useCallback((): Promise<any> => {
    return new Promise((resolve, reject) => {
      axios({
        method: "POST",
        url: "/users/responseUserStatus",
        responseType: "json",
      })
        .then((response) => {
          console.log("fetchUserStatus response ", response.data);
          setUserStatus({
            userId: response.data.userId,
            userName: response.data.userName,
            session: response.data.session,
          });
        })
        .catch((err) => {
          console.log("err: ", err);
        });
    });
  }, []);

  const postTopicToDB = useCallback(
    (
      inputTitle: string,
      inputContent: string,
      postUserID: string
    ): Promise<any> => {
      return new Promise((resolve, reject) => {
        const params = new URLSearchParams();
        params.append("title", inputTitle);
        params.append("content", inputContent);
        params.append("post_user_id", postUserID);

        axios
          .post("/post-topic", params, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          })
          .then((response) => {
            console.log("postTopicResponse axios response data", response.data);
            location.href = "/";
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
    if (!userStatus.session) {
      return (
        <div id="login-wrapper">
          <LoginRecommendForm
            fetchUserStatus={fetchUserStatus}
            dialogTitle="ログインすることでトピックの投稿ができます"
            buttonExplanation="ログインしてトピックを投稿"
          ></LoginRecommendForm>
        </div>
      );
    }
    return (
      <Button
        onClick={() => {
          postTopicToDB(inputTitle, inputContent, userStatus.userId);
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
      fetchUserStatus();
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
