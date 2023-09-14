import * as React from "react";
import { Grid, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { UserAuth } from "../../Components/General/ContextProvider";
import EventDetails from "./EventDetails";
import LiveMode from "./LiveMode";
import {
  getEventDetails,
  getProductionDetails,
} from "../../Components/Fetches/StaticFetch";
import { useQuery } from "@tanstack/react-query";

export default function Event() {
  const { event_id } = useParams();
  const { currentUser } = UserAuth();
  const [navigateTo, setNavigateTo] = useState("Event");

  /* Fetch the event's details */
  const { data: eventDetails = [] } = useQuery({
    queryKey: ["eventDetails"],
    queryFn: () => getEventDetails(event_id),
  });

  /* Fetch the production's details */
  const { data: productionDetails = null } = useQuery({
    queryKey: ["productionDetails", eventDetails?.user_id],
    queryFn: () => getProductionDetails(eventDetails?.user_id),
    enabled: eventDetails != null && eventDetails != [],
  });

  return (
    <Grid
      component="main"
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Stack direction="row" justifyContent="center" my="1rem">
        <ToggleButtonGroup
          color="primary"
          value={navigateTo}
          exclusive
          onChange={(event, page) => setNavigateTo(page)}
          aria-label="Platform"
          size="small"
        >
          <ToggleButton value="Event" style={{ fontSize: "small" }}>
            Details
          </ToggleButton>
          <ToggleButton value="LiveMode" style={{ fontSize: "small" }}>
            Live
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {navigateTo === "LiveMode" ? (
        <LiveMode
          currentUser={currentUser}
          eventDetails={eventDetails}
          event_id={event_id}
          productionDetails={productionDetails}
        />
      ) : (
        <EventDetails
          currentUser={currentUser}
          eventDetails={eventDetails}
          event_id={event_id}
          productionDetails={productionDetails}
        />
      )}
    </Grid>
  );
}
