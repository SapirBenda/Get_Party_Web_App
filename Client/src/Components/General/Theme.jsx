import { lighten } from "@material-ui/core";
import { createTheme, darken } from "@mui/material";

export const p = "#c780fa";
export const s = "#e5e0ff";
export const w = "#FFFFFF";
export const bg = "#232323";
export const bgp = "#121212";
const font = "Geologica";
export const buttonbg = "#80489C";

export const theme = createTheme({
  palette: {
    primary: {
      main: s,
    },
    secondary: {
      main: s,
    },
    background: {
      default: bg,
    },
  },

  components: {
    MuiList: {
      styleOverrides: {
        root: {
          "&::-webkit-scrollbar": {
            width: "0.4em",
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
    },
    MuiAutocomplete: {
      styleOverrides: {
        clearIndicator: {
          "& svg": {
            color: s, //  ClearIcon
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          //color of the arrow down
          color: s,
        },
      },
    },
    MuiImageListItem: {
      styleOverrides: {
        root: {
          "& .MuiImageListItem-img": {
            height: "20rem",
          },
        },
      },
    },
    MuiImageList: {
      styleOverrides: {
        root: {
          "&::-webkit-scrollbar": {
            width: "0.4em",
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
    },
    MuiButton: {
      styleOverrides: {
        root: {
          // width: "3rem",
          height: "3rem",
          fontSize: "1rem",
          fontWeight: 500,
          letterSpacing: "0.08em",
          backgroundColor: buttonbg,
          color: w,
          borderRadius: 11,
          variant: "outlined",
          "&:hover": {
            // backgroundColor: darken(buttonbg, 0.3),
            backgroundColor: lighten(buttonbg, 0.15),
          },
          "&:focus": {
            outline: "none",
          },
        },
        submitButton: {
          width: "10rem",
          height: "3rem",
          fontSize: "1.2rem",
          fontWeight: 500,
          letterSpacing: "0.08em",
          backgroundColor: buttonbg,
          color: w,
          borderRadius: 11,
          variant: "outlined",
          border: "1px solid white",
          "&:hover": {
            // backgroundColor: darken(buttonbg, 0.3),
            backgroundColor: lighten(buttonbg, 0.15),
          },
          "&:focus": {
            outline: "none",
          },
        },
        textKind: {
          fontSize: "1rem",
          fontWeight: 500,
          letterSpacing: "0.08em",
          backgroundColor: "transparent",
          color: "black",
          borderRadius: 11,
          variant: "outlined",
          "&:hover": {
            // backgroundColor: darken(buttonbg, 0.3),
            backgroundColor: "transparent",
          },
          "&:focus": {
            outline: "none",
          },
        },
        deleteButton: {
          fontSize: "1rem",
          fontWeight: 600,
          letterSpacing: "0.08em",
          backgroundColor: "transparent",
          color: "red",
          borderRadius: 11,
          variant: "outlined",
          "&:hover": {
            // backgroundColor: darken(buttonbg, 0.3),
            backgroundColor: "transparent",
          },
          "&:focus": {
            outline: "none",
          },
        },
        cancleButton: {
          fontSize: "1rem",
          // fontWeight: 600,
          letterSpacing: "0.08em",
          backgroundColor: "transparent",
          color: s,
          borderRadius: 11,
          variant: "outlined",
          "&:hover": {
            // backgroundColor: darken(buttonbg, 0.3),
            backgroundColor: "transparent",
          },
          "&:focus": {
            outline: "none",
          },
        },
        resultTags: {
          fontSize: "1rem",
          fontWeight: 600,
          letterSpacing: "0.08em",
          backgroundColor: lighten(bg, 0.05),
          color: s,
          borderColor: s,
          borderRadius: 11,
          width: "fit-content",
          display: "inline-flex",
          "&:hover": {
            backgroundColor: "transparent",
          },
          "&:focus": {
            outline: s,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:focus": {
            outline: "none",
          },
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        grouped: {
          borderColor: s,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          color: s, // color for unselected ToggleButton
          "&.Mui-selected": {
            color: p, // Replace with the desired color for selected ToggleButton
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: s, // color of text
          backgroundColor: bg, // background color of list
          justifyContent: "flex-start",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          // width: '30rem',
          backgroundColor: bg,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: s,
          },
          "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
            // backgroundColor: lighten(bg, 0.05),
            borderColor: darken(s, 0.3),
          },
          "& .MuiInputBase-input": {
            color: s,
          },
          "& .MuiInputBase-input::placeholder": {
            color: s,
          },
          "& input.MuiAutocomplete-input": {
            // backgroundColor: bg, // background color of the placeholder
            color: s, // color of free text input
          },
          // color of X in the selected tags
          "& .MuiAutocomplete-tag svg": {
            color: s,
          },
          "& .MuiAutocomplete-value": {
            backgroundColor: s,
          },
          "& .MuiChip-label": {
            // Tags styling
            // backgroundColor: w,
            fontSize: "1rem",
          },
          "& .MuiSvgIcon-root": {
            //color of the arrow down
            color: s, // Replace 'red' with your desired color
          },
          "& .MuiInputAdornment-positionEnd .MuiSvgIcon-root": {
            color: s, // Replace 'red' with your desired color
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          backgroundColor: bg,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: s,
          },
          "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: darken(s, 0.3),
            // "#D6A2F9"
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: lighten(bg, 0.01),
          "&.Mui-disabled": {
            backgroundColor: "red",
          },
        },
        input: {
          "&:-webkit-autofill": {
            textFillColor: s,
            boxShadow: `0 0 0px 1000px ${bg} inset !important`,
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        input: {
          "&:-webkit-autofill": {
            textFillColor: bg,
            boxShadow: `0 0 0px 1000px ${bg} inset !important`,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        label: {
          color: p,
        },
      },
    },
    MuiRating: {
      styleOverrides: {
        root: {
          borderColor: p,
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        day: {
          backgroundColor: "red",
        },
        daySelected: {
          backgroundColor: "red",
        },
        dayDisabled: {
          backgroundColor: "red",
        },
        current: {
          backgroundColor: "red",
        },
      },
    },
  },

  typography: {
    fontFamily: font,
    /* Logo */
    appName: {
      color: p,
      fontSize: "1.6rem",
      fontWeight: "bold",
      letterSpacing: "0.1em",
    },
    /* Home page font */
    listTitle: {
      fontFamily: font,
      color: p,
      fontSize: "2.7rem",
      fontWeight: 500,
      letterSpacing: "0.00735em",
      textAlign: "left",
    },
    /* Title of cards */
    cardFontTitle: {
      fontFamily: font,
      color: s,
      fontSize: "1.2rem",
      fontWeight: 500,
      letterSpacing: "0.05em",
      lineHeight: "1.167",
    },
    /* Title of cards */
    cardFontTitle2: {
      fontFamily: font,
      color: p,
      fontSize: "1.8rem",
      fontWeight: 600,
      letterSpacing: "0.05em",
      lineHeight: "1.167",
    },
    /* Title of Comments */
    cardFontTitle3: {
      fontFamily: font,
      color: p,
      fontSize: "1.2rem",
      fontWeight: 500,
      letterSpacing: "0.05em",
      lineHeight: "1.167",
    },
    /* Cards font */
    cardFont: {
      fontFamily: font,
      color: s,
      fontSize: "1rem",
      fontWeight: 100,
      letterSpacing: "0.05em",
      lineHeight: "1.167",
    },
    /* Header of the add event page*/
    eventHeader: {
      fontFamily: font,
      color: p,
      fontSize: "3rem",
      fontWeight: 690,
      letterSpacing: "0.1rem",
      textAlign: "center",
    },
    /* Header of the LiveMode page*/
    eventHeader2: {
      fontFamily: font,
      color: p,
      fontSize: "2rem",
      fontWeight: 690,
      letterSpacing: "0.1rem",
      textAlign: "center",
    },
    /* prodile body font */
    eventBody: {
      fontFamily: font,
      color: s,
      fontSize: "1.3rem",
      fontWeight: 400,
      letterSpacing: "0.08em",
      lineHeight: "1.167",
      textAlign: "left",
    },
    /* event page */
    eventBody2: {
      fontFamily: font,
      color: s,
      fontSize: "1.3rem",
      fontWeight: 100,
      letterSpacing: "0.08em",
      lineHeight: "1.167",
      textAlign: "left",
    },
    /* LiveMode */
    eventBody3: {
      fontFamily: font,
      color: s,
      fontSize: "1rem",
      fontWeight: 100,
      letterSpacing: "0.08em",
      lineHeight: "1.167",
      textAlign: "left",
    },
    /* Sub header for the profile page */
    subTitle1: {
      fontFamily: font,
      color: s,
      fontSize: "1.5rem",
      fontWeight: 500,
      letterSpacing: "0.08em",
      lineHeight: "1.4",
      textAlign: "center",
    },
    /* Sub header for the LiveMode page */
    subTitle2: {
      fontFamily: font,
      color: s,
      fontSize: "1rem",
      fontWeight: 400,
      letterSpacing: "0.08em",
      lineHeight: "1.4",
      textAlign: "center",
    },
    emptyMessage: {
      fontFamily: font,
      color: p,
      fontSize: "1.5rem",
      fontWeight: 400,
      letterSpacing: "0.08em",
      lineHeight: "1.4",
      textAlign: "center",
    },
    /* this controlls the text field font for some reason*/
    body1: {
      color: s,
      fontSize: "1.27rem",
      fontWeight: 500,
      letterSpacing: "0.05em",
      lineHeight: "1.4",
    },
    message: {
      fontFamily: font,
      color: "black",
      fontSize: "1.2rem",
      fontWeight: 400,
      letterSpacing: "0.08em",
      lineHeight: "1.4",
      textAlign: "center",
    },

    /******************************************************************* */
    /******************************************************************* */
    /* FROM DOWN HERE I HAVE NO IDEA WHAT HAPPENS, DO NOT ADD ABOVE THIS */
    /******************************************************************* */
    /******************************************************************* */

    smallLinks: {
      fontSize: "0.98rem",
      fontWeight: 400,
      letterSpacing: "0.01071em",
      lineHeight: "1.43",
    },
  },
});
