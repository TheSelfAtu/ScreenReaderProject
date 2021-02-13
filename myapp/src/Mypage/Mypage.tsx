import {formatDateTime, formatTopicTitle, postFire} from "../Common"
import React, { useState, useEffect} from "react";
import { Link, useParams } from "react-router-dom";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import BookMark from "../BookMark";
import UpdateProfile from "./UpdateProfile";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flex: {
      flexGrow: 1,
    },
    paper: {
      height: 140,
      width: 100,
    },
    control: {
      padding: theme.spacing(2),
    },
    root: {
      width: "100%",
      maxWidth: "100%",
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: "inline",
    },
  })
);

interface MypageProps {
  userStatus: {
    userId: string;
    userName: string;
    session: boolean;
    comment: string;
  };

  // ログインユーザーのブックマーク情報
  bookmarkTopicInfo: {
    id: string;
    topic_id: string;
    user_id: string;
  }[];

  // ブックマーク情報更新のためのフック
  setBookMarkTopicInfo: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        topic_id: string;
        user_id: string;
      }[]
    >
  >;


  requestSuccessMessage: string[];
  setRequestSuccessMessage: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function Mypage(props: MypageProps) {
// マイページを表示するユーザのID　他者から閲覧可能
  let { userID }: any = useParams();
  const [topicsInformation, setTopicsInformation] = useState([
    {
      id: "",
      title: "",
      content: "",
      is_topic_active: 1,
      post_user_id: "",
      username: "",
      created_at: "",
      "COUNT(response.id)": "",
    },
  ]);

  //表示されるトピックのリスト
  const [shownTopics, setShownTopics] = useState([
    {
      id: "",
      title: "",
      content: "",
      is_topic_active: 1,
      post_user_id: "",
      username: "",
      created_at: "",
      "COUNT(response.id)": "",
    },
  ]);

  const [error, setError] = useState("");
  
  // 初期値は自分の投稿したトピックのみ表示
  const [filter, setFilter] = useState("mytopic");

  // トピックの受付状態などを表示するJSXを返す
  const topicStatus = (topic: any) => {
    if (topic.is_topic_active) {
      return (
        <div>
          <div className="topic-is-active-true">
            <span>受付中</span>
          </div>
          <div className="count-response">
            <span>回答</span>
            <span className="number-of-response">
              {topic["COUNT(response.id)"]}
            </span>
            <span>件</span>
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="topic-is-active-false">
          <span>締め切り</span>
        </div>
        <div className="count-response">
          <span>回答</span>
          <span className="number-of-response">
            {topic["COUNT(response.id)"]}
          </span>
          <span>件</span>
        </div>
      </div>
    );
  };

  const showBookMark = (topicId: string) => {
    // ブックマークしているトピックIDを返す
    const bookmarkTopicID = props.bookmarkTopicInfo.map((eachTopic) => {
      return eachTopic.topic_id;
    });
    // トピックがブックマークされている場合のJSXを返す
    if (
      props.userStatus.session &&
      bookmarkTopicID.some((id) => id == topicId)
    ) {
      return (
        <BookMark
          bookmark={true}
          userID={props.userStatus.userId}
          topicID={topicId}
          endpoint="drop"
          requestSuccessMessage={props.requestSuccessMessage}
          setRequestSuccessMessage={props.setRequestSuccessMessage}
        ></BookMark>
      );
    }

    // ログイン済みでトピックがブックマークされていない場合のJSXを返す
    if (props.userStatus.session) {
      return (
        <BookMark
          bookmark={false}
          userID={props.userStatus.userId}
          topicID={topicId}
          endpoint="register"
          requestSuccessMessage={props.requestSuccessMessage}
          setRequestSuccessMessage={props.setRequestSuccessMessage}
        ></BookMark>
      );
    }
    return null;
  };

  // フィルターにより表示するトピックを制御
  useEffect(() => {
    const filterTopics = () => {
      // 投稿したトピックを返す
      if (filter == "mytopic") {
        // ログインしているユーザーが投稿したトピックを返す
        const filterdTopics = topicsInformation.filter((topic) => {
          return topic.post_user_id == props.userStatus.userId;
        });
        setShownTopics(filterdTopics);
      }
      if (filter == "bookmark-topic") {
        // ブックマークされたトピックIDの配列を返す
        const bookmarkTopicID = props.bookmarkTopicInfo.map((eachTopic) => {
          return eachTopic.topic_id;
        });
        // 配列の中にIDが含まれているトピックのデータを返す
        const filterdTopics = topicsInformation.filter((topic) => {
          return bookmarkTopicID.some((id) => id == topic.id);
        });
        setShownTopics(filterdTopics);
      }
    };
    filterTopics();
  }, [filter, topicsInformation]);


// トピックとブックマーク情報を登録
  useEffect(() => {
    const fetchFromDB = async () => {
      const topicListInfo = await postFire("/", {});

      setTopicsInformation(topicListInfo.data);
      const filterdTopics = topicsInformation.filter((topic) => {
        return topic.post_user_id == props.userStatus.userId;
      });
      setShownTopics(filterdTopics);
      const bookMarkTopic = await postFire(
        "/users/fetch-bookmark-topic",
        {user_id:props.userStatus.userId},
      );

      props.setBookMarkTopicInfo(bookMarkTopic.data);
    };
    fetchFromDB();
  }, [props.userStatus]);

  // ブックマークの状態が変化した際に実行
  useEffect(() => {
    const fetchBookmarkInfo = async () => {
      const bookMarkTopic = await postFire(
        "/users/fetch-bookmark-topic",
        {user_id:props.userStatus.userId},
      );
      props.setBookMarkTopicInfo(bookMarkTopic.data);
    };
    fetchBookmarkInfo();
  }, [props.requestSuccessMessage]);

  return (
    <div id="mypage-wrapper">
      <div className="profile">
        <div className="profile-sidemenu">
          <h1>プロフィール</h1>
          <ul>
            <li>ユーザー名：{props.userStatus.userName}</li>
            <li>コメント　：{props.userStatus.comment}</li>
          </ul>
        </div>
        <UpdateProfile
          profileUserID={userID}
          userStatus={props.userStatus}
          requestSuccessMessage={props.requestSuccessMessage}
          setRequestSuccessMessage={props.setRequestSuccessMessage}
        ></UpdateProfile>
      </div>
      <div>
        <Divider variant="fullWidth" />
        <Filter setFilter={setFilter}></Filter>
      </div>
      {shownTopics.map((topic, index) => {
        return (
          <div className="topic-wrapper" key={topic.id}>
            <div className="topic-main">
              <div className="topic-main-content">
                <Grid container spacing={1}>
                  <Grid item xs={2} className="topic-side-menu">
                    {topicStatus(topic)}
                  </Grid>

                  <Grid item xs={10}>
                    <div>
                      <h2 className="topic-list-title">
                        <Link to={"/topic-detail/" + topic.id}>
                          {formatTopicTitle(topic.title)}
                        </Link>
                      </h2>
                    </div>

                    <div className="topic-list-status">
                      {showBookMark(topic.id)}
                      <div>
                        <a className="flex-status-name">
                          投稿者 {topic.username}
                        </a>
                        <span>{formatDateTime(topic.created_at)}</span>
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface FilterProps {
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}
function Filter(props: FilterProps) {
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        flexGrow: 1,
        boxShadow: "none",
        paddingBottom: "30px",
      },
    })
  );

  const classes = useStyles();

  // 最初は投稿したトピックを表示する
  const [filter, setFilter] = useState("mytopic");
  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setFilter(newValue);
    props.setFilter(newValue);
  };

  return (
    <Paper className={classes.root}>
      <Tabs
        value={filter}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        aria-label="simple tabs example"
      >
        <Tab label="投稿したトピック" value="mytopic" />
        <Tab label="ブックマークしたトピック" value="bookmark-topic" />
      </Tabs>
    </Paper>
  );
}
