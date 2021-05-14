import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { List, ListItem } from "@material-ui/core";
import OrderProductsRow from "./OrderProductsRow";
import OrderUserDetailsRow from "./OrderUserDetailsRow";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    // height: "100%",
    flexWrap: "wrap",
    overflowY: "auto",
    maxHeight: "100vh",

    "& > *": {
      margin: theme.spacing(1),
      width: "100%",
      height: "100%",
    },
    paperSection: {
      backgroundColor: "black",
    },
  },
  row: {
    borderBottom: "2px solid gray",
  },
  orderRow: {
    border: "1px solid black",
    padding: "10px",
    marginBottom: "40px",
    flexDirection: "column",
  },
}));

export default function OrdersCatalog(props) {
  const classes = useStyles();
  // console.log(props);
  // const dispatch = useDispatch();
  // const [time, changeTime] = useState("15");
  // const setTime = (event) => {
  //   changeTime(event.target.value);
  // };
  return (
    <Paper className={classes.root} elevation={3}>
      {props.selectedCategory === "Εισερχόμενες" &&
      props.orders.pending_orders.length === 0 ? (
        <React.Fragment>Δεν υπάρχουν νέες παραγγελίες.</React.Fragment>
      ) : props.selectedCategory === "Ετοιμάζονται" &&
        props.orders.accepted_orders.length === 0 ? (
        <React.Fragment>Δεν υπάρχουν παραγγελίες σε εξέλιξη.</React.Fragment>
      ) : props.selectedCategory === "Ολοκληρώθηκαν" &&
        props.orders.finished_orders.length === 0 ? (
        <React.Fragment>Δεν υπάρχουν ολοκληρωμένες παραγγελίες.</React.Fragment>
      ) : null}
      <List>
        {props.selectedCategory === "Εισερχόμενες" &&
        props.orders.pending_orders !== undefined
          ? props.orders.pending_orders.map((order, index) => {
              console.log(order);
              return (
                <ListItem key={index} className={classes.orderRow}>
                  <OrderUserDetailsRow
                    time={order.create_at}
                    total_price={order.pre_discount_price}
                    payment_type={order.payment_type}
                    user_details={order.user_details}
                    ID={order.id}
                    order={order}
                    delivery_time={order.delivery_time}
                    type={props.selectedCategory}
                  />
                  <OrderProductsRow products={order.products} />
                </ListItem>
              );
            })
          : props.selectedCategory === "Ετοιμάζονται" &&
            props.orders.accepted_orders !== undefined
          ? props.orders.accepted_orders.map((order, index) => {
              return (
                <ListItem key={index} className={classes.orderRow}>
                  <OrderUserDetailsRow
                    time={order.create_at}
                    total_price={order.pre_discount_price}
                    payment_type={order.payment_type}
                    user_details={order.user_details}
                    ID={order.id}
                    order={order}
                    delivery_time={order.delivery_time}
                    type={props.selectedCategory}
                  />
                  <OrderProductsRow products={order.products} />
                </ListItem>
              );
            })
          : props.selectedCategory === "Ολοκληρώθηκαν" &&
            props.orders.finished_orders !== undefined
          ? props.orders.finished_orders.map((order, index) => {
              return (
                <ListItem key={index} className={classes.orderRow}>
                  <OrderUserDetailsRow
                    time={order.create_at}
                    total_price={order.pre_discount_price}
                    payment_type={order.payment_type}
                    user_details={order.user_details}
                    ID={order.id}
                    order={order}
                    type={props.selectedCategory}
                    delivery_time={order.delivery_time}
                  />
                  <OrderProductsRow products={order.products} />
                </ListItem>
              );
            })
          : null}
      </List>
    </Paper>
  );
}
