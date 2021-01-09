import axios from "axios";
import React, {
  useState,
  useEffect,
  useContext,
  ReactHTMLElement,
  useMemo,
  useCallback,
} from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";

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
  const [responsesToTopic, setResponsesToTopic] = useState([
    {
      content: "",
      created_at: "",
    },
  ]);

  const fetchData = useCallback((endpoint: string): Promise<any>=>{
    return new Promise((resolve, reject) => {
      axios({
        method: "POST",
        url: document.location + "/" + endpoint,
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
  },[])
  

  const postResponseToDB = useCallback((inputValue: string) => {
    if (inputValue === "") {
      return false;
    }
    const params = new URLSearchParams();
    params.append("inputValue", inputValue);

    axios
      .post(document.location + "/postResponse", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
      .then((response) => {
        console.log("postResponse axios response data", response.data);
        setResponsesToTopic(response.data);
      })
      .catch((err) => {
        console.log("err: ", err);
      });
  },[]);

  useEffect(() => {
    const fetchedData = async () => {
      const topicData = await fetchData("topic");
      const responseData = await fetchData("getAllResponseToTopic");
      setTopicInformation(topicData);
      setResponsesToTopic(responseData);
    };
    fetchedData();
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
            postResopnseToDB={postResponseToDB}
            fetchData={fetchData}
          ></FormDialog>
          <div id="response-content-wrapper">
            <h3>回答</h3>
            <Divider variant="fullWidth"/>

            <List>
              {responsesToTopic.map((response, index) => {
                return (
                  <React.Fragment >
                    <ListItem  alignItems="flex-start">
                      <ListItemText  primary={response.content} />
                    </ListItem>
                    <Divider variant="fullWidth" component="li" />
                  </React.Fragment>
                );
              })}
            </List>
          </div>
        </div>
      </div>
    </div>
  );
}

