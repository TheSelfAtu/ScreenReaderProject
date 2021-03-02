import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

interface TopicFilterProps {
  // 現在適用中のフィルター
  filter: string;
  // フィルターの項目
  filterTabs: { label: string; value: string }[];
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}

export function TopicFilter(props: TopicFilterProps):JSX.Element {
  const useStyles = makeStyles(() =>
    createStyles({
      root: {
        flexGrow: 2,
        boxShadow: "none",
      },
    })
  );

  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    props.setFilter(newValue);
  };

  return (
    <Paper className={classes.root}>
      <Tabs
        value={props.filter}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        aria-label="表示するトピック"
      >
        {/* それぞれの場面で必要なフィルターのタブを表示する */}
        {props.filterTabs.map((filterTab) => {
          return <Tab label={filterTab.label} value={filterTab.value} key={filterTab.label}/>;
        })}
      </Tabs>
    </Paper>
  );
}
