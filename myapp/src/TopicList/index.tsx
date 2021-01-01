import React from 'react';
import ReactDOM from 'react-dom';
import TopicList from "./TopicList";
import NavBar from "../NavBar";

window.onload = () => {  
    if (document.getElementById('navbar')) {
      ReactDOM.render(<NavBar />, document.getElementById('navbar'));
    }
    if (document.getElementById('topic-list')) {
      ReactDOM.render(<TopicList />, document.getElementById('topic-list'));
    }
}
