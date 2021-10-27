import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Col, Form } from "react-bootstrap";
import "../../css/Layout/general.css";
import { connect } from "react-redux";
// import { updateUser, addUserAddress } from "../../actions/user";
import {
  auth_get_request,
  auth_put_request,
  auth_post_request,
} from "../actions/lib";
import GoogleMapReact from "google-map-react";
import { ADD_ADDRESS, EDIT_ADDRESS } from "../actions/actions";

import Marker from "../components/Layout/Marker";

class EditAddressModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      address: "",
      addressName: "",
      addressNumber: "",
      zipCode: "",
      cityName: "",
      areaName: "",
      text: "",
      center: {
        lat: 0,
        lng: 0,
      },
      zoom: 17,
    };

    this.onAddAddress = this.onAddAddress.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    let text;
    if (this.props.updateAddress) {
      text = "Ενημέρωση";
    } else {
      text = "Προσθήκη";
    }
    // console.log(this.props.address);
    let addr = this.props.address;
    if (addr.latitude === 0) {
      addr.latitude = 37.892267385003336;
    }
    if (addr.longitude === 0) {
      addr.longitude = 23.749797071179643;
    }
    this.setState({
      address: addr.address,
      addressName: addr.address_name,
      addressNumber: addr.address_number,
      areaName: addr.area_name,
      zipCode: addr.zipcode,
      text: text,
      center: {
        lat: addr.latitude,
        lng: addr.longitude,
      },
    });
  }

  static propTypes = {
    userReducer: PropTypes.object.isRequired,
    auth_put_request: PropTypes.func.isRequired,
    auth_get_request: PropTypes.func.isRequired,
    auth_post_request: PropTypes.func.isRequired,
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();
  };

  onAddAddress(e) {
    e.preventDefault();
    let addressname = document.getElementById("formGridAddressName").value;
    let addressnumber = document.getElementById("formGridAddressNumber").value;
    let areaname = document.getElementById("formGridAreaName").value;
    let zipcode = document.getElementById("formGridZipCode").value;
    const data = {
      // user_id: sessionStorage.getItem("userID"),
      area_name: areaname,
      address_name: addressname,
      address_number: addressnumber,
      zipcode: zipcode,
      longitude: this.state.center.lng,
      latitude: this.state.center.lat,
      city_name: "",
    };
    if (this.props.updateAddress) {
      //   {**UPDATE ADDRESS**}
      data.address_id = this.props.address.id;
      this.props.auth_put_request(
        `user/${sessionStorage.getItem("userID")}/update_address`,
        data,
        EDIT_ADDRESS
      );
    } else {
      //   {**ADD ADDRESS**}
      this.props.auth_post_request(
        `user/${sessionStorage.getItem("userID")}/add_address`,
        data,
        ADD_ADDRESS
      );
    }
    // console.log(data);
    this.setState({
      address: "",
      addressName: "",
      addressNumber: "",
      zipCode: "",
      cityName: "",
      areaName: "",
    });
    this.props.closeModal();
  }

  closeModal(e) {
    this.setState({
      address: "",
      addressName: "",
      addressNumber: "",
      zipCode: "",
      cityName: "",
      areaName: "",
    });
    e.stopPropagation();
  }
  render() {
    let style = {};
    if (this.props.displayModal) {
      style = { display: "block" };
    } else {
      style = { display: "none" };
    }
    return (
      <div
        className="modal addressModal"
        onClick={this.props.closeModal}
        style={style}
      >
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content-header">
            <span className="modal-content-header-title">
              Επεξεργασία Διεύθυνσης
            </span>
            <span className="close" onClick={this.props.closeModal}>
              &times;
            </span>
          </div>
          <div className="modal-content-body">
            <div className="modal-content-body-col left-col">
              <Form onSubmit={this.onSubmit}>
                <Form.Group as={Col} controlId="formGridAddressName">
                  <Form.Label>Όνομα Οδού</Form.Label>
                  <Form.Control
                    onChange={this.onChange}
                    type="text"
                    name="addressName"
                    value={this.state.addressName}
                    // defaultValue={this.props.address.address_name}
                    placeholder="Όνομα Οδού"
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridAddressNumber">
                  <Form.Label>Αριθμός Οδού</Form.Label>
                  <Form.Control
                    onChange={this.onChange}
                    type="text"
                    name="addressNumber"
                    value={this.state.addressNumber}
                    // defaultValue={this.props.address.address_number}
                    placeholder="Αριθμός Οδού"
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridAreaName">
                  <Form.Label>Όνομα Περιοχής</Form.Label>
                  <Form.Control
                    onChange={this.onChange}
                    type="text"
                    name="areaName"
                    value={this.state.areaName}
                    // defaultValue={this.props.address.area_name}
                    placeholder="Όνομα Περιοχής"
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridZipCode">
                  <Form.Label>Τ.Κ.</Form.Label>
                  <Form.Control
                    onChange={this.onChange}
                    type="text"
                    name="zipCode"
                    value={this.state.zipCode}
                    // defaultValue={this.props.address.zipcode}
                    placeholder="Τ.Κ."
                  />
                </Form.Group>
              </Form>
            </div>
            <div className="modal-content-body-col right-col">
              <div style={{ height: "100%", width: "100%" }}>
                <GoogleMapReact
                  defaultCenter={this.state.center}
                  // center={this.state.center}
                  defaultZoom={this.state.zoom}
                >
                  <Marker
                    eventHandlers={this.eventHandlers}
                    lat={this.state.center.lat}
                    lng={this.state.center.lng}
                    draggable={true}
                    name="Here"
                    color="blue"
                  />
                </GoogleMapReact>
              </div>
            </div>
          </div>
          <div className="modal-content-footer">
            <Button
              onClick={this.onAddAddress}
              className="modal-content-footer-button"
            >
              {this.state.text}
              {/* Αποθήκευση */}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userReducer: state.userReducer,
});

export default connect(mapStateToProps, {
  auth_get_request,
  auth_put_request,
  auth_post_request,
})(EditAddressModal);
