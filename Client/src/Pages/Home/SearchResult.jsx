import * as React from "react";
import { Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material";
import EventsList from "../../Components/EventsList/EventsList";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { p, s } from "../../Components/General/Theme";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import moment from "moment";
import CelebrationIcon from "@mui/icons-material/Celebration";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MultipleSelectScrollbar from "../../Components/SpecialButtons/MultiSelectScrollbar";
import SouthIcon from "@mui/icons-material/South";
import NorthIcon from "@mui/icons-material/North";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getResults } from "../../Components/Fetches/StaticFetch";
import noResult from "./noResult.gif";

export default function SearchResult() {
  const { searchData } = useParams();
  const parsedData = JSON.parse(searchData);
  const queryClient = useQueryClient();

  const [sortOption, setSortOption] = useState("Date");
  const [filters, setFilters] = useState(parsedData);

  /* Fetch the place types, music types, regions and all productions lists */
  const placeTypes = queryClient.getQueryData(["placeTypes"]);
  const musicTypes = queryClient.getQueryData(["musicTypes"]);
  const regions = queryClient.getQueryData(["regions"]);
  const allProductions = queryClient.getQueryData(["allProductions"]);

  /* Fetch the results of the search */
  const { data: searchResults } = useQuery({
    queryKey: ["searchResults", filters],
    queryFn: () => getResults(filters),
    enabled: filters != null, // checks if filters is not null and undefined
    placeholderData: [],
  });

  /*handle filltring the results */
  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
  };
  const sortSearchResults = () => {
    if (sortOption === "PriceDown") {
      return searchResults?.sort((a, b) => a.max_price - b.max_price);
    }
    if (sortOption === "PriceUp") {
      return searchResults?.sort((a, b) => b.max_price - a.max_price);
    }
    /* sort by date is default */
    return searchResults?.sort((a, b) =>
      moment(a?.start_time, "dddd, DD/MM/YYYY - HH:mm").isAfter(
        moment(b?.start_time, "dddd, DD/MM/YYYY - HH:mm")
      )
        ? 1
        : -1
    );
  };

  const refreshFilters = (filter, value) => {
    const newFilters = { ...filters };
    if (value === null || value.length === 0) {
      newFilters[filter] = null;
    } else {
      newFilters[filter] = value;
    }
    setFilters(newFilters);
  };

  return (
    <>
      <Stack
        direction="row"
        color="white"
        spacing="2rem"
        mt="3rem"
        justifyContent="center"
      >
        <Stack
          direction="column"
          width="30%"
          height="100%"
          position="sticky"
          top="90px"
          sx={{ border: `solid 2px ${s}`, borderRadius: "1rem" }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={1}
            mt="1rem"
          >
            <CelebrationIcon fontSize="medium" sx={{ color: p }} />
            <Typography variant="cardFontTitle2" my="0.1rem" textAlign="center">
              We Found {searchResults?.length} Events
            </Typography>
            <CelebrationIcon fontSize="medium" sx={{ color: p }} />
          </Stack>
          <Stack justifyContent="center" alignItems="left" mx="1rem" mt="1rem">
            <FormControl sx={{ width: "100%" }}>
              <FormLabel>Sort By:</FormLabel>
              <RadioGroup
                aria-label="sortOption"
                row
                value={sortOption}
                onChange={handleSortOptionChange}
                defaultValue="Date"
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  width={"100%"}
                  spacing={-0.32}
                >
                  <FormControlLabel
                    value="Date"
                    control={<Radio />}
                    label="Date"
                    labelPlacement="Date"
                  />
                  <FormControlLabel
                    value="PriceDown"
                    control={<Radio />}
                    label="Price"
                    labelPlacement="PriceDown"
                  />
                  <SouthIcon />
                  <FormControlLabel
                    value="PriceUp"
                    control={<Radio />}
                    label="Price"
                    labelPlacement="PriceUp"
                  />
                  <NorthIcon />
                </Stack>
              </RadioGroup>
            </FormControl>
          </Stack>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing="0.5rem"
            mt="1rem"
            width="100%"
          >
            <MultipleSelectScrollbar
              headline="Region"
              elements={regions}
              required={false}
              width="95%"
              initialSelected={
                filters?.location !== null ? filters?.location : []
              }
              filter="location"
              refreshFiltersFunc={refreshFilters}
              searchResultPage={1}
            />
            <MultipleSelectScrollbar
              headline="Production"
              elements={allProductions}
              required={false}
              width="95%"
              initialSelected={
                filters?.production !== null ? filters?.production : []
              }
              filter="production"
              refreshFiltersFunc={refreshFilters}
              searchResultPage={1}
            />
            <MultipleSelectScrollbar
              headline="Music Genres"
              elements={musicTypes}
              required={false}
              width="95%"
              initialSelected={
                filters?.music_type !== null ? filters?.music_type : []
              }
              filter="music_type"
              refreshFiltersFunc={refreshFilters}
              searchResultPage={1}
            />
            <MultipleSelectScrollbar
              headline="Place"
              elements={placeTypes}
              required={false}
              width="95%"
              initialSelected={
                filters?.place_type !== null ? filters?.place_type : []
              }
              filter="place_type"
              refreshFiltersFunc={refreshFilters}
              searchResultPage={1}
            />
            <TextField
              type="number"
              id="maxPrice"
              name="maxPrice"
              label="Price Limit"
              variant="outlined"
              sx={{
                width: "95%",
              }}
              defaultValue={filters?.max_price}
              onChange={(event) =>
                refreshFilters("max_price", event.target.value)
              }
            />
            <TextField
              type="number"
              id="minAge"
              name="minAge"
              label="Minimum Age"
              variant="outlined"
              InputProps={{ inputProps: { min: 18, max: 120 } }}
              sx={{
                width: "95%",
              }}
              defaultValue={filters?.min_age}
              onChange={(event) =>
                refreshFilters("min_age", event.target.value)
              }
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                slotProps={{
                  actionBar: {
                    actions: ["clear"],
                  },
                }}
                sx={{ width: "95%" }}
                label="Date"
                format="DD/MM/YYYY"
                clearable
                defaultValue={filters?.date ? dayjs(filters?.date) : null}
                onChange={(newValue) => refreshFilters("date", newValue)}
              />
            </LocalizationProvider>
          </Stack>

          <br />
        </Stack>

        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          width="65%"
        >
          {searchResults.length === 0 ? (
            <img src={noResult} width="250px" />
          ) : (
            <EventsList events={sortSearchResults()} />
          )}
        </Stack>
      </Stack>
    </>
  );
}
