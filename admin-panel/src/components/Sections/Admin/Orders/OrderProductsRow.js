import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    // height: "100%",
    flexWrap: "wrap",
    overflowY: "auto",
    maxHeight: "100vh",

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
  listItem: {
    borderBottom: "1px solid black",
  },
  innerText: {
    borderBottom: "0.5px solid gray",
  },
  leftText: {
    textAlign: "start",
  },
  rightText: {
    textAlign: "end",
  },
  productRow: {
    backgroundColor: "#f4f4f4",
    marginBottom: "10px",
  },
}));

export default function OrderProductsRow(props) {
  const classes = useStyles();
  // console.log(props);

  return (
    <Container>
      <List>
        {props.products.map((product, index) => {
          return (
            <Paper className={classes.productRow} key={index}>
              <ListItem className={classes.listItem}>
                <ListItemText
                  primary={product.item.name}
                  className={classes.leftText}
                />
                <ListItemText
                  primary={
                    product.quantity +
                    " X " +
                    product.totalPrice / product.quantity +
                    "€"
                  }
                  className={classes.rightText}
                />
              </ListItem>
              <List>
                {product.options.length > 0
                  ? product.options.map((option, op_index) => {
                      return (
                        <ListItem
                          key={op_index}
                          className={classes.innerListItem}
                        >
                          <ListItemText
                            // primary={"+ " + option.Name + " : " + option.Choice}
                            primary={"+ " + option.Choice}
                            className={classes.innerText}
                          />
                        </ListItem>
                      );
                    })
                  : null}
                {product.extra_ingredients.length > 0
                  ? product.extra_ingredients.map((ingredient, op_index) => {
                      return (
                        <ListItem
                          key={op_index}
                          className={classes.innerListItem}
                        >
                          <ListItemText
                            primary={"+ " + ingredient}
                            className={classes.innerText}
                          />
                        </ListItem>
                      );
                    })
                  : null}
                {product.comment !== "" ? (
                  <ListItem key={"item_comments"}>
                    <ListItemText
                      primary={"Σχόλια : " + product.comment}
                      className={classes.innerText}
                    />
                  </ListItem>
                ) : null}
              </List>
            </Paper>
          );
        })}
      </List>
    </Container>
  );
}
