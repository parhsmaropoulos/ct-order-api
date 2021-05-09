import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import {
  List,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { update_item } from "../../../../actions/items";
import { useDispatch } from "react-redux";

function changeAvailability(item) {
  update_item(item.id, item, "change_availability");
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    // height: "100%",
    overflowY: "auto",
    maxHeight: "100vh",
    flexWrap: "wrap",
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

export default function ProductCatalog(props) {
  const classes = useStyles();

  const dispatch = useDispatch();

  const update_prod = (product) => {
    dispatch(update_item(product.id, product, "change_availability"));
  };

  return (
    <Paper className={classes.root} elevation={3}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">Όνομα</TableCell>
            <TableCell align="right">Τιμή</TableCell>
            <TableCell align="right">Διαθέσιμο</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.products.map((product, index) => {
            if (props.selectedCategory === product.category) {
              return (
                <TableRow key={index}>
                  <TableCell align="left">{product.name}</TableCell>
                  <TableCell align="right">{product.price}</TableCell>
                  <TableCell align="right">
                    <Switch
                      checked={product.available === true ? true : false}
                      onChange={() => update_prod(product)}
                      label="Available"
                    />
                  </TableCell>
                </TableRow>
              );
            } else {
              return null;
            }
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}
