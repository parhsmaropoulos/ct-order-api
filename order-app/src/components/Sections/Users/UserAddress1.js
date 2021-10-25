/* eslint-disable no-restricted-globals */
import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button, Modal, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../../css/Pages/accountpage.css";
import { PencilFill } from "react-bootstrap-icons";
import EditAddressModal from "../../Modals/EditAddressModal";
// import { getUser, updateUser, getUserAddresses } from "../../../actions/user";
import {
  auth_get_request,
  auth_put_request,
  auth_delete_request,
} from "../../../actions/lib";
import AddressModal from "../../Modals/AddressModal";
import { MdRemoveCircle } from "react-icons/md";
import { Grid, Container } from "@material-ui/core";
import {
  GET_USER,
  GET_USER_ADDRESSES,
  UPDATE_USER,
} from "../../../actions/actions";
import withAuthorization from "../../../firebase/withAuthorization";
import Header from "../../Layout/Header";
import Header1 from "../../Layout/Header1";
import { AccountMenu } from "./AccountPage";
import AddressModal1 from "../../Modals/AddressModal1";
import EditAddressModal1 from "../../Modals/EditAddressModal1";

// const columns = [
//   {
//     field: "#",
//     headerName: "#",
//     width: 70,
//   },
//   { field: "Διευθηνση", headerName: "Διευθηνση" },
//   { field: "Αριθμός", headerName: "Αριθμός" },
//   { field: "Περιοχή", headerName: "Περιοχή" },
//   { field: "Τ.Κ.", headerName: "Τ.Κ." },
//   { field: "Actions", headerName: "Actions" },
// ];

class UserAddress1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      updateAddress: true,
      showEditAddressModal: false,
      showAddressModal: false,
      showRemoveAddressDialog: false,
      selectedAddress: {},
      loaded: false,
    };
  }
  static propTypes = {
    userReducer: PropTypes.object.isRequired,
    auth_get_request: PropTypes.func.isRequired,
    auth_put_request: PropTypes.func.isRequired,
    auth_delete_request: PropTypes.func.isRequired,
  };

  selectEditAddressModal = (info) => {
    this.setState({ showEditAddressModal: !this.state.showEditAddressModal });
  };

  selectAddressModal = (showadd, showedit, address) => {
    console.log(address);
    let updateAddress = true;
    if (showedit) {
      updateAddress = false;
    }
    this.setState({
      showAddressModal: showadd,
      showEditAddressModal: showedit,
      selectedAddress: address,
      updateAddress: updateAddress,
    });
  };

  removeAddress = (address) => {
    if (
      confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε την διεύθυνση αυτή ;")
    ) {
      this.props.auth_delete_request(
        `user/${sessionStorage.getItem("userID")}/delete_address/${address.ID}`,
        UPDATE_USER
      );
    }
  };

  componentDidMount() {
    sessionStorage.setItem("selectedTab", "addresses");
    if (this.props.userReducer.hasLoaded === false) {
      this.props.auth_get_request(
        `user/${sessionStorage.getItem("userID")}`,
        GET_USER
      );
    }
    if (this.state.loaded === false) {
      this.props.auth_get_request(
        `user/${sessionStorage.getItem("userID")}/addresses`,
        GET_USER_ADDRESSES
      );
      this.setState({
        loaded: true,
      });
    }
  }

  editAddress = (address, index) => {
    this.setState({
      selectedAddress: address,
      updateAddress: true,
    });
    this.selectEditAddressModal(true);
  };

  render() {
    return (
      <div>
        {this.state.showAddressModal && (
          <AddressModal1
            displayModal={this.state.showAddressModal}
            onClose={() => this.selectAddressModal(false, false, "")}
            editAddress={(showAdd, showEdit, address) =>
              this.selectAddressModal(showAdd, showEdit, address)
            }
          />
        )}
        {this.state.showEditAddressModal && (
          <EditAddressModal1
            address={this.state.selectedAddress}
            updateAddress={this.state.updateAddress}
            displayModal={this.state.showEditAddressModal}
            onClose={() => this.selectEditAddressModal(false)}
          />
        )}
        <Header1 />
        <AccountMenu />
        <AddressesList
          addresses={this.props.userReducer.addresses}
          editAddress={(address) => this.editAddress(address)}
          removeAddress={(address) => this.removeAddress(address)}
        />
        <div className="flex justify-items-center">
          <div className="text-center w-full">
            <button
              onClick={() => this.selectAddressModal(true)}
              class="p-2 pl-5 pr-5 bg-blue-500 text-gray-100 text-lg rounded-lg focus:border-4 border-blue-300"
            >
              Προσθήκη
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userReducer: state.userReducer,
});

const condition = (authUser) => !!authUser;
export default withAuthorization(condition)(
  connect(mapStateToProps, {
    auth_get_request,
    auth_put_request,
    auth_delete_request,
  })(UserAddress1)
);

const AddressesList = ({ addresses, editAddress, removeAddress }) => {
  return (
    <div class="bg-white shadow rounded-lg p-6 mt-6">
      <div className="py-6">
        <span className="font-bold text-xl">
          <h1>Οι διευθήνσεις σου</h1>
        </span>
      </div>
      {addresses ? (
        <table class="text-left w-full">
          <thead class="bg-black flex text-white h-10 w-full">
            <tr class="flex w-full text-center">
              <th className="w-1/6">#</th>
              <th className="w-1/6">Διευθηνση</th>
              <th className="w-1/6">Αριθμός</th>
              <th className="w-1/6">Περιοχή</th>
              <th className="w-1/6">Τ.Κ.</th>
              <th className="w-1/6">Επιλογές</th>
            </tr>
          </thead>
          {/* <!-- Remove the nasty inline CSS fixed height on production and replace it with a CSS class — this is just for demonstration purposes! --> */}
          <tbody class="bg-grey-light flex flex-col items-center justify-between overflow-y-auto w-full">
            {addresses.map((a, i) => {
              return (
                <tr class="flex text-center w-full mb-4" key={i}>
                  <td className="w-1/6">{i}</td>
                  <td className="w-1/6">{a.address_name}</td>
                  <td className="w-1/6">{a.address_number}</td>
                  <td className="w-1/6">{a.area_name}</td>
                  <td className="w-1/6">{a.zipcode}</td>
                  <td className="w-1/6">
                    <span className="mr-3">
                      <i
                        class="fas fa-pencil-alt"
                        onClick={() => editAddress(a)}
                      ></i>
                    </span>
                    <span className="ml-3">
                      <i
                        class="fas fa-trash-alt"
                        onClick={() => removeAddress(a)}
                      ></i>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div>
          <span>Δεν έχεις ακόμα καταχωρήσει διευθυνση</span>
        </div>
      )}
    </div>
  );
};
