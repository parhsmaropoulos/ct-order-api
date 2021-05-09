import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { List, ListItem, ListItemText } from "@material-ui/core";
import "../../../../css/Pages/adminpage.css";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    // height: "100%",
    flexWrap: "wrap",
    width: "100%",
    // flexFlow: "column",

    "& > *": {
      margin: theme.spacing(1),
      width: "100%",
      height: "100%",
    },
    paperSection: {
      backgroundColor: "black",
    },
  },
  list: {
    width: "90%",
  },
}));

export default function SimplePaper(props) {
  const classes = useStyles();

  return (
    <Paper className={classes.root} elevation={3}>
      <List className={classes.list}>
        {props.tabs.map((tab, index) => {
          let style;
          if (tab === props.selectedTab) {
            style = "selected";
          }
          return (
            <div
              key={index}
              className={style}
              onClick={() => props.onSelectChange(tab)}
            >
              <ListItem>
                <ListItemText primary={tab} />
              </ListItem>
            </div>
          );
        })}
      </List>
    </Paper>
  );
}
