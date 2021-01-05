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
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

interface TopicListProps {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: "36ch",
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
    { id: "", title: "", content: "" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const topicListInfo = await fetchTopicList();
      setTopicsInformation(topicListInfo);
    };
    fetchData();
  }, []);

  return (
    <div id="topic-list-wrapper">
      {topicsInformation.map((topicInfo) => {
        return (
          <List className={classes.root}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={topicInfo.title}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textPrimary"
                    >
                      {topicInfo.content}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </List>
        );
      })}
    </div>
  );
}

function fetchTopicList(): any {
  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url: "/",
      responseType: "json",
    })
      .then((response) => {
        console.log("axios response data", response.data);
        resolve(response.data);
      })
      .catch((err) => {
        console.log("err: ", err);
      });
  });
}
