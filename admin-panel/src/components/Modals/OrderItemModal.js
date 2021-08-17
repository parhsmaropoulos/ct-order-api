import React, { Component } from "react";
import { Form } from "react-bootstrap";
import "../../css/Pages/orderpage.css";
import "../../css/common/logregmodal.css";
import "../../css/Layout/general.css";
import { connect } from "react-redux";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import PropTypes from "prop-types";
import {
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Modal,
  Grid,
  Button,
  Paper,
  IconButton,
  Divider,
} from "@material-ui/core";

class OrderItemModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      quantity: 1,
      comment: "",
      extraPrice: 0,
      item: {},
      extra_ingredients: [""],
      loaded: false,
      item_available_ingredients: [],
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onAdd = this.onAdd.bind(this);
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    ingredients: PropTypes.array.isRequired,
  };

  componentDidMount() {
    if (this.props.update) {
      // console.log(this.props);
      this.setState({
        options: this.props.updateItem.options,
        quantity: this.props.updateItem.quantity,
        comment: this.props.updateItem.comment,
        extra_ingredients: this.props.updateItem.extra_ingredients,
        extraPrice:
          this.props.updateItem.totalPrice / this.props.updateItem.quantity -
          this.props.updateItem.item.price,
      });
    }
  }

  componentWillUnmount() {
    this.setState({
      loaded: false,
    });
  }

  handleToggle = (ingredient) => {
    const currentIndex = this.state.extra_ingredients.indexOf(ingredient.name);
    const newChecked = [...this.state.extra_ingredients];
    let newPrice = this.state.extraPrice;

    // console.log(ingredient.name);
    if (currentIndex === -1) {
      newChecked.push(ingredient.name);
      newPrice += ingredient.price;
    } else {
      newChecked.splice(currentIndex, 1);
      newPrice -= ingredient.price;
    }

    this.setState({
      extra_ingredients: newChecked,
      extraPrice: newPrice,
    });
  };

  onSubmit(e) {
    e.preventDefault();
  }

  onAdd(e) {
    e.preventDefault();
    let optionAnswers = [];
    if (this.state.options.length > 0) {
      for (var i in this.state.options) {
        // console.log(i);
        optionAnswers.push(this.state.options[i].choice);
      }
    }
    const item = {
      item: this.props.item,
      options: this.state.options,
      comment: this.state.comment,
      extraPrice: this.state.extraPrice,
      optionAnswers: optionAnswers,
      extra_ingredients: this.state.extra_ingredients.slice(1),
    };
    if (this.props.update) {
      item.extra_ingredients = this.state.extra_ingredients;
    }
    // console.log(item);
    if (this.props.update) {
      this.props.onUpdate &&
        this.props.onUpdate(item, this.state.quantity, this.props.index);
    } else {
      this.props.onAdd && this.props.onAdd(item, this.state.quantity);
    }
    this.props.onClose && this.props.onClose(e);
    this.setState({
      options: {},
      quantity: 1,
      comment: "",
      extraPrice: 0,
      extraIngredients: [""],
    });
  }

  onChangeChoice = (choiceName, selectedOption) => {
    var currentOptions = this.state.options;
    let oldPrice = 0;
    let found = false;
    let exists = false;
    // console.log(choiceName);
    // console.log(selectedOption);
    // Check if choice has already changed once
    for (var id in currentOptions) {
      let old_option = currentOptions[id];
      if (old_option.name === choiceName) {
        if (old_option.choice === selectedOption.name) {
          exists = true;
        }
        oldPrice = old_option.price;
        old_option.choice = selectedOption.name;
        old_option.price = selectedOption.price;
        found = true;
        console.log("found");
      }
    }
    // Else it adds the option
    if (found === false && exists === false) {
      let newOption = {
        name: choiceName,
        choice: selectedOption.name,
        price: selectedOption.price,
      };
      currentOptions.push(newOption);
    }

    if (exists === false) {
      var newPrice = this.state.extraPrice + selectedOption.price - oldPrice;
      this.setState({
        options: currentOptions,
        extraPrice: newPrice,
      });
    }
    console.log(currentOptions);
  };

  onChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  static getDerivedStateFromProps(props, state) {
    // console.log(props, state);
    if (
      props.item.custom === true &&
      props.item.extra_ingredients !== undefined &&
      state.loaded === false
    ) {
      let grouped_ingredients = [];
      let grouped;
      var _ = require("lodash");
      grouped = _.groupBy(props.item.extra_ingredients, "category");
      for (var i in grouped) {
        grouped_ingredients.push(grouped[i]);
      }
      // console.log(grouped_ingredients);
      return {
        loaded: true,
        item_available_ingredients: grouped_ingredients,
      };
    }
    return null;
  }

  onClose = (e) => {
    this.props.onClose && this.props.onClose(e);
    this.setState({
      options: {},
      quantity: 1,
      comment: "",
      extraPrice: 0,
    });
  };

  changeQuantity = (bool) => {
    if (bool) {
      this.setState({ quantity: this.state.quantity + 1 });
    } else if (this.state.quantity > 0) {
      this.setState({ quantity: this.state.quantity - 1 });
    }
  };

  render() {
    let text = "";
    if (this.props.update) {
      // console.log("here to update");
      text = "Ενημέρωση";
    } else {
      // console.log("here to add");
      text = "Προσθήκη";
    }
    return (
      <Modal
        open={this.props.show}
        onClose={(e) => {
          this.onClose(e);
        }}
        className="log-reg-modal"
      >
        <Paper elevation={0}>
          <Grid container>
            <Grid item lg={9} md={9} sm={6} xs={6}>
              <Typography>{this.props.item.name}</Typography>
            </Grid>
            {/* <Grid item></Grid> */}
            <Grid item lg={1} md={1} sm={3} xs={3}>
              {/* {item_.price} € */}
              <Typography>
                {this.props.update
                  ? this.state.extraPrice + this.props.updateItem.item.price
                  : this.state.extraPrice + this.props.item.price}{" "}
                €
              </Typography>
            </Grid>
            <Grid item lg={2} md={2} sm={3} xs={3}>
              <Button
                variant="contained"
                color="secondary"
                onClick={(e) => {
                  this.onClose(e);
                }}
              >
                X
              </Button>
            </Grid>
          </Grid>
          <Divider />
          {/* #################### CHOICES ######################### */}
          <Grid container>
            <Grid item xs={1}></Grid>
            <Grid item xs={10}>
              <Form>
                <Form.Group>
                  {this.props.item.choices.map((choice, indx) => {
                    return (
                      <Paper elevation={0} key={indx}>
                        <Typography className="modalChoiceName">
                          {choice.name}
                          {choice.required ? <span>*</span> : <span></span>}
                        </Typography>
                        <Paper
                          elevation={0}
                          className="orderItemModalChoiceDiv"
                          key={indx}
                        >
                          {choice.options ? (
                            choice.options.map((option, index) => {
                              // if (this.props.update) {
                              let show = false;
                              for (var i in this.props.updateItem.options) {
                                let update_option =
                                  this.props.updateItem.options[i];
                                if (
                                  update_option.name === choice.name &&
                                  update_option.choice === option.name
                                ) {
                                  show = true;
                                }
                              }
                              if (this.props.update && show) {
                                return (
                                  <Grid
                                    item
                                    lg={6}
                                    md={6}
                                    sm={12}
                                    xs={12}
                                    className="form-check"
                                    key={index}
                                  >
                                    <Grid direction="row" container>
                                      <Grid item xs={1}>
                                        <input
                                          className="form-check-input"
                                          type="radio"
                                          name={`${choice.name}`}
                                          value={`${option.name}`}
                                          id={`${option.name}${index}`}
                                          onClick={() =>
                                            this.onChangeChoice(
                                              choice.name,
                                              option
                                            )
                                          }
                                          defaultChecked
                                        />
                                      </Grid>
                                      <Grid item xs={9}>
                                        <label
                                          className="form-check-label"
                                          htmlFor={`${option.name}${index}`}
                                        >
                                          {option.name}
                                        </label>
                                      </Grid>
                                      <Grid item xs={2}>
                                        <span className="form-check-price">
                                          {option.price} €
                                        </span>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                );
                                // }
                              } else {
                                return (
                                  <Grid
                                    item
                                    lg={6}
                                    md={6}
                                    sm={12}
                                    xs={12}
                                    className="form-check"
                                    key={index}
                                  >
                                    <Grid container>
                                      <Grid item xs={1}>
                                        <input
                                          className="form-check-input"
                                          type="radio"
                                          name={`${choice.name}`}
                                          value={`${option.name}`}
                                          id={`${option.name}${index}`}
                                          onClick={() =>
                                            this.onChangeChoice(
                                              choice.name,
                                              option
                                            )
                                          }
                                        />
                                      </Grid>
                                      <Grid item xs={8}>
                                        <label
                                          className="form-check-label"
                                          htmlFor={`${option.name}${index}`}
                                        >
                                          {option.name}
                                        </label>
                                      </Grid>
                                      <Grid item xs={3}>
                                        {" "}
                                        <span className="form-check-price">
                                          {option.price} €
                                        </span>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                );
                              }
                            })
                          ) : (
                            <span></span>
                          )}
                        </Paper>
                      </Paper>
                    );
                  })}
                </Form.Group>
                <Form.Group controlId="ingrdients">
                  {this.props.item.custom === true &&
                  this.props.item.extra_ingredients !== undefined ? (
                    <List
                      className="create-item-ingredient-list"
                      id="ingredient-list"
                    >
                      {this.state.item_available_ingredients.map(
                        (ingredientCategory, index) => {
                          return (
                            <Paper elevation={0} key={index}>
                              <p className="modalChoiceName">
                                {`${ingredientCategory[0].category}`}
                              </p>
                              <Paper
                                elevation={0}
                                className="orderItemModalIngredientsDiv"
                                key={index}
                              >
                                {ingredientCategory.map((ingredient, index) => {
                                  const labelId = `ingredient-item-${ingredient.name}`;
                                  if (ingredient.available) {
                                    return (
                                      <Grid item xs={12} sm={12} md={6} lg={6}>
                                        <ListItem
                                          key={index}
                                          role={undefined}
                                          dense
                                          // className="item-modal-ingredient-li"
                                          button
                                          onClick={() =>
                                            this.handleToggle(ingredient)
                                          }
                                        >
                                          <ListItemIcon
                                            style={{ width: "100%" }}
                                          >
                                            <Checkbox
                                              edge="start"
                                              checked={
                                                this.state.extra_ingredients.indexOf(
                                                  ingredient.name
                                                ) !== -1
                                              }
                                              tabIndex={-1}
                                              disableRipple
                                              inputProps={{
                                                "aria-labelledby": labelId,
                                              }}
                                            />
                                            <ListItemText
                                              id={labelId}
                                              primary={
                                                <Typography
                                                  type="body2"
                                                  style={{
                                                    color: "black",
                                                    textAlgin: "left",
                                                  }}
                                                >
                                                  {ingredient.name}
                                                </Typography>
                                              }
                                            />
                                            <ListItemText
                                              id={labelId}
                                              primary={
                                                <Typography
                                                  type="subtitle1"
                                                  style={{
                                                    color: "black",
                                                    textAlign: "right",
                                                  }}
                                                >
                                                  {ingredient.price}€
                                                </Typography>
                                              }
                                            />
                                          </ListItemIcon>
                                        </ListItem>
                                      </Grid>
                                    );
                                  } else {
                                    return (
                                      <Grid item xs={12} sm={12} md={6} lg={6}>
                                        <ListItem
                                          key={index}
                                          role={undefined}
                                          dense
                                          disabled
                                          // className="item-modal-ingredient-li"
                                          // style={{ maxWidth: "50%", minWidth: "50%" }}
                                          button
                                          onClick={() =>
                                            this.handleToggle(ingredient)
                                          }
                                        >
                                          <ListItemIcon
                                            style={{ width: "100%" }}
                                          >
                                            <ListItemText
                                              id={labelId}
                                              primary={
                                                <Typography
                                                  type="body2"
                                                  style={{
                                                    color: "black",
                                                    textAlgin: "center",
                                                  }}
                                                >
                                                  {ingredient.name}
                                                </Typography>
                                              }
                                            />
                                            <ListItemText
                                              id={labelId}
                                              primary={
                                                <Typography
                                                  type="subtitle1"
                                                  style={{
                                                    color: "black",
                                                    textAlign: "right",
                                                  }}
                                                >
                                                  {ingredient.price} €
                                                </Typography>
                                              }
                                            />
                                          </ListItemIcon>
                                        </ListItem>
                                      </Grid>
                                    );
                                  }
                                })}
                              </Paper>
                            </Paper>
                          );
                        }
                      )}
                    </List>
                  ) : (
                    <span></span>
                  )}
                </Form.Group>
                <Form.Group>
                  <Form.Label className="modalChoiceName">Comments</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="comment"
                    label="Leave a comment"
                    placeholder="Leave a comment"
                    value={this.state.comment}
                    onChange={this.onChange}
                  />
                </Form.Group>
              </Form>
            </Grid>
            <Grid item xs={1}></Grid>
          </Grid>
          <Divider />
          <Grid container style={{ marginTop: "2" }}>
            <Grid item lg={1} md={1} sm={12}></Grid>
            <Grid item lg={3} md={3} sm={12} xs={12}>
              <Grid container>
                <Grid item xs={4}>
                  <IconButton
                    // variant="outline-danger"
                    className="minPlusButton"
                    color="primary"
                    variant="contained"
                    aria-label="remove"
                    onClick={() => this.changeQuantity(false)}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                </Grid>
                <Grid item xs={4}>
                  <span>{this.state.quantity}</span>
                </Grid>
                <Grid item xs={4}>
                  <IconButton
                    // variant="outline-success"
                    className="minPlusButton"
                    color="primary"
                    aria-label="add"
                    // size="small"
                    // variant="contained"
                    onClick={() => this.changeQuantity(true)}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={4} md={4} sm={12} xs={12}>
              <Button
                color="primary"
                variant="contained"
                onClick={this.onAdd}
                className="modalFooterButton"
              >
                {text}
              </Button>
            </Grid>
            <Grid xs={4} item></Grid>
          </Grid>
        </Paper>
      </Modal>
    );
  }
}
const mapStateToProps = (state) =>
  // console.log(state.productReducer.ingredients),
  ({
    isAuthenticated: state.userReducer.isAuthenticated,
    ingredients: state.productReducer.ingredients,
    choices: state.productReducer.choices,
  });

export default connect(mapStateToProps, {})(OrderItemModal);
