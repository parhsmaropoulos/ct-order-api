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
    this.showCommentModal = this.showCommentModal.bind(this);
    this.commentOrder = this.commentOrder.bind(this);
  }
  static propTypes = {
    userReducer: PropTypes.object.isRequired,
    auth_get_request: PropTypes.func.isRequired,
    auth_put_request: PropTypes.func.isRequired,
    auth_post_request: PropTypes.func.isRequired,
  };

  showCommentModal = (order) => {
    this.setState({
      showCommentModal: !this.state.showCommentModal,
      selectedOrder: order,
    });
  };

  async commentOrder() {
    console.log(this.state);
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

  onClose = (e) => {
    this.setState({ showCommentModal: false, selectedOrder: null });
  };
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div className="min-h-screen">
        <CommentModal
          show={this.state.showCommentModal}
          onChange={this.onChange}
          onClose={this.onClose}
          comment={this.state.comment}
          onSubmit={this.commentOrder}
        />
        <Header1 />
        <AccountMenu />

        <OrdersList
          orders={this.props.userReducer.orders}
          showCommentModal={(o) => this.showCommentModal(0)}
        />
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

const OrdersList = ({ orders, showCommentModal }) => {
  return (
    <section className="bg-white shadow rounded-lg p-6 mt-6 container">
      <div className="py-6">
        <span className="font-bold text-xl">
          <h1>Οι παραγγελίες σου</h1>
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
                    {/* <button
                      onClick={() => showCommentModal(o)}
                      class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 border border-yellow-500 rounded"
                    >
                      <i className="fas fa-pencil-alt"></i>
                    </button> */}
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

const CommentModal = ({ show, onClose, comment, onSubmit, onChange }) => {
  return (
    <div
      className={`fixed z-10 inset-0 overflow-y-auto ${show ? "" : "hidden"}`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`flex  justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 ${
          show ? "" : "hidden"
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
            show
              ? "ease-out duration-300 opacity-100"
              : "ease-in duration-200 opacity-0 hidden"
          }`}
          onClick={onClose}
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
            show
              ? "ease-out duration-300 opacity-100 translate-y-0 sm:scale-100"
              : "ease-in duration-200 opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          }`}
        >
          <div className="flex text-center">
            <span className=" flex-1 font-bold text-2xl w-8/10">
              Εισάγετε το σχόλιο σας!
            </span>
            <button
              type="submit"
              className="flex-none  w-1/10   py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onClose}
            >
              X
            </button>
          </div>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 text-center">
            {/* COMMENTS */}
            <div className="flex flex-wrap mb-6 mt-6 text-center">
              <span className="text-center text-xl font-bold">Σχόλια</span>
              <div className="relative w-full appearance-none label-floating">
                <textarea
                  className="autoexpand tracking-wide py-2 px-4 mb-3 leading-relaxed appearance-none block w-full bg-gray-200 border border-gray-200 rounded focus:outline-none focus:bg-white focus:border-gray-500"
                  id="message"
                  type="text"
                  name="comment"
                  value={comment}
                  onChange={onChange}
                  placeholder="Σχόλια.."
                ></textarea>
                <label
                  htmlFor="message"
                  className="absolute tracking-wide py-2 px-4 mb-4 opacity-0 leading-tight block top-0 left-0 cursor-text"
                >
                  Σχόλια..
                </label>
              </div>
            </div>
            {/* BUTTONS */}
            <div className="flex">
              <div className="flex-1">
                <button
                  onClick={onSubmit}
                  className="p-2 pl-5 pr-5 bg-blue-500 text-gray-100 text-lg rounded-lg focus:border-4 border-blue-300"
                >
                  Αποθήκευση
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
