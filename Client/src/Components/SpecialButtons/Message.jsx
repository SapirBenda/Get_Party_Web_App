import * as React from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import { useState } from "react";
import { Typography } from "@mui/material";

export default function Message({ message, onClose, time = 3000 }) {
  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={true}
        onClose={onClose}
        message={<Typography variant="message">{message}</Typography>}
        /*Remains only 3 seconds */
        autoHideDuration={time}
        /* length of the snackbar */
        sx={{
          "& .MuiSnackbarContent-root": {
            minWidth: `${message.length + 5}px`,
          },
        }}
      />
    </>
  );
}
