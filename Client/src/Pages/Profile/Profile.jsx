import * as React from "react";
import Grid from "@mui/material/Grid";
import { Typography, Avatar } from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import Stack from "@mui/material/Stack";
import PhoneIcon from "@mui/icons-material/Phone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useNavigate } from "react-router-dom";
import { p, s } from "../../Components/General/Theme";
import EventIcon from "@mui/icons-material/Event";
import ImageCarousel from "../../Components/ImageDisplay/ImageCarousel";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { useState } from "react";
import { IconButton } from "@mui/material";
import UpdateUserDetailsPopUp from "../../Components/Register/UpdateUserDetailsPopUp";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { UserAuth } from "../../Components/General/ContextProvider";
import { useQuery } from "@tanstack/react-query";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import SignalCellularNoSimIcon from "@mui/icons-material/SignalCellularNoSim";
import {
  getFollowedProductions,
  getLikedEvents,
  getUserPreferences,
} from "../../Components/Fetches/StaticFetch";

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, getTokenId } = UserAuth();
  const [open, setOpen] = useState(false);

  /* Fetch user's token ID */
  const { data: token_id = null } = useQuery({
    queryKey: ["tokenId"],
    queryFn: getTokenId,
    enabled: Boolean(currentUser),
  });

  /* Fetch the user's followed production's details */
  const { data: followedProductionsList = [] } = useQuery({
    queryKey: ["followedProductionsList"],
    queryFn: () => getFollowedProductions(currentUser?.user_id, token_id),
    enabled: Boolean(token_id) && Boolean(currentUser),
    placeholderData: [],
  });

  /* Fetch the user's favorite events' details */
  const { data: likedEventsList = [] } = useQuery({
    queryKey: ["likedEventsList"],
    queryFn: () => getLikedEvents(currentUser?.user_id, token_id),
    enabled: Boolean(token_id) && Boolean(currentUser),
    placeholderData: [],
  });

  /* Fetch the user's preferences */
  const { data: userPreferences = [] } = useQuery({
    queryKey: ["userPreferences"],
    queryFn: () => getUserPreferences(currentUser?.user_id, token_id),
    enabled: Boolean(token_id) && Boolean(currentUser),
    placeholderData: [],
  });

  return (
    <>
      <Grid
        container
        mt="3rem"
        mx="3rem"
        direction="column"
        maxWidth="xl"
        sx={{ width: "100%", margin: "0 auto", padding: "20px" }}
        justifyContent="center"
      >
        <Stack
          direction="row"
          spacing={2}
          mt="2rem"
          justifyContent="center"
          alignItems="center"
        >
          <Avatar
            alt={currentUser?.full_name}
            src={currentUser?.photo[0]}
            sx={{
              border: "0.2px solid lightgray",
              width: "5rem",
              height: "5rem",
            }}
          />
          <Typography variant="eventHeader">
            {currentUser?.full_name}
          </Typography>
        </Stack>

        {/* user deatails */}
        <Stack
          direction="row"
          spacing="1rem"
          mt={2}
          mx={1}
          alignItems="center"
          justifyContent="center"
        >
          <MailOutlineIcon sx={{ color: "red" }} />
          <Typography variant="eventBody">{currentUser?.email} </Typography>
          <Typography> | </Typography>

          <PhoneIcon sx={{ color: "green" }} />
          <Typography variant="eventBody">
            {currentUser?.phone_number}
          </Typography>
          <Typography> | </Typography>

          {!currentUser?.is_producer && (
            <>
              <EventIcon sx={{ color: s }} />
              <Typography variant="eventBody">
                {new Date(currentUser?.birth_date)
                  .toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                  .split("/")
                  .join(".")}
              </Typography>
              <Typography> | </Typography>
            </>
          )}
          <IconButton aria-label="edit" onClick={() => setOpen(true)}>
            <ModeEditIcon sx={{ color: s }} />
          </IconButton>
          <UpdateUserDetailsPopUp open={open} onClose={() => setOpen(false)} />
        </Stack>
        {/* user preferences */}
        <Stack direction="row" mt={2} justifyContent="center" spacing={5}>
          <Stack
            direction="row"
            spacing="0.6rem"
            maxWidth="40%"
            sx={{
              flexWrap: "wrap", // Allow content to wrap to new lines
            }}
          >
            <LoyaltyIcon sx={{ color: p }} />
            {userPreferences?.favorite_locations?.map((location, index) => (
              <Typography key={index} variant="eventBody">
                {location} {index === userPreferences?.favorite_locations.length - 1 ? "" : "|"}
              </Typography>
            ))}
            {userPreferences?.favorite_locations?.length === 0 && (
              <Typography variant="eventBody">No preferred places</Typography>
            )}
          </Stack>
          <Stack
            direction="row"
            spacing="0.3rem"
            maxWidth="40%"
            sx={{
              flexWrap: "wrap", // Allow content to wrap to new lines
            }}
          >
            <MusicNoteIcon sx={{ color: p }} />
            {userPreferences?.favorite_music_types?.map((music, index) => (
              <Typography variant="eventBody" key={index}>
                {music} {index === userPreferences?.favorite_music_types.length - 1 ? "" : "|"}
              </Typography>
            ))}
            {userPreferences?.favorite_music_types?.length === 0 && (
              <Typography variant="eventBody">
                No preferred music genres
              </Typography>
            )}
          </Stack>
        </Stack>
        <Stack
          direction="row"
          spacing="1rem"
          mt="3rem"
          justifyContent="center"
          alignItems="center"
        >
          <FavoriteOutlinedIcon fontSize="large" color="error" />
          <Typography variant="subTitle1">Favorite Events</Typography>
        </Stack>
        {likedEventsList.length === 0 ? (
          <Stack
            direction="row"
            spacing="1rem"
            my="3rem"
            justifyContent="center"
            alignItems="center"
          >
            <HeartBrokenIcon sx={{ color: p }} />
            <Typography variant="emptyMessage">
              You don't have favorite events yet
            </Typography>
            <HeartBrokenIcon sx={{ color: p }} />
          </Stack>
        ) : (
          <ImageCarousel
            elements={likedEventsList}
            number_of_photos={1}
            width="50%"
          />
        )}

        <Stack
          direction="row"
          spacing="1rem"
          mt="2rem"
          justifyContent="center"
          alignItems="center"
          mb={1}
        >
          <HowToRegIcon fontSize="large" sx={{ color: s }} />
          <Typography variant="subTitle1">Followed Productions</Typography>
        </Stack>
        {followedProductionsList.length === 0 ? (
          <Stack
            direction="row"
            spacing="1rem"
            my="3rem"
            justifyContent="center"
            alignItems="center"
          >
            <SignalCellularNoSimIcon sx={{ color: p }} />
            <Typography variant="emptyMessage">
              You don't follow productions yet
            </Typography>
            <SignalCellularNoSimIcon sx={{ color: p }} />
          </Stack>
        ) : (
          <Stack
            direction="row"
            justifyContent="space-evenly"
            spacing="1.5rem"
            mt="1rem"
          >
            {followedProductionsList?.map((production) => (
              <Stack key={production?.user_id} alignItems="center">
                <IconButton
                  onClick={() => {
                    navigate(`/ProductionProfile/${production?.user_id}`);
                  }}
                >
                  <Avatar
                    src={production?.photo[0]}
                    sx={{
                      border: `2px solid ${p}`,
                      width: "6rem",
                      height: "6rem",
                      margin: "0 auto",
                      marginBottom: 1,
                    }}
                  />
                </IconButton>
                <Typography variant="eventBody" color={p}>
                  {production?.full_name}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}
      </Grid>
    </>
  );
}
