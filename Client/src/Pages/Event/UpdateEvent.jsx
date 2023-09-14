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
import MultipleSelectScrollbar from "../../Components/SpecialButtons/MultiSelectScrollbar";
import { useNavigate, useParams } from "react-router-dom";
import { bg } from "../../Components/General/Theme";
import AddressesGoogleMapsAutoComplete from "../../Components/AddressGoogleMaps/AddressesGoogleMapsAutoComplete";
import DateTimePickerValue from "../../Components/DatePickers/DateTimePickerValue";
import { useState, useEffect } from "react";
import Loading from "../../Components/SpecialButtons/Loading";
import dayjs from "dayjs";
import UploadImages from "../../Components/ImageDisplay/UploadImages";
import { UserAuth } from "../../Components/General/ContextProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import SERVER_PATH from "../../Components/General/config";

export default function UpdateEvent() {
  const { currentUser, getTokenId } = UserAuth();
  const { event_id } = useParams();
  const queryClient = useQueryClient();
  const [eventInfo, setEventInfo] = useState();
  const [productionDetails, setProductionDetails] = useState();

  const [eventName, setEventName] = useState([]);
  const [shortDescription, setShortDescription] = useState([]);
  const [longDescription, setLongDescription] = useState([]);
  const [minAge, setMinAge] = useState();
  const [minPrice, setMinPrice] = useState([]);
  const [maxPrice, setMaxPrice] = useState([]);
  const [pricesError, setPricesError] = useState(false);

  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedPlaceType, setSelectedPlaceType] = useState([]);
  const [selectedMusicType, setSelectedMusicType] = useState([]);
  const [selectedAddress, setSelectedAssress] = useState([]);
  const [district, setDistrict] = useState();
  const [urls, setUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /* Get from cache the place and music type lists */
  const placetype = queryClient.getQueryData(["placeTypes"]);
  const musictype = queryClient.getQueryData(["musicTypes"]);

  const navigate = useNavigate();

  /* Fetch user's token ID */
  const { data: token_id = null } = useQuery({
    queryKey: ["tokenId"],
    queryFn: getTokenId,
    enabled: Boolean(currentUser),
  });

  async function fetchFromServer(url, setFunction) {
    fetch(`${SERVER_PATH}/${url}`)
      .then((response) => response.json())
      .then((json) => setFunction(json))
      .catch((error) =>
        console.log(
          "There was an error in fetching the data on the event page" + error
        )
      );
  }

  /* Fetch event details */
  useEffect(() => {
    async function fetchData() {
      await fetchFromServer(
        `eventForUpdate?event_id=${event_id}&user_id=${currentUser?.user_id}&token_id=${token_id}`,
        setEventInfo
      );
    }
    fetchData();
  }, [event_id, currentUser]);

  /* Fetch production details */
  useEffect(() => {
    async function fetchData() {
      if (eventInfo?.user_id) {
        await fetchFromServer(
          `productionInfo?user_id=${eventInfo?.user_id}`,
          setProductionDetails
        );
      }
    }
    async function setAllDetails() {
      setEventName(eventInfo?.event_name);
      setShortDescription(eventInfo?.short_description);
      setLongDescription(eventInfo?.long_description);
      setSelectedAssress(eventInfo?.address);
      setDistrict(eventInfo?.location);
      setMinAge(eventInfo?.min_age);
      setMinPrice(eventInfo?.min_price);
      setMaxPrice(eventInfo?.max_price);
      setSelectedPlaceType(eventInfo?.place_type);
      setSelectedMusicType(eventInfo?.music_type);
      setStartTime(eventInfo?.start_time);
      setEndTime(eventInfo?.end_time);
      setUrls(eventInfo?.photos);
    }
    fetchData().then(setAllDetails);
  }, [eventInfo, event_id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const data = new FormData();
    data.append("event_id", eventInfo?.event_id);
    data.append("event_name", eventName);
    data.append("address", selectedAddress);
    data.append("location", district);
    data.append("start_time", startTime);
    data.append("end_time", endTime);
    data.append("short_description", shortDescription);
    data.append("long_description", longDescription);
    data.append("min_age", minAge);
    data.append("min_price", minPrice);
    data.append("max_price", maxPrice);
    selectedMusicType.forEach((value) => {
      data.append("music_type[]", value);
    });
    selectedPlaceType.forEach((value) => {
      data.append("place_type[]", value);
    });
    urls.forEach((value) => {
      data.append("urls[]", value);
    });
    selectedFiles.forEach((file) => {
      data.append("images", file);
    });

    // fetch(
    //   `${SERVER_PATH}/updateEvent?event_id=${eventInfo?.event_id}&user_id=${currentUser?.user_id}&token_id=${token_id}`,
    //   {
    //     method: "POST",
    //     body: data,
    //   }
    // )
    //   .then(navigate(`/Event/${eventInfo?.event_id}`))
    //   .then(window.location.reload())
    //   .catch((error) =>
    //     console.log("There was error in updating the event", error)
    //   );
    fetch(
      `${SERVER_PATH}/updateEvent?event_id=${eventInfo?.event_id}&user_id=${currentUser?.user_id}&token_id=${token_id}`,
      {
        method: "POST",
        body: data,
      }
    )
      .then(() => {
        // Show loading state for 3 seconds
        setTimeout(() => {
          setIsLoading(false); // Set loading state back to false
          navigate(`/Event/${eventInfo?.event_id}`);
          window.location.reload();
        }, 5000);
      })
      .catch((error) =>
        console.log("There was error in updating the event", error)
      );
  };

  if (!eventInfo || !productionDetails) return <Loading />;

  return (
    <Grid
      container
      my={"3rem"}
      component={Paper}
      elevation={24}
      justifyContent="center"
      style={{ backgroundColor: bg }}
    >
      <Typography variant="eventHeader">Update Event</Typography>

      <Grid
        container
        component="form"
        onSubmit={submitHandler}
        justifyContent="center"
        spacing="2rem"
        my="1rem"
      >
        <Grid item xs={5} mx="1rem">
          <Stack direction="column" spacing="1rem">
            <TextField
              name={"EventName"}
              label={"Party's Name"}
              required
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
            <TextField
              name={"ShortDescription"}
              label={"Short Description"}
              required
              focused
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
            />
            <TextField
              name={"LongDescription"}
              label={"Full Description"}
              required
              multiline
              focused
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
            />

            <Stack direction="row" justifyContent="center" spacing="2rem">
              <Stack width={"100%"}>
                <AddressesGoogleMapsAutoComplete
                  setSelectedAddresses={setSelectedAssress}
                  initAddress={selectedAddress}
                  setDistrict={setDistrict}
                />
              </Stack>
            </Stack>
            <DateTimePickerValue
              setStartTime={setStartTime}
              setEndTime={setEndTime}
              initialStartTime={dayjs(startTime)}
              initialEndTime={dayjs(endTime)}
            />
          </Stack>
        </Grid>

        <Grid item xs={5} mx="1rem">
          <Stack direction="column" spacing="1rem">
            <MultipleSelectScrollbar
              headline="Place's Type"
              elements={placetype}
              setSelected={setSelectedPlaceType}
              width="100%"
              initialSelected={selectedPlaceType}
            />
            <MultipleSelectScrollbar
              headline="Music Genres"
              elements={musictype}
              setSelected={setSelectedMusicType}
              width="100%"
              initialSelected={selectedMusicType}
            />
            <TextField
              type="number"
              id="minAge"
              name="minAge"
              label="Minimum Entry Age"
              fullWidth
              required
              variant="outlined"
              value={minAge}
              onChange={(e) => setMinAge(e.target.value)}
              InputProps={{ inputProps: { max: 120, min: 18 } }}
            />
            <TextField
              type="number"
              id="minPrice"
              name="minPrice"
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
              name="maxPrice"
              required
              label="Highest Ticket Price"
              variant="outlined"
              fullWidth
              value={maxPrice}
              error={pricesError}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                setPricesError(parseInt(e.target.value) < parseInt(minPrice));
              }}
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
                urls={urls}
                setUrls={setUrls}
              />
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="center">
            {
              <Button type="submit" variant="outlined">
                {isLoading === false ? <>Update</> : <>Loading...</>}
              </Button>
            }
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
}
