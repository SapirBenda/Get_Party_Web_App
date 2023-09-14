import * as React from "react";
import Grid from "@mui/material/Grid";
import { Stack, TextField, Button } from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import dayjs from "dayjs";
import { bg } from "../../Components/General/Theme";
import { lighten } from "@material-ui/core";
import { useState } from "react";
import SignInUpPopup from "../../Components/Register/SignInUpPopup";
import MultipleSelectScrollbar from "../../Components/SpecialButtons/MultiSelectScrollbar";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { UserAuth } from "../../Components/General/ContextProvider";
import { useQueryClient } from "@tanstack/react-query";


export default function Search() {
  const navigate = useNavigate();
  const { currentUser } = UserAuth();
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState();
  const [selectedPlaceType, setSelectedPlaceType] = useState([]);
  const [selectedMusicType, setSelectedMusicType] = useState([]);
  const [selectedProductions, setSelectedProductios] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [open, setOpen] = useState(false);

  /* Fetch the place types, music types, regions and all productions lists */
  const placeTypes = queryClient.getQueryData(["placeTypes"]);
  const musicTypes = queryClient.getQueryData(["musicTypes"]);
  const regions = queryClient.getQueryData(["regions"]);
  const allProductions = queryClient.getQueryData(["allProductions"]);


  /* This function fires up when we click the search button */
  const submitHandler = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const searchData = {
      location: selectedRegions.length !== 0 ? selectedRegions : null,
      music_type: selectedMusicType.length !== 0 ? selectedMusicType : null,
      place_type: selectedPlaceType.length !== 0 ? selectedPlaceType : null,
      production: selectedProductions.length !== 0 ? selectedProductions : null,
      min_age: data.get("minAge") !== "" ? data.get("minAge") : null,
      max_price: data.get("maxPrice") !== "" ? data.get("maxPrice") : null,
      date: selectedDate ? selectedDate : null,
    };
    const searchDataString = JSON.stringify(searchData);
    navigate(`/SearchResult/${encodeURIComponent(searchDataString)}`);
  };

  return (
    <>
      <Grid
        container
        mt="1rem"
        component="form"
        onSubmit={submitHandler}
        alignItems="center"
        justifyContent="center"
        direction="row"
      >
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          /*height="3.5rem" This makes the size of the search bar static not very responsive*/
          spacing="1rem"
          mt="1rem"
          width="100%"
        >
          <MultipleSelectScrollbar
            headline="Region"
            elements={regions}
            setSelected={setSelectedRegions}
            required={false}
            width="13%"
          />
          <MultipleSelectScrollbar
            headline="Production"
            elements={allProductions}
            setSelected={setSelectedProductios}
            required={false}
            width="13%"
          />
          <MultipleSelectScrollbar
            headline="Music Genres"
            elements={musicTypes}
            setSelected={setSelectedMusicType}
            required={false}
            width="13%"
          />
          <MultipleSelectScrollbar
            headline="Place"
            elements={placeTypes}
            setSelected={setSelectedPlaceType}
            required={false}
            width="13%"
          />
          <TextField
            type="number"
            id="maxPrice"
            name="maxPrice"
            label="Price Limit"
            variant="outlined"
            width="10%"
            sx={{
              width: { sm: "11rem" },
            }}
          />
          <TextField
            type="number"
            id="minAge"
            name="minAge"
            label="Min. Age"
            variant="outlined"
            width="10%"
            InputProps={{ inputProps: { min: 18, max: 120 } }}
            sx={{
              width: { sm: "11rem" },
            }}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{ width: "13%" }}
              label="Date"
              format="DD/MM/YYYY"
              onChange={(newValue) => setSelectedDate(dayjs(newValue))}
              required
            />
          </LocalizationProvider>
          {currentUser ? (
            <Button
              size="large"
              type="submit"
              color="primary"
              sx={{
                bgcolor: "transparent",
                "&:hover": { backgroundColor: lighten(bg, 0.15) },
              }}
            >
              <SearchOutlinedIcon fontSize="large" />
            </Button>
          ) : (
            <Button
              size="large"
              type="button"
              color="primary"
              sx={{
                bgcolor: "transparent",
                "&:hover": { backgroundColor: lighten(bg, 0.15) },
              }}
              onClick={() => setOpen(true)}
            >
              <SearchOutlinedIcon fontSize="large" />
            </Button>
          )}
        </Stack>
      </Grid>
      <SignInUpPopup
        open={open}
        onClose={() => setOpen(false)}
        defaultTab={0}
      />
    </>
  );
}
