import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";
import React, { Component } from "react";

class PrintComponent extends Component {
  render() {
    let order;
    if (this.props.order !== undefined) {
      order = this.props.order;
    } else {
      return null;
    }
    // console.log(order)
    return (
      <Paper className="main">
        <React.Fragment>
          <Typography>COFFEE TWIST</Typography>
          <Typography>ΠΡΟΣΟΧΗ ΔΕΝ ΕΙΝΑΙ ΑΠΟΔΕΙΞΗ!</Typography>
          <Typography>***** ΠΑΡΑΓΓΕΛΕΙΑ *****</Typography>
          <Typography>
            ***** {order.CreatedAt.slice(0, 10)} {order.CreatedAt.slice(11, 19)}
            *****
          </Typography>
          <Typography>*** ΠΑΡΑΓΓΕΛΕΙΑ {order.id} ***</Typography>
        </React.Fragment>
        <React.Fragment>
          <List>
            {order.tips !== 0 ? (
              <ListItem>
                <ListItemText primary={"1 X TIP ΓΙΑ ΔΙΑΝΟΜΕΑ"} />
                <ListItemText primary={order.tips + "€"} />
              </ListItem>
            ) : null}
            {order.products.map((product, index) => {
              // console.log(product);
              return (
                <Paper key={index} elevation={0}>
                  <ListItem>
                    <ListItemText
                      primary={product.quantity + " X " + product.item_name}
                    />
                    <ListItemText
                      primary={product.total_price / product.quantity + "€"}
                    />
                  </ListItem>
                  <List>
                    {!!product.option_answers
                      ? product.option_answers.map((option, op_index) => {
                          return (
                            <ListItem key={op_index}>
                              <ListItemText primary={"+ " + option} />
                            </ListItem>
                          );
                        })
                      : null}
                    {!!product.extra_ingredients
                      ? product.extra_ingredients.map(
                          (ingredient, op_index) => {
                            return (
                              <ListItem key={op_index}>
                                <ListItemText primary={"+ " + ingredient} />
                              </ListItem>
                            );
                          }
                        )
                      : null}
                    {product.comment !== "" ? (
                      <ListItem key={"item_comments"}>
                        <ListItemText primary={"Σχόλια : " + product.comment} />
                      </ListItem>
                    ) : null}
                  </List>
                </Paper>
              );
            })}
          </List>
          <Typography>======================================</Typography>
          <Typography>ΤΡΟΠΟΣ ΠΛΗΡΩΜΗΣ : {order.payment_type}</Typography>
          <Typography>ΤΕΛΙΚΟ ΣΥΝΟΛΟ : {order.pre_discount_price} €</Typography>
          <Typography>======================================</Typography>
          <Typography>##### ΔΙΕΥΘΥΝΣΗ #####</Typography>
          <List>
            <ListItem>
              <ListItemText
                primary={`ΟΝ/ΜΟ :${order.name}  ${order.surname} `}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary={`ΚΙΝΗΤΟ :${order.phone} `} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`ΟΔΟΣ :${order.address.address_name}  ${order.address.address_number} `}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`ΠΟΛΗ :${order.address.area_name}  ${order.address.city_name} `}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary={`TK :${order.address.zipcode} `} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`ΟΡΟΦΟΣ :${order.floor} `} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`ΚΟΥΔΟΥΝΙ :${order.bell_name} `} />
            </ListItem>
          </List>
          <Typography>ΣΧΟΛΙΑ: {order.comments}</Typography>
          <Typography>###### www.coffeetwist.gr ######</Typography>
        </React.Fragment>
      </Paper>
    );
  }
}

export default PrintComponent;
