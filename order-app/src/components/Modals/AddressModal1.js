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

class AddressModal1 extends Component {
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
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  static propTypes = {
    userReducer: PropTypes.object.isRequired,
    updateUser: PropTypes.func.isRequired,
  };

  handleChange = (address) => {
    this.setState({ address });
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
      // .then((latLng) => console.log("Success", this.state))
      .catch((error) => console.error("Error", error));
  };

  saveResults = (results) => {
    // console.log(results);
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
  componentWillUnmount() {
    this.setState({
      address: "",
      addressName: "",
      addressNumber: "",
      areaName: "",
      zipCode: "",
    });
  }

  onAddAddress(e) {
    e.preventDefault();
    // console.log(this.props);
    const data = {
      id: sessionStorage.getItem("userID"),
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
    this.props.editAddress && this.props.editAddress(false, true, data.address);
  }
  showEditModal = () => {
    this.setState({ showEditModal: !this.state.showEditModal });
  };

  onClose = (e) => {
    this.props.onClose && this.props.onClose(e);
  };
  render() {
    return (
      <div
        className={`fixed z-10 inset-0 overflow-y-auto ${
          this.props.displayModal ? "" : "hidden"
        }`}
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          className={`flex  justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 ${
            this.props.displayModal ? "" : "hidden"
          }`}
        >
          {/* <!--
      Background overlay, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100"
        To: "opacity-0"
    --> */}
          <div
            className={`fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${
              this.props.displayModal
                ? "ease-out duration-300 opacity-100"
                : "ease-in duration-200 opacity-0 hidden"
            }`}
            onClick={(e) => {
              this.onClose(false);
            }}
            aria-hidden="true"
          ></div>

          {/* <!-- This element is to trick the browser into centering the modal contents. --> */}
          <span
            className="hidden inline-block align-middle h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          {/* <!--
      Modal panel, show/hide based on modal state.

      
      Entering: "ease-out duration-300"
        From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        To: "opacity-100 translate-y-0 sm:scale-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100 translate-y-0 sm:scale-100"
        To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    --> */}
          <div
            className={`inline-block  align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle  sm:w-full md:w-8/12 lg:w-8/12 ${
              this.props.displayModal
                ? "ease-out duration-300 opacity-100 translate-y-0 sm:scale-100"
                : "ease-in duration-200 opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            }`}
          >
            <div className="flex text-center">
              <span className=" flex-1 font-bold text-2xl w-9/10">
                Προσθήκη Διεύθυνσης
              </span>
              <button
                type="submit"
                className="flex-none  w-1/10   py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={(e) => {
                  this.onClose(false);
                }}
              >
                X
              </button>
            </div>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4  text-center">
              <AddressForm
                address={this.state.address}
                handleChange={this.handleChange}
                handleSelect={this.handleSelect}
              />
            </div>
            {/* BUTTON */}
            <div className="flex">
              <div className="flex-1 w-full text-center">
                <button
                  onClick={this.onAddAddress}
                  class="p-2 pl-5 pr-5 bg-blue-500 text-gray-100 text-lg rounded-lg focus:border-4 border-blue-300"
                >
                  Συνέχεια
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userReducer: state.userReducer,
});

export default connect(mapStateToProps, { updateUser })(AddressModal1);

const AddressForm = ({ address, handleChange, handleSelect }) => {
  return (
    <div className="flex">
      <div className="flex-1 text-center">
        <PlacesAutocomplete
          value={address}
          onChange={handleChange}
          onSelect={handleSelect}
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
            <div className="">
              <input
                {...getInputProps({
                  placeholder: "Αναζήτηση ...",
                  className: "w-1/2",
                })}
              />
              <div className="flex flex-col text-center">
                {loading && <div>Loading...</div>}
                {suggestions.map((suggestion, index) => {
                  const className = `text-center bg-gray-200 ${
                    suggestion.active && "bg-gray-400"
                  } rounded-sm cursor-pointer`;

                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
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
    </div>
  );
};
