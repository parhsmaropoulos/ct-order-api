import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Col, Form } from "react-bootstrap";
import "../../css/Layout/general.css";
import { connect } from "react-redux";
import { updateUser, addUserAddress } from "../../actions/user";
import GoogleMapReact from "google-map-react";

import Marker from "../Layout/Marker";

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
    console.log(this.props.address);
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
    updateUser: PropTypes.func.isRequired,
    addUserAddress: PropTypes.func.isRequired,
  };

  onChange = (e) => {
    // var newState = this.state;
    // var newName = e.target.name;
    // newState[newName] = e.target.value;

    // var newAddress =
    //   newState.addressName +
    //   " " +
    //   newState.addressNumber +
    //   ", " +
    //   newState.areaName +
    //   " " +
    //   newState.zipCode +
    //   " , Greece";
    // geocodeByAddress(newAddress)
    //   .then((results) => getLatLng(results[0]))
    //   .then(
    //     (latLng) => (
    //       (newState.center.lat = latLng.lat), (newState.center.lng = latLng.lng)
    //     )
    //   )
    //   .then(this.setState(newState));

    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();
  };
  // handleChange = (address) => {
  //   console.log(this.props);
  // };

  //   handleSelect = (address) => {
  //     geocodeByAddress(address)
  //       .then((results) => this.saveResults(results))
  //       .then((results) => getLatLng(results[0]))
  //       .then((latLng) => console.log("Success", latLng))
  //       .catch((error) => console.error("Error", error));
  //   };

  //   saveResults = (results) => {
  //     console.log(results);
  //     var opts = results[0].address_components;
  //     this.setState({
  //       address: results[0].formatted_address,
  //       addressName: opts[1].long_name,
  //       addressNumber: opts[0].short_name,
  //       areaName: opts[2].long_name,
  //       zipCode: opts[5].long_name,
  //     });
  //     return results;
  //   };

  onAddAddress(e) {
    e.preventDefault();
    let addressname = document.getElementById("formGridAddressName").value;
    let addressnumber = document.getElementById("formGridAddressNumber").value;
    let areaname = document.getElementById("formGridAreaName").value;
    let zipcode = document.getElementById("formGridZipCode").value;
    // console.log(this.props.address);
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
      data.reason = "update_address";
      data.address_id = this.props.address.id;
    } else {
      //   {**ADD ADDRESS**}
      data.reason = "add_address";
    }
    console.log(data);
    this.props.addUserAddress(data);
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
            <span className="modal-content-header-title">Edit Address</span>
            <span className="close" onClick={this.props.closeModal}>
              &times;
            </span>
          </div>
          <div className="modal-content-body">
            <div className="modal-content-body-col left-col">
              <Form onSubmit={this.onSubmit}>
                <Form.Group as={Col} controlId="formGridAddressName">
                  <Form.Label>Address Name</Form.Label>
                  <Form.Control
                    onChange={this.onChange}
                    type="text"
                    name="addressName"
                    value={this.state.addressName}
                    // defaultValue={this.props.address.address_name}
                    placeholder="Address Name"
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridAddressNumber">
                  <Form.Label>Address Number</Form.Label>
                  <Form.Control
                    onChange={this.onChange}
                    type="text"
                    name="addressNumber"
                    value={this.state.addressNumber}
                    // defaultValue={this.props.address.address_number}
                    placeholder="Address Number"
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridAreaName">
                  <Form.Label>Area Name</Form.Label>
                  <Form.Control
                    onChange={this.onChange}
                    type="text"
                    name="areaName"
                    value={this.state.areaName}
                    // defaultValue={this.props.address.area_name}
                    placeholder="Area Name"
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridZipCode">
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control
                    onChange={this.onChange}
                    type="text"
                    name="zipCode"
                    value={this.state.zipCode}
                    // defaultValue={this.props.address.zipcode}
                    placeholder="Zip Code"
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

export default connect(mapStateToProps, { updateUser, addUserAddress })(
  EditAddressModal
);
