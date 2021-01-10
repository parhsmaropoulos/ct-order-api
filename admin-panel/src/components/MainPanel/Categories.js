import React, { Component } from "react";
import axios from "axios";
import { Container, ListGroup } from "react-bootstrap";

class Categories extends Component {
  state = {
    categories: [],
  };

  componentDidMount() {
    axios.get("http://localhost:8080/product_category/all").then((res) => {
      // const categories = res.data.data;
      this.state.categories = res.data.data;
      //   this.setSate({ categories });
    });
  }
  render() {
    return (
      <Container>
        <div>
          <ListGroup as="ul">
            {this.state.categories.map((category) => {
              <ListGroup.Item as="li" key={category.id}>
                {category.name}
              </ListGroup.Item>;
            })}
          </ListGroup>
        </div>
      </Container>
    );
  }
}

export default Categories;
