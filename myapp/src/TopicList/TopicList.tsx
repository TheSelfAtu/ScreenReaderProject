import axios from "axios";
import React, {
  useState,
  useEffect,
  useContext,
  ReactHTMLElement,
} from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Grid from "@material-ui/core/Grid";

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
      const topicListInfo = await fetchData("/");
      setTopicsInformation(topicListInfo);
    };
    fetchFromDB();
  }, []);

  return (
    <div id="topic-list-wrapper">
      <div>
        <h1>トピック一覧</h1>
        <Divider variant="fullWidth" />
      </div>

      {topicsInformation.map((topic, index) => {
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
                      <span>投稿{formatDateTime(topic.created_at)}</span>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </div>
            <Divider variant="fullWidth" />
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
