import React, { useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { useDispatch } from "react-redux";
import {
  accept_order,
  complete_order,
  reject_order,
} from "../../../../actions/orders";
import ReactToPrint from "react-to-print";
import PrintComponent from "../Common/PrintComponent";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    // height: "100%",
    // flexWrap: "no-wrap",
    overflowY: "auto",
    maxHeight: "100vh",
    flexDirection: "row",

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
  printButton: {
    backgroundColor: "red",
  },
  buttonsPaper: {
    margin: "10px",
  },
  printPaper: {
    textAlign: "right",
  },
  acceptButton: {
    marginLeft: "5px",
    marginRight: "5px",
    backgroundColor: "green",
  },
  rejectButton: {
    backgroundColor: "red",
  },
  compleButton: {
    backgroundColor: "beige",
  },
}));

const timeOptions = [
  {
    value: "10",
    label: "10",
  },
  {
    value: "15",
    label: "15",
  },
  {
    value: "20",
    label: "20",
  },
  {
    value: "25",
    label: "25",
  },
  {
    value: "30",
    label: "30",
  },
];

export default function OrderUserDetailsRow(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [time, changeTime] = useState(15);

  const componentRef = useRef();
  const setTime = (event) => {
    changeTime(event.target.value);
  };
  // console.log(props);
  const address =
    props.order.address.address_name +
    " " +
    props.order.address.address_number +
    " ," +
    props.order.address.area_name +
    "," +
    props.order.address.zipcode;
  return (
    <Container className={classes.root}>
      <Grid item xs={9}>
        <List>
          <ListItem>
            <ListItemText
              primary={
                "Ώρα παραγγελίας : " +
                props.time.slice(11, 19) +
                " , ID: " +
                props.ID
              }
            />
          </ListItem>
          <ListItem className={classes.addressItem}>
            <ListItemText primary={"Διεύθυνση : " + address} />
          </ListItem>
          <ListItem className={classes.userDetailsItem}>
            <ListItemText
              primary={
                "Πελάτης : " + props.order.name + " " + props.order.surname
              }
            />
          </ListItem>
          <ListItem className={classes.userDetailsItem}>
            <ListItemText primary={"Τηλέφωνο : " + props.order.phone} />
          </ListItem>
          <ListItem className={classes.userDetailsItem}>
            <ListItemText primary={"Όροφος : " + props.order.floor} />
          </ListItem>
          <ListItem className={classes.userDetailsItem}>
            <ListItemText primary={"Κουδούνι : " + props.order.bell_name} />
          </ListItem>
          <ListItem>
            <ListItemText primary={"Σύνολο : " + props.total_price + "€"} />
          </ListItem>
          <ListItem>
            <ListItemText primary={"Πληρωμή : " + props.payment_type} />
          </ListItem>
          {props.order.tips > 0 ? (
            <ListItem>
              <ListItemText
                primary={"Tip διανομέα : " + props.order.tips + "€"}
              />
            </ListItem>
          ) : null}
        </List>
      </Grid>
      <Grid item xs={3}>
        <Paper elevation={0} className={classes.printPaper}>
          <ReactToPrint
            trigger={() => (
              <Button className={classes.printButton}>print it</Button>
            )}
            content={() => componentRef.current}
          />
          <div style={{ display: "none" }}>
            <PrintComponent order={props.order} ref={componentRef} />
          </div>
        </Paper>
        {props.type === "Εισερχόμενες" ? (
          <Paper elevation={0} className={classes.buttonsPaper}>
            <TextField
              id="timer-set"
              select
              label="Χρόνος"
              value={time}
              onChange={setTime}
            >
              {timeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Button
              id={`accept_buton_${props.order.ID}`}
              onClick={() => dispatch(accept_order(props.order, time))}
              className={classes.acceptButton}
            >
              {" "}
              Accept
            </Button>
            <Button
              id={`reject_buton_${props.order.ID}`}
              onClick={() => dispatch(reject_order(props.order, time))}
              className={classes.rejectButton}
            >
              {" "}
              Reject
            </Button>
          </Paper>
        ) : (
          <Typography>Χρόνος παράδοσης {props.delivery_time} λεπτά</Typography>
        )}
        {props.type === "Ετοιμάζονται" ? (
          <Paper elevation={0}>
            {props.order.canceled === true ? (
              <span>Ακτρωμένη</span>
            ) : (
              <span>Αποδεχτή</span>
            )}
            <Button
              id={`complete_buton_${props.order.ID}`}
              className={classes.compleButton}
              onClick={() => dispatch(complete_order(props.order.ID))}
            >
              Ολοκλήρωση
            </Button>
          </Paper>
        ) : null}
      </Grid>
    </Container>
  );
}
