import { postFire } from "./common";
import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavBar from "./NavBar";
import TopicList from "./TopicList/TopicList";
import PostTopic from "./PostTopic/PostTopic";
import TopicDetail from "./TopicDetail/TopicDetail";
import Login from "./Users/Login";
import Signup from "./Users/Signup";
import Mypage from "./Mypage/Mypage";
import Usage from "./Usage/Usage";
import UpdateProfile from "./Mypage/UpdateProfile";

export default function ProjectRouter():JSX.Element {
  const [userStatus, setUserStatus] = useState({
    userId: "",
    userName: "",
    session: false,
    comment: "",
    is_superuser: 0,
    yearsOfProgramming:""
  });
  const [bookmarkTopicInfo, setBookMarkTopicInfo] = useState([
    {
      id: "",
      topic_id: "",
      user_id: "",
    },
  ]);
  const [requestSuccessMessage, setReqestSuccessMessage] = useState([""]);

  // ユーザーの情報を取得
  const fetchUserStatus = useCallback(async (): Promise<undefined> => {
    try {
      const fetchedResult = await postFire("/users/responseUserStatus", {});
      setUserStatus(fetchedResult.data);
    } catch (e) {
      // ユーザー情報取得に失敗した場合はエラーをセット
      alert("ユーザー情報取得に失敗しました");
      return;
    }
  }, []);

  // アプリロード,ログイン時にユーザーのステータスを取得
  useEffect(() => {
    const fetchFromDB = () => {
      fetchUserStatus();
    };
    fetchFromDB();
  }, [requestSuccessMessage]);

  return (
    <Router>
      <div>
        <NavBar userStatus={userStatus} fetchUserStatus={fetchUserStatus} />
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
              requestSuccessMessage={requestSuccessMessage}
              setRequestSuccessMessage={setReqestSuccessMessage}
              bookmarkTopicInfo={bookmarkTopicInfo}
              setBookMarkTopicInfo={setBookMarkTopicInfo}
            />
          </Route>
          <Route path={`/mypage/:userID`}>
            <Mypage
              userStatus={userStatus}
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
          <Route path="/updateProfile/:userID">
            <UpdateProfile 
            profileUserID={userStatus.userId}
            userStatus ={userStatus}
            requestSuccessMessage={requestSuccessMessage}
            setRequestSuccessMessage={setReqestSuccessMessage}
            />
          </Route>
          <Route path="/usage">
            <Usage />
          </Route>
          <Route path="/">
            <TopicList
              userStatus={userStatus}
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
