import React from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

import { bg, p } from "../../Components/General/Theme";
import { lighten } from "@material-ui/core";
import { MenuItem, TextField } from "@mui/material";
import { useState } from "react";
import Message from "../SpecialButtons/Message";

export default function AddressesGoogleMapsAutoComplete({
  setSelectedAddresses,
  setDistrict,
  width = "100%",
  initAddress = "",
  validateChars = true,
}) {
  const [address, setAddress] = useState(initAddress);
  const google = window.google;

  /* Defines the valid characters of the address - !!!add missing chars if needed!!! */
  const ALPHA_NUMERIC_DASH_REGEX = /^[a-zA-Z0-9- _,.'()`;"]+$/;
  const [invalidChar, setInvalidChar] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  const searchOptions = {
    location: new google.maps.LatLng(31.4117, 35.0818155), 
    componentRestrictions: {
      country: "il", // Restrict to Israel (country code: il)
    },
    radius: 2000,
    types: ["address"],
    language: "en",
  };

  const handleSelect = async (value) => {
    let result = null;
    try {
      result = await geocodeByAddress(value, { language: "en" });
      const addr = value.replace(", Israel", "");
      if (
        validateChars &&
        addr !== "" &&
        !ALPHA_NUMERIC_DASH_REGEX.test(addr)
      ) {
        setInvalidChar(true);
        return;
      }
      setInvalidChar(false);
      setSelectedAddresses(addr);
      setAddress(value);
      const latLng = await getLatLng(result[0]);
      getDistrictByLatLng(latLng.lat, latLng.lng);
    } catch {
      /* falid to fetch addr !*/
      setOpenMessage(true);
      setAddress("");
    }
  };

  const getDistrictByLatLng = (latitude, longitude) => {
    const apiKey = "AIzaSyCxNJYiyu-F_xJZG8bPh70oYtN1aUNsgHA";
    const language = "en";
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&language=${language}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.results.length > 0) {
          for (let result of data.results) {
            if (result.types.includes("administrative_area_level_1")) {
              setDistrict(
                result.formatted_address.replace("District, Israel", "")
              );
            }
          }
        } else {
          console.log("No district found - set Other");
          setDistrict("Other");
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  const handlerChange = (newAddress) => {
    if (
      validateChars &&
      newAddress !== "" &&
      !ALPHA_NUMERIC_DASH_REGEX.test(newAddress)
    ) {
      setInvalidChar(true);
      return;
    }
    setInvalidChar(false);
    setAddress(newAddress);
    setSelectedAddresses(newAddress);
  };
  const handleBlur = () => {
    if (invalidChar) {
      setSelectedAddresses("");
      setAddress("");
    }
    setInvalidChar(false);
  };
  const styleLoading = {
    color: p,
    backgroundColor: bg,
  };
  return (
    <>
      {openMessage && (
        <Message
          message="Invalid Address !"
          onClose={handleCloseMessage}
          time={4500}
        />
      )}
      <PlacesAutocomplete
        value={address}
        onChange={(newValue) => handlerChange(newValue)}
        onSelect={handleSelect}
        searchOptions={searchOptions}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div onBlur={handleBlur}>
            <TextField
              required={true}
              name={"address"}
              label={"Full Address"}
              error={invalidChar}
              helperText={invalidChar ? "Please use english characters" : null}
              {...getInputProps({})}
              sx={{
                width: { width },
                language: "en",
              }}
            />
            {/* <div style={{position:"fixed",  zIndex: 9999,}}> */}
            <div
              style={{
                position: "absolute",
                top: "auto",
                right: "auto",
                zIndex: 9999,
              }}
            >
              {loading ? (
                <div {...getSuggestionItemProps(suggestions, { styleLoading })}>
                  Loading ...
                </div>
              ) : null}
              {suggestions?.map((suggestion) => {
                const style = {
                  color: p,
                  fontWeight: 100,
                  backgroundColor: suggestion.active
                    ? lighten(bg, 0.1)
                    : lighten(bg, 0.05),
                  language: "en",
                };
                return (
                  <MenuItem {...getSuggestionItemProps(suggestion, { style })}>
                    {suggestion.description}
                  </MenuItem>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    </>
  );
}
