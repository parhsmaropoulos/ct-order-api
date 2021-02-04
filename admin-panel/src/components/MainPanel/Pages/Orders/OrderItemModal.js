import React, { Component } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import "../../../../css/Pages/orderpage.css";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class OrderItemModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: 0,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onAdd = this.onAdd.bind(this);
  }

  static propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
  };

  componentDidMount() {
    // this.setState({ selectedTab: this.props.selectedTab });
    console.log(this.props.item);
  }

  onSubmit(e) {
    e.preventDefault();
  }

  onAdd(e) {
    this.props.onAdd && this.props.onAdd(this.props.item, this.state.quantity);
    this.props.onClose && this.props.onClose(e);
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onClose = (e) => {
    console.log("e");
    this.props.onClose && this.props.onClose(e);
  };

  changeQuantity = (bool) => {
    if (bool) {
      this.setState({ quantity: this.state.quantity + 1 });
    } else if (this.state.quantity > 0) {
      this.setState({ quantity: this.state.quantity - 1 });
    }
  };

  render() {
    if (!this.props.show) {
      return null;
    }
    return (
      <Modal
        show={true}
        autoFocus={true}
        scrollable={true}
        onHide={(e) => {
          this.onClose(e);
        }}
        id="orderItemModal"
      >
        <Modal.Header className="modalHeader">
          <Container fluid>
            <Row>
              <Col className="modalHeaderTitle">
                {this.props.item.name}
                <br />
                {this.props.item.description}
              </Col>
              <Col></Col>
              <Col className="closeButtonCol">
                {this.props.item.price}
                <Button
                  variant="secondary"
                  onClick={(e) => {
                    this.onClose(e);
                  }}
                >
                  X
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Header>
        <Modal.Body className="modalBody">
          <Container fluid>
            <p>Επιλογές</p>
            <Form></Form>
          </Container>
        </Modal.Body>
        <Modal.Footer id="modalFooter">
          <Row className="modalFooterRow">
            <Col>
              <Row>
                <Button
                  variant="outline-danger"
                  onClick={() => this.changeQuantity(false)}
                >
                  -
                </Button>
                <p
                  style={{
                    margin: 10,
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  {this.state.quantity}
                </p>
                <Button
                  variant="outline-success"
                  onClick={() => this.changeQuantity(true)}
                >
                  +
                </Button>
              </Row>
            </Col>
            <Col>
              <Button onClick={this.onAdd} className="modalFooterButton">
                Προσθήκη
              </Button>
            </Col>
            <Col></Col>
          </Row>
        </Modal.Footer>
      </Modal>
    );
  }
}
const mapStateToProps = (state) => ({
  isAuthenticated: state.isAuthenticated,
});

export default connect(mapStateToProps, {})(OrderItemModal);
