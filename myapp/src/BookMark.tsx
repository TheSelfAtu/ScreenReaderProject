import { PostFire } from "./Common";
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
  const [error, setError] = React.useState("");

  const requestBookMarkAction = useCallback(async (): Promise<any> => {
    // endpointに応じたブックマーク操作のリクエストを送る
    try {
      await PostFire("/users/bookmark/" + props.endpoint, {
        user_id: props.userID,
        topic_id: props.topicID,
      });
    } catch (e) {
      // ブックマークの変更に失敗した場合はエラーをセット
      setError("ブックマークの変更に失敗しました");
      return;
    }
    // ブックマークに成功した場合にブックマークの状態を再取得
    props.setRequestSuccessMessage(
      prevMessageRef.current.concat(["ブックマークしました"])
    );
  }, [props.userID, props.topicID, props.bookmark]);

  // ブックマーク済みのトピックのブックマークボタン
  if (props.bookmark) {
    return (
      <div className="bookmark-wrapper">
        <Button
          variant="contained"
          color="default"
          size="small"
          className={classes.button}
          onClick={async () => {
            const requestResult = await requestBookMarkAction();
            // ブックマーク解除に成功した場合にブックマークの状態を再取得
            if (requestResult) {
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

  // ブックマークしていないのトピックのブックマークボタン
  return (
    <div className="bookmark-wrapper">
      <Button
        variant="contained"
        color="primary"
        size="small"
        className={classes.button}
        onClick={async () => {
          requestBookMarkAction();
        }}
        startIcon={<BookmarkIcon />}
      >
        ブックマークする
      </Button>{" "}
    </div>
  );
}
