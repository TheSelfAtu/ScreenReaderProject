import axios from "axios";
import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  ReactHTMLElement,
} from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
  })
);

interface BookMarkActionButtonProps {
userID:string
topicID:string
    endpoint: string;
}
export default function BookMarkActionButton(props: BookMarkActionButtonProps) {
  const classes = useStyles();
  const requestBookMarkAction = useCallback((): Promise<any> => {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams();
      params.append("user_id", props.userID);
      params.append("topic_id", props.topicID);
      axios({
        method: "POST",
        url: "/users/bookmark/" + props.endpoint,
        responseType: "json",
        params: params,
      })
        .then((response) => {
          console.log("bookmark", response);
        })
        .catch((err) => {
          console.log("err: ", err);
        });
    });
  }, []);

  return (
    <div className="bookmark-wrapper">
      <Button
        variant="contained"
        color="default"
        size="small"
        className={classes.button}
        onClick={() => {
          requestBookMarkAction();
        }}
        startIcon={<BookmarkIcon />}
      >
        ブックマークする
      </Button>{" "}
    </div>
  );
}
