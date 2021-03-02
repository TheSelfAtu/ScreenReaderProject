import { postFire, formatDateTime } from "../common";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import LoginRecommendForm from "../Users/LoginRecommend";
import SetTopicNotActiveButton from "./SetTopicNotActive";
import BookMark from "../BookMark";
import { Button, TextareaAutosize } from "@material-ui/core";

interface TopicDetailProps {
  // ユーザーの状態
  userStatus: {
    userId: string;
    userName: string;
    session: boolean;
    comment: string;
  };
  fetchUserStatus: () => Promise<undefined>;
  // ログインユーザーのブックマーク情報
  bookmarkTopicInfo: {
    id: string;
    topic_id: string;
    user_id: string;
  }[];

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

  requestSuccessMessage: string[];
  setRequestSuccessMessage: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function TopicDetail(props: TopicDetailProps): JSX.Element {
  // 表示しているトピックのID
  const { topicID }: any = useParams<string>();
  const prevMessageRef = useRef(props.requestSuccessMessage);

  const [topicInformation, setTopicInformation] = useState({
    id: "",
    title: "",
    content: "",
    is_topic_active: 1,
    post_user_id: "",
    username: "",
    created_at: "",
  });
  const [responsesToTopic, setResponsesToTopic] = useState([
    {
      id: "",
      response_user_id: "",
      content: "",
      created_at: "",
      username: "",
    },
  ]);
  const [responseMessage, setResponseMessage] = useState("");

  const [error, setError] = useState("");

  const postResponseToDB = useCallback(
    async (inputValue: string): Promise<undefined> => {
      // 入力内容が不足しているときのバリデーション
      if (inputValue == "") {
        setError("回答を記入してください");
        return;
      }

      // トピックへの回答を投稿する
      try {
        await postFire("/topic-detail/" + topicID + "/postResponse", {
          inputValue: inputValue,
          response_user_id: props.userStatus.userId,
        });
      } catch (e) {
        // 回答の投稿に失敗した場合はエラーをセット
        setError("回答の投稿に失敗しました");
        return;
      }
      // フォームとエラーの内容を初期化
      setResponseMessage("");
      setError("");
      props.setRequestSuccessMessage(
        prevMessageRef.current.concat(["回答を送信しました"])
      );
    },
    [props.userStatus]
  );

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

  useEffect(() => {
    const fetchFromDB = async () => {
      // トピックの情報を取得
      const topicData = await postFire(
        "/topic-detail/" + topicID + "/topic",
        {}
      );
      // トピックに対する回答を取得
      const responseData = await postFire(
        "/topic-detail/" + topicID + "/getAllResponseToTopic",
        {}
      );
      // ブックマークの情報を取得
      const bookMarkTopic = await postFire("/users/fetch-bookmark-topic", {
        user_id: props.userStatus.userId,
      });
      props.setBookMarkTopicInfo(bookMarkTopic.data);

      // 取得したデータをセット
      setTopicInformation(topicData.data);
      setResponsesToTopic(responseData.data);
      props.setBookMarkTopicInfo(bookMarkTopic.data);
    };
    fetchFromDB();
  }, [props.userStatus, props.requestSuccessMessage]);

  // 各トピックの状態を返す
  const topicStatus = () => {
    const datetime = formatDateTime(topicInformation.created_at);
    if (topicInformation.is_topic_active) {
      return (
        <div className="topic-status">
          <div className="topic-active">
            <span>回答受付中</span>
          </div>
          <div className="topic-post-username">
            <span>投稿者 {topicInformation.username}</span>
          </div>
          <div className="topic-datetime">
            <span>投稿日時 {datetime}</span>
          </div>
        </div>
      );
    }
    return (
      <div className="topic-status">
        <div className="topic-not-active">
          <span>回答締め切り </span>
        </div>
        <div className="topic-post-username">
          <span>投稿者 {topicInformation.username}</span>
        </div>
        <div className="topic-datetime">
          <span>投稿日時 {datetime}</span>
        </div>
      </div>
    );
  };

  const SetTopicNotActiveDialog = () => {
    if (
      topicInformation.is_topic_active == 0 ||
      props.userStatus.userId != topicInformation.post_user_id
    ) {
      return "";
    }
    return (
      <div className="set-topic-not-active">
        <SetTopicNotActiveButton
          topicId={topicInformation.id}
        ></SetTopicNotActiveButton>
      </div>
    );
  };

  const Form = () => {
    // トピックへの回答が締め切りの場合は何も返さない
    if (topicInformation.is_topic_active == 0) {
      return "";
    }
    // ログインしている場合はメッセージ送信フォームを返す
    if (props.userStatus.session) {
      return (
        <div className="response-form">
          <div className="response-main">
            <div className="content">
              <TextareaAutosize
                className="response-textarea"
                rowsMin="3"
                value={responseMessage}
                onChange={(e) => {
                  setResponseMessage(e.target.value);
                }}
                aria-label="トピックへのメッセージを送信"
                placeholder="メッセージを送信"
              ></TextareaAutosize>
            </div>
            <div role="alert">
              <span>{error}</span>
            </div>
            <div className="form-button">
              <Button
                className="button"
                variant="contained"
                color="primary"
                onClick={() => {
                  postResponseToDB(responseMessage);
                }}
              >
                メッセージを送信
              </Button>
            </div>
          </div>
        </div>
      );
    }
  };

  // ログインしていない場合ログイン用フォームを表示するボタンを返す
  const LoginDialogButton = () => {
    // トピックへの回答が締め切りの場合は何も返さない
    if (topicInformation.is_topic_active == 0 || props.userStatus.session) {
      return "";
    }
    // ログインしていない場合ログイン用フォームを表示するボタンを返す
    if (!props.userStatus.session) {
      return (
        <div className="login-button">
          <LoginRecommendForm
            fetchUserStatus={props.fetchUserStatus}
            dialogTitle="ログインすることで回答を投稿できます"
            buttonExplanation="ログインして回答を投稿"
          ></LoginRecommendForm>
        </div>
      );
    }
  };

  return (
    <div id="topic-detail-wrapper">
      <div className="topic-detail-main">
        <div className="topic-wrapper">
          <div className="topic-info">{topicStatus()}</div>
          <div className="topic-title-wrapper">
            <h1>{topicInformation.title}</h1>
          </div>
          <div className="topic-content-wrapper">
            <div className="topic-content">
              <h4>{topicInformation.content}</h4>
            </div>
            <div className="bookmark">
              {SetTopicNotActiveDialog()}
              {showBookMark(topicID)}
            </div>
          </div>
        </div>

        <div className="topic-response-wrapper">
          <div className="topic-response-info">
            <h3>
              <span>回答</span>
              <span className="number-of-response">
                {responsesToTopic.length}
              </span>
              <span>件</span>
            </h3>
          </div>
          <div id="response-main-wrapper">
            <hr></hr>
            {responsesToTopic.map((response) => {
              return (
                <div className="each-response-wrapper" key={response.id}>
                  <div className="content">{response.content}</div>
                  <div className="response-info">
                    <div className="response-username">
                      <span>投稿者 {response.username}</span>
                    </div>
                    <div>
                      <span>{formatDateTime(response.created_at)}</span>
                    </div>
                  </div>
                  <hr></hr>
                </div>
              );
            })}
            {/* ログインしていない場合、ログイン用フォームを表示 */}
            {LoginDialogButton()}
          </div>
        </div>
        {/* ログインしている場合、メッセージの投稿フォームを表示 */}
        <div className="form">{Form()}</div>
      </div>
    </div>
  );
}
