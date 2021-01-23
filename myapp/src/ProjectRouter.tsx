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

export default function ProjectRouter() {
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
          console.log("userstatus navbar", response);
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

  useEffect(() => {
    const fetchFromDB = async () => {
      fetchUserStatus();
    };
    fetchFromDB();
  }, []);

  return (
    <Router>
      <div>
        <NavBar userStatus={userStatus}/>
        <Switch>
          <Route path="/post-topic">
            <PostTopic />
          </Route>
          <Route path={`/topic-detail/:topicID`}>
            <TopicDetail />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/">
            <TopicList />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
