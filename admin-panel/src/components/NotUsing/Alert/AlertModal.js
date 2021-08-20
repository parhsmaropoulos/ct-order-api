import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import "../../../../css/Layout/general.css";
import PropTypes from "prop-types";

class AlertModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static propTypes = {
    errorReducer: PropTypes.object.isRequired,
  };
  componentDidMount() {
    // console.log(this.props);
  }
  onClose = (e) => {
    this.props.onClose && this.props.onClose(e);
  };
  render() {
    if (!this.props.show) {
      return null;
    } else {
      return (
        <Modal
          show={true}
          autoFocus={true}
          onHide={(e) => {
            this.onClose(e);
          }}
          id="alertModal"
        >
          <Modal.Header className="alertModalHeader">
            <Button
              variant="secondary"
              onClick={(e) => {
                this.onClose(e);
              }}
            >
              X
            </Button>
          </Modal.Header>
          <Modal.Body>
            <div className="alertModalMessageDiv">
              <span className="alertModalMessage">
                {this.props.errorReducer.message}
              </span>
            </div>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  errorReducer: state.errorReducer,
});

export default connect(mapStateToProps)(AlertModal);
