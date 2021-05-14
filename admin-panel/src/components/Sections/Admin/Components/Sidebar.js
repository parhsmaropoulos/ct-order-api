import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { Grid, List, ListItem, ListItemText } from "@material-ui/core";
import "../../../../css/Pages/adminpage.css";
import { orderTabs, shopTabs } from "../Common/tabs";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    // height: "100%",
    height: "100vh",
    flexWrap: "wrap",
    width: "100%",
    margin: "8px",
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
  listTitle: {
    fontSize: "25px",
  },
  listText: {
    marginLeft: "5",
  },
  arrowButtonGrid: {
    flexDirection: "column",
    alignItems: "center",
  },
}));

export default function Sidebar(props) {
  const classes = useStyles();
  // const [open, toogleOpen] = useState(true);

  return (
    <Paper className={classes.root} elevation={3}>
      <Grid container>
        <Grid item xs={12}>
          <List className={classes.list}>
            <ListItem className={classes.listTitle}>
              <ListItemText primary={"Παραγγελίες"} />
            </ListItem>
            {orderTabs.map((tab, index) => {
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
                    <ListItemText className={classes.listText} primary={tab} />
                  </ListItem>
                </div>
              );
            })}
            <ListItem>
              <ListItemText className={classes.listTitle} primary={"Μαγαζί"} />
            </ListItem>
            {shopTabs.map((tab, index) => {
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
                    <ListItemText className={classes.listText} primary={tab} />
                  </ListItem>
                </div>
              );
            })}
          </List>
        </Grid>
        {/* <Grid item xs={1} className={classes.arrowButtonGrid}>
          <Button>
            <ArrowBackIcon />
          </Button>
        </Grid> */}
      </Grid>
    </Paper>
  );
}
