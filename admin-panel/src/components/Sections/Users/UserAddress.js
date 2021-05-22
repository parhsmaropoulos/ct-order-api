import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button, Modal, Table } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import "../../../css/Pages/accountpage.css";
import { PencilFill } from "react-bootstrap-icons";
import EditAddressModal from "../../Modals/EditAddressModal";
import { getUser, updateUser } from "../../../actions/user";
import AddressModal from "../../Modals/AddressModal";
import { MdRemoveCircle } from "react-icons/md";
import { CircularProgress, Grid, Container } from "@material-ui/core";

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
    };
  }
  static propTypes = {
    userReducer: PropTypes.object.isRequired,
    getUser: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired,
  };

  selectEditAddressModal = (info) => {
    console.log("here");
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
    let data = {
      id: this.props.userReducer.user.id,
      reason: "remove_address",
      address_id: this.state.selectedAddress.id,
    };
    this.props.updateUser(data);
    this.showRemoveAddressDialog(false, null);
  };

  componentDidMount() {
    if (this.props.userReducer.isAuthenticated === false) {
      return <Redirect to="/home" />;
    }
    if (this.props.userReducer.hasLoaded === false) {
      this.props.getUser(this.props.userReducer.user.id);
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
    let authenticated =
      sessionStorage.getItem("isAuthenticated") === "true" ? true : false;
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
    console.log(this.state.showAddressModal);
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

    if (authenticated === false) {
      return <Redirect to="/home" />;
    }
    if (authenticated === true && this.props.userReducer.hasLoaded === false) {
      this.props.getUser(sessionStorage.getItem("userID"));
      return (
        <div className="loading-div">
          <CircularProgress disableShrink />{" "}
        </div>
      );
    } else {
      return (
        <Container className="accountMainPage">
          <Grid xs={8} spacing={3} container>
            <Grid item lg={3} md={3} sm={6}>
              <Link className="nav-text " to="/account">
                Ο λογαριασμός μου
              </Link>
            </Grid>
            <Grid item lg={3} md={3} sm={6}>
              <Link className="nav-text" to="/account/orders">
                Οι παραγγελίες μου
              </Link>
            </Grid>
            <Grid item lg={2} md={2} sm={6}>
              <Link
                className="nav-text  nav-text-activated"
                to="/account/addresses"
              >
                Διευθύνσεις
              </Link>
            </Grid>

            <Grid item lg={2} md={2} sm={6}>
              <Link className="nav-text" to="/account/ratings">
                Βαθμολογίες
              </Link>
            </Grid>
          </Grid>
          <Grid contaier style={{ marginTop: 10 }}>
            <Grid container className="roundedContainer">
              <div className="userAddressColHeader">
                <div className="title">Οι διευθήνσεις σου</div>
                <span></span>
              </div>
              <div className="userAddressColBody table-responsive-sm">
                {this.props.userReducer.user.addresses.length > 0 ? (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Διευθηνση</th>
                        <th>Αριθμός</th>
                        <th>Περιοχή</th>
                        <th>Τ.Κ.</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.props.userReducer.user.addresses.map(
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

export default connect(mapStateToProps, { getUser, updateUser })(UserAdress);
