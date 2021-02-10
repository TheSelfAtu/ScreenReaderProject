import { useHistory } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";
import LoginRecommendForm from "../Users/LoginRecommend";
import { Button } from "@material-ui/core";
import BookMark from "../BookMark";
import TopicTitle from "./TopicTitle";
import TopicContent from "./TopicContent";
import { PostFire } from "../Common";

interface PostTopicProps {
  // ログインユーザーのステータス
  userStatus: {
    userId: string;
    userName: string;
    session: boolean;
  };
  // ログインユーザーのブックマーク情報
  bookmarkTopicInfo: {
    id: string;
    topic_id: string;
    user_id: string;
  }[];
  // ユーザーのステータスをサーバーから取得する
  fetchUserStatus: () => Promise<any>;

  // ブックマーク情報更新のためのフック
  setBookMarkTopicInfo: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        topic_id: string;
        user_id: string;
      }[]
    >
  >;
  // リクエストが成功した時のメッセージを追加する配列
  requestSuccessMessage: string[];
  // リクエストが成功した時のメッセージを追加するフック
  setRequestSuccessMessage: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function PostTopic(props: PostTopicProps) {
  const history = useHistory();
  const [inputTitle, setInputTitle] = useState("");
  const [inputContent, setInputContent] = useState("");
  const [error, setError] = useState("");
  const showBookMark = (topicId: string) => {
    // ブックマークしているトピックIDを返す
    const bookmarkTopicID = props.bookmarkTopicInfo.map((eachTopic) => {
      return eachTopic.topic_id;
    });
    // トピックがブックマークされている場合のJSXを返す
    if (
      props.userStatus.session &&
      bookmarkTopicID.some((id) => id == topicId)
    ) {
      return (
        <BookMark
          bookmark={true}
          userID={props.userStatus.userId}
          topicID={topicId}
          endpoint="drop"
          requestSuccessMessage={props.requestSuccessMessage}
          setRequestSuccessMessage={props.setRequestSuccessMessage}
        ></BookMark>
      );
    }

    // ログイン済みでトピックがブックマークされていない場合のJSXを返す
    if (props.userStatus.session) {
      return (
        <BookMark
          bookmark={false}
          userID={props.userStatus.userId}
          topicID={topicId}
          endpoint="register"
          requestSuccessMessage={props.requestSuccessMessage}
          setRequestSuccessMessage={props.setRequestSuccessMessage}
        ></BookMark>
      );
    }
    return null;
  };
  const postTopicToDB = useCallback(
// 入力内容が不足しているときのバリデーション
    async (inputTitle: string, inputContent: string, postUserID: string) => {
      if (inputTitle == "") {
        setError("タイトルを記入してください");
        return;
      }
      if (inputContent == "") {
        setError("内容を記入してください");
        return;
      }

      const postTopicResult = PostFire("/post-topic", {
        title: inputTitle,
        content: inputContent,
        post_user_id: postUserID,
      });
    // トピック投稿に成功した場合はトピックリスト画面に遷移
    if(postTopicResult){
      history.push("/");
      return;
    }
    
    // トピック投稿に失敗した場合はエラーをセット
      setError("トピック投稿に失敗しました")
    },
    []
  );

  // ログインしていなければログインボタン、そうでなければトピック送信ボタンを返す
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
      {/* {showBookMark()} */}
      {LoginORSubmitButton()}
    </div>
  );
}
