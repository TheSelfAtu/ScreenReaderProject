import { postFire } from "../common";
import { useHistory } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";
import LoginRecommendForm from "../Users/LoginRecommend";
import { Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";

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
  fetchUserStatus: () => Promise<undefined>;

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

export default function PostTopic(props: PostTopicProps):JSX.Element {
  const history = useHistory();
  const [inputTitle, setInputTitle] = useState("");
  const [inputContent, setInputContent] = useState("");
  const [error, setError] = useState("");

  // トピックを投稿する関数
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

      // トピックを投稿する
      try {
        await postFire("/post-topic", {
          title: inputTitle,
          content: inputContent,
          post_user_id: postUserID,
        });
      } catch (e) {
        // トピック投稿に失敗した場合はエラーをセット
        setError("トピック投稿に失敗しました");
        return;
      }
      // トピック投稿に成功した場合はトピックリスト画面に遷移
      history.push("/");
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

  // ユーザーのステータスを更新
  useEffect(() => {
    const fetchedData = async () => {
      props.fetchUserStatus();
    };
    fetchedData();
  }, []);

  return (
    <div id="post-topic-wrapper">
      <div className="post-topic-main">
        <div id="topic-title-wrapper">
          <h3 className="form-name">タイトルを記入してください</h3>
          <TextField
            id="title-form"
            type="textarea"
            variant="outlined"
            fullWidth
            inputProps={{ step: 300 }}
            placeholder="話し合いたいトピックのタイトルを記入してください"
            value={inputTitle}
            name="title"
            required
            onChange={(e) => {
              setInputTitle(e.target.value);
            }}
          />
        </div>
        <div id="topic-content-wrapper">
          <h3 className="form-name">話し合いたいことを記入してください</h3>
          <TextField
            id="post-topic-content-form"
            type="textarea"
            variant="outlined"
            placeholder="トピックの内容を記述してください"
            fullWidth
            multiline
            rows="6"
            inputProps={{ step: 300 }}
            value={inputContent}
            name="content"
            required
            onChange={(e) => {
              setInputContent(e.target.value);
            }}
          />
        </div>
        {/* エラーメッセージを表示 */}
        <div className="error" role="alert">
          <span>{error}</span>
        </div>
        <div className="login-or-submit">{LoginORSubmitButton()}</div>
      </div>
    </div>
  );
}
