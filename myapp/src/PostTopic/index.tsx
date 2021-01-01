import React from 'react';
import ReactDOM from 'react-dom';
import PostTopic from "./PostTopic";
import NavBar from "../NavBar";


window.onload = () => {
    if (document.getElementById('navbar')) {
        ReactDOM.render(<NavBar />, document.getElementById('navbar'));
      }
    if (document.getElementById('post_topic')) {
      console.log('post')
      ReactDOM.render(<PostTopic />, document.getElementById('post_topic'));
    }
}
