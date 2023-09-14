import * as React from "react";
import ListItem from "@mui/material/ListItem";
import PlaceIcon from "@mui/icons-material/Place";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { p, s } from "../General/Theme";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import SellIcon from "@mui/icons-material/Sell";

export default function EventListItem({ eventDetails }) {
  const navigate = useNavigate();

  return (
    <ListItem
      key={eventDetails?.event_id}
      sx={{
        border: `solid 2px ${s}`,
        borderRadius: "1rem",
        // bgcolor: bgp,
        cursor: "pointer",
      }}
      onClick={() => navigate(`/Event/${eventDetails?.event_id}`)}
    >
      <Stack direction="row">
        <Stack direction="column" mr="2rem">
          <img
            src={`${eventDetails.photos[0]}`}
            alt={eventDetails.event_name}
            style={{
              width: "250px",
              height: "250px",
              objectFit: "cover",
              objectPosition: "center center",
              borderRadius: "1rem",
            }}
          />
        </Stack>
        <Stack
          direction="column"
          justifyContent="left"
          alignItems="left"
          spacing="0.5rem"
        >
          <Typography variant="cardFontTitle2" key="event-name">
            {eventDetails.event_name}
          </Typography>
          <Typography
            variant="cardFontTitle"
            alignItems="center"
            key="short-description"
          >
            {eventDetails.short_description}
          </Typography>

          <Stack direction="row" alignItems="center" key="address">
            <PlaceIcon sx={{ color: "red", mr: "0.5rem" }} />
            <Typography variant="cardFont">{eventDetails.address}</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" key="start-time">
            <CalendarMonthIcon sx={{ color: "#3498db", mr: "0.5rem" }} />
            <Typography variant="cardFont">
              {eventDetails.start_time}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" key="price">
            <SellIcon size="small" sx={{ color: "White", mr: "0.5rem" }} />
            <Typography variant="cardFont">
              {eventDetails.min_price} - {eventDetails.max_price}
              {" ₪"}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" key="music-type">
            <MusicNoteIcon size="small" sx={{ color: p, mr: "0.5rem" }} />
            {eventDetails.music_type?.map((name, index) => (
              <Typography variant="cardFont" key={index}>
                {name}&nbsp;
              </Typography>
            ))}
          </Stack>
          <Stack direction="row" alignItems="center" key="min-age">
            <PersonIcon sx={{ color: "green", mr: "0.5rem" }} />
            <Typography variant="cardFont">
              {eventDetails?.min_age} +
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </ListItem>
  );
}
