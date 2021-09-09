import { useDispatch, useSelector } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import { clearSnackbar } from "../../../actions/snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function ErrorSnackbar() {
  const dispatch = useDispatch();
  //   const classes = useStyles();
  const { errorSnackbarMessage, errorSnackbarOpen } = useSelector(
    (state) => state.uiReducer
  );

  function handleClose() {
    dispatch(clearSnackbar());
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={errorSnackbarOpen}
      autoHideDuration={4000}
      onClose={handleClose}
      //   aria-describedby="client-snackbar"
      //   message={
      //     <span id="client-snackbar">
      //       <Icon>check_circle</Icon>
      //       {successSnackbarMessage}
      //     </span>
      //   }
      //   action={[
      //     <IconButton
      //       key="close"
      //       aria-label="close"
      //       color="inherit"
      //       onClick={handleClose}
      //     >
      //       <Icon>close</Icon>
      //     </IconButton>,
      //   ]}
    >
      <Alert onClose={handleClose} severity="error">
        {errorSnackbarMessage}
      </Alert>
    </Snackbar>
  );
}
