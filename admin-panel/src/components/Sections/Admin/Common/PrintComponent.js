import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";
import React, { Component } from "react";

// let order = {
//   id: "609f9bb1186eff05507246a2",
//   products: [
//     {
//       comment: "",
//       extraPrice: 0,
//       extra_ingredients: ["waffle"],
//       item: {
//         id: "60841a29f47efe9d043d69c5",
//         name: "CHEF'S",
//         description: "Μαρούλι, ντομάτα, ζαμπόν, τυρί, αυγό βραστό, σως κοκτέιλ",
//         price: 5,
//         category: "Σαλάτες",
//         image: "",
//         ingredients: null,
//         choices: [],
//         custom: false,
//         extra_ingredients: null,
//         available: true,
//         visible: false,
//       },
//       optionAnswers: [],
//       options: [],
//       quantity: 1,
//       totalPrice: 5,
//     },
//     {
//       comment: "",
//       extraPrice: 0,
//       extra_ingredients: ["wafflef"],
//       item: {
//         id: "60841a29f47efe9d043d69c5",
//         name: "CHEF",
//         description: "Μαρούλι, ντομάτα, ζαμπόν, τυρί, αυγό βραστό, σως κοκτέιλ",
//         price: 5,
//         category: "Σαλάτες",
//         image: "",
//         ingredients: null,
//         choices: [],
//         custom: false,
//         extra_ingredients: null,
//         available: true,
//         visible: false,
//       },
//       optionAnswers: [],
//       options: [],
//       quantity: 1,
//       totalPrice: 5,
//     },
//   ],
//   accepted: true,
//   user_id: "6060b7a74e3408671bf3cc7f",
//   delivery_type: "Delivery",
//   pre_discount_price: 5,
//   after_discount_price: 0,
//   payment_type: "Cash",
//   discounts: [],
//   discounts_ids: [],
//   tips: 0.5,
//   comments: "",
//   user_details: {
//     Name: "pa",
//     Surname: "ma",
//     Address: {
//       id: "60621a3cc569e29bc11f8fa3",
//       city_name: "",
//       area_name: "Glifada",
//       address_name: "Georgiou Gennimata",
//       address_number: "20",
//       zipcode: "165 62",
//       latitude: 37.8941277,
//       longitude: 23.7627664,
//     },
//     Phone: "2102342341",
//     Bell_name: "4",
//     Floor: "5",
//   },
//   delivery_time: 25,
//   rating: {
//     rate: 0,
//     user_id: "000000000000000000000000",
//   },
//   comment: {
//     comment_text: "",
//     comment_answer: "",
//     approved: false,
//   },
//   completed: true,
//   canceled: false,
//   create_at: "2021-05-15T10:00:17.001Z",
// };
class PrintComponent extends Component {
  render() {
    let order;
    if (this.props.order !== undefined) {
      order = this.props.order;
    } else {
      return null;
    }
    return (
      <Paper className="main">
        <React.Fragment>
          <Typography>COFFEE TWIST</Typography>
          <Typography>ΠΡΟΣΟΧΗ ΔΕΝ ΕΙΝΑΙ ΑΠΟΔΕΙΞΗ!</Typography>
          <Typography>***** ΠΑΡΑΓΓΕΛΕΙΑ *****</Typography>
          <Typography>
            ***** {order.create_at.slice(0, 10)} {order.create_at.slice(11, 19)}
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
              return (
                <Paper key={index} elevation={0}>
                  <ListItem>
                    <ListItemText
                      primary={product.quantity + " X " + product.item.name}
                    />
                    <ListItemText
                      primary={product.totalPrice / product.quantity + "€"}
                    />
                  </ListItem>
                  <List>
                    {product.options.length > 0
                      ? product.options.map((option, op_index) => {
                          return (
                            <ListItem key={op_index}>
                              <ListItemText primary={"+ " + option.Choice} />
                            </ListItem>
                          );
                        })
                      : null}
                    {product.extra_ingredients.length > 0
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
                primary={`ΟΝ/ΜΟ :${order.user_details.Name}  ${order.user_details.Surname} `}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary={`ΚΙΝΗΤΟ :${order.user_details.Phone} `} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`ΟΔΟΣ :${order.user_details.Address.address_name}  ${order.user_details.Address.address_number} `}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`ΠΟΛΗ :${order.user_details.Address.area_name}  ${order.user_details.Address.city_name} `}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`TK :${order.user_details.Address.zipcode} `}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary={`ΟΡΟΦΟΣ :${order.user_details.Floor} `} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`ΚΟΥΔΟΥΝΙ :${order.user_details.Bell_name} `}
              />
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
