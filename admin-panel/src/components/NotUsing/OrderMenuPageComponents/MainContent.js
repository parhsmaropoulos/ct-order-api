import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "../../../../../css/OrderPage/MainContainer.css";
import { Media } from "react-bootstrap";
import { add_item } from "../../../../../actions/orders";

class MainContent extends Component {
  constructor(props) {
    super(props);
    this.addItem = this.addItem.bind(this);
  }
  componentDidMount() {
    console.log(this.props.products);
  }
  static propTypes = {
    add_item: PropTypes.func.isRequired,
  };
  addItem = (item) => {
    console.log(item);
    // this.state.product_ids.push(id);
    this.props.add_item(item);
  };

  sendOrder = () => {
    // console.log(this.state);
    // this.props.send_order(this.state.order);
  };
  render() {
    return (
      <div className="mainContent">
        <div className="itemList">
          <ul className="list-unstyled">
            {this.props.products.map((product, index) => {
              return (
                <Media as="li" key={index}>
                  <img
                    width={64}
                    height={64}
                    className="mr-3"
                    // src="holder.js/64x64"
                    alt="Generic placeholder"
                    onClick={() => this.addItem(product)}
                  />
                  <Media.Body>
                    <h5>{product.name}</h5>
                    <h6>{product.description}</h6>
                    <p>{product.price}</p>
                  </Media.Body>
                  <hr />
                </Media>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default connect(null, { add_item })(MainContent);
