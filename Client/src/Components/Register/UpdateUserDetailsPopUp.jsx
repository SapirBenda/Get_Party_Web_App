import * as React from "react";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import "react-datepicker/dist/react-datepicker.css";
import { Container, Dialog, Stack, Typography } from "@mui/material";
import AddressesGoogleMapsAutoComplete from "../AddressGoogleMaps/AddressesGoogleMapsAutoComplete";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MultipleSelectScrollbar from "../SpecialButtons/MultiSelectScrollbar";
import { bg } from "../General/Theme";
import dayjs from "dayjs";
import { UserAuth } from "../General/ContextProvider";
import { useNavigate } from "react-router-dom";
import UploadImages from "../ImageDisplay/UploadImages";
import Loading from "../SpecialButtons/Loading";
import TextFieldLimitedChars from "../SpecialButtons/TextFieldLimitedChars";
import Message from "../SpecialButtons/Message";
import SERVER_PATH from "../General/config";

export default function UpdateUserDetailsPopUp({ open, onClose }) {
  const { currentUser, getTokenId, signout } = UserAuth();
  const navigate = useNavigate();
  const ALPHA_NUMERIC_DASH_REGEX = /^[a-zA-Z0-9- _]+$/;
  const DIGITS_REGEX = /^[0-9+]+$/;

  const [placetype, setPlacetype] = useState([]);
  const [musictype, setMusictype] = useState([]);

  const [phone_number, setPhoneNumber] = useState("");
  const [full_name, setFullName] = useState("");
  const [selectedAddress, setSelectedAddress] = useState([]);
  const [birth_date, setBirthDate] = useState();
  const [selectedPlaceType, setSelectedPlaceType] = useState([]);
  const [selectedMusicType, setSelectedMusicType] = useState([]);
  const [userType, setUserType] = useState("partier");
  const [userPreferences, setUserPreferences] = useState();

  const [district, setDistrict] = useState("");
  const [user_id, setUserId] = useState();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [urls, setUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [openM, setOpenM] = useState({
    generalError: false,
    content: "There was an error, try again later",
  });

  async function fetchFromServer(url, setFunction) {
    try {
      fetch(`${SERVER_PATH}/${url}`)
        .then(async (response) => {
          /* if the BE verification failed - signout, alert the user and navigate to Home */
          if (response.status === 401) {
            await signout();
            // alert("Error: authorization failed");
            setOpenM({
              ...openM,
              generalError: true,
              content: "Error: authorization failed",
            });
            navigate("/");
          }
          if (response.status === 403) {
            await signout();
            // alert("Error: session ended - please sign in again");
            setOpenM({
              ...openM,
              generalError: true,
              content: "Error: session ended - please sign in again",
            });
            navigate("/");
          }
          return response.json();
        })
        .then((json) => setFunction(json));
    } catch (error) {
      console.log(
        "There was an error in fetching the data in update user details",
        error
      );
      setOpenM({
        ...openM,
        generalError: true,
        content: { error },
      });
    }
  }

  useEffect(() => {
    async function fetchData() {
      /* Fetch the music type list */
      await fetchFromServer(`musicTypes`, setMusictype);
      /* Fetch the place type list */
      await fetchFromServer(`placeTypes`, setPlacetype);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const token_id = await getTokenId().catch((error) => {
          console.log("Error getting tokenId: " + error);
        });
        if (token_id) {
          /* Fetch the user's preferences  */
          await fetchFromServer(
            `getPreferences?user_id=${currentUser?.user_id}&token_id=${token_id}`,
            setUserPreferences
          );
        }
      } catch (error) {
        console.log(error);
        setOpenM({
          ...openM,
          generalError: true,
          content: { error },
        });
      }
    }
    fetchData();
  }, [getTokenId, currentUser]);

  useEffect(() => {
    setUserId(currentUser?.user_id);
    setPhoneNumber(currentUser?.phone_number);
    setFullName(currentUser?.full_name);
    setBirthDate(dayjs(currentUser?.birth_date));
    setSelectedAddress(currentUser?.address);
    setUrls(currentUser?.photo);
    if (userPreferences) {
      setSelectedMusicType(userPreferences?.favorite_music_types);
      setSelectedPlaceType(userPreferences?.favorite_locations);
    }

    if (currentUser?.is_producer) {
      setUserType("production");
    }
  }, [userPreferences, currentUser]);

  const handleUserType = (event) => {
    setUserType(event.target.value);
  };

  async function updateUserDetails(user) {
    const updateUser = async () => {
      await getTokenId()
        .then(async (token_id) => {
          if (token_id) {
            return await fetch(
              `${SERVER_PATH}/updateUserDetails?user_id=${currentUser.user_id}&token_id=${token_id}`,
              {
                method: "POST",
                body: user,
              }
            );
          }
        })
        .then(async (response) => {
          if (response.status === 401) {
            await signout();
            alert("Error: authorization failed");
            setOpenM({
              ...openM,
              generalError: true,
              content: "Error: authorization failed",
            });
            navigate("/");
          }
        })
        .catch((error) => {
          console.log("Error Updating users details: ", error);
          setOpenM({
            ...openM,
            generalError: true,
            content: { error },
          });
        });
    };
    await updateUser();
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const data = new FormData(e.target);
    const dataToServer = new FormData(e.target);
    let type = false;
    if (userType === "production") {
      type = true;
    }
    dataToServer.append("user_id", user_id);
    dataToServer.append("is_producer", type);
    dataToServer.append("birth_date", birth_date);
    // dataToServer.append("address", selectedAddress);
    dataToServer.append("email", currentUser?.email);
    selectedPlaceType.forEach((value) => {
      dataToServer.append("favorite_locations[]", value);
    });
    selectedMusicType.forEach((value) => {
      dataToServer.append("favorite_music_types[]", value);
    });
    urls?.forEach((value) => {
      dataToServer.append("urls[]", value);
    });
    selectedFiles.forEach((file) => {
      dataToServer.append("images", file);
    });

    //***send update to server***
    await updateUserDetails(dataToServer);

    setTimeout(() => {
      setIsLoading(false);
      onClose();
      window.location.reload();
    }, 5000);
  };

  if (!currentUser || !userPreferences || !musictype || !placetype)
    return <Loading />;

  return (
    <Dialog open={open} onClose={onClose}>
      {openM.generalError && (
        <Message
          message={openM.content}
          onClose={() =>
            setOpenM({
              ...openM,
              generalError: false,
            })
          }
          time={4500}
        />
      )}
      <Stack sx={{ width: "100%", bgcolor: bg }}>
        <Typography my="0.5rem" textAlign="center" fontSize="1.2rem">
          Update Your Details
        </Typography>
        <Container component="main">
          <Grid
            container
            component="form"
            onSubmit={submitHandler}
            justifyContent="center"
            alignItems="center"
          >
            <Stack direction="column" width="100%" mt={1}>
              <Stack direction="row" spacing={1} mb={2}>
                <TextFieldLimitedChars
                  width="50%"
                  required={true}
                  name="full_name"
                  label="Full Name"
                  value={full_name}
                  validCharacters={ALPHA_NUMERIC_DASH_REGEX}
                  helperText={"Please use only English characters"}
                  setFunction={setFullName}
                />

                <TextFieldLimitedChars
                  width="50%"
                  required={true}
                  name="phone_number"
                  label="Phone Number"
                  value={phone_number}
                  helperText={"Should contain only digits"}
                  validCharacters={DIGITS_REGEX}
                  setFunction={setPhoneNumber}
                />
              </Stack>

              <Stack direction="row" spacing={2.5} mb={2} width={"100%"}>
                <AddressesGoogleMapsAutoComplete
                  setSelectedAddresses={setSelectedAddress}
                  initAddress={selectedAddress}
                  setDistrict={setDistrict}
                  width="105%"
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ width: "50%" }}
                    label="Date of Birth *"
                    value={birth_date}
                    onChange={(newValue) => setBirthDate(newValue)}
                    required
                  />
                </LocalizationProvider>
              </Stack>

              <Stack direction="row" spacing={1} mb={2}>
                <MultipleSelectScrollbar
                  headline="Favorite Place"
                  elements={placetype}
                  setSelected={setSelectedPlaceType}
                  width={"50%"}
                  required={false}
                  initialSelected={selectedPlaceType}
                />
                <MultipleSelectScrollbar
                  headline="Favorite Music"
                  elements={musictype}
                  setSelected={setSelectedMusicType}
                  width={"50%"}
                  required={false}
                  initialSelected={selectedMusicType}
                />
              </Stack>

              <Stack direction="row" justifyContent="center" spacing={1} mb={2}>
                <UploadImages
                  selectedFiles={selectedFiles}
                  setSelectedFiles={setSelectedFiles}
                  label={"Profile Picture"}
                  limit={true}
                  height="120px"
                  roundView={true}
                  urls={urls}
                  setUrls={setUrls}
                />
                {/* {userType !== "partier" && (
                  <UploadButtons label={"Certificate"} />
                )} */}
              </Stack>
              <Stack direction="row" justifyContent="center" spacing={1} mb={1}>
                <Button type="submit" variant="outlined">
                  {isLoading === true ? <>Loading...</> : <>Update Details</>}
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Container>

        {/* <DialogActions>
    <Button onClick={handleCancel}>Cancel</Button>
    <Button onClick={submitHandler}>Submit</Button>
  </DialogActions> */}
      </Stack>
    </Dialog>
  );
}
