import React, { Component } from "react";
import { Form, Button, Container, Row, Col, Image } from "react-bootstrap";
import { connect } from "react-redux";
import { create_category } from "../../../actions/items";
import PropTypes from "prop-types";
import Resizer from "react-image-file-resizer";
import { auth_post_request } from "../../../actions/lib";
import { CREATE_CATEGORY } from "../../../actions/actions";
class CreateCategoryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      filename: "Choose category image *",
      description: "",
      show: false,
      image: null,
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  static propTypes = {
    auth_post_request: PropTypes.func.isRequired,
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
  async onSubmit(event) {
    event.preventDefault();
    const category = {
      name: this.state.name,
      description: this.state.description,
    };
    const image = this.state.image;
    let body = new FormData();
    body.append("file", image);
    body.append("name", category.name);
    body.append("description", category.description);

    await this.props.auth_post_request(
      "product_category/create_product_category",
      body,
      CREATE_CATEGORY
    );

    // this.props.create_category(category, image);
    this.setState({
      name: "",
      filename: "Choose category image *",
      description: "",
      show: false,
      image: null,
    });
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
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
        <Form.Group controlId="image">
          <Form.File
            id="custom-file"
            label={this.state.filename}
            custom
            onChange={this.onFileChange}
          />
        </Form.Group>
        <Container>
          <Row>
            <Col xs={6} md={4}>
              <Image id="preview-image" src={this.state.source} rounded />
            </Col>
          </Row>
        </Container>
        <Button type="submit" style={{ marginTop: 15 }}>
          Create Category
        </Button>
      </Form>
    );
  }
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { create_category, auth_post_request })(
  CreateCategoryForm
);
