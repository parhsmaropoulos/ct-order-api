import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import StarIcon from "@material-ui/icons/Star";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckIcon from "@material-ui/icons/Check";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import {
  answer_comment,
  approve_comment,
  reject_comment,
} from "../../../../actions/comments";
import { useDispatch } from "react-redux";
// import ReactToPrint from "react-to-print";
// import PrintComponent from "../Common/PrintComponent";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    // height: "100%",
    flexWrap: "wrap",
    overflowY: "auto",
    maxHeight: "100vh",

    "& > *": {
      margin: theme.spacing(1),
      width: "100%",
      height: "100%",
    },
    paperSection: {
      backgroundColor: "black",
    },
  },
}));

export default function CommentsCatalog(props) {
  const classes = useStyles();
  //   console.log(props);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [selected_id, setID] = useState(null);
  const [answer, handleChange] = useState("");

  const handleClickOpen = (id) => {
    setOpen(true);
    setID(id);
  };

  // let componentRef = useRef(PrintComponent);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Paper className={classes.root} elevation={3}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">Ημερομηνία</TableCell>
            <TableCell align="left">Όνομα</TableCell>
            <TableCell align="right">Σχόλιο</TableCell>
            <TableCell align="right">Βαθμολογία</TableCell>
            <TableCell align="right">Απάντηση</TableCell>
            <TableCell align="right">Ενέργειες</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.comments.map((comment, index) => {
            return (
              <TableRow key={index}>
                <TableCell align="left">
                  {comment.created_at.slice(0, 10)}{" "}
                  {comment.created_at.slice(12, 19)}
                </TableCell>

                <TableCell align="left">{comment.user_name}</TableCell>
                <TableCell align="right">{comment.text} </TableCell>
                <TableCell align="right">
                  {comment.rate}
                  <StarIcon />
                </TableCell>
                {comment.answer === "" ? (
                  <TableCell>
                    <Button onClick={() => handleClickOpen(comment.id)}>
                      Απάντηση
                    </Button>{" "}
                  </TableCell>
                ) : (
                  <TableCell>{comment.answer}</TableCell>
                )}
                {comment.answered === false ? (
                  <TableCell align="right">
                    <Button
                      color="primary"
                      onClick={() => dispatch(approve_comment(comment.id))}
                      startIcon={<CheckIcon />}
                    />
                    <Button
                      color="secondary"
                      onClick={() => dispatch(reject_comment(comment.id))}
                      startIcon={<CancelIcon />}
                    />
                  </TableCell>
                ) : (
                  <TableCell>
                    {comment.approved ? (
                      <span>Approved</span>
                    ) : (
                      <span>Rejected</span>
                    )}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {/* ########## DIALOG ############### */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Απάντηση στο Σχόλιο</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Εισάγετε την απάντηση για το σχόλιο αυτό.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Απάντηση"
            type="text"
            fullWidth
            onChange={(e) => handleChange(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Ακύρωση
          </Button>
          <Button
            onClick={() => {
              dispatch(answer_comment(selected_id, { text: answer }));
              setOpen(false);
            }}
            color="primary"
          >
            Επιβεβαίωση
          </Button>
        </DialogActions>
      </Dialog>
      {/* <ReactToPrint
        trigger={() => <button>print it</button>}
        content={() => componentRef}
      />
      <PrintComponent ref={(el) => (componentRef = el)} /> */}
    </Paper>
  );
}
