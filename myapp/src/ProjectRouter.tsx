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
  
  const requestToAPIServer = useCallback((endpoint:string): Promise<any> => {
    return new Promise((resolve, reject) => {
      axios({
        method: "POST",
        url: endpoint,
        responseType: "json",
      })
        .then((response) => {
          console.log("request result", response);
          resolve(response)
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
        <NavBar userStatus={userStatus} requestToAPIServer={requestToAPIServer} fetchUserStatus={fetchUserStatus}/>
        <Switch>
          <Route path="/post-topic">
            <PostTopic />
          </Route>
          <Route path={`/topic-detail/:topicID`}>
            <TopicDetail requestBookMarkAction={requestToAPIServer}/>
          </Route>
          <Route path="/login">
            <Login fetchUserStatus={fetchUserStatus}/>
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/">
            <TopicList userStatus={userStatus} requestBookMarkAction={requestToAPIServer} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
