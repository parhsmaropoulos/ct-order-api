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
import { CircularProgress, Grid, Container } from "@material-ui/core";
import {
  GET_USER,
  GET_USER_ADDRESSES,
  UPDATE_USER,
} from "../../../actions/actions";

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

class UserAdress extends Component {
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

  showRemoveAddressDialog = (bool, address) => {
    this.setState({
      showRemoveAddressDialog: !this.state.showRemoveAddressDialog,
      selectedAddress: address,
    });
  };

  removeAddress = () => {
    // e.preventDefault();
    // let data = {
    //   id: this.props.userReducer.user.id,
    //   reason: "remove_address",
    //   address_id: this.state.selectedAddress.id,
    // };
    //
    this.props.auth_delete_request(
      `user/${sessionStorage.getItem("userID")}/delete_address/${
        this.state.selectedAddress.ID
      }`,
      UPDATE_USER
    );
    this.showRemoveAddressDialog(false, null);
  };

  componentDidMount() {
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
    let editAddressModal;
    let addAddressModal;
    let removeAddressdialog;
    let authenticated = sessionStorage.getItem("isAuthenticated");
    if (this.state.showRemoveAddressDialog) {
      removeAddressdialog = (
        <Modal
          show={true}
          autoFocus={true}
          onHide={(e) => {
            this.showRemoveAddressDialog(false, null);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Remove address</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>Are you sure you want to remove it?</p>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => this.showRemoveAddressDialog(false, null)}
            >
              Close
            </Button>
            <Button variant="primary" onClick={() => this.removeAddress()}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
    if (this.state.showEditAddressModal) {
      editAddressModal = (
        <EditAddressModal
          address={this.state.selectedAddress}
          updateAddress={this.state.updateAddress}
          displayModal={this.state.showEditAddressModal}
          closeModal={() => this.selectEditAddressModal(false)}
        />
      );
    }
    if (this.state.showAddressModal) {
      addAddressModal = (
        <AddressModal
          displayModal={this.state.showAddressModal}
          closeModal={() => this.selectAddressModal(false, false, "")}
          editAddress={(showAdd, showEdit, address) =>
            this.selectAddressModal(showAdd, showEdit, address)
          }
        />
      );
    }

    if (authenticated === true && this.props.userReducer.hasLoaded === false) {
      this.props.auth_get_request(
        `user/${sessionStorage.getItem("uid")}`,
        GET_USER
      );
      return (
        <div className="loading-div">
          <CircularProgress disableShrink />{" "}
        </div>
      );
    } else {
      return (
        <Container className="accountMainPage">
          <Grid spacing={3} container>
            <Grid item lg={3} md={3} sm={6} xs={12}>
              <Link className="nav-text" to="/account">
                Ο λογαριασμός μου
              </Link>
            </Grid>
            <Grid item lg={3} md={3} sm={6} xs={12}>
              <Link className="nav-text" to="/account/orders">
                Οι παραγγελίες μου
              </Link>
            </Grid>
            <Grid item lg={2} md={2} sm={6} xs={12}>
              <Link
                className="nav-text  nav-text-activated"
                to="/account/addresses"
              >
                Διευθύνσεις
              </Link>
            </Grid>

            {/* <Grid item lg={2} md={2} sm={6} xs={12}>
              <Link className="nav-text" to="/account/ratings">
                Βαθμολογίες
              </Link>
            </Grid> */}
          </Grid>
          <Grid container style={{ marginTop: 10 }}>
            <Grid container className="roundedContainer">
              <div className="userAddressColHeader">
                <div className="title">Οι διευθήνσεις σου</div>
                <span></span>
              </div>
              <div className="userAddressColBody table-responsive-sm">
                {this.props.userReducer.addresses.length > 0 ? (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Διευθηνση</th>
                        <th>Αριθμός</th>
                        <th>Περιοχή</th>
                        <th>Τ.Κ.</th>
                        <th>Επιλογές</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.props.userReducer.addresses.map(
                        (address, index) => {
                          return (
                            <tr
                              className="address-list-item-container"
                              key={index}
                            >
                              <td>{index}</td>
                              <td>{address.address_name}</td>
                              <td>{address.address_number}</td>
                              <td>{address.area_name}</td>
                              <td>{address.zipcode}</td>
                              <td style={{ dispaly: "flex" }}>
                                <PencilFill
                                  onClick={() => this.editAddress(address)}
                                />{" "}
                                <MdRemoveCircle
                                  onClick={() =>
                                    this.showRemoveAddressDialog(true, address)
                                  }
                                >
                                  X
                                </MdRemoveCircle>
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </Table>
                ) : (
                  <div>Δεν εχεις καταχωρήσει κάποια διεύθηνση ακόμα</div>
                )}
              </div>
            </Grid>
          </Grid>
          <div className="addAddressDiv">
            <Button
              className="addAddressButton"
              onClick={() => this.selectAddressModal(true)}
            >
              +
            </Button>
          </div>
          {removeAddressdialog}
          {editAddressModal}
          {addAddressModal}
        </Container>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  userReducer: state.userReducer,
});

export default connect(mapStateToProps, {
  auth_get_request,
  auth_put_request,
  auth_delete_request,
})(UserAdress);
