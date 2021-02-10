import { PostFire } from "../Common";
import { formatDateTime, formatTopicTitle } from "../Common";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import BookMark from "../BookMark";
import "./css/style.css";
import { Button } from "@material-ui/core";

interface TopicListProps {
  userStatus: {
    userId: string;
    userName: string;
    session: boolean;
    is_superuser: number;
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

export default function TopicList(props: TopicListProps) {
  const prevMessageRef = useRef(props.requestSuccessMessage);
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

  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
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

  const DeletePostDataButton = (topic_id: string) => {
    // 管理者のみ操作できる記事削除ボタンを返す
    if (props.userStatus.is_superuser == 1) {
      return (
        <Button
          color="secondary"
          onClick={async () => {
            try {
              await PostFire("/delete-topic", { topic_id: topic_id });
              props.setRequestSuccessMessage(
                prevMessageRef.current.concat(["トピックを削除しました"])
              );
            } catch (e) {
              // トピックの削除に失敗した場合
              setError("トピックの削除に失敗しました");
              return;
            }
          }}
        >
          トピックを削除する
        </Button>
      );
    }
    return null;
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

  // ユーザーの状態が変化した際にトピックリストとブックマークを更新
  useEffect(() => {
    const fetchFromDB = async () => {
      const topicListInfo = await PostFire("/", {});
      setTopicsInformation(topicListInfo.data);
      setShownTopics(topicListInfo.data);
      const bookMarkTopic = await PostFire(
        "/users/fetch-bookmark-topic",
        {user_id:props.userStatus.userId},
      );
      props.setBookMarkTopicInfo(bookMarkTopic.data);
    };
    fetchFromDB();
  }, [props.userStatus]);

  // ブックマークの状態が変化した際にブックマーク情報を再取得
  useEffect(() => {
    const fetchBookmarkInfo = async () => {
      try {
        const bookMarkTopic = await PostFire("/users/fetch-bookmark-topic", {
          user_id: props.userStatus.userId,
        });
        props.setBookMarkTopicInfo(bookMarkTopic.data);
      } catch (e) {
        // ブックマークの変更に失敗した場合
        if(props.userStatus.session){
          // setError("ブックマークの変更に失敗しました");
        }
      }
    };
    fetchBookmarkInfo();
  }, [props.requestSuccessMessage]);

  // フィルターにより表示するトピックを制御
  useEffect(() => {
    const filterTopics = async () => {
      // すべてのトピックを返す
      if (filter == "all") {
        setShownTopics(topicsInformation);
      }
      if (filter == "open") {
        // トピックへの回答が受付中のトピックを返す
        const filterdTopics = topicsInformation.filter((topic) => {
          return topic.is_topic_active == 1;
        });
        setShownTopics(filterdTopics);
      }
      if (filter == "closed") {
        // トピックへの回答が締め切られたトピックを返す
        const filterdTopics = topicsInformation.filter((topic) => {
          return topic.is_topic_active == 0;
        });
        setShownTopics(filterdTopics);
      }
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
  }, [filter]);

  // エラーが発生した際にアラートを表示
  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  return (
    <div id="topic-list-wrapper">
      <title>トピック一覧</title>
      <div>
        <h1>トピック一覧</h1>
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
                      {DeletePostDataButton(topic.id)}
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

  const [filter, setFilter] = useState("all");
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
        <Tab label="すべて表示" value="all" />
        <Tab label="受付中" value="open" />
        <Tab label="締め切り" value="closed" />
        <Tab label="投稿したトピック" value="mytopic" />
        <Tab label="ブックマークしたトピック" value="bookmark-topic" />
      </Tabs>
    </Paper>
  );
}
