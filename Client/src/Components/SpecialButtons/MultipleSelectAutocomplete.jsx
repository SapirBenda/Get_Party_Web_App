import * as React from "react";
import { TextField, Autocomplete, MenuItem, lighten } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { bg } from "../General/Theme";

export default function MultipleSelectAutocomplete({
  elements,
  headline,
  setSelected,
  width = "12rem",
  limitTags = 1,
  required = false,
  initialSelected = [],
}) {
  const handleChnaged = (event, newValue) => {
    setSelected(newValue);
    setSelected1(newValue);
  };
  const [selected, setSelected1] = React.useState(initialSelected);

  return (
    <Autocomplete
      onChange={handleChnaged}
      multiple
      name={headline}
      disableCloseOnSelect
      id="tags-standard"
      options={elements}
      /*limits #selected item in the box */
      limitTags={limitTags}
      value={selected}
      sx={{
        width: { width },
      }}
      /* define what will be presented in the box */
      // renderTags={() => (
      //   <Typography variant="eventBody" align="center">
      //     open to see
      //   </Typography>
      // )}

      renderInput={(params) => (
        <TextField
          {...params}
          label={headline}
          variant="outlined"
          overflow="hidden"
          size="12rem"
        />
      )}
      renderOption={(props, option, { selected }) => {
        return (
          <MenuItem
            {...props}
            key={option}
            value={option}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = lighten(bg, 0.05))
            }
            onMouseLeave={(e) => (e.target.style.backgroundColor = bg)}
            sx={{ backgroundColor: bg, width: "100%" }}
          >
            {option}
            {selected ? <CheckIcon color="p" /> : null}
          </MenuItem>
        );
      }}
    />
  );
}
