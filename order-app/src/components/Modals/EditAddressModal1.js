import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../css/Layout/general.css";
import { connect } from "react-redux";
// import { updateUser, addUserAddress } from "../../actions/user";
import {
  auth_get_request,
  auth_put_request,
  auth_post_request,
} from "../../actions/lib";
import GoogleMapReact from "google-map-react";
import { ADD_ADDRESS, EDIT_ADDRESS } from "../../actions/actions";

import Marker from "../Layout/Marker";

class EditAddressModal1 extends Component {
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
    this.onChangeAddressField = this.onChangeAddressField.bind(this);
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

  onChangeAddressField = (e) => {
    e.preventDefault();
    return;
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
    this.props.onClose();
  }

  onClose(e) {
    this.setState({
      address: "",
      addressName: "",
      addressNumber: "",
      zipCode: "",
      cityName: "",
      areaName: "",
    });
    this.props.onClose && this.props.onClose(e);
  }
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
                Επεξεργασία Διεύθυνσης
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
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 text-center">
              <div className=" border-t-2 border-b-2 border-l-0 border-r-0 border-black lg:flex md:flex lg:flex-row md:flex-row sm:flex-col">
                <div className="flex-1 bg-blue-100">
                  <AddressForm
                    onChange={this.onChange}
                    state={this.state}
                    onSubmit={this.onChangeAddressField}
                  />
                </div>
                <div className="flex-1 bg-blue-200">
                  <AddressMap
                    state={this.state}
                    handlers={this.eventHandlers}
                  />
                </div>
              </div>
            </div>
            {/* BUTTON */}
            <div className="flex">
              <div className="flex-1 w-full text-center">
                <button
                  onClick={this.onAddAddress}
                  className="p-2 pl-5 pr-5 mb-5 bg-blue-500 text-gray-100 text-lg rounded-lg focus:border-4 border-blue-300"
                >
                  Προσθήκη
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

export default connect(mapStateToProps, {
  auth_get_request,
  auth_put_request,
  auth_post_request,
})(EditAddressModal1);

const AddressForm = ({ onChange, state, onSubmit }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="py-6">
        <span className="font-bold">
          <h1>Αλλαγή στοιχείων</h1>
        </span>
      </div>
      <div className="grid lg:grid-cols-1 gap-6">
        <div className="border focus-within:border-blue-500 focus-within:text-blue-500 transition-all duration-500 relative rounded p-1">
          <div className="-mt-4 absolute tracking-wider px-1 uppercase text-xs">
            <p>
              <label
                htmlFor="addressName"
                className="bg-white text-gray-600 px-1"
              >
                Όνομα Οδού
              </label>
            </p>
          </div>
          <p>
            <input
              id="addressName"
              name="addressName"
              autoComplete="false"
              tabIndex="0"
              value={state.addressName}
              onChange={onChange}
              type="text"
              className="py-1 px-1 text-gray-900 outline-none block h-full w-full"
            />
          </p>
        </div>
        <div className="border focus-within:border-blue-500 focus-within:text-blue-500 transition-all duration-500 relative rounded p-1">
          <div className="-mt-4 absolute tracking-wider px-1 uppercase text-xs">
            <p>
              <label
                htmlFor="addressNumber"
                className="bg-white text-gray-600 px-1"
              >
                Αριθμός Οδού
              </label>
            </p>
          </div>
          <p>
            <input
              name="addressNumber"
              id="addressNumber"
              autoComplete="false"
              tabIndex="0"
              onChange={onChange}
              value={state.addressNumber}
              type="text"
              className="py-1 px-1 outline-none block h-full w-full"
            />
          </p>
        </div>
        <div className="border focus-within:border-blue-500 focus-within:text-blue-500 transition-all duration-500 relative rounded p-1">
          <div className="-mt-4 absolute tracking-wider px-1 uppercase text-xs">
            <p>
              <label htmlFor="areaName" className="bg-white text-gray-600 px-1">
                Όνομα Περιοχής
              </label>
            </p>
          </div>
          <p>
            <input
              id="areaName"
              name="areaName"
              inputprops={{
                pattern: "69[0-9]{8}",
              }}
              tabIndex="0"
              onChange={onChange}
              value={state.areaName}
              type="text"
              className="py-1 px-1 outline-none block h-full w-full"
            />
          </p>
        </div>
        <div className="border f transition-all duration-500  relative rounded p-1">
          <div className="-mt-4 absolute tracking-wider  px-1 uppercase text-xs">
            <p>
              <label htmlFor="zipCode" className="bg-white text-gray-600 px-1">
                Τ.Κ.
              </label>
            </p>
          </div>
          <p>
            <input
              onChange={onChange}
              value={state.zipCode}
              id="zipCode"
              autoComplete="false"
              tabIndex="0"
              name="zipCode"
              type="text"
              className="py-1 px-1 outline-none block bg-gray-200 h-full w-full"
            />
          </p>
        </div>
      </div>
      <div className="border-t mt-6 pt-3">
        <button
          onClick={onSubmit}
          className="rounded text-gray-100 px-3 py-1 bg-blue-500 hover:shadow-inner hover:bg-blue-700 transition-all duration-300"
        >
          Ενημέρωση
        </button>
      </div>
    </div>
  );
};

const AddressMap = ({ state, eventHandlers }) => {
  return (
    <div className="w-full h-full">
      <GoogleMapReact
        defaultCenter={state.center}
        // center={this.state.center}
        defaultZoom={state.zoom}
      >
        <Marker
          eventHandlers={eventHandlers}
          lat={state.center.lat}
          lng={state.center.lng}
          draggable={true}
          name="Here"
          color="blue"
        />
      </GoogleMapReact>
    </div>
  );
};
