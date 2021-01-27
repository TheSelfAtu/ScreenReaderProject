import React from 'react';
import ReactDOM from 'react-dom';

import ProjectRouter from "./ProjectRouter";

window.onload = () => {
    if (document.getElementById('project-index')) {
        ReactDOM.render(<ProjectRouter />, document.getElementById('project-index'));
      }
}
