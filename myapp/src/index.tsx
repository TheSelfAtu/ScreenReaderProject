import React from 'react';
import ReactDOM from 'react-dom';
import LessonPlan from "./LessonPlan";


window.onload = () => {
    if (document.getElementById('lesson-plan')) {
      ReactDOM.render(<LessonPlan />, document.getElementById('lesson-plan'));
    }
}
