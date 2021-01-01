import React from 'react';
import ReactDOM from 'react-dom';
import TopicDetail from "./TopicDetail";

window.onload = () => {
    if (document.getElementById('topic-detail')) {
      ReactDOM.render(<TopicDetail />, document.getElementById('topic-detail'));
    }
}
