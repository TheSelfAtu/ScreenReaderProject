import { postFire } from "./common";
import React, { useCallback, useRef } from "react";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import Button from "@material-ui/core/Button";

interface BookMarkProps {
  bookmark: boolean;
  userID: string;
  topicID: string;
  endpoint: string;
  requestSuccessMessage: string[];
  setRequestSuccessMessage: React.Dispatch<React.SetStateAction<string[]>>;
}
export default function BookMark(props: BookMarkProps):JSX.Element {
  const prevMessageRef = useRef(props.requestSuccessMessage);

  const requestBookMarkAction = useCallback(async (): Promise<undefined> => {
    // endpointに応じたブックマーク操作のリクエストを送る
    try {
      await postFire("/users/bookmark/" + props.endpoint, {
        user_id: props.userID,
        topic_id: props.topicID,
      });
    } catch (e) {
      // ブックマークの変更に失敗した場合はアラートをだす
      alert("ブックマークの変更に失敗しました");
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
          onClick={async () => {
            const requestResult = await requestBookMarkAction();
            // ブックマーク解除に成功した場合にブックマークの状態を再取得
            if (requestResult) {
              props.setRequestSuccessMessage(
                prevMessageRef.current.concat(["ブックマークを解除しました"])
              );
            }
          }}
          startIcon={<BookmarkIcon />}
        >
          ブックマークを解除
        </Button>{" "}
      </div>
    );
  }

  // ブックマークしていないトピックのブックマークボタン
  return (
    <div className="bookmark-wrapper">
      <Button
        variant="contained"
        color="primary"
        size="small"
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
