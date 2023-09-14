import * as React from "react";
import Grid from "@mui/material/Grid";
import { Typography, Avatar, Rating, Button } from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import Stack from "@mui/material/Stack";
import { useParams } from "react-router-dom";
import { p, s } from "../../Components/General/Theme";
import ImageCarousel from "../../Components/ImageDisplay/ImageCarousel";
import PhoneIcon from "@mui/icons-material/Phone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HistoryIcon from "@mui/icons-material/History";
import PeopleIcon from "@mui/icons-material/People";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import { useState } from "react";
import { UserAuth } from "../../Components/General/ContextProvider";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import {
  getFutureEventOfProduction,
  getIsFollowed,
  getIsRanked,
  getNumberOfFollowers,
  getPastEvents,
  getProductionDetails,
  getRank,
  postFollow,
  postRank,
} from "../../Components/Fetches/StaticFetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function ProductionProfile() {
  const queryClient = useQueryClient();
  const { currentUser, getTokenId } = UserAuth();
  const { production_id } = useParams();
  const [open, setOpen] = useState(false);

  /* Fetch user's token ID */
  const { data: token_id = null } = useQuery({
    queryKey: ["tokenId"],
    queryFn: async () => await getTokenId(),
    enabled: Boolean(currentUser),
  });

  /* Fetch the production's details */
  const { data: productionDetails = null } = useQuery({
    queryKey: ["productionDetails"],
    queryFn: () => getProductionDetails(production_id),
  });

  /* Fetch the production's past events */
  const { data: pastEventsOfProduction = [] } = useQuery({
    queryKey: ["pastEventsOfProduction"],
    queryFn: () => getPastEvents(production_id),
  });

  /* Fetch the production's future events */
  const { data: futureEventsOfProduction = [] } = useQuery({
    queryKey: ["futureEventsOfProduction"],
    queryFn: () => getFutureEventOfProduction(production_id),
  });

  /* Fetch number of followers of the production */
  const { data: numberOfFollowers = null } = useQuery({
    queryKey: ["numberOfFollowers"],
    queryFn: () => getNumberOfFollowers(production_id),
  });

  /* Fetch the production's rank */
  const { data: rank = null } = useQuery({
    queryKey: ["rank"],
    queryFn: () => getRank(production_id),
  });

  /* Fetch if the user followed the event's production */
  const { data: isFollowed = null } = useQuery({
    queryKey: ["isFollowed", token_id],
    queryFn: () => getIsFollowed(currentUser?.user_id, production_id, token_id),
    enabled: Boolean(token_id) && Boolean(currentUser),
  });

  /* Fetch if the user ranked the production */
  const { data: isRanked = null } = useQuery({
    queryKey: ["isRanked", token_id],
    queryFn: () => getIsRanked(currentUser?.user_id, production_id, token_id),
    enabled: Boolean(token_id) && Boolean(currentUser),
  });

  /* Handle the follow action */
  const followAction = useMutation({
    mutationFn: postFollow,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["isFollowed"]);
      await queryClient.invalidateQueries(["numberOfFollowers"]);
    },
  });

  /* Handle the rank action */
  const rankAction = useMutation({
    mutationFn: postRank,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["isRanked"] });
      await queryClient.invalidateQueries({ queryKey: ["rank"] });
    },
  });

  return (
    <Grid
      container
      mt="3rem"
      direction="column"
      sx={{ width: "90%", margin: "0 auto", padding: "20px" }}
    >
      <Stack
        direction="row"
        spacing="1rem"
        mt="2rem"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar
          alt={productionDetails?.full_name}
          src={productionDetails?.photo[0]}
          sx={{
            border: "0.2px solid lightgray",
            width: "4rem",
            height: "4rem",
          }}
        />
        <Typography variant="eventHeader">
          {productionDetails?.full_name}
        </Typography>
        <Button
          variant="text"
          size="medium"
          color="primary"
          onClick={() =>
            followAction.mutate({
              user_id: currentUser.user_id,
              production_id,
              token_id,
              setOpen,
            })
          }
          disabled={!currentUser}
          sx={{
            bgcolor: "transparent",
            "&:hover": { backgroundColor: "transparent" },
          }}
        >
          {isFollowed?.result === 1 ? (
            <HowToRegIcon fontSize="large" />
          ) : (
            <PersonAddAlt1Icon fontSize="large" sx={{ color: "white" }} />
          )}
        </Button>
      </Stack>
      <Stack direction="row" spacing="1rem" mt="2rem" justifyContent="center">
        <MailOutlineIcon sx={{ color: "red" }} />
        <Typography variant="eventBody">
          {productionDetails?.email} |{" "}
        </Typography>
        <PhoneIcon sx={{ color: "green" }} />
        <Typography variant="eventBody">
          {productionDetails?.phone_number} |
        </Typography>
        <PeopleIcon style={{ color: s }} />
        <Typography variant="eventBody">
          {numberOfFollowers?.number_of_followers} |
        </Typography>
        <Typography variant="eventBody">
          {rank?.production_rank.toFixed(1)}
        </Typography>
        <Rating
          name="half-rating-read"
          value={rank?.production_rank}
          precision={0.5}
          onChange={(event, new_rank) =>
            rankAction.mutate({
              user_id: currentUser.user_id,
              production_id,
              token_id,
              new_rank,
              setOpen,
            })
          }
          sx={{
            "& .MuiRating-iconEmpty": {
              color: "gray",
            },
          }}
          readOnly={
            !currentUser ||
            Boolean(isRanked?.result) ||
            String(currentUser?.user_id) === String(production_id)
          }
        />
        <Typography variant="eventBody">
          {rank?.number_of_people_rated} voted
        </Typography>
      </Stack>

      <Stack direction="row" spacing="1rem" my="1rem" alignItems="center">
        <CalendarMonthIcon fontSize="large" sx={{ color: s }} />
        <Typography variant="subTitle1" sx={{ fontSize: "2rem" }}>
          Future Events
        </Typography>
      </Stack>
      {futureEventsOfProduction.length === 0 ? (
        <Stack
          direction="row"
          spacing="1rem"
          my="3rem"
          justifyContent="center"
          alignItems="center"
        >
          <HistoryToggleOffIcon sx={{ color: p }} />
          <Typography variant="subTitle2">
            There are no future events
          </Typography>
          <HistoryToggleOffIcon sx={{ color: p }} />
        </Stack>
      ) : (
        <ImageCarousel elements={futureEventsOfProduction} />
      )}

      <Stack direction="row" spacing="1rem" my="1rem" alignItems="center">
        <HistoryIcon fontSize="large" sx={{ color: s }} />
        <Typography variant="subTitle1" sx={{ fontSize: "2rem" }}>
          Past Events
        </Typography>
      </Stack>
      {pastEventsOfProduction.length === 0 ? (
        <Stack
          direction="row"
          spacing="1rem"
          my="3rem"
          justifyContent="center"
          alignItems="center"
        >
          <HistoryToggleOffIcon sx={{ color: p }} />
          <Typography variant="emptyMessage">
            There are no past events
          </Typography>
          <HistoryToggleOffIcon sx={{ color: p }} />
        </Stack>
      ) : (
        <ImageCarousel elements={pastEventsOfProduction} />
      )}
    </Grid>
  );
}
