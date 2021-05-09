import React, { Component } from "react";
import { connect } from "react-redux";
import { update_item, delete_item } from "../../../../actions/items";
import PropTypes from "prop-types";
import { Button, Form } from "react-bootstrap";
import {
  Checkbox,
  Collapse,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@material-ui/core";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

class SingleItemPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      name: "",
      price: 0,
      category: "",
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
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onChangeCheck = this.onChangeCheck.bind(this);
    this.onCustomChange = this.onCustomChange.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.handleChoiceToggle = this.handleChoiceToggle.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.showChoices = this.showChoices.bind(this);
  }
  componentWillMount() {
    let item = this.props.location.state.item;
    this.setState({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description,
      filename: item.image,
      choices: item.choices,
      isCustom: item.custom,
    });
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    // get_categories: PropTypes.func.isRequired,
    update_item: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
    choices: PropTypes.array.isRequired,
    ingredients: PropTypes.array.isRequired,
  };

  onSubmit(event) {
    event.preventDefault();
    const item = {
      id: this.state.id,
      name: this.state.name,
      description: this.state.description,
      price: parseFloat(this.state.price),
      category: this.state.category,
      ingredients: this.state.extra_ingredients.slice(1),
      choices: [],
      custom: this.state.isCustom,
    };

    for (var i in this.state.checkedChoices) {
      if (this.state.checkedChoices[i] !== -1) {
        item.choices.push(this.props.choices[this.state.checkedChoices[i]]);
      }
    }
    // console.log(item);
    this.props.update_item(item.id, item, "update_product");
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

  onDelete = () => {
    const id = this.state.item.id;
    const type = "product";
    this.props.delete_item(id, type);
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onFileChange = (e) => {
    console.log(e.target.files[0]);
    this.setState({
      image: e.target.files[0],
    });
  };

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
  }

  showChoices(e) {
    e.preventDefault();
    this.setState({ showChoices: !this.state.showChoices });
  }

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Item Name</Form.Label>
          <Form.Control
            type="text"
            placehodler="Enter name"
            defaultValue={this.state.name}
            name="name"
            onChange={this.onChange}
          />
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>Item description</Form.Label>
          <Form.Control
            type="text"
            defaultValue={this.state.description}
            placeholder="Enter desc"
            name="description"
            onChange={this.onChange}
          />
        </Form.Group>
        <Form.Group controlId="price">
          <Form.Label>Item price</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            defaultValue={this.state.price}
            autoComplete="false"
            placeholder="Enter price"
            name="price"
            onChange={this.onChange}
          />
        </Form.Group>
        <Form.Group controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            name="category"
            defaultValue={this.state.category}
            onChange={this.onChange}
          >
            {this.props.categories.map((category, index) => {
              return <option key={index}>{category.name}</option>;
            })}
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
                const labelId = `choice-item-${choice.name}`;
                return (
                  <ListItem
                    key={index}
                    role={undefined}
                    dense
                    button
                    onClick={() => this.handleChoiceToggle(index)}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={
                          this.state.checkedChoices.indexOf(index) !== -1
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
                    <ListSubheader>{`${ingredientCategory[0].category}`}</ListSubheader>
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
        <Form.Group controlId="name">
          <Form.File
            id="custom-file"
            label="Custom file input"
            custom
            onChange={this.onFileChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Update
        </Button>
        <Button variant="danger" onClick={this.onDelete}>
          DELETE
        </Button>
      </Form>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.userReducer.isAuthenticated,
  categories: state.productReducer.categories,
  choices: state.productReducer.choices,
  ingredients: state.productReducer.ingredients,
});

export default connect(mapStateToProps, {
  update_item,
  delete_item,
})(SingleItemPage);
