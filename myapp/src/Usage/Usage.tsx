import { postFire } from "../Common";
import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { Menu } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import MenuItem from "@material-ui/core/MenuItem";

export default function Usage() {
  // アプリ使い方説明
  return (
    <div className="usage-wrapper">
      <div className="usage-wrapper-main">
        <div className="usage-each-function">
          <div className="usage-topic-list">
            <div className="usage-title">
              <Link to={`topic-list`}>
                <h2>■ トピック一覧ページ</h2>
              </Link>
            </div>
            <div className="usage-content">
              <p>
                トピック一覧ページからは投稿されたトピックを確認できます。
                <br></br>
                「受付中」と書かれたトピックに対しては回答をすることができます。
                <br></br>
                「締め切り」と書かれたトピックには回答をすることができません。
              </p>
            </div>
          </div>
          <div className="usage-post-topic">
            <div className="usage-title">
              <Link to={`post-topic`}>
                <h2>■ トピック投稿</h2>
              </Link>
            </div>
            <div className="usage-content">
              <p>ログインして話し合いたいトピックの投稿をしましょう。</p>
            </div>
          </div>
        </div>
        <div className="usage-each-function">
          <div className="usage-topic-detail">
            <div className="usage-title">
              <h2>■ 投稿されたトピックに回答する</h2>
            </div>
            <div className="usage-content">
              <p>
                トピック一覧画面から投稿されたそれぞれのトピックのページに移動できます。
                それぞれのトピックページにてメッセージを送ることができます。
              </p>
            </div>
          </div>
        </div>
        <div className="usage-each-function">
          <div className="usage-bookmark-topic">
            <div className="usage-title">
              <h2>■ ブックマーク</h2>
              <div className="usage-content">
                <p>
                  ログインしてトピックをブックマークしましょう。ブックマークしたトピックは後から
                  読み返しやすくなります。
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="usage-each-function">
          <div className="usage-post-topic">
            <div className="usage-title">
              <Link to={`post-topic`}>
                <h2>■ </h2>
              </Link>
              <div className="usage-content">
                <p>話し合いたいトピックの投稿をしましょう。</p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
