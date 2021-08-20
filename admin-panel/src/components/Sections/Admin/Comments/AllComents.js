import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";
import "../../../../css/Pages/adminpage.css";
import { approve_comment, reject_comment } from "../../../../actions/comments";
import {
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@material-ui/core";

class AllComments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      hasLoaded: false,
    };
  }

  static propTypes = {
    approve_comment: PropTypes.func.isRequired,
    reject_comment: PropTypes.func.isRequired,
  };

  componentDidMount() {
    if (this.state.hasLoaded === false) {
      let comments = [];

      axios.get("http://localhost:8080/comments/all").then((res) => {
        console.log(res);
        comments = res.data.data;
        this.setState({
          comments: comments,
          hasLoaded: true,
        });
      });
    }
  }

  render() {
    console.log(this.state);
    if (this.state.hasLoaded === false) {
      return (
        <div>
          <div className="loading-div">
            <CircularProgress disableShrink />{" "}
          </div>
        </div>
      );
    }
    return (
      <div>
        {this.state.comments.length > 0 ? (
          <List>
            {this.state.comments.map((comment, id) => {
              return (
                <ListItem
                  key={id}
                  alignItems="flex-start"
                  className="comment-list-item"
                >
                  <Paper>
                    <ListItemText
                      primary={
                        <React.Fragment>
                          {comment.text}
                          <br />
                          {comment.rate}/5
                          <br />
                          <Button>View Details</Button>
                        </React.Fragment>
                      }
                      secondary={
                        <React.Fragment>
                          {comment.answered === false ? (
                            <React.Fragment>
                              <Button
                                onClick={() =>
                                  this.props.approve_comment(comment.id)
                                }
                              >
                                Accept
                              </Button>
                              <Button
                                onClick={() =>
                                  this.props.reject_comment(comment.id)
                                }
                              >
                                Reject
                              </Button>
                            </React.Fragment>
                          ) : (
                            <span>
                              {comment.approved ? (
                                <span>approved</span>
                              ) : (
                                <span>rejected</span>
                              )}
                            </span>
                          )}
                        </React.Fragment>
                      }
                    />
                  </Paper>
                </ListItem>
              );
            })}
          </List>
        ) : (
          <span>No comments yet</span>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { approve_comment, reject_comment })(
  AllComments
);
