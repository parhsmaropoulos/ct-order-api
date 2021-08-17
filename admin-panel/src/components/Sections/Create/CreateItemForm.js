import React, { Component } from "react";
import { Form, Button, Container, Image, Col, Row } from "react-bootstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
// import { create_product } from "../../../actions/items";
import { auth_post_request } from "../../../actions/lib";
import Resizer from "react-image-file-resizer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import { Collapse, FormControlLabel, ListSubheader } from "@material-ui/core";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { CREATE_ITEM } from "../../../actions/actions";

class CreateItemForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      price: 0,
      category: "Kafedes",
      category_id: 0,
      description: "",
      filename: "Choose product image *",
      source: "",
      image: null,
      extra_ingredients: [""],
      available_ingredients: [""],
      checkedChoices: [-1],
      hasIngredients: false,
      showChoices: false,
      isCustom: false,
      ingredients: [],
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeCheck = this.onChangeCheck.bind(this);
    this.onCustomChange = this.onCustomChange.bind(this);
    this.showChoices = this.showChoices.bind(this);
  }

  showChoices(e) {
    e.preventDefault();
    this.setState({ showChoices: !this.state.showChoices });
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    auth_post_request: PropTypes.func.isRequired,
    ingredients: PropTypes.array.isRequired,
    choices: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    ingredientCategories: PropTypes.array.isRequired,
  };

  onSubmit(event) {
    event.preventDefault();
    console.log(this.state);
    const item = {
      name: this.state.name,
      description: this.state.description,
      price: parseFloat(this.state.price),
      category_id: parseInt(this.state.category_id),
      default_ingredients: this.state.extra_ingredients.slice(1),
      ingredients_id: this.state.available_ingredients.slice(1),
      choices_id: this.state.checkedChoices.slice(1),
      custom: this.state.isCustom,
      choices: [],
      ingredients: this.state.ingredients,
    };
    for (var i in item.default_ingredients) {
      item.default_ingredients[i] = item.default_ingredients[i].trim();
    }

    this.props.choices.forEach(function (choice) {
      if (item.choices_id.includes(choice.ID)) {
        item.choices.push(choice);
      }
    });

    const image = this.state.image;
    console.log(item);
    let body = new FormData();
    body.append("file", image);
    body.append("name", item.name);
    body.append("description", item.description);
    body.append("price", item.price);
    body.append("choices_id", JSON.stringify(item.choices_id));
    body.append("custom", item.custom);
    body.append("category_id", item.category_id);
    body.append("ingredients_id", JSON.stringify(item.ingredients_id));
    body.append(
      "default_ingredients",
      JSON.stringify(item.default_ingredients)
    );

    this.props.auth_post_request("products/create_product", body, CREATE_ITEM);
    this.setState({
      name: "",
      price: 0,
      category: "Kafedes",
      description: "",
      filename: "Choose product image *",
      source: "",
      image: null,
      extra_ingredients: [""],
      checkedChoices: [-1],
      hasIngredients: false,
      showChoices: false,
      isCustom: false,
      choices: [],
    });
  }

  handleToggle = (value) => {
    const currentIndex = this.state.extra_ingredients.indexOf(value);
    const newChecked = [...this.state.extra_ingredients];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      extra_ingredients: newChecked,
    });
  };

  handleAvailableToggle = (value) => {
    const currentIndex = this.state.available_ingredients.indexOf(value.ID);
    const newChecked = [...this.state.available_ingredients];
    const newIngredients = [...this.state.ingredients];

    if (currentIndex === -1) {
      newChecked.push(value.ID);
      newIngredients.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
      newIngredients.splice(currentIndex, 1);
    }

    this.setState({
      available_ingredients: newChecked,
      ingredients: newIngredients,
    });
  };

  handleChoiceToggle = (choice) => {
    const currentIndex = this.state.checkedChoices.indexOf(choice);
    const newChecked = [...this.state.checkedChoices];

    if (currentIndex === -1) {
      newChecked.push(choice);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checkedChoices: newChecked,
    });
    console.log(newChecked);
  };

  onChangeCheck() {
    this.setState({ hasIngredients: !this.state.hasIngredients });
    if (document.getElementById("ingredient-list").style.display === "block") {
      document.getElementById("ingredient-list").style.display = "none";
    } else {
      document.getElementById("ingredient-list").style.display = "block";
    }
  }

  onCustomChange() {
    this.setState({ isCustom: !this.state.isCustom });
    if (
      document.getElementById("available-ingredient-list").style.display ===
      "block"
    ) {
      document.getElementById("available-ingredient-list").style.display =
        "none";
    } else {
      document.getElementById("available-ingredient-list").style.display =
        "block";
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onFileChange = (e) => {
    // console.log(e.target.files);
    try {
      Resizer.imageFileResizer(
        e.target.files[0],
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          this.setState({
            source: uri,
          });
        },
        "base64",
        200,
        200
      );
    } catch (err) {
      console.log(err);
    }

    this.setState({
      image: e.target.files[0],
      filename: e.target.files[0].name,
    });
  };

  componentDidMount() {}

  render() {
    // console.log(this.props.ingredients);
    // console.log(this.state);
    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Item Name *</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            name="name"
            onChange={this.onChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>Item description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter desc"
            name="description"
            onChange={this.onChange}
          />
        </Form.Group>
        <Form.Group controlId="price">
          <Form.Label>Item price *</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            autoComplete="false"
            placeholder="Enter price"
            name="price"
            onChange={this.onChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="category">
          <Form.Label>Category *</Form.Label>
          <Form.Control
            as="select"
            name="category_id"
            onChange={this.onChange}
            required
          >
            <option>None</option>
            {this.props.categories.length > 0 ? (
              this.props.categories.map((category, index) => {
                return (
                  <option key={index} value={category.ID}>
                    {category.name.trim()}
                  </option>
                );
              })
            ) : (
              <option key="0">No categories yet</option>
            )}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="choices">
          <ListItem button onClick={this.showChoices}>
            <ListItemText primary="Select choices" />
            {this.state.showChoices ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={this.state.showChoices} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {this.props.choices.map((choice, index) => {
                const labelId = `choice-item-${choice.ID}`;
                return (
                  <ListItem
                    key={index}
                    role={undefined}
                    dense
                    button
                    onClick={() => this.handleChoiceToggle(choice.ID)}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={
                          this.state.checkedChoices.indexOf(choice.ID) !== -1
                        }
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                      <ListItemText id={labelId} primary={`${choice.name}`} />
                    </ListItemIcon>
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
        </Form.Group>
        <Form.Group controlId="image">
          <Form.File
            id="custom-file"
            label={this.state.filename}
            custom
            onChange={this.onFileChange}
          />
        </Form.Group>
        <Form.Group controlId="customProduct">
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.isCustom}
                onChange={this.onCustomChange}
                name="isCustom"
                color="primary"
              />
            }
            label="Is product custom?"
          />
          <List
            style={{ display: "none" }}
            className="create-item-ingredient-list"
            id="available-ingredient-list"
            subhead={<li />}
          >
            {this.props.ingredients.map((ingredientCategory, index) => {
              return (
                <li key={index}>
                  <ul>
                    <ListSubheader>{`${this.props.ingredientCategories[index]}`}</ListSubheader>
                    {ingredientCategory.map((ingredient, index) => {
                      const labelId = `ingredient-item-${ingredient.ID}`;
                      return (
                        <ListItem
                          key={index}
                          role={undefined}
                          dense
                          button
                          onClick={() => this.handleAvailableToggle(ingredient)}
                        >
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={
                                this.state.available_ingredients.indexOf(
                                  ingredient.ID
                                ) !== -1
                              }
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ "aria-labelledby": labelId }}
                            />
                            <ListItemText
                              id={labelId}
                              primary={`${ingredient.name}`}
                            />
                          </ListItemIcon>
                        </ListItem>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </List>
        </Form.Group>
        <Form.Group controlId="ingredients">
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.hasIngredients}
                onChange={this.onChangeCheck}
                name="hasIngredients"
                color="primary"
              />
            }
            label="Has ingredients"
          />
          <List
            style={{ display: "none" }}
            className="create-item-ingredient-list"
            id="ingredient-list"
            subhead={<li />}
          >
            {this.props.ingredients.map((ingredientCategory, index) => {
              return (
                <li key={index}>
                  <ul>
                    <ListSubheader>{`${this.props.ingredientCategories[index]}`}</ListSubheader>
                    {ingredientCategory.map((ingredient, index) => {
                      const labelId = `ingredient-item-${ingredient.name}`;
                      return (
                        <ListItem
                          key={index}
                          role={undefined}
                          dense
                          button
                          onClick={() => this.handleToggle(ingredient.name)}
                        >
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={
                                this.state.extra_ingredients.indexOf(
                                  ingredient.name
                                ) !== -1
                              }
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ "aria-labelledby": labelId }}
                            />
                            <ListItemText
                              id={labelId}
                              primary={`${ingredient.name}`}
                            />
                          </ListItemIcon>
                        </ListItem>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </List>
        </Form.Group>
        <Container>
          <Row>
            <Col xs={6} md={4}>
              <Image id="preview-image" src={this.state.source} rounded />
            </Col>
          </Row>
        </Container>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.userReducer.isAuthenticated,
  ingredients: state.productReducer.ingredients,
  ingredientCategories: state.productReducer.ingredientCategories,
  choices: state.productReducer.choices,
  categories: state.productReducer.categories,
});
export default connect(mapStateToProps, { auth_post_request })(CreateItemForm);
