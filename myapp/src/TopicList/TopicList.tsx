import { postFire } from "../common";
import { formatDateTime, formatTopicTitle } from "../common";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { TopicFilter } from "../TopicFilter";
import { Link } from "react-router-dom";
import BookMark from "../BookMark";
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

  // ブックマークしているトピックIDを返す
  const bookmarkTopicID = useMemo(
    () =>
      props.bookmarkTopicInfo.map((eachTopic) => {
        return eachTopic.topic_id;
      }),
    [props.bookmarkTopicInfo]
  );

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

  // 表示するトピックを制限するフィルター
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
          size="small"
          color="secondary"
          onClick={async () => {
            try {
              await postFire("/delete-topic", { topic_id: topic_id });
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
      const topicListInfo = await postFire("/", {});
      setTopicsInformation(topicListInfo.data);
      setShownTopics(topicListInfo.data);
      const bookMarkTopic = await postFire("/users/fetch-bookmark-topic", {
        user_id: props.userStatus.userId,
      });
      props.setBookMarkTopicInfo(bookMarkTopic.data);
    };
    fetchFromDB();
  }, [props.userStatus]);

  // ブックマークの状態が変化した際にブックマーク情報を再取得
  useEffect(() => {
    const fetchBookmarkInfo = async () => {
      try {
        const bookMarkTopic = await postFire("/users/fetch-bookmark-topic", {
          user_id: props.userStatus.userId,
        });
        props.setBookMarkTopicInfo(bookMarkTopic.data);
      } catch (e) {
        // ブックマークの変更に失敗した場合
        if (props.userStatus.session) {
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
    <div className="topic-list-wrapper">
      {/* トピックのフィルター部分 */}
      <div className="topic-filter">
        <TopicFilter
          filter={filter}
          setFilter={setFilter}
          filterTabs={[
            { label: "すべて表示", value: "all" },
            { label: "受付中", value: "open" },
            { label: "締め切り", value: "close" },
            { label: "投稿したトピック", value: "mytopic" },
            { label: "ブックマークしたトピック", value: "bookmark-topic" },
          ]}
        ></TopicFilter>
      </div>
      <hr></hr>
      {/* 各トピックを表示 */}
      {shownTopics.map((topic, index) => {
        return (
          <div className="topic-wrapper" key={topic.id}>
            <div className="topic-side-menu">{topicStatus(topic)}</div>
            <div className="topic-main">
              <h2 className="topic-title">
                <Link to={"/topic-detail/" + topic.id}>
                  {formatTopicTitle(topic.title)}
                </Link>
              </h2>

              <div className="topic-main-bottom">
                <div className="topic-change-button">
                  <div className="topic-bookmark">{showBookMark(topic.id)}</div>
                  <div className="topic-delete-post"></div>
                  {DeletePostDataButton(topic.id)}
                </div>
                <div className="topic-info">
                  <a className="sender-name">投稿者 {topic.username}</a>
                  <span className="post-date">
                    {formatDateTime(topic.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
