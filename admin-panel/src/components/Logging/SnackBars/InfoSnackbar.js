import { useDispatch, useSelector } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import { clearSnackbar } from "../../../actions/snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

// const useStyles = makeStyles((theme) => ({
//   root: {
//     width: "100%",
//     "& > * + *": {
//       marginTop: theme.spacing(2),
//     },
//   },
// }));

export default function InfoSnackbar() {
  const dispatch = useDispatch();
  //   const classes = useStyles();
  const { infoSnackbarMessage, infoSnackbarOpen } = useSelector(
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
      open={infoSnackbarOpen}
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
      <Alert onClose={handleClose} severity="info">
        {infoSnackbarMessage}
      </Alert>
    </Snackbar>
  );
}
