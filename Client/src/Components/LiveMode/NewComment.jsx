import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { useState } from "react";
import { Stack, Typography } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { bg } from "../General/Theme";
import UploadImages from "../ImageDisplay/UploadImages";
import { UserAuth } from "../General/ContextProvider";
import { useQueryClient } from "@tanstack/react-query";
import SERVER_PATH from "../General/config";
import Message from "../SpecialButtons/Message";

export default function NewComment({
  onClose,
  open = true,
  currentUser,
  event_id,
}) {
  const { getTokenId } = UserAuth();
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [content, setContent] = useState("");
  const [votes, setVotes] = useState({
    general_opinion: "",
    crowding: "",
    average_ages: "",
    waiting_time: "",
  });
  const queryClient = useQueryClient();
  const [openMessage, setOpenMessage] = useState(false);
  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  const handleClose = () => {
    setSelectedFiles([]);
    onClose();
  };
  const restartSelection = () => {
    setContent("");
    setVotes((prevState) => ({
      general_opinion: "",
      crowding: "",
      average_ages: "",
      waiting_time: "",
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (
      votes.general_opinion.length === 0 ||
      votes.crowding.length === 0 ||
      votes.average_ages.length === 0 ||
      votes.waiting_time.length === 0
    ) {
      setLoading(false);
      setOpenMessage(true);
    } else {
      const data = new FormData();
      data.append("event_id", event_id);
      data.append("user_id", currentUser?.user_id);
      data.append("full_name", currentUser?.full_name);
      data.append("avatar", currentUser?.photo);
      data.append("post_time", new Date());
      data.append("votes", JSON.stringify(votes));
      data.append("content", content);
      selectedFiles.forEach((file) => {
        data.append("images", file);
      });

      // for (const [key, value] of data.entries()) {
      //   console.log(`${key}: ${value}`);
      // }
      restartSelection();
      const token_id = await getTokenId().catch((error) =>
        console.log("Error getting tokenId")
      );
      fetch(
        `${SERVER_PATH}/uploadComment?user_id=${currentUser.user_id}&token_id=${token_id}`,
        {
          method: "POST",
          body: data,
        }
      )
        .then(() => {
          if (selectedFiles) queryClient.invalidateQueries(["liveImages"]);
          queryClient.invalidateQueries(["comments"]);
          queryClient.invalidateQueries(["calculatedVotes"]);
        })
        .then(() => {
          handleClose();
          setLoading(false);
        })
        .catch((error) =>
          console.log("There was error in updating the event", error)
        );
    }
  };

  return (
    <Stack
      direction="column"
      alignItems="center"
      justifycontent="center"
      spacing="3rem"
      my="1rem"
      sx={{ bgcolor: bg }}
      component="form"
      encType="multipart/form-data"
      onSubmit={submitHandler}
    >
      {openMessage && (
        <Message
          message="Plese select all attributes"
          onClose={handleCloseMessage}
          time={4500}
        />
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        PaperProps={{ sx: { backgroundColor: bg } }}
      >
        <Typography mt="1rem" textAlign="center">
          New Comment
        </Typography>

        <DialogContent>
          <Stack
            direction="column"
            justifycontent="flex-start"
            my="0.5rem"
            spacing="0.5rem"
          >
            <Typography>How is the party so far?</Typography>
            <ToggleButtonGroup
              color="primary"
              value={votes.general_opinion}
              exclusive
              onChange={(e, newVal) =>
                setVotes((prevState) => ({
                  ...prevState,
                  general_opinion: newVal,
                }))
              }
              aria-label="Platform"
              fullWidth
            >
              <ToggleButton value="1">Terrible</ToggleButton>
              <ToggleButton value="2">Poor</ToggleButton>
              <ToggleButton value="3">Average</ToggleButton>
              <ToggleButton value="4">Good</ToggleButton>
              <ToggleButton value="5">Wow</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          <Stack
            direction="column"
            justifycontent="flex-start"
            my="1rem"
            spacing="0.5rem"
          >
            <Typography>How crowded is the party?</Typography>
            <ToggleButtonGroup
              color="primary"
              value={votes.crowding}
              exclusive
              onChange={(e, newVal) =>
                setVotes((prevState) => ({
                  ...prevState,
                  crowding: newVal,
                }))
              }
              aria-label="Platform"
              fullWidth
            >
              <ToggleButton value="1">Crowded</ToggleButton>
              <ToggleButton value="4">Just Right</ToggleButton>
              <ToggleButton value="3">Spacious</ToggleButton>
              <ToggleButton value="2">Empty</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          <Stack
            direction="column"
            justifycontent="flex-start"
            my="1rem"
            spacing="0.5rem"
          >
            <Typography>What is the average age, in your opinion?</Typography>
            <ToggleButtonGroup
              color="primary"
              value={votes.average_ages}
              exclusive
              onChange={(e, newVal) =>
                setVotes((prevState) => ({
                  ...prevState,
                  average_ages: newVal,
                }))
              }
              aria-label="Platform"
              fullWidth
            >
              <ToggleButton value="1">18-21</ToggleButton>
              <ToggleButton value="2">21-25</ToggleButton>
              <ToggleButton value="3">25-30</ToggleButton>
              <ToggleButton value="4">30+</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          <Stack
            direction="column"
            justifycontent="flex-start"
            my="1rem"
            spacing="0.5rem"
          >
            <Typography>How long did you wait at the entrance?</Typography>
            <ToggleButtonGroup
              color="primary"
              value={votes.waiting_time}
              exclusive
              onChange={(e, newVal) =>
                setVotes((prevState) => ({
                  ...prevState,
                  waiting_time: newVal,
                }))
              }
              aria-label="Platform"
              fullWidth
            >
              <ToggleButton value="4">0-10 mins</ToggleButton>
              <ToggleButton value="3">10-30 mins</ToggleButton>
              <ToggleButton value="2">30-60 mins</ToggleButton>
              <ToggleButton value="1">60+ mins</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          <Stack
            direction="column"
            justifycontent="flex-start"
            my="1rem"
            spacing="0.5rem"
          >
            <Typography>Share your thoughts:</Typography>
            <TextField
              fullWidth
              name={"content"}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Stack>
          <Stack
            direction="row"
            justifyContent="center"
            style={{ backgroundColor: "transparent" }}
          >
            <UploadImages
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              label={"Share Party's Images"}
              limit={true}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="cancleButton" onClick={handleClose}>
            Cancel
          </Button>
          <Stack direction="row" justifyContent="center">
            {
              <Button
                type="submit"
                variant="submitButton"
                onClick={submitHandler}
              >
                {loading ? <>Loading...</> : <>post</>}
              </Button>
            }
          </Stack>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
