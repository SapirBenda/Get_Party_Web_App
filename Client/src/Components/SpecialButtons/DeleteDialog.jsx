import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import { bg, s } from "../../Components/General/Theme";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../General/ContextProvider";
import Message from "./Message";
import SERVER_PATH from "../General/config";

export default function DeleteDialog({ event_id }) {
  const { currentUser, getTokenId } = UserAuth();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const [openMessage, setOpenMessage] = useState(false);
  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    setOpen(false);
    deleteEvent();
    setOpenMessage(true);
  };

  async function deleteEvent() {
    const token_id = await getTokenId();
    const deletion = async () => {
      try {
        const result = await fetch(
          `${SERVER_PATH}/deleteEvent?event_id=${event_id}&user_id=${currentUser.user_id}&token_id=${token_id}`,
          {
            method: "POST",
            headers: { "content-Type": "application/json" },
          }
        ).then(navigate("/"));
      } catch (error) {
        console.log("There was error in deleting the event front", error);
      }
    };
    deletion();
  }

  return (
    <div>
      {openMessage && (
        <Message
          message="The event was successfully deleted !"
          onClose={handleCloseMessage}
        />
      )}
      <IconButton
        onClick={handleClickOpen}
        sx={{
          bgcolor: "transparent",
          "&:hover": { backgroundColor: "transparent" },
          color: s,
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        bgcolor={bg}
      >
        <DialogTitle>{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the event ?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            variant="textKind"
            autoFocus
            onClick={handleClose}
            sx={{ mr: 5 }}
          >
            cancel
          </Button>
          <Button variant="deleteButton" onClick={handleDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
