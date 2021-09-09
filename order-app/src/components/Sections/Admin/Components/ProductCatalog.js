import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import {
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { put_request } from "../../../../actions/lib";
import { useDispatch } from "react-redux";
import { CHANGE_AVAILABILITY } from "../../../../actions/actions";

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

  const update_prod = (id) => {
    dispatch(put_request(`products/${id}/change_availability`,null,CHANGE_AVAILABILITY));
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
            if (props.selectedCategory === product.category_id) {
              return (
                <TableRow key={index}>
                  <TableCell align="left">{product.name}</TableCell>
                  <TableCell align="right">{product.price}</TableCell>
                  <TableCell align="right">
                    <Switch
                      checked={product.available === true ? true : false}
                      onChange={() => update_prod(product.ID)}
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
