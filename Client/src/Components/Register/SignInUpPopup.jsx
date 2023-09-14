import {
  Box,
  Dialog,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { bg, s } from "../../Components/General/Theme";
import { UserAuth } from "../General/ContextProvider";
import { auth } from "../../firebase";

export default function SignInUpPopup(props) {
  const { onClose, open, defaultTab } = props;
  const {signout, currentUser} = UserAuth()

  const handleClose = async () => {
    /* if the user tried to sign up with google and closed the dialog before submiting - sign out the user from firebase */
    if (!currentUser && auth.currentUser){
      await signout()
    }
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <BasicTabs closePopUp={onClose} defaultTab={defaultTab} />
    </Dialog>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Stack p={2}>
          <Typography variant="smallLinks">{children}</Typography>
        </Stack>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function BasicTabs(props) {
  const { closePopUp, defaultTab } = props;
  const [value, setValue] = React.useState(defaultTab);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // sx={{border:'solid 20px red'}}

  return (
    <Stack sx={{ width: "100%", bgcolor: bg }}>
      <Typography my="0.5rem" textAlign="center" fontSize="1.2rem">
        Please Login To Continue
      </Typography>
      <Divider sx={{ backgroundColor: s, width: "100%" }} />

      <Box
        mt="0.5rem"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
        >
          <Tab label="Sign In" sx={{ color: s }} {...a11yProps(0)} />
          <Tab label="Sign Up" sx={{ color: s }} {...a11yProps(1)} />
        </Tabs>
      </Box>
      <Box>
        <TabPanel value={value} index={0}>
          <SignIn closePopUp={closePopUp} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <SignUp closePopUp={closePopUp} />
        </TabPanel>
      </Box>
    </Stack>
  );
}
