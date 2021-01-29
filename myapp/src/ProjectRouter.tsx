import axios from "axios";
import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  ReactHTMLElement,
} from "react";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import NavBar from "./NavBar";
import TopicList from "./TopicList/TopicList";
import PostTopic from "./PostTopic/PostTopic";
import TopicDetail from "./TopicDetail/TopicDetail";
import Login from "./Users/Login";
import Signup from "./Users/Signup";
import Mypage from "./Mypage/Mypage";

export default function ProjectRouter() {
  const [userStatus, setUserStatus] = useState({
    userId: "",
    userName: "",
    session: false,
    comment:"",
    is_superuser:0,
  });
  const [bookmarkTopicInfo, setBookMarkTopicInfo] = useState([
    {
      id: "",
      topic_id: "",
      user_id: "",
    },
  ]);
  const [requestSuccessMessage, setReqestSuccessMessage] = useState([""]);

  const fetchUserStatus = useCallback((): Promise<any> => {
    return new Promise((resolve, reject) => {
      axios({
        method: "POST",
        url: "/users/responseUserStatus",
        responseType: "json",
      })
        .then((response) => {
          console.log("userstatus navbar", response);
          setUserStatus({
            userId: response.data.userId,
            userName: response.data.userName,
            session: response.data.session,
            comment: response.data.comment,
            is_superuser:response.data.is_superuser
          });
        })
        .catch((err) => {
          console.log("err: ", err);
        });
    });
  }, []);

  const requestToAPIServer = useCallback(
    (
      endpoint: string,
      user_id: string = "",
      topic_id: string = ""
    ): Promise<any> => {
      const params = new URLSearchParams();
      if (user_id != null) {
        params.append("user_id", user_id);
      }
      if (topic_id != null) {
        params.append("topic_id", topic_id);
      }

      return new Promise((resolve, reject) => {
        axios({
          method: "POST",
          url: endpoint,
          responseType: "json",
          params: params,
        })
          .then((response) => {
            console.log("request result", response);
            resolve(response.data);
          })
          .catch((err) => {
            console.log("err: ", err);
          });
      });
    },
    []
  );

  // アプリロード時にユーザーのステータスを取得
  useEffect(() => {
    const fetchFromDB = async () => {
      fetchUserStatus();
    };
    fetchFromDB();
  }, []);

  return (
    <Router>
      <div>
        <NavBar
          userStatus={userStatus}
          requestToAPIServer={requestToAPIServer}
          fetchUserStatus={fetchUserStatus}
        />
        <Switch>
          <Route path="/post-topic">
            <PostTopic
              userStatus={userStatus}
              fetchUserStatus={fetchUserStatus}
              bookmarkTopicInfo={bookmarkTopicInfo}
              setBookMarkTopicInfo={setBookMarkTopicInfo}
              requestSuccessMessage={requestSuccessMessage}
              setRequestSuccessMessage={setReqestSuccessMessage}
            />
          </Route>
          <Route path={`/topic-detail/:topicID`}>
            <TopicDetail
              userStatus={userStatus}
              fetchUserStatus={fetchUserStatus}
              requestToApiServer={requestToAPIServer}
              requestSuccessMessage={requestSuccessMessage}
              setRequestSuccessMessage={setReqestSuccessMessage}
              bookmarkTopicInfo={bookmarkTopicInfo}
              setBookMarkTopicInfo={setBookMarkTopicInfo}
            />
          </Route>
          <Route path={`/mypage/:userID`}>
            <Mypage
              userStatus={userStatus}
              requestToApiServer={requestToAPIServer}
              requestSuccessMessage={requestSuccessMessage}
              setRequestSuccessMessage={setReqestSuccessMessage}
              bookmarkTopicInfo={bookmarkTopicInfo}
              setBookMarkTopicInfo={setBookMarkTopicInfo}
            />
          </Route>
          <Route path="/login">
            <Login fetchUserStatus={fetchUserStatus} />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/">
            <TopicList
              userStatus={userStatus}
              requestToApiServer={requestToAPIServer}
              requestSuccessMessage={requestSuccessMessage}
              setRequestSuccessMessage={setReqestSuccessMessage}
              bookmarkTopicInfo={bookmarkTopicInfo}
              setBookMarkTopicInfo={setBookMarkTopicInfo}
            />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
