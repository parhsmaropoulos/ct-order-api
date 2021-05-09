import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { ListItem, ListItemText } from "@material-ui/core";
import "../../../../css/Pages/adminpage.css";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    // height: "100%",
    flexWrap: "wrap",
    maxHeight: "100vh",
    overflowY: "auto",
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
}));

export default function InnerSidebarCatalog(props) {
  const classes = useStyles();
  return (
    <Paper className={classes.root} elevation={3}>
      {props.type === "products"
        ? props.categories.map((category, index) => (
            <div
              key={index}
              className={
                category.name === props.selectedCategory ? "selected" : ""
              }
            >
              <ListItem>
                <ListItemText
                  onClick={(e) => props.onCategoryChange(category.name)}
                  primary={category.name}
                />
              </ListItem>
            </div>
          ))
        : props.categories.map((category, index) => (
            <div
              key={index}
              className={index === props.selectedCategory ? "selected" : ""}
            >
              <ListItem>
                <ListItemText
                  onClick={(e) => props.onCategoryChange(index)}
                  primary={category}
                />
              </ListItem>
            </div>
          ))}
    </Paper>
  );
}
