import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import logo from "./favicon.png";
import UserMenu from "./UserMenu";
import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, lighten } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { bg, s } from "../General/Theme";
import CelebrationIcon from "@mui/icons-material/Celebration";
import { UserAuth } from "../General/ContextProvider";

export default function Header() {
  const navigate = useNavigate();
  const {currentUser} = UserAuth()


  return (
    <AppBar position="fixed" sx={{ bgcolor: bg }}>
      <Toolbar>
        <Stack>
          <IconButton onClick={() => navigate("/")}>
            <img src={logo} alt="logo" style={{ width: "2.2rem", marginRight:"1rem" }}/>
            <Typography variant="appName">
              GET PARTY
            </Typography>
          </IconButton>
        </Stack>
        <Box sx={{ flexGrow: 1 }}></Box>
        <Stack direction="row">
          {currentUser?.is_producer === 1 && (
            <Button
              onClick={() => navigate("/AddEvent")}
              size="large"
              type="submit"
              color="primary"
              sx={{
                borderRadius: "50%",
                bgcolor: "transparent",
                "&:hover": { backgroundColor: lighten(bg, 0.15) },
              }}
            >
                  <CelebrationIcon fontSize="large" sx={{ color: s , position:"absolute"}} />
                  <AddIcon fontSize="small" sx={{ color: s, mt: 3.8, ml: 0.5}} />
            </Button>
          )}
          <UserMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
