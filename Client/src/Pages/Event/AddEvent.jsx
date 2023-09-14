import * as React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {
  Button,
  InputAdornment,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { bg } from "../../Components/General/Theme";
import AddressesGoogleMapsAutoComplete from "../../Components/AddressGoogleMaps/AddressesGoogleMapsAutoComplete";
import DateTimePickerValue from "../../Components/DatePickers/DateTimePickerValue";
import { useState } from "react";
import MultipleSelectScrollbar from "../../Components/SpecialButtons/MultiSelectScrollbar";
import UploadImages from "../../Components/ImageDisplay/UploadImages";
import { UserAuth } from "../../Components/General/ContextProvider";
import dayjs from "dayjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import SERVER_PATH from "../../Components/General/config";


export default function AddEvent() {
  const navigate = useNavigate();
  const { currentUser, getTokenId } = UserAuth();
  const queryClient = useQueryClient();

  /* Fetch user's token ID */
  const { data: token_id = null } = useQuery({
    queryKey: ["tokenId"],
    queryFn: getTokenId,
    enabled: Boolean(currentUser),
  });

  /* Get from cache the place and music type lists */
  const placeTypes = queryClient.getQueryData(["placeTypes"]);
  const musicTypes = queryClient.getQueryData(["musicTypes"]);

  const [loading, setLoading] = useState(false);

  const [district, setDistrict] = useState([]);
  const [selectedPlaceType, setSelectedPlaceType] = useState([]);
  const [selectedMusicType, setSelectedMusicType] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState([]);
  const [startTime, setStartTime] = useState(
    dayjs(new Date(new Date().getTime() + 24 * 60 * 60 * 1000))
  );
  const [endTime, setEndTime] = useState(
    dayjs(new Date(new Date().getTime() + 25 * 60 * 60 * 1000))
  );
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [pricesError, setPricesError] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (pricesError) {
      alert("Invalid Price Range");
    } else {
      setLoading(true);
      const data = new FormData(e.target);
      // const token_id = await getTokenId();
      data.append("user_id", currentUser.user_id);
      data.append("production_name", currentUser.full_name);
      data.append("location", district);
      data.append("start_time", startTime.add(3, "hour").toString());
      data.append("end_time", endTime.add(3, "hour").toString());
      data.set("address", selectedAddress);
      selectedMusicType.forEach((value) => {
        data.append("music_type[]", value);
      });
      selectedPlaceType.forEach((value) => {
        data.append("place_type[]", value);
      });
      selectedFiles.forEach((file) => {
        data.append("images", file);
      });

      fetch(
        `${SERVER_PATH}/insertEvent?user_id=${currentUser.user_id}&token_id=${token_id}`,
        {
          method: "POST",
          body: data,
        }
      )
        .then((response) => response.json())
        .then((result) => navigate(`/Event/${result.event_id}`))
        .catch((error) => {
          console.log("There was error in inserting the new event", error);
          setLoading(false);
        });
    }
  };

  return (
    <Stack direction="column" alignItems="center">
      <Grid
        container
        my={"2%"}
        component={Paper}
        elevation={24}
        justifyContent="center"
        style={{ backgroundColor: bg }}
        width="90%"
      >
        <Typography variant="eventHeader">New Event</Typography>
        <Grid
          container
          component="form"
          encType="multipart/form-data"
          onSubmit={submitHandler}
          justifyContent="center"
          spacing="3rem"
          my="1rem"
        >
          <Grid item xs={5} mx="1rem">
            <Stack direction="column" spacing="1.3rem">
              <TextField
                name={"event_name"}
                label={"Party's Name"}
                required
                width="2rem"
              />
              <TextField
                name={"short_description"}
                label={"Short Description"}
                placeholder="A one-line description of your event"
                required
              />
              <TextField
                name={"long_description"}
                label={"Full Description"}
                placeholder="Full details, DJ line up, number of stages..."
                required
                multiline
              />

              <Stack direction="row" justifyContent="center" spacing="2rem">
                <Stack width={"100%"}>
                  <AddressesGoogleMapsAutoComplete
                    setSelectedAddresses={setSelectedAddress}
                    setDistrict={setDistrict}
                  />
                </Stack>
              </Stack>
              <DateTimePickerValue
                setStartTime={setStartTime}
                setEndTime={setEndTime}
              />
            </Stack>
          </Grid>

          <Grid item xs={5} mx="1rem">
            <Stack direction="column" spacing="1.3rem">
              <MultipleSelectScrollbar
                headline="Place's Type"
                elements={placeTypes}
                setSelected={setSelectedPlaceType}
                width="100%"
                required={true}
              />
              <MultipleSelectScrollbar
                headline="Music Genres"
                elements={musicTypes}
                setSelected={setSelectedMusicType}
                width="100%"
                required={true}
              />
              <TextField
                type="number"
                id="minAge"
                name="min_age"
                label="Minimum Entry Age"
                fullWidth
                required
                variant="outlined"
                InputProps={{
                  inputProps: { max: 120, min: 18 },
                }}
              />
              <TextField
                type="number"
                id="minPrice"
                name="min_price"
                required
                label="Lowest Ticket Price"
                variant="outlined"
                fullWidth
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setPricesError(parseInt(e.target.value) > parseInt(maxPrice));
                }}
                error={pricesError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography>₪</Typography>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                type="number"
                id="maxPrice"
                name="max_price"
                required
                label="Highest Ticket Price"
                variant="outlined"
                fullWidth
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPricesError(parseInt(e.target.value) < parseInt(minPrice));
                }}
                error={pricesError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography>₪</Typography>
                    </InputAdornment>
                  ),
                }}
              />
              <Stack
                direction="row"
                justifyContent="center"
                style={{ backgroundColor: "transparent" }}
              >
                <UploadImages
                  selectedFiles={selectedFiles}
                  setSelectedFiles={setSelectedFiles}
                  label={"Add Images"}
                />
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} mb="1rem">
            <Stack direction="row" justifyContent="center">
              {
                <Button type="submit" variant="submitButton">
                  {loading ? <>Loading...</> : <>submit</>}
                </Button>
              }
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </Stack>
  );
}
