import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import "../../css/Layout/general.css";
import { connect } from "react-redux";
import PlacesAutocomplete from "react-places-autocomplete";
import { updateUser } from "../../actions/user";

import {
  geocodeByAddress,
  // geocodeByPlaceId,
  getLatLng,
} from "react-places-autocomplete";
// import AlertModal from "../MainPanel/Pages/Alert/AlertModal";
// import EditAddressModal from "./EditAddressModal";/

class AddressModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      addressName: "",
      addressNumber: "",
      zipCode: "",
      cityName: "",
      areaName: "",
      completeAddress: {},
      latitude: 0,
      longitude: 0,
      showErrorModal: false,
      showEditModal: false,
      errorMessage: "",
    };
    this.onAddAddress = this.onAddAddress.bind(this);
  }

  static propTypes = {
    userReducer: PropTypes.object.isRequired,
    updateUser: PropTypes.func.isRequired,
  };

  handleChange = (address) => {
    this.setState({ address });
    // console.log(this.state);
  };

  handleSelect = (address) => {
    console.log(address);
    geocodeByAddress(address)
      .then((results) => this.saveResults(results))
      .then((results) => getLatLng(results[0]))
      .then((latLng) =>
        this.setState({
          latitude: latLng.lat,
          longitude: latLng.lng,
        })
      )
      .then((latLng) => console.log("Success", this.state))
      .catch((error) => console.error("Error", error));
  };

  saveResults = (results) => {
    console.log(results);
    var opts = results[0].address_components;
    this.setState({
      address: results[0].formatted_address,
      addressName: opts[1].long_name,
      addressNumber: opts[0].short_name,
      areaName: opts[2].long_name,
      zipCode: opts[5].long_name,
    });
    return results;
  };

  onAddAddress(e) {
    e.preventDefault();
    console.log(this.props);

    const data = {
      id: this.props.userReducer.user.id,
      address: {
        area_name: this.state.areaName,
        address_name: this.state.addressName,
        address_number: this.state.addressNumber,
        zipcode: this.state.zipCode,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
      },
      reason: "add_address",
    };
    this.props.closeModal && this.props.closeModal(false, true, data.address);

    // if (
    //   this.state.addressName === "" ||
    //   this.state.addressNumber === "" ||
    //   this.state.zipCode === "" ||
    //   this.state.address === ""
    // ) {
    //   this.setState({
    //     showErrorModal: true,
    //     errorMessage: "Invalid location",
    //   });
    // } else {
    //   this.props.updateUser(data);
    //   this.setState({
    //     address: "",
    //     addressName: "",
    //     addressNumber: "",
    //     zipCode: "",
    //     cityName: "",
    //     areaName: "",
    //     latitude: 0,
    //     longitude: 0,
    //     showErrorModal: false,
    //     errorMessage: "",
    //   });
    //   this.props.closeModal();
    // }
  }
  showEditModal = () => {
    this.setState({ showEditModal: !this.state.showEditModal });
  };

  closeModal(e) {
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
      <div className="modal " onClick={this.props.closeModal} style={style}>
        {/* <AlertModal
          show={this.state.showErrorModal}
          message={this.state.errorMessage}
        /> */}
        <div
          className="modal-content address-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content-header">
            <span className="modal-content-header-title">Add new address</span>
            <span className="close" onClick={this.props.closeModal}>
              &times;
            </span>
          </div>
          <div className="modal-content-body">
            <PlacesAutocomplete
              value={this.state.address}
              onChange={this.handleChange}
              onSelect={this.handleSelect}
              searchOptions={{
                componentRestrictions: {
                  country: "gr",
                },
              }}
            >
              {({
                getInputProps,
                suggestions,
                getSuggestionItemProps,
                loading,
              }) => (
                <div className="autocomplete-div">
                  <input
                    {...getInputProps({
                      placeholder: "Search Places ...",
                      className: "location-search-input",
                    })}
                  />
                  <div className="autocomplete-dropdown-container">
                    {loading && <div>Loading...</div>}
                    {suggestions.map((suggestion, index) => {
                      const className = suggestion.active
                        ? "suggestion-item--active"
                        : "suggestion-item";
                      // inline style for demonstration purpose
                      const style = suggestion.active
                        ? { backgroundColor: "#fafafa", cursor: "pointer" }
                        : { backgroundColor: "#ffffff", cursor: "pointer" };
                      return (
                        <div
                          {...getSuggestionItemProps(suggestion, {
                            className,
                            style,
                          })}
                          key={index}
                        >
                          <span>{suggestion.description}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
          </div>
          <div className="modal-content-footer">
            <Button
              onClick={this.onAddAddress}
              className="modal-content-footer-button"
            >
              {/* Προσθήκη */}
              Συνέχεια
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

export default connect(mapStateToProps, { updateUser })(AddressModal);
