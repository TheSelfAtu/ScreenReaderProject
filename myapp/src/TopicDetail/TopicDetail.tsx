import axios from "axios";
import React, { useState, useEffect, useContext, useCallback } from "react";
import { useRouteMatch, useParams } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import LoginRecommendForm from "../Users/LoginRecommend";
import SetTopicNotActiveButton from "./SetTopicNotActive";
import PostResponseFormDialog from "./PostResponseFormDialog";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import BookMark from "../BookMark";

import "./css/style.css";

interface TopicDetailProps {
  // ユーザーの状態
  userStatus: {
    userId: string;
    userName: string;
    session: boolean;
    comment:string;
  };
  fetchUserStatus: () => Promise<any>;
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

  requestToApiServer: (
    endpoint: string,
    user_id: string,
    topic_id: string
  ) => Promise<any>;

  requestSuccessMessage: string[];
  setRequestSuccessMessage: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function TopicDetail(props: TopicDetailProps) {
  let { topicID }: any = useParams();

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

  const [error, setError] = useState(null);

  const postResponseToDB = useCallback(
    (inputValue: string): Promise<any> => {
      return new Promise((resolve, reject) => {
        const params = new URLSearchParams();
        params.append("inputValue", inputValue);
        params.append("response_user_id", props.userStatus.userId);
        axios({
          method: "POST",
          url: "/topic-detail/" + topicID + "/postResponse",
          responseType: "json",
          params: params,
        })
          .then((response) => {
            console.log("postResponse axios response data", response.data);
            const fetchedResponseData = props.requestToApiServer(
              "/topic-detail/" + topicID + "/topic",
              "",
              ""
            );
            resolve(true);
          })
          .catch((err) => {
            console.log("err: ", err);
            setError(err.response.data.err);
          });
      });
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
      const topicData = await props.requestToApiServer(
        "/topic-detail/" + topicID + "/topic",
        "",
        ""
      );

      const responseData = await props.requestToApiServer(
        "/topic-detail/" + topicID + "/getAllResponseToTopic",
        "",
        ""
      );
      const bookMarkTopic = await props.requestToApiServer(
        "/users/fetch-bookmark-topic",
        props.userStatus.userId,
        ""
      );
      props.setBookMarkTopicInfo(bookMarkTopic);

      setTopicInformation(topicData);
      setResponsesToTopic(responseData);
      props.setBookMarkTopicInfo(bookMarkTopic);
    };
    fetchFromDB();
  }, [props.userStatus, props.requestSuccessMessage]);

  const topicStatus = () => {
    const datetime = formatDateTime(topicInformation.created_at);
    if (topicInformation.is_topic_active) {
      return (
        <div className="topic-status">
          <div className="topic-is-active">
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
        <div className="topic-is-active">
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

  const DialogButton = () => {
    if (topicInformation.is_topic_active == 0) {
      return "";
    }
    if (!props.userStatus.session) {
      return (
        <div id="login-wrapper">
          <LoginRecommendForm
            fetchUserStatus={props.fetchUserStatus}
            dialogTitle="ログインすることで回答を投稿できます"
            buttonExplanation="ログインして回答を投稿"
          ></LoginRecommendForm>
        </div>
      );
    }
    return (
      <div id="response-post-wrapper">
        <PostResponseFormDialog
          topicTitle={topicInformation.title}
          topicContent={topicInformation.content}
          postResopnseToDB={postResponseToDB}
          requestSuccessMessage={props.requestSuccessMessage}
          setRequestSuccessMessage={props.setRequestSuccessMessage}
        ></PostResponseFormDialog>
      </div>
    );
  };

  return (
    <div id="topic-detail-wrapper">
      <div className="topic-title-wrapper">
        {topicStatus()}
        <h1>{topicInformation.title}</h1>
      </div>
      <div className="topic-content-wrapper">
        <div className="topic-content">
          <h4>{topicInformation.content}</h4>
        </div>
        {showBookMark(topicID)}
      </div>

      <Divider variant="fullWidth" />
      <div id="response-content-wrapper">
        <h3>
          <span>回答</span>
          <span className="number-of-response">{responsesToTopic.length}</span>
          <span>件</span>
        </h3>
        <Divider variant="fullWidth" />

        {responsesToTopic.map((response, index) => {
          return (
            <div className="topic-response-wrapper" key={response.id}>
              <div className="topic-response-side-menu"></div>
              <div className="topic-response-main">
                <div className="topic-response-main-content">
                  {response.content}
                </div>
                <div className="topic-response-status">
                  <div>
                    <span>投稿者 {response.username}</span>
                  </div>
                  <div>
                    <span>{formatDateTime(response.created_at)}</span>
                  </div>
                </div>
              </div>
              <Divider variant="fullWidth" />
            </div>
          );
        })}
      </div>
      <div id="post-response-form">
        <div className="dialog-buttons">
          {SetTopicNotActiveDialog()}
          {DialogButton()}
        </div>
        <div>
          <span>{error}</span>
        </div>
      </div>
    </div>
  );
}

function formatDateTime(datetime: string): string {
  const separatedDateTime = datetime.match(
    /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/
  );
  if (separatedDateTime?.length == 6) {
    return (
      separatedDateTime[1] +
      "年" +
      separatedDateTime[2] +
      "月" +
      separatedDateTime[3] +
      "日" +
      separatedDateTime[4] +
      ":" +
      separatedDateTime[5]
    );
  }
  return "";
}
