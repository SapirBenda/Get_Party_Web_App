import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Chip, IconButton, Stack } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import NotListedLocationIcon from "@mui/icons-material/NotListedLocation";
import SellIcon from "@mui/icons-material/Sell";
import SwipeableTextMobileStepper from "../../Components/ImageDisplay/SwipeableTextMobileStepper";
import { useNavigate } from "react-router-dom";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import { bg, p, s } from "../../Components/General/Theme";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";
import DeleteDialog from "../../Components/SpecialButtons/DeleteDialog";
import moment from "moment";
import SignInUpPopup from "../../Components/Register/SignInUpPopup";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getIsFollowed,
  getIsLiked,
  postFollow,
  postLike,
} from "../../Components/Fetches/StaticFetch";
import { UserAuth } from "../../Components/General/ContextProvider";
import ShareMenu from "../../Components/SpecialButtons/ShareMenu";

export default function EventDetails({
  currentUser,
  eventDetails,
  event_id,
  productionDetails,
}) {
  const { getTokenId } = UserAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  /* Fetch user's token ID */
  const { data: token_id = null } = useQuery({
    queryKey: ["tokenId"],
    queryFn: async () => await getTokenId(),
    enabled: Boolean(currentUser),
  });

  /* Fetch if the user followed the event's production */
  const { data: isFollowed = null, refetch: isFollowedRefetch } = useQuery({
    queryKey: ["isFollowed", eventDetails?.user_id, currentUser?.user_id],
    queryFn: () =>
      getIsFollowed(currentUser?.user_id, eventDetails?.user_id, token_id),
    enabled: Boolean(token_id) && Boolean(currentUser),
    placeholderData: null,
  });

  /* Fetch if the user followed the event's production */
  const { data: isLiked = null, refetch: isLikedRefetch } = useQuery({
    queryKey: ["isLiked", eventDetails?.user_id, currentUser?.user_id],
    queryFn: () => getIsLiked(currentUser?.user_id, event_id, token_id),
    enabled: Boolean(token_id) && Boolean(currentUser),
    placeholderData: null,
  });

  /* Handle the follow action */
  const followAction = useMutation({
    mutationFn: postFollow,
    onSuccess: isFollowedRefetch(),
    enabled: Boolean(token_id) && Boolean(currentUser),
  });

  /* Handle the like action */
  const likeAction = useMutation({
    mutationFn: postLike,
    onSuccess: isLikedRefetch(),
    enabled: Boolean(token_id) && Boolean(currentUser),
  });

  const openGoogleMaps = () => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      eventDetails?.address
    )}`;
    window.open(mapUrl, "_blank");
  };

  return (
    <Grid
      component="main"
      container
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing="2rem"
      width="100%"
    >
      <Grid
        xs={6}
        component={Paper}
        elevation={24}
        style={{ color: p, backgroundColor: bg }}
        mt="1rem"
      >
        <Stack justifyContent="center">
          <Typography variant="eventHeader">
            {eventDetails?.event_name}
          </Typography>
          <Typography variant="subTitle1" textAlign="center">
            {eventDetails?.short_description}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          justifyContent="left"
          alignItems="center"
          mt="1rem"
          mx="1rem"
        >
          <Chip
            onClick={() =>
              navigate(`/ProductionProfile/${eventDetails?.user_id}`)
            }
            avatar={<Avatar src={productionDetails?.photo[0]} />}
            label={eventDetails?.production_name}
            sx={{ fontSize: "1.25rem", gap: "0.8rem" }}
            clickable
          />
          <IconButton
            variant="text"
            size="medium"
            color="primary"
            onClick={() => {
              followAction.mutate({
                user_id: currentUser?.user_id,
                production_id: eventDetails?.user_id,
                token_id,
                setOpen,
              });
            }}
            sx={{
              bgcolor: "transparent",
              "&:hover": { backgroundColor: "transparent" },
            }}
          >
            {!currentUser ? (
              <PersonAddAlt1Icon
                onClick={() => setOpen(true)}
                sx={{ color: "white" }}
              />
            ) : isFollowed?.result === 1 ? (
              <HowToRegIcon />
            ) : (
              <PersonAddAlt1Icon />
            )}
          </IconButton>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing="1rem"
          mt="1rem"
          mx="1.5rem"
          onClick={openGoogleMaps}
          sx={{ cursor: "pointer" }}
        >
          <PlaceIcon />
          <Typography variant="eventBody2">{eventDetails?.address}</Typography>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing="1rem"
          mt="1rem"
          mx="1.5rem"
        >
          <CalendarMonthIcon />
          <Typography variant="eventBody2">
            {eventDetails?.start_time} - {eventDetails?.end_time}{" "}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" mt="0.5rem" mx="1.5rem">
          <Typography variant="eventBody2">
            {eventDetails?.long_description}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          spacing="1rem"
          mt="1rem"
          mx="1.5rem"
        >
          <PersonIcon />
          <Typography variant="eventBody2">
            {eventDetails?.min_age} +
          </Typography>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          spacing="1rem"
          mt="1rem"
          mx="1.5rem"
        >
          <SellIcon />
          <Typography variant="eventBody2">
            {eventDetails?.min_price} - {eventDetails?.max_price}
            {" ₪"}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing="1rem"
          mt="1rem"
          mx="1.5rem"
        >
          <MusicNoteIcon />
          {eventDetails?.music_type?.map((name, index) => (
            <Typography key={index} variant="eventBody2">
              {name}
            </Typography>
          ))}
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing="1rem"
          mt="1rem"
          mx="1.5rem"
        >
          <NotListedLocationIcon />
          {eventDetails?.place_type?.map((name, index) => (
            <Typography key={index} variant="eventBody2">
              {name}
            </Typography>
          ))}
        </Stack>

        <Grid
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          sx={{ columnGap: 1 }}
        >
          <ShareMenu />
          <IconButton
            variant="text"
            size="medium"
            color="primary"
            onClick={() =>
              likeAction.mutate({
                user_id: currentUser?.user_id,
                event_id,
                token_id,
                setOpen,
              })
            }
            sx={{
              bgcolor: "transparent",
              "&:hover": { backgroundColor: "transparent" },
            }}
          >
            {!currentUser ? (
              <FavoriteBorderOutlinedIcon
                onClick={() => setOpen(true)}
                color="error"
              />
            ) : isLiked?.result === 1 ? (
              <FavoriteOutlinedIcon color="error" />
            ) : (
              <FavoriteBorderOutlinedIcon color="error" />
            )}
          </IconButton>
          <SignInUpPopup
            open={open}
            onClose={() => {
              setOpen(false);
              navigate(`/Event/${eventDetails?.event_id}`);
            }}
            defaultTab={0}
          />
          {currentUser &&
            currentUser?.user_id === eventDetails?.user_id &&
            moment(eventDetails?.end_time, "dddd, DD/MM - HH:mm").isAfter(
              moment()
            ) && (
              <>
                <IconButton
                  color="primary"
                  onClick={() =>
                    navigate(`/UpdateEvent/${eventDetails?.event_id}`)
                  }
                  sx={{
                    bgcolor: "transparent",
                    "&:hover": { backgroundColor: "transparent" },
                    color: s,
                  }}
                >
                  <ModeEditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  color="primary"
                  sx={{
                    mr: "0.5rem",
                    bgcolor: "transparent",
                    "&:hover": { backgroundColor: "transparent" },
                    color: s,
                  }}
                >
                  <DeleteDialog event_id={event_id} />
                </IconButton>
              </>
            )}
        </Grid>
      </Grid>
      {eventDetails?.photos !== undefined && (
        <Grid item xs={5}>
          <SwipeableTextMobileStepper elements={eventDetails?.photos} />
        </Grid>
      )}
    </Grid>
  );
}
