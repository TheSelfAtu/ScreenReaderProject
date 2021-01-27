import axios from "axios";
import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
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

interface BookMarkProps {
  bookmark: boolean;
  userID: string;
  topicID: string;
  endpoint: string;
  requestSuccessMessage: string[];
  setRequestSuccessMessage: React.Dispatch<React.SetStateAction<string[]>>;
}
export default function BookMark(props: BookMarkProps) {
  const classes = useStyles();
  const prevMessageRef = useRef(props.requestSuccessMessage);

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
          resolve(response.data);
        })
        .catch((err) => {
          console.log("err: ", err);
        });
    });
  }, [props.userID, props.topicID, props.bookmark]);

  if (props.bookmark) {
    return (
      <div className="bookmark-wrapper">
        <Button
          variant="contained"
          color="default"
          size="small"
          className={classes.button}
          onClick={async () => {
            console.log("unbook ")
            const requestResult = await requestBookMarkAction();
            // ブックマーク解除に成功した場合にブックマークの状態を再取得
            if (requestResult) {
              console.log("unbook success")
              props.setRequestSuccessMessage(
                prevMessageRef.current.concat(["ブックマークを解除しました"])
              );
              console.log(props.requestSuccessMessage);
            }
          }}
          startIcon={<BookmarkIcon />}
        >
          ブックマークを解除
        </Button>{" "}
      </div>
    );
  }

  return (
    <div className="bookmark-wrapper">
      <Button
        variant="contained"
        color="primary"
        size="small"
        className={classes.button}
        onClick={async () => {
          console.log('async')
          const requestResult = await requestBookMarkAction();
          // ブックマークに成功した場合にブックマークの状態を再取得
          if (requestResult) {
            console.log("request success book")
            props.setRequestSuccessMessage(
              prevMessageRef.current.concat(["ブックマークしました"])
            );
          }
        }}
        startIcon={<BookmarkIcon />}
      >
        ブックマークする
      </Button>{" "}
    </div>
  );
}
