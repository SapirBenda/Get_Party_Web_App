import * as React from "react";
import EventListItem from "./EventListItem";
import { Stack } from "@mui/material";

export default function EventsList({ events }) {
  return (
    <Stack spacing="1rem">
      {events?.map((event) => (
        <EventListItem key={event?.event_id} eventDetails={event} />
      ))}
    </Stack>
  );
}
