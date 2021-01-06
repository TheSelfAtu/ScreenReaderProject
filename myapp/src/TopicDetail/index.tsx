import React from "react";
import ReactDOM from "react-dom";
import TopicDetail from "./TopicDetail";
import NavBar from "../NavBar";

window.onload = () => {
  if (document.getElementById("navbar")) {
    ReactDOM.render(<NavBar />, document.getElementById("navbar"));
  }
  if (document.getElementById("topic-detail")) {
    ReactDOM.render(<TopicDetail />, document.getElementById("topic-detail"));
  }
};
