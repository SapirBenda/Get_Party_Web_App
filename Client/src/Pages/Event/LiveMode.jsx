import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Rating,
  Stack,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { bg, bgp, s, p } from "../../Components/General/Theme";
import { useState } from "react";
import Comments from "../../Components/LiveMode/Comments";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import SendIcon from "@mui/icons-material/Send";
import NewComment from "../../Components/LiveMode/NewComment";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import googleLogo from "./Google_Maps_Logo.png";
import moment from "moment";
import SignInUpPopup from "../../Components/Register/SignInUpPopup";
import CountDown from "../../Components/SpecialButtons/CountDown";
import {
  getAllComments,
  getEventTime,
  getLiveImages,
  getVotes,
} from "../../Components/Fetches/StaticFetch";
import { useQuery } from "@tanstack/react-query";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import Skeleton from "@mui/material/Skeleton";
import SERVER_PATH from "../../Components/General/config";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const boxStyle = {
  border: `solid 2px ${s}`,
  borderRadius: "1rem",
  boxShadow: `5px 2.5px 2.5px ${bgp}`,
  width: "10%",
  justifyContent: "center",
  alignItems: "center",
  mx: "1rem",
  padding: "0.6rem",
  gap: "0.5rem",
};

export default function LiveMode({
  currentUser,
  eventDetails,
  event_id,
  productionDetails,
}) {
  const [open, setOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const { data: comments = [] } = useQuery({
    queryKey: ["comments"],
    queryFn: () => getAllComments(event_id),
    refetchInterval: 3000,
    enabled: !moment().isBefore(
      moment(eventDetails?.start_time, "dddd, DD/MM - HH:mm").subtract(
        2,
        "hours"
      )
    ),
  });

  const { data: liveImages = [] } = useQuery({
    queryKey: ["liveImages"],
    queryFn: () => getLiveImages(event_id),
    refetchInterval: 3000,
    enabled: !moment().isBefore(
      moment(eventDetails?.start_time, "dddd, DD/MM - HH:mm").subtract(
        2,
        "hours"
      )
    ),
  });

  const { data: eventTime = [] } = useQuery({
    queryKey: ["eventTime"],
    queryFn: () => getEventTime(event_id),
  });

  const {
    data: calculatedVotes = {
      general_opinion: "",
      crowding: "",
      average_ages: "",
      waiting_time: "",
    },
  } = useQuery({
    queryKey: ["calculatedVotes"],
    queryFn: () => getVotes(event_id),
    refetchInterval: 3000,
    enabled: !moment().isBefore(
      moment(eventDetails?.start_time, "dddd, DD/MM - HH:mm").subtract(
        2,
        "hours"
      )
    ),
  });

  /* need to modify those */
  const [onStage, setOnStage] = useState(
    eventDetails?.on_stage ? eventDetails?.on_stage : "Unknown"
  );
  const [editOnStage, setEditOnStage] = useState(false);
  const [openSignPopUp, setOpenSignPopUp] = useState(
    currentUser ? false : true
  );

  const handleCloseOnStage = () => {
    setEditOnStage(false);
  };

  const mapCrowdedness = (rate) => {
    let round = Math.round(rate);
    const crowdedness = ["Crowded", "Just Right", "Spacious", "Empty"];
    if (round) {
      return crowdedness[round - 1];
    }
  };

  const mapAvgAges = (avg) => {
    if (18 <= avg && avg <= 21) {
      return "18-21";
    }
    if (21 <= avg && avg <= 25) {
      return "21-25";
    }
    if (25 <= avg && avg <= 30) {
      return "25-30";
    }
    return "30+";
  };

  const openGoogleMaps = () => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      eventDetails?.address
    )}`;
    window.open(mapUrl, "_blank");
  };

  const submitOnStage = async (newValue) => {
    setOnStage(newValue);
    setEditOnStage(false);
    eventDetails.on_stage = newValue;
    fetch(
      `${SERVER_PATH}/updateOnStage?event_id=${eventDetails?.event_id}&on_stage=${newValue}`,
      {
        method: "POST",
        headers: { "content-Type": "application/json" },
      }
    ).catch((error) => {
      console.log("There was error in updating onStage value", error);
    });
  };

  return (
    <>
      {!currentUser ? (
        <Stack mt="3rem">
          <SignInUpPopup
            open={openSignPopUp}
            onClose={() => {
              setOpenSignPopUp(false);
            }}
            defaultTab={0}
          />
          <Typography variant="eventHeader">
            Please Log In To Join Us
          </Typography>
        </Stack>
      ) : moment().isBefore(
          moment(eventDetails?.start_time, "dddd, DD/MM - HH:mm").subtract(
            2,
            "hours"
          )
        ) ? (
        <Stack>{eventTime && <CountDown eventTime={eventTime} />}</Stack>
      ) : (
        <Grid container component="main" mt="0.3rem" direction="column">
          <Typography variant="eventHeader2">
            {eventDetails?.event_name}
            {moment().isAfter(
              moment(eventDetails?.end_time, "dddd, DD/MM - HH:mm")
            ) && <Typography color="red">The event has ended</Typography>}
          </Typography>

          <Stack
            direction="row"
            spacing="1rem"
            alignItems="center"
            justifyContent="center"
          >
            <Avatar
              alt={productionDetails?.full_name}
              src={productionDetails?.photo[0]}
              sx={{
                border: "0.2px solid lightgray",
                width: "2rem",
                height: "2rem",
              }}
            />
            <Typography variant="eventBody3">
              {productionDetails?.full_name}
            </Typography>

            <AccessTimeIcon fontSize="medium" sx={{ color: "#3498db" }} />
            <Typography variant="eventBody3">
              {dayjs(eventDetails?.start_time, "dddd, DD/MM - HH:mm").format(
                "HH:mm"
              )}{" "}
              -{" "}
              {dayjs(eventDetails?.end_time, "dddd, DD/MM - HH:mm").format(
                "HH:mm"
              )}
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              onClick={openGoogleMaps}
              sx={{ cursor: "pointer" }}
            >
              <img src={googleLogo} width="30rem" />
              <Typography variant="eventBody3">Show On Map</Typography>
            </Stack>
            {calculatedVotes?.general_opinion && (
              <>
                <Rating
                  name="read-only"
                  precision={0.1}
                  value={calculatedVotes?.general_opinion}
                  readOnly
                  sx={{
                    "& .MuiRating-iconEmpty": {
                      color: "gray",
                    },
                  }}
                />
                <Typography variant="eventBody3">
                  {calculatedVotes?.general_opinion}
                </Typography>
              </>
            )}
          </Stack>

          <Grid container direction="row" justifyContent="center" my="0.5rem">
            <Stack sx={boxStyle} alignItems="end">
              <Typography variant="subTitle2">{"Crowdedness"}</Typography>
              <Divider sx={{ backgroundColor: s, width: "100%" }} />
              <Typography variant="eventBody3">
                {calculatedVotes?.crowding ? (
                  mapCrowdedness(calculatedVotes?.crowding)
                ) : (
                  <>Unknown</>
                )}
              </Typography>
            </Stack>

            <Stack sx={boxStyle} alignItems="end">
              <Typography variant="subTitle2">{"Average Age"}</Typography>
              <Divider sx={{ backgroundColor: s, width: "100%" }} />
              <Typography variant="eventBody3">
                {calculatedVotes?.avg_ages ? (
                  mapAvgAges(calculatedVotes?.avg_ages)
                ) : (
                  <>Unknown</>
                )}
              </Typography>
            </Stack>

            <Stack sx={boxStyle} alignItems="end">
              <Typography variant="subTitle2">{"Waiting Time"}</Typography>
              <Divider sx={{ backgroundColor: s, width: "100%" }} />
              <Typography variant="eventBody3">
                {calculatedVotes?.waiting_time ? (
                  <>~{calculatedVotes?.waiting_time} mins</>
                ) : (
                  <>Unknown</>
                )}
              </Typography>
            </Stack>

            <Stack sx={boxStyle}>
              <Stack direction="row" alignItems="end">
                <Typography variant="subTitle2">{"On Stage"}</Typography>
                {currentUser &&
                  currentUser?.user_id === eventDetails?.user_id && (
                    <IconButton
                      color="primary"
                      sx={{
                        bgcolor: "transparent",
                        "&:hover": { backgroundColor: "transparent" },
                        color: s,
                      }}
                      onClick={() => setEditOnStage(true)}
                    >
                      <ModeEditIcon fontSize="small" />
                    </IconButton>
                  )}
              </Stack>
              <Divider sx={{ backgroundColor: s, width: "100%" }} />
              <Typography variant="eventBody3">{onStage}</Typography>
              {
                <Dialog
                  PaperProps={{ sx: { backgroundColor: bg } }}
                  open={editOnStage}
                  onClose={handleCloseOnStage}
                >
                  <DialogTitle variant="eventBody3">
                    Who is preforming now?
                  </DialogTitle>
                  <DialogContent>
                    <TextField
                      autoFocus
                      id="onStage"
                      fullWidth
                      variant="standard"
                      value={onStage}
                      onChange={(e) => {
                        if (e.target.value.length === 0) {
                          setOnStage("UNKNOW");
                        } else {
                          setOnStage(e.target.value);
                        }
                      }}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button
                      variant="textKind"
                      sx={{ color: s }}
                      onClick={handleCloseOnStage}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        submitOnStage(onStage);
                      }}
                    >
                      Post
                    </Button>
                  </DialogActions>
                </Dialog>
              }
            </Stack>
          </Grid>

          {/* Comments and galery  */}
          <Grid
            container
            direction="row"
            justifyContent="center"
            mt="0.5rem"
            spacing={2}
            style={{ height: "600px" }}
          >
            <Grid
              container
              justifyContent="center"
              alignItems="flex-start"
              xs={5.5}
            >
              {comments && comments.length !== 0 ? (
                <Comments comments={comments} />
              ) : (
                <Stack
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  mt="1rem"
                >
                  {moment().isAfter(
                    moment(eventDetails?.end_time, "dddd, DD/MM - HH:mm")
                  ) ? (
                    <Typography variant="cardFontTitle2">
                      No comments
                    </Typography>
                  ) : (
                    <Typography variant="cardFontTitle2">
                      Be The First To Comment !
                    </Typography>
                  )}
                </Stack>
              )}
              {!moment().isAfter(
                moment(eventDetails?.end_time, "dddd, DD/MM -HH:mm")
              ) ? (
                <TextField
                  name={"add comment"}
                  placeholder="Write a comment"
                  fullWidth
                  onClick={() => {
                    if (
                      !moment().isAfter(
                        moment(eventDetails?.end_time, "dddd, DD/MM - HH:mm")
                      )
                    ) {
                      setOpen(true);
                    }
                  }}
                  sx={{
                    ml: "4.5rem",
                    width: "88%",
                    mt: "1rem",
                    backgroundColor: bg,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton>
                          <SendIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              ) : (
                <Typography></Typography>
              )}
              <NewComment
                open={open}
                onClose={() => setOpen(false)}
                currentUser={currentUser}
                event_id={event_id}
              />
            </Grid>

            <Grid
              container
              xs={5.5}
              alignItems="flex-start"
              justifyContent="center"
              // maxWidth={"10rem"}
            >
              {(comments && comments?.length === 0) ||
              !liveImages ||
              liveImages?.length === 0 ? (
                <Stack
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  spacing={3}
                  maxWidth="10rem"
                >
                  <Stack direction="row" spacing={2}>
                    <Skeleton
                      variant="rectangular"
                      animation={false}
                      width={"10rem"}
                      height={"11rem"}
                    />
                    <Skeleton
                      variant="rectangular"
                      animation={false}
                      width={"10rem"}
                      height={"11rem"}
                    />
                    <Skeleton
                      variant="rectangular"
                      animation={false}
                      width={"10rem"}
                      height={"11rem"}
                    />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Skeleton
                      variant="rectangular"
                      animation={false}
                      width={"10rem"}
                      height={"11rem"}
                    />
                    <Skeleton
                      variant="rectangular"
                      animation={false}
                      width={"10rem"}
                      height={"11rem"}
                    />
                    <Skeleton
                      variant="rectangular"
                      animation={false}
                      width={"10rem"}
                      height={"11rem"}
                    />
                  </Stack>
                </Stack>
              ) : (
                liveImages && (
                  <ImageList
                    cols={3}
                    sx={{
                      overflow: "auto",
                      height: "32rem",
                    }}
                  >
                    {liveImages.map((item) => (
                      <>
                        {item.photo.length !== 0 && (
                          <ImageListItem>
                            <img
                              src={item.photo}
                              loading="lazy"
                              onClick={() => window.open(item.photo, "_blank")}
                              style={{ height: "auto", cursor: "pointer" }}
                            />
                          </ImageListItem>
                        )}
                      </>
                    ))}
                  </ImageList>
                )
              )}
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
}
