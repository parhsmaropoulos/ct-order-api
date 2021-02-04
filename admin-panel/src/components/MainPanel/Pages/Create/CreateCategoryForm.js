import axios from "axios";
import React, { Component } from "react";
import { Form, Button, Col, Modal } from "react-bootstrap";
import { headers } from "../../../../utils/axiosHeaders";
import { PlusCircle } from "react-bootstrap-icons";
import ChoiceList from "./Choices";
import CreateChoiceForm from "./CreateChoiceForm";
import { connect } from "react-redux";
import { create_category } from "../../../../actions/items";
import PropTypes from "prop-types";

class CreateCategoryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      show: false,
      choices: [],
      choiceName: "",
      choiceDescription: "",
      options: [],
      optionName: "",
      optionPrice: "",
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    // this.addChoice = this.addChoice.bind(this);
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    create_category: PropTypes.func.isRequired,
  };

  onSubmit(event) {
    event.preventDefault();
    const category = {
      name: this.state.name,
      description: this.state.description,
      choices: this.state.choices,
    };
    console.log(category);
    this.props.create_category(category);
    this.setState({
      name: "",
      description: "",
      choices: [],
    });
    // axios
    //   .post(
    //     "http://localhost:8080/product_category/create_product_category",
    //     category,
    //     headers
    //   )
    //   .then((response) => console.log(response))
    //   .catch((error) => console.log(error))
    //   .then(
    //     this.setState({
    //       name: "",
    //       description: "",
    //       choices: [
    //         {
    //           name: "",
    //           description: "",
    //           options: [
    //             {
    //               name: "",
    //               price: 0,
    //             },
    //           ],
    //         },
    //       ],
    //     })
    //   );
  }

  addChoice = () => {
    const choice = {
      name: this.state.choiceName,
      description: this.state.choiceDescription,
      options: this.state.options,
    };
    this.setState((prevState) => ({
      choices: [...prevState.choices, choice],
    }));
    document.getElementById("choicedescription").value = "";
    document.getElementById("choicename").value = "";
    this.setState({ options: [] });
  };
  removeChoice = (index) => {
    this.setState({
      choices: this.state.choices.filter((s, sindex) => index !== sindex),
    });
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleShow = () => {
    console.log("open");
    this.setState({ show: true });
  };
  handleClose = () => {
    this.setState({ show: false });
  };
  handleSaveOption = () => {
    const option = {
      name: this.state.optionName,
      price: parseFloat(this.state.optionPrice),
    };
    this.setState((prevState) => ({
      options: [...prevState.options, option],
    }));
    this.setState({ show: false });
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Category Name *</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            name="name"
            required
            onChange={this.onChange}
          />
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>Category description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter desc"
            name="description"
            onChange={this.onChange}
          />
        </Form.Group>
        <br />
        <br />
        <h3>Category Choices</h3>
        <ChoiceList
          choiceList={this.state.choices}
          delete={this.removeChoice.bind(this)}
        />

        {/* CREATE CHOICE */}
        <Form>
          <Form.Group>
            <Form.Label>Choice Name *</Form.Label>
            <Form.Control
              name="choiceName"
              type="text"
              id="choicename"
              onChange={this.onChange}
              placeholder="Enter name"
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Choice Description</Form.Label>
            <Form.Control
              name="choiceDescription"
              onChange={this.onChange}
              type="text"
              id="choicedescription"
              placeholder="Enter description"
              required
            ></Form.Control>
          </Form.Group>
          <Form.Label>Choice Options</Form.Label>
          <Form.Group controlId="choiceOptions">
            {this.state.options.map((opt, key) => {
              {
                console.log(opt);
                return (
                  <Form.Group>
                    <Form.Label key={key}>
                      {opt.name} : {opt.price}
                    </Form.Label>
                    <Button onClick={() => this.removeOption(key)}>X</Button>
                  </Form.Group>
                );
              }
            })}
          </Form.Group>
          <Form.Row>
            <Button variant="primary" onClick={this.handleShow}>
              Add option
            </Button>
            <Button variant="primary" onClick={this.addChoice}>
              Save choice
            </Button>
          </Form.Row>
        </Form>

        {/* MODAL FOR OPTIONS */}
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Option Values *</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Row>
              <Form.Group as={Col} md={6}>
                <Form.Label>Value</Form.Label>
                <Form.Control
                  id="optionName"
                  required
                  name="optionName"
                  type="text"
                  placeholer="enter name"
                  onChange={this.onChange}
                ></Form.Control>
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>Price *</Form.Label>
                <Form.Control
                  id="optionPrice"
                  required
                  name="optionPrice"
                  type="number"
                  step="0.01"
                  placeholer="enter price"
                  onChange={this.onChange}
                ></Form.Control>
              </Form.Group>
            </Form.Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleSaveOption}>
              Save Option
            </Button>
          </Modal.Footer>
        </Modal>

        <Button
          type="submit"
          style={{ marginTop: 15 }}
          // onClick={this.createCategory}
        >
          Create Category
        </Button>
      </Form>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.userReducer.isAuthenticated,
  // categories: state.productReducer.categories,
});

export default connect(mapStateToProps, { create_category })(
  CreateCategoryForm
);
