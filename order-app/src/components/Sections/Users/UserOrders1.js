import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button, Modal, Row } from "react-bootstrap";

import StarBorderIcon from "@material-ui/icons/StarBorder";
import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import {
  auth_get_request,
  auth_put_request,
  auth_post_request,
} from "../../../actions/lib";
import {
  GET_USER,
  GET_USER_ORDERS,
  UPDATE_ORDER,
} from "../../../actions/actions";
import withAuthorization from "../../../firebase/withAuthorization";

import Header1 from "../../Layout/Header1";
import { AccountMenu } from "./AccountPage";
import moment from "moment-timezone";
moment.tz.setDefault("Europe/Athens");

class UserOrders1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOrder: {},
      comment: "",
      comment_order_ids: [],
      rating: 4,
      showCommentModal: false,
      loaded: false,
    };
  }
  static propTypes = {
    userReducer: PropTypes.object.isRequired,
    auth_get_request: PropTypes.func.isRequired,
    auth_put_request: PropTypes.func.isRequired,
    auth_post_request: PropTypes.func.isRequired,
  };

  showCommentModal = (bool, order) => {
    this.setState({
      showCommentModal: !this.state.showCommentModal,
      selectedOrder: order,
    });
  };

  async commentOrder() {
    let data = {
      order_id: this.state.selectedOrder.ID,
      text: this.state.comment,
      // user_name: this.props.userReducer.user.name,
      user_id: this.props.userReducer.user.ID,
      rate: parseFloat(this.state.rating),
    };
    await this.props.auth_post_request(
      `comments/new_comment`,
      data,
      UPDATE_ORDER
    );
    this.showCommentModal(false, null);
  }

  componentDidMount() {
    sessionStorage.setItem("selectedTab", "orders");
    if (this.state.loaded === false) {
      this.props.auth_get_request(
        `user/${sessionStorage.getItem("userID")}`,
        GET_USER
      );
      this.props.auth_get_request(
        `user/${sessionStorage.getItem("userID")}/orders`,
        GET_USER_ORDERS
      );
      this.setState({
        loaded: true,
      });
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div className="min-h-screen">
        {this.state.showCommentModal && <CommentModal />}
        <Header1 />
        <AccountMenu />

        <OrdersList orders={this.props.userReducer.orders} />
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
    auth_post_request,
  })(UserOrders1)
);

const OrdersList = ({ orders }) => {
  return (
    <section className="bg-white shadow rounded-lg p-6 mt-6 container">
      <div className="py-6">
        <span className="font-bold text-xl">
          <h1>Οι διευθήνσεις σου</h1>
        </span>
      </div>
      {orders ? (
        <table class="min-w-full border-collapse block md:table">
          {/* <thead class="block md:table-header-group">
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
          </thead> */}
          <tbody class="block md:table-row-group">
            {orders.map((o, i) => {
              let date = moment(o.createdAt).format("YYYY-MM-DD");
              return (
                <tr class="bg-gray-300 border border-grey-500 md:border-none block md:table-row">
                  <td class="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                    <span class="inline-block w-1/3 md:hidden font-bold">
                      ΗΜ/ΝΙΑ
                    </span>
                    {date}
                  </td>
                  <td class="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                    <span class="inline-block w-1/3 md:hidden font-bold">
                      ΠΡΟΪΌΝΤΑ
                    </span>
                    <ul>
                      {o.products.map((p, ind) => (
                        <li key={ind} className="flex flex-col">
                          <span>
                            {p.quantity} <small>x</small> {p.item_name}
                          </span>
                          <span>
                            {!!p.option_answers && p.option_answers.join()}
                          </span>
                          <span>{p.comment}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td class="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                    <span class="inline-block w-1/3 md:hidden font-bold">
                      Επιλογές
                    </span>
                    <button
                      //   onClick={() => editAddress(a)}
                      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 border border-blue-500 rounded"
                    >
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button
                      //   onClick={() => removeAddress(a)}
                      class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 border border-red-500 rounded"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
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
    </section>
  );
};

const CommentModal = ({}) => {
  return (
    <Modal
      show={true}
      autoFocus={true}
      onHide={(e) => {
        this.showCommentModal(false, null);
      }}
      id="alertModal"
    >
      <Modal.Header className="commentModalHeader">
        <Button
          variant="secondary"
          onClick={(e) => {
            this.showCommentModal(false, null);
          }}
        >
          X
        </Button>
      </Modal.Header>
      <Modal.Body>
        <div className="commentModalBodyDiv">
          <Row className="centered">
            <div>
              <Typography component="legend">
                Εισάγετε το σχόλιο σας!
              </Typography>
              <textarea
                name="comment"
                type="textarea"
                value={this.state.comment}
                placeholder="Σχόλιο.."
                cols="40"
                onChange={(e) => this.onChange(e)}
              />
            </div>
          </Row>
          <Row className="centered">
            <Box component="fieldset" mb={3} borderColor="transparent">
              <Typography component="legend">Βαθμολογία!</Typography>
              <Rating
                name="rating"
                defaultValue={4}
                precision={0.5}
                onChange={(e) => this.onChange(e)}
                emptyIcon={<StarBorderIcon fontSize="inherit" />}
              />
            </Box>
          </Row>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => this.commentOrder()}>Submit</Button>
      </Modal.Footer>
    </Modal>
  );
};
