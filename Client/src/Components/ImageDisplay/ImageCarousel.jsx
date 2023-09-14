import React from "react";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";
import PlaceIcon from "@mui/icons-material/Place";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import Carousel from "react-elastic-carousel";

export default function ImageCarousel({
  elements,
  number_of_photos = 4,
  width = "100%",
}) {
  const navigate = useNavigate();


  return (
    <Carousel
      itemsToShow={number_of_photos}
      style={{
        margin: "0.75rem auto",
        height: "100%",
        cursor: "pointer",
        width: `${width}`,
      }}
    >
      {elements?.map((event) => (
        <div
          key={event?.event_id}
          style={{ flex: "0.98", height: "18rem", position: "relative", maxWidth: elements.length < 3 ? "500px" : "100%"}}
        >
          <img
            alt="eventMainImage"
            src={event?.photos[0]}
            style={{ objectFit: "cover", width: "100%", height: "100%",  }}
            onClick={() => {
              navigate(`/Event/${event?.event_id}`);
            }}
          />
          <ImageListItemBar
            title={
              <Typography variant="cardFontTitle">
                {event?.event_name}
              </Typography>
            }
            onClick={() => {
              navigate(`/Event/${event?.event_id}`);
            }}
            subtitle={
              <React.Fragment>
                <Stack
                  direction="row"
                  alignItems="center"
                  mt="0.3rem"
                  spacing="0.5rem"
                >
                  <PlaceIcon fontSize="small" sx={{ color: "red" }} />
                  <Typography variant="cardFont">{event?.address}</Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing="0.5rem">
                  <CalendarMonthIcon
                    fontSize="small"
                    sx={{ color: "#3498db" }}
                  />
                  <Typography variant="cardFont">
                    {event?.start_time}
                  </Typography>
                </Stack>
              </React.Fragment>
            }
          />
        </div>
      ))}
    </Carousel>
  );
}
