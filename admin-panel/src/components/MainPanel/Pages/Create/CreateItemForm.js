import React, { Component } from "react";
import { Form, Button, Container, Image, Col, Row } from "react-bootstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { create_product } from "../../../../actions/items";
import Resizer from "react-image-file-resizer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import { Collapse, FormControlLabel } from "@material-ui/core";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

class CreateItemForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      price: 0,
      category: "Kafedes",
      description: "",
      filename: "Choose product image *",
      source: "",
      image: null,
      checkedIngredients: [""],
      checkedChoices: [-1],
      hasIngredients: false,
      showChoices: false,
      choices: [],
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeCheck = this.onChangeCheck.bind(this);
    this.showChoices = this.showChoices.bind(this);
  }

  showChoices(e) {
    e.preventDefault();
    this.setState({ showChoices: !this.state.showChoices });
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    create_product: PropTypes.func.isRequired,
    ingredients: PropTypes.array.isRequired,
    choices: PropTypes.array.isRequired,
  };

  onSubmit(event) {
    event.preventDefault();
    const item = {
      name: this.state.name,
      description: this.state.description,
      price: parseFloat(this.state.price),
      category: this.state.category,
      ingredients: this.state.checkedIngredients.slice(1),
      choices: this.state.choices,
    };
    for (var i in this.state.checkedChoices.slice(1)) {
      item.choices.push(this.props.choices[i]);
    }
    const image = this.state.image;
    // console.log(item);
    this.props.create_product(item, image);
    this.setState({
      name: "",
      price: 0,
      category: "Kafedes",
      description: "",
      filename: "Choose product image *",
      source: "",
      image: null,
      checkedIngredients: [""],
      checkedChoices: [-1],
      hasIngredients: false,
      showChoices: false,
      choices: [],
    });
  }

  handleToggle = (value) => {
    const currentIndex = this.state.checkedIngredients.indexOf(value);
    const newChecked = [...this.state.checkedIngredients];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checkedIngredients: newChecked,
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
  };

  onChangeCheck() {
    this.setState({ hasIngredients: !this.state.hasIngredients });
    if (document.getElementById("ingredient-list").style.display === "block") {
      document.getElementById("ingredient-list").style.display = "none";
    } else {
      document.getElementById("ingredient-list").style.display = "block";
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
  render() {
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
            name="category"
            onChange={this.onChange}
            required
          >
            {this.props.categories.length > 0 ? (
              this.props.categories.map((category, index) => {
                return <option key={index}>{category.name}</option>;
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
        <Form.Group controlId="image">
          <Form.File
            id="custom-file"
            label={this.state.filename}
            custom
            onChange={this.onFileChange}
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
          >
            {this.props.ingredients.map((ingredient, index) => {
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
                        this.state.checkedIngredients.indexOf(
                          ingredient.name
                        ) !== -1
                      }
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                    <ListItemText id={labelId} primary={`${ingredient.name}`} />
                  </ListItemIcon>
                </ListItem>
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
  choices: state.productReducer.choices,
});
export default connect(mapStateToProps, { create_product })(CreateItemForm);
