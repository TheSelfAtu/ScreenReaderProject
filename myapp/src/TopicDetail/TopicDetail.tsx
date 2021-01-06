import axios from "axios";
import React, {
  useState,
  useEffect,
  useContext,
  ReactHTMLElement,
} from "react";

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import ButtonAppBar from "../NavBar";

import FormDialog from "./FormDialog";
interface TopicDetailProps {}

export default function TopicDetail(props: TopicDetailProps) {
  const [topicInformation, setTopicInformation] = useState({
    id: "",
    title: "",
    content: "",
  });
  const [responsesToTopic, setResponsesToTopic] = useState({
    content: "",
    created_at: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const topicData = await fetchTopicData("topic");
      // const responseData = await fetchTopicData("response");
      setTopicInformation(topicData);
      // setResponsesToTopic(responseData);
    };
    fetchData();
  }, []);

  return (
    <div id="topic-detail-wrapper">
      <h2>{topicInformation.title}</h2>
      <h4>{topicInformation.content}</h4>
      <div id="response-to-topic">
        <div id="response-form">
          <FormDialog
            topicTitle={topicInformation.title}
            topicContent={topicInformation.content}
          ></FormDialog>
        </div>
      </div>
    </div>
  );
}

function fetchTopicData(endpoint: string): any {
  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url: document.location+"/"+endpoint,
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
