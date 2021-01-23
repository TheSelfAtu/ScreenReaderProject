import axios from "axios";
import React, { useState, useEffect, useContext, useCallback } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import LoginRecommendForm from "../Users/LoginRecommend";
import SetTopicNotActiveButton from "./SetTopicNotActive";
import FormDialog from "./FormDialog";
import BookmarkIcon from '@material-ui/icons/Bookmark';

import "./css/style.css";

interface TopicDetailProps {
  requestBookMarkAction:(endpoint:string)=>Promise<any>
}

export default function TopicDetail(props: TopicDetailProps) {
  const [topicInformation, setTopicInformation] = useState({
    id: "",
    title: "",
    content: "",
    is_topic_active: 1,
    post_user_id: "",
    created_at: "",
  });
  const [responsesToTopic, setResponsesToTopic] = useState([
    {
      id: "",
      response_user_id: "",
      content: "",
      created_at: "",
    },
  ]);
  const [userStatus, setUserStatus] = useState({
    userId: "",
    userName: "",
    session: false,
  });
  const [error, setError] = useState(null);
  const [posted, setPosted] = useState(false);

  const fetchData = useCallback((endpoint: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      axios({
        method: "POST",
        url: document.location + "/" + endpoint,
        responseType: "json",
      })
        .then((response) => {
          console.log("axios fetch response data", response.data);
          resolve(response.data);
        })
        .catch((err) => {
          console.log("err: ", err);
        });
    });
  }, []);

  const fetchUserStatus = useCallback((): Promise<any> => {
    return new Promise((resolve, reject) => {
      axios({
        method: "POST",
        url: "/users/responseUserStatus",
        responseType: "json",
      })
        .then((response) => {
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

  const postResponseToDB = useCallback(
    (inputValue: string): Promise<any> => {
      return new Promise((resolve, reject) => {
        const params = new URLSearchParams();
        params.append("inputValue", inputValue);
        params.append("response_user_id", userStatus.userId);
        axios
          .post(document.location + "/postResponse", params, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          })
          .then((response) => {
            console.log("postResponse axios response data", response.data);
            const fetchedResponseData = fetchData("getAllResponseToTopic");
            setPosted(true);
          })
          .catch((err) => {
            console.log("err: ", err);
            setError(err.response.data.err);
          });
      });
    },
    [userStatus]
  );

  useEffect(() => {
    const fetchedData = async () => {
      const topicData = await fetchData("topic");
      const responseData = await fetchData("getAllResponseToTopic");
      fetchUserStatus();
      setTopicInformation(topicData);
      setResponsesToTopic(responseData);
    };
    fetchedData();
  }, [posted]);

  const topicStatus = () => {
    const datetime = formatDateTime(topicInformation.created_at);
    if (topicInformation.is_topic_active) {
      return (
        <div className="topic-status">
          <div className="topic-is-active">
            <span>回答受付中</span>
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
        <div className="topic-datetime">
          <span>投稿日時 {datetime}</span>
        </div>
      </div>
    );
  };

  const SetTopicNotActiveDialog = () => {
    if (
      topicInformation.is_topic_active == 0 ||
      userStatus.userId != topicInformation.post_user_id
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
    if (!userStatus.session) {
      return (
        <div id="login-wrapper">
          <LoginRecommendForm
            fetchUserStatus={fetchUserStatus}
            dialogTitle="ログインすることで回答を投稿できます"
            buttonExplanation="ログインして回答を投稿"
          ></LoginRecommendForm>
        </div>
      );
    }
    return (
      <div id="response-post-wrapper">
        <FormDialog
          topicTitle={topicInformation.title}
          topicContent={topicInformation.content}
          postResopnseToDB={postResponseToDB}
          fetchData={fetchData}
        ></FormDialog>
      </div>
    );
  };

  return (
    <div id="topic-detail-wrapper">
      <div className="topic-title-wrapper">
        {topicStatus()}
        <h1>{topicInformation.title}</h1>
      </div>
      <div className="topic-content">
        <h4>{topicInformation.content}</h4>
      </div>
      <div id="post-response-to-topic">
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
            <div className="topic-response-wrapper">
              <div className="topic-response-side-menu"></div>
              <div className="topic-response-main">
                <div className="topic-response-main-content">
                  {response.content}
                </div>
                <div className="topic-response-status">
                  <span>投稿{formatDateTime(response.created_at)}</span>
                </div>
              </div>
              <Divider variant="fullWidth" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatDateTime(datetime: string): string {
  const separatedDateTime = datetime.match(
    /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/
  );
  if (separatedDateTime?.length == 6) {
    console.log("separateddate", separatedDateTime[1] + "年");
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
