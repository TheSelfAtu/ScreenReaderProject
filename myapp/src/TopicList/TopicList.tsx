import axios from "axios";
import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  ReactHTMLElement,
} from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import "./css/style.css";

interface TopicListProps {}

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

export default function TopicList(props: TopicListProps) {
  const classes = useStyles();
  const [topicsInformation, setTopicsInformation] = useState([
    {
      id: "",
      title: "",
      content: "",
      is_topic_active: 1,
      post_user_id: "",
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
      username:"",
      created_at: "",
      "COUNT(response.id)": "",
    },
  ]);
  const [userStatus, setUserStatus] = useState({
    userId: "",
    userName: "",
    session: false,
  });
  const [filter, setFilter] = useState("all");

  const fetchData = (endpoint: string, topic_id = ""): Promise<any> => {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams();
      if (topic_id != "") {
        params.append("topic_id", topic_id);
      }

      axios({
        method: "POST",
        url: endpoint,
        responseType: "json",
        params: params,
      })
        .then((response) => {
          console.log("axios response data", response.data);
          resolve(response.data);
        })
        .catch((err) => {
          console.log("err: ", err);
        });
    });
  };

  const fetchUserStatus = useCallback((): Promise<any> => {
    return new Promise((resolve, reject) => {
      axios({
        method: "POST",
        url: "/users/responseUserStatus",
        responseType: "json",
      })
        .then((response) => {
          console.log("userstatus",response)
          setUserStatus({
            userId: response.data.userId,
            userName: response.data.userName,
            session: response.data.session,
          });
        })
        .catch((err) => {
          console.log("err: ", err);
        });
    });
  }, []);

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

  useEffect(() => {
    const fetchFromDB = async () => {
      fetchUserStatus();
      const topicListInfo = await fetchData("/");
      setTopicsInformation(topicListInfo);
      setShownTopics(topicListInfo);
    };
    fetchFromDB();
  }, []);

  useEffect(() => {
    const filterTopics = async () => {
      if (filter == "all") {
        setShownTopics(topicsInformation);
      }
      if (filter == "open") {
        const filterdTopics = topicsInformation.filter((topic) => {
          return topic.is_topic_active == 1;
        });
        setShownTopics(filterdTopics);
      }
      if (filter == "closed") {
        const filterdTopics = topicsInformation.filter((topic) => {
          return topic.is_topic_active == 0;
        });
        setShownTopics(filterdTopics);
      }
      if (filter == "mytopic") {
        const filterdTopics = topicsInformation.filter((topic) => {
          return topic.post_user_id == userStatus.userId;
        });
        setShownTopics(filterdTopics);
      }
    };
    filterTopics();
  }, [filter]);

  return (
    <div id="topic-list-wrapper">
      <div>
        <h1>トピック一覧</h1>
        <Divider variant="fullWidth" />
        <Filter setFilter={setFilter}></Filter>
      </div>
      {shownTopics.map((topic, index) => {
        return (
          <div className="topic-wrapper">
            <div className="topic-main">
              <div className="topic-main-content">
                <Grid container spacing={1}>
                  <Grid item xs={2} className="topic-side-menu">
                    {/* {countResponseToTopic} */}
                    {topicStatus(topic)}
                  </Grid>

                  <Grid item xs={10}>
                    <h2>
                      <a href={"/topic-detail/" + topic.id}>
                        {formatTopicTitle(topic.title)}
                      </a>
                    </h2>
                    <div className="topic-status">
                      <div><a className="flex-status-name">投稿者 {topic.username}</a></div>
                      <span>{formatDateTime(topic.created_at)}</span>
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

function formatTopicTitle(topicTitle: string): string {
  if (topicTitle.length < 50) {
    return topicTitle;
  }
  return topicTitle.substr(0, 50) + "...";
}

function formatDateTime(datetime: string): string {
  const separatedDateTime = datetime.match(
    /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/
  );
  if (separatedDateTime?.length == 6) {
    console.log("separateddate", separatedDateTime[1] + "年");
    return (
      separatedDateTime[1] +
      "年" +
      separatedDateTime[2] +
      "月" +
      separatedDateTime[3] +
      "日" +
      separatedDateTime[4] +
      ":" +
      separatedDateTime[5]
    );
  }
  return "";
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
    console.log(newValue);
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
      </Tabs>
    </Paper>
  );
}
