import * as React from "react";
import { lighten } from "@mui/material/styles";
import Box from "@mui/material/Box";
import {
  OutlinedInput,
  InputLabel,
  MenuItem,
  Select,
  Chip,
  FormControl,
  IconButton,
} from "@mui/material/";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { bg } from "../General/Theme";
import { useState } from "react";

const MenuProps = {
  PaperProps: {
    sx: {
      backgroundColor: bg,
      borderRadius: "10px",
      border: "solid 2px black",
      maxHeight: "300px",
      overflowY: "auto",
      "&::-webkit-scrollbar": {
        width: "0.5em",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        borderRadius: "10px",
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: "#f2f2f2",
        borderRadius: "10px",
      },
    },
  },
};

export default function MultipleSelectScrollbar({
  elements,
  headline,
  setSelected,
  width = "12rem",
  required = false,
  initialSelected = [],
  filter,
  refreshFiltersFunc,
  searchResultPage = 0,
}) {
  const [selectedValue, setSelectedValue] = useState(initialSelected);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedValue(value);
    if (searchResultPage) {
      refreshFiltersFunc(filter, value);
    } else {
      setSelected(value);
    }
  };

  const handleClearClick = (event) => {
    setSelectedValue([]);
    if (searchResultPage) {
      refreshFiltersFunc(filter, []);
    } else {
      setSelected([]);
    }
  };

  return (
    <>
      <FormControl
        sx={{
          width: width,
        }}
      >
        {required ? (
          <InputLabel> {headline} * </InputLabel>
        ) : (
          <InputLabel> {headline} </InputLabel>
        )}
        <Select
          labelId="multiselect-chip"
          multiple
          variant="outlined"
          value={selectedValue}
          onChange={handleChange}
          input={<OutlinedInput label="Chip" />}
          renderValue={(selected) => (
            <Box
              sx={{
                overflowX: "scroll",
                overflowY: "hidden",
                "&::-webkit-scrollbar": {
                  height: "0.4rem",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#f2f2f2",
                  borderRadius: "10px",
                },
              }}
            >
              {selected?.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
          required={required}
          endAdornment={
            selectedValue.length === 0 ? null : (
              <IconButton
                onClick={handleClearClick}
                color="primary"
                sx={{ margin: "0 10px" }}
              >
                <ClearIcon />
              </IconButton>
            )
          }
        >
          {elements?.map((option) => (
            <MenuItem
              key={option}
              value={option}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = lighten(bg, 0.05))
              }
              onMouseLeave={(e) => (e.target.style.backgroundColor = bg)}
            >
              {option}
              {selectedValue.includes(option) ? <CheckIcon color="p" /> : null}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
