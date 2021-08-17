import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../../css/Pages/accountpage.css";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { CircularProgress, Grid, Container } from "@material-ui/core";
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

class UserOrders extends Component {
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
    console.log(data);
    await this.props.auth_post_request(
      `comments/new_comment`,
      data,
      UPDATE_ORDER
    );
    console.log(this.state);
  }

  componentDidMount() {
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
    let authenticated =
      sessionStorage.getItem("isAuthenticated") === "true" ? true : false;
    let commentModal;
    if (this.state.showCommentModal)
      commentModal = (
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
                    Enter your comment!
                  </Typography>
                  <textarea
                    name="comment"
                    type="textarea"
                    value={this.state.comment}
                    placeholder="Great job.."
                    cols="40"
                    onChange={(e) => this.onChange(e)}
                  />
                </div>
              </Row>
              <Row className="centered">
                <Box component="fieldset" mb={3} borderColor="transparent">
                  <Typography component="legend">Leave a rating!</Typography>
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
    if (authenticated === true && this.props.userReducer.hasLoaded === false) {
      this.props.auth_get_request(
        `user/${sessionStorage.getItem("userID")}`,
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
              <Link
                className="nav-text  nav-text-activated"
                to="/account/orders"
              >
                Οι παραγγελίες μου
              </Link>
            </Grid>
            <Grid item lg={2} md={2} sm={6} xs={12}>
              <Link className="nav-text" to="/account/addresses">
                Διευθύνσεις
              </Link>
            </Grid>

            <Grid item lg={2} md={2} sm={6} xs={12}>
              <Link className="nav-text" to="/account/ratings">
                Βαθμολογίες
              </Link>
            </Grid>
          </Grid>
          <Col className="userOrdersCol bodyCol">
            <div className="roundedContainer">
              <div className="userOrdersColHeader">
                <div className="title">Οι παραγγελίες σου</div>
                <span></span>
              </div>
              <div className="userOrdersColBody">
                {this.props.userReducer.orders.length > 0 ? (
                  <div>
                    {this.props.userReducer.orders.map((order, index) => {
                      // console.log(order);
                      var date = new Date(order.CreatedAt);
                      return (
                        <Row className="orderRow" key={index}>
                          <Col className="orderRowCol dateCol">
                            {date.getDate()}-{date.getMonth() + 1}-
                            {date.getFullYear()}
                          </Col>
                          <Col className="orderRowCol prodsCol">
                            <ul>
                              {order.products.map((product, index) => {
                                return (
                                  <li key={index}>
                                    <span className="listItemTitle">
                                      x {product.quantity} {product.item_name}
                                    </span>
                                    <br />{" "}
                                    <span className="listItemSubTitle">
                                      {!!product.option_answers &&
                                      product.option_answers.length > 0
                                        ? product.option_answers.join() + ","
                                        : null}
                                      {product.comment}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          </Col>
                          <Col className="orderRowCol optionsCol">
                            {/* {console.log(this.state.comment_order_ids)}
                            {console.log(order.id)} */}
                            {this.state.comment_order_ids.includes(order.id) ? (
                              <span>Commented</span>
                            ) : (
                              <button
                                className="commentButton"
                                onClick={() =>
                                  this.showCommentModal(false, order)
                                }
                              >
                                Comment!
                              </button>
                            )}
                          </Col>
                        </Row>
                      );
                    })}
                  </div>
                ) : (
                  <div>Δεν εχεις ολοκληρώσει κάποια παραγγελία ακόμα</div>
                )}
              </div>
            </div>
          </Col>
          {commentModal}
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
  auth_post_request,
})(UserOrders);
