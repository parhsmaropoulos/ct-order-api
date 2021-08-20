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
import { useDispatch } from "react-redux";
import { update_ingredient } from "../../../../actions/items";

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
}));

export default function IngredientsCatalog(props) {
  const classes = useStyles();
  // console.log(props);

  const dispatch = useDispatch();

  const update_ingre = (ingredient) => {
    dispatch(
      update_ingredient(ingredient.id, ingredient, "change_availability")
    );
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
          {props.ingredients !== undefined
            ? props.ingredients.map((ingredient, index) => {
                // console.log(ingredient);
                return (
                  <TableRow key={index}>
                    <TableCell align="left">{ingredient.name}</TableCell>
                    <TableCell align="right">{ingredient.price}</TableCell>
                    <TableCell align="right">
                      <Switch
                        checked={ingredient.available === true ? true : false}
                        onChange={() => update_ingre(ingredient)}
                        label="Available"
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            : null}
        </TableBody>
      </Table>
    </Paper>
  );
}
