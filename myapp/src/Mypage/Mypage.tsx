import { formatDateTime, formatTopicTitle, postFire } from "../common";
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { TopicFilter } from "../TopicFilter";
import BookMark from "../BookMark";
interface MypageProps {
  userStatus: {
    userId: string;
    userName: string;
    session: boolean;
    comment: string;
    yearsOfProgramming: string;
  };

  // ログインユーザーのブックマーク情報
  bookmarkTopicInfo: {
    id: string;
    topic_id: string;
    user_id: string;
  }[];

  // ブックマーク情報更新のための関数
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
      // トピックに対する回答の数
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
      // トピックに対する回答の数
      "COUNT(response.id)": "",
    },
  ]);

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
      const bookMarkTopic = await postFire("/users/fetch-bookmark-topic", {
        user_id: props.userStatus.userId,
      });

      props.setBookMarkTopicInfo(bookMarkTopic.data);
    };
    fetchFromDB();
  }, [props.userStatus]);

  // ブックマークの状態が変化した際に実行
  useEffect(() => {
    const fetchBookmarkInfo = async () => {
      const bookMarkTopic = await postFire("/users/fetch-bookmark-topic", {
        user_id: props.userStatus.userId,
      });
      props.setBookMarkTopicInfo(bookMarkTopic.data);
    };
    fetchBookmarkInfo();
  }, [props.requestSuccessMessage]);

  return (
    <div id="mypage-wrapper">
      <div className="profile">
        <div className="user-icon">
          <img src="../icons/person.svg" alt="usericon"></img>
        </div>
        <div className="user-name">
          <h3>{props.userStatus.userName}</h3>
        </div>
        <div className="edit">
          <Link to={`/updateProfile/${props.userStatus.userId}`}>
            <button tabIndex={-1}>設定</button>
          </Link>
        </div>

        <div className="user-comment">{props.userStatus.comment}</div>

        {props.userStatus.yearsOfProgramming}
      </div>
      <div className="topic-list-wrapper">
        <div className="topic-filter">
        <TopicFilter
          filter={filter}
          setFilter={setFilter}
          filterTabs={[
            { label: "投稿したトピック", value: "mytopic" },
            { label: "ブックマークしたトピック", value: "bookmark-topic" },
          ]}
        ></TopicFilter>
        </div>
        <hr></hr>
        {shownTopics.map((topic) => {
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
                    <div className="topic-bookmark">
                      {showBookMark(topic.id)}
                    </div>
                    <div className="topic-delete-post"></div>
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
    </div>
  );
}
