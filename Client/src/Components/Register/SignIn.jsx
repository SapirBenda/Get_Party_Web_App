import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import GoogleIcon from "@mui/icons-material/Google";
import { UserAuth } from "../General/ContextProvider";
import { auth } from "../../firebase";
import { p } from "../General/Theme";
import { IconButton, InputAdornment, Link, Stack } from "@mui/material";
import { useState } from "react";
import ForgotPassword from "./ForgotPassword";
import Message from "../SpecialButtons/Message";
import SERVER_PATH from "../General/config";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


export default function SignIn(props) {
  const { signIn, googleSignIn, getTokenId, setCurrentUser, signout } =
    UserAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [open, setOpen] = useState({
    generalError: false,
    content: "There was an error, try again later",
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSignIn = async (e, signInfunction) => {
    e.preventDefault();
    try {
      await signInfunction(email, password);
      const user = auth.currentUser;
      if (!auth.currentUser) {
        console.log("ERROR: sign in failed!!");
        setOpen({
          ...open,
          content: "ERROR: sign in failed!!",
          generalError: true,
          content: "User does not exist or wrong password!"
        });
      } else {
        try {
          const token_id = await getTokenId().catch((error) =>
            console.log("Error getting tokenId")
          );
          if (token_id) {
            const response = await fetch(
              `${SERVER_PATH}/userInfo?user_id=${user.uid}&token_id=${token_id}`
            );
            if (response.status === 401) {
              console.log("NOT AUTHORIZED");
              setOpen({
                ...open,
                generalError: true,
                content: "NOT AUTHORIZED",
              });
            }
            if (response.status === 403) {
              console.log("ERROR: status 403, token ID issue")
              setOpen({
                ...open,
                generalError: true,
                content: "Session ended - please sign in again",
              });
              await signout();
            }

            const resultjson = await response.json();
            setCurrentUser(resultjson);
            localStorage.setItem("logged_in", true);
            props.closePopUp();
            window.location.reload();
          }
        } catch (error) {
          await signout();
          console.log("There was an error ", error);
          setOpen({
            ...open,
            generalError: true,
            content: "User does not exist or wrong password. ",
          });
          
        }
      }
    } catch (error) {
      console.log("There was an error ", error);
      setOpen({
        ...open,
        generalError: true,
        content: "User does not exist or wrong password. ",
      });
    }
  };

  const handleShowForgotPassword = () => {
    setShowForgotPassword(true);
  };

  return (
    <Container component="main" maxWidth="xs">
      {open.generalError && (
        <Message
          message={open.content}
          onClose={() =>
            setOpen({
              ...open,
              generalError: false,
            })
          }
        />
      )}
      {!showForgotPassword ? (
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            type="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            InputProps={{endAdornment: 
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Link
            underline="hover"
            variant="smallLinks"
            fontSize="12px"
            onClick={handleShowForgotPassword}
            sx={{
              marginTop: 10,
              cursor: "pointer",
            }}
          >
            Forgot password?
          </Link>
          <Stack direction="row" alignItems="center" justifyContent="center">
            <Button
              type="submit"
              variant="submitButton"
              sx={{ mt: 3, mb: 2 }}
              onClick={(e) => handleSignIn(e, signIn)}
            >
              Sign In
            </Button>

            <Button
              onClick={(e) => handleSignIn(e, googleSignIn)}
              sx={{
                position: "absolute",
                right: "6%",
                marginLeft: 5,
                borderRadius: "50%",
                background: "transparent",
                "&:hover": {
                  background: "transparent",
                },
              }}
            >
              <GoogleIcon
                sx={{
                  fontSize: "35px",
                  color: p,
                  borderRadius: "50%",
                  border: `solid 1px ${p}`,
                  backgroundColor: "white",
                  padding: 0.5,
                }}
              />
            </Button>
          </Stack>
        </Box>
      ) : (
        <ForgotPassword setShowForgotPassword={setShowForgotPassword} />
      )}
    </Container>
  );
}
