/* eslint-disable no-restricted-globals */
import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  auth_get_request,
  auth_put_request,
  auth_delete_request,
} from "../../../actions/lib";
import {
  GET_USER,
  GET_USER_ADDRESSES,
  UPDATE_USER,
} from "../../../actions/actions";
import withAuthorization from "../../../firebase/withAuthorization";

import Header1 from "../../Layout/Header1";
import { AccountMenu } from "./AccountPage";
import AddressModal1 from "../../Modals/AddressModal1";
import EditAddressModal1 from "../../Modals/EditAddressModal1";

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
              className="p-2 pl-5 pr-5 bg-blue-500 text-gray-100 text-lg rounded-lg focus:border-4 border-blue-300"
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
    <section className="bg-white shadow rounded-lg p-6 mt-6 container">
      <div className="py-6">
        <span className="font-bold text-xl">
          <h1>Οι διευθήνσεις σου</h1>
        </span>
      </div>
      {addresses ? (
        <table class="min-w-full border-collapse block md:table">
          <thead class="block md:table-header-group">
            <tr class="border border-grey-500 md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto  md:relative ">
              <th class="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell">
                #
              </th>
              <th class="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell">
                Διεύθυνση
              </th>
              <th class="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell">
                Αριθμός
              </th>
              <th class="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell">
                Περιοχή
              </th>
              <th class="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell">
                T.K.
              </th>
              <th class="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell">
                Επιλογές
              </th>
            </tr>
          </thead>
          <tbody class="block md:table-row-group">
            {addresses.map((a, i) => (
              <tr class="bg-gray-300 border border-grey-500 md:border-none block md:table-row">
                <td class="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  <span class="inline-block w-1/3 md:hidden font-bold">#</span>
                  {i}
                </td>
                <td class="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  <span class="inline-block w-1/3 md:hidden font-bold">
                    Διεύθυνση
                  </span>
                  {a.address_name}
                </td>
                <td class="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  <span class="inline-block w-1/3 md:hidden font-bold">
                    Αριθμός
                  </span>
                  {a.address_number}
                </td>
                <td class="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  <span class="inline-block w-1/3 md:hidden font-bold">
                    Περιοχή
                  </span>
                  {a.area_name}
                </td>
                <td class="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  <span class="inline-block w-1/3 md:hidden font-bold">
                    Τ.Κ
                  </span>
                  {a.zipcode}
                </td>
                <td class="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  <span class="inline-block w-1/3 md:hidden font-bold">
                    Επιλογές
                  </span>
                  <button
                    onClick={() => editAddress(a)}
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 border border-blue-500 rounded"
                  >
                    <i className="fas fa-pencil-alt"></i>
                  </button>
                  <button
                    onClick={() => removeAddress(a)}
                    class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 border border-red-500 rounded"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>
          <span>Δεν έχεις ακόμα καταχωρήσει διευθυνση</span>
        </div>
      )}
    </section>
  );
};
