import React from 'react';
import ReactDOM from 'react-dom';
import NavBar from "../NavBar";
import Login from "./Login";
import Signup from "./Signup";


window.onload = () => {
    if (document.getElementById('navbar')) {
        ReactDOM.render(<NavBar />, document.getElementById('navbar'));
      }
    if (document.getElementById('signup')) {
      ReactDOM.render(<Signup />, document.getElementById('signup'));
    }
    if (document.getElementById('login')) {
      ReactDOM.render(<Login />, document.getElementById('login'));
    }
}
