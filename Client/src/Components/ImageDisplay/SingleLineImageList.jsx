import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";
import PlaceIcon from "@mui/icons-material/Place";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  imageList: {
    flexWrap: "nowrap",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)",
  },
  // title: {
  //   color: theme.palette.primary.light,
  // },
  // titleBar: {
  //   background:
  //     "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  // },
}));

export default function SingleLineImageList({ elements, wantedwidth = "90%" }) {
  const classes = useStyles();

  const navigate = useNavigate();
  const handleEventClick = (item) => {
    navigate(`/Event/${item.id}`);
  };

  return (
    <Grid
      container
      alignItems="center"
      // justifyContent="center"
      width={wantedwidth}
    >
      <ImageList
        className={classes.imageList}
        cols={2}
        sx={{ innerHeight: "100%" }}
      >
        {elements?.map((item) => (
          // <EventListItem eventDetails={item} />
          <ImageListItem key={item.images[0].img}>
            <img src={item.images[0].img} alt={item.images[0].title} />
            <ImageListItemBar
              title={item.name}
              subtitle={
                <React.Fragment>
                  <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="left"
                    // spacing={1}
                    // mt={1}
                  >
                    <item>
                      <PlaceIcon fontSize="small" sx={{ color: "White" }} />
                    </item>
                    <Typography
                      sx={{
                        // width: "100%",
                        color: "White",
                        fontSize: "small",
                      }}
                    >
                      {item.address}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-end"
                    // spacing={1}
                    // mt={1}
                  >
                    <item>
                      <CalendarMonthIcon
                        fontSize="small"
                        sx={{ color: "White" }}
                      />
                    </item>
                    <Typography
                      sx={{
                        // width: "100%",
                        color: "White",
                        fontSize: "small",
                      }}
                    >
                      {item.start}
                    </Typography>
                  </Stack>
                </React.Fragment>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Grid>
  );
}
