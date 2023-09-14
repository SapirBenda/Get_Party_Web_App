import * as React from "react";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import "react-datepicker/dist/react-datepicker.css";
import { UserAuth } from "../General/ContextProvider";
import { Container, Stack } from "@mui/material";
import AddressesGoogleMapsAutoComplete from "../AddressGoogleMaps/AddressesGoogleMapsAutoComplete";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MultipleSelectScrollbar from "../SpecialButtons/MultiSelectScrollbar";
import UploadImages from "../ImageDisplay/UploadImages";
import TextFieldLimitedChars from "../SpecialButtons/TextFieldLimitedChars";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import SERVER_PATH from "../General/config";
import Message from "../SpecialButtons/Message";

export default function SignUpDetails(props) {
  const {
    email,
    password,
    phone_number_fromGoogle,
    full_name_fromGoogle,
    user_id_fromGoogle,
    closePopUp,
  } = props;

  const queryClient = useQueryClient();

  const { createUser, getTokenId, signout } = UserAuth();

  const ALPHA_NUMERIC_DASH_REGEX = /^[a-zA-Z0-9- _]+$/;
  const DIGITS_REGEX = /^[0-9+]+$/;

  const [userType, setUserType] = useState("partier");
  const [selectedPlaceType, setSelectedPlaceType] = useState([]);
  const [selectedMusicType, setSelectedMusicType] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState([]);
  const [birth_date, setBirthDate] = useState();
  const [phone_number, setPhoneNumber] = useState(phone_number_fromGoogle);
  const [full_name, setFullName] = useState(full_name_fromGoogle);
  const [district, setDistrict] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [wasSubmitted, setWasSubmitted] = useState(false);

  /* Get from cache the place and music type lists */
  const placeTypes = queryClient.getQueryData(["placeTypes"]);
  const musicTypes = queryClient.getQueryData(["musicTypes"]);

  const [open, setOpen] = useState({
    generalError: false,
    UNAUTHORIZED: false,
    content: "There was an error, try again later",
  });
  const handleUserType = (event) => {
    setUserType(event.target.value);
  };

  /* if user leaves before he register need to sighOut and delete cache */
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      /*if user leaves the page before he submits*/
      if (!wasSubmitted) {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome and Firefox

        /* if the user leaves the page make sure he is not connected to google account  */
        signout();
      }
    };

    if (!wasSubmitted) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [wasSubmitted]);

  const submitHandler = async (e) => {
    setIsLoading(true);
    setWasSubmitted(true);

    e.preventDefault();
    const data = new FormData(e.target);
    let type = false;
    let user_info = {};
    if (userType === "production") {
      type = true;
    }

    try {
      /* If user didn't sign up with google he has no user id - need to create user in firebase with email/password */
      if (!user_id_fromGoogle) {
        if (email && password) {
          await createUser(email, password).then((result) => {
            user_info = result.user;
          });
        } else {
          console.log("Error: No password OR email");
        }
      } else {
        //user signed up with google so he has user id
        user_info.uid = user_id_fromGoogle;
      }

      /************ set user details to send to server *************/
      const token_id = await getTokenId();

      data.append("user_id", user_info.uid);
      data.append("email", email);
      data.append("is_producer", type);
      data.append("birth_date", birth_date);

      selectedMusicType.forEach((value) => {
        data.append("favorite_music_types[]", value);
      });
      selectedPlaceType.forEach((value) => {
        data.append("favorite_locations[]", value);
      });
      selectedFiles.forEach((file) => {
        data.append("images", file);
      });

      /* Debug prints - form data */
      // console.log("------------Form Data---------------")
      // for (const entry of data.entries()) {
      //   console.log(JSON.stringify(entry));
      // }
      // console.log("------------------------------------")

      /* Insert user to DB */
      if (!user_info.uid) {
        //test that user_id updated to avoid issues
        console.log("user_id is null");
      } else {
        const result = await fetch(
          `${SERVER_PATH}/insertUser?user_id=${user_info.uid}&token_id=${token_id}`,
          {
            method: "POST",
            body: data,
          }
        );
        if (result.status === 401) {
          console.log("UNAUTHORIZED");
          // alert("Error: Authentication error ");
          setOpen({
            ...open,
            generalError: true,
            content: "Error: Authentication error ",
          });
        }

        localStorage.setItem("logged_in", true);
        closePopUp();
        window.location.reload();
      }
    } catch (e) {
      // alert(e.message);
      setOpen({
        ...open,
        generalError: true,
        content: e.message,
      });
      console.log(e.message);
    }
    setIsLoading(false);
  };

  return (
    <Container component="main">
      {open.generalError && (
        <Message
          message={open.content}
          onClose={() =>
            setOpen({
              ...open,
              generalError: false,
            })
          }
          time={5000}
        />
      )}
      <Grid
        container
        component="form"
        onSubmit={submitHandler}
        justifyContent="center"
        alignItems="center"
      >
        <Stack direction="column" mt={1} width={"100%"}>
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

          <Stack
            direction="row"
            spacing={1}
            mb={2}
            width={"100%"}
            justifyContent="space-between"
          >
            <AddressesGoogleMapsAutoComplete
              setSelectedAddresses={setSelectedAddress}
              setDistrict={setDistrict}
              width="100%"
              validateChars={true}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={{ width: "55%" }}
                label="Date of Birth *"
                onChange={(newValue) => setBirthDate(newValue)}
                required
                format="DD/MM/YYYY"
                disableFuture
                maxDate={dayjs().subtract(18, "years")}
              />
            </LocalizationProvider>
          </Stack>

          <Stack direction="row" spacing={1} mb={2}>
            <MultipleSelectScrollbar
              headline="Favorite Places"
              elements={placeTypes}
              setSelected={setSelectedPlaceType}
              width={"50%"}
              required={false}
            />
            <MultipleSelectScrollbar
              headline="Favorite Music Genres"
              elements={musicTypes}
              setSelected={setSelectedMusicType}
              width={"50%"}
              required={false}
            />
          </Stack>
          <Stack direction="row" justifyContent="center" spacing={1} mb={2}>
            <FormControlLabel
              value="partier"
              control={
                <Radio
                  color={userType === "partier" ? "secondary" : "default"}
                  sx={{
                    "& .MuiSvgIcon-root": {
                      color: userType === "partier" ? "#3f51b5" : "#9e9e9e",
                    },
                  }}
                />
              }
              label="Partier"
              checked={userType === "partier"}
              onChange={handleUserType}
            />
            <FormControlLabel
              value="production"
              control={
                <Radio
                  color={userType === "production" ? "secondary" : "default"} // fixed: changed from "default" to "secondary"
                  sx={{
                    "& .MuiSvgIcon-root": {
                      color: userType === "production" ? "#f50057" : "#9e9e9e", // fixed: changed from "publisher" to "production"
                    },
                  }}
                />
              }
              label="Production"
              checked={userType === "production"}
              onChange={handleUserType}
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
            />
            {/* {userType !== "partier" && <UploadButtons label={"Certificate"} />} */}
          </Stack>
          <Stack direction="row" justifyContent="center" spacing={1}>
            <Button type="submit" variant="submitButton">
              {isLoading === true ? <>Loading...</> : <>Sign Up</>}
            </Button>
          </Stack>
        </Stack>
      </Grid>
    </Container>
  );
}
