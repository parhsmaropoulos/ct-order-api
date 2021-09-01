import React, { Component } from "react";
import { Button, Container } from "react-bootstrap";
import { connect } from "react-redux";
import {
  get_items,
  get_categories,
  get_ingredients,
  get_choices,
} from "../../../actions/items";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";

// Images
import { Link } from "react-router-dom";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      showAddressModal: false,
      id: "",
    };
  }

  componentDidMount() {
    this.setState({
      id: uuidv4(),
    });
  }
  static propTypes = {
    get_items: PropTypes.func.isRequired,
    get_categories: PropTypes.func.isRequired,
    get_ingredients: PropTypes.func.isRequired,
    get_choices: PropTypes.func.isRequired,
    productReducer: PropTypes.object.isRequired,
  };

  render() {
    return (
      <Container className="homePageContainer" style={{ minHeight: "70vh" }}>
        <div>
          <Button>
            <Link to="/order">Order Now</Link>
          </Button>
          <Link to="/create_item">Create</Link>
          <br />
          <Link to="/items">Items</Link>
          <br />
          <Link to="/ingredients">Ingredients</Link>
          <br />
          <Link to="/choices">Choices</Link>
          {/* <br />
          <Link to={`/stats/${this.state.id}`}>Choices</Link> */}
          <br />
          <Link to={`/comments`}>Comments</Link>
        </div>
        {/* <Carousel>
          <Carousel.Item>
            <img
              className="d-block w-100"
              // height={250}
              src={crepe}
              alt="First slide"
            />
            <Carousel.Caption>
              <h3>First slide label</h3>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              // height={250}
              src={club}
              alt="Third slide"
            />

            <Carousel.Caption>
              <h3>Second slide label</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              // height={250}
              src={pan}
              alt="Third slide"
            />

            <Carousel.Caption>
              <h3>Third slide label</h3>
              <p>
                Praesent commodo cursus magna, vel scelerisque nisl consectetur.
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
        <div></div> */}
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  productReducer: state.productReducer,
});

export default connect(mapStateToProps, {
  get_items,
  get_categories,
  get_ingredients,
  get_choices,
})(HomePage);
