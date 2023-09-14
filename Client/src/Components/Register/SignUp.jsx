import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import * as React from "react";
import SignUpDetails from "./SignUpDetails";
import { UserAuth } from "../General/ContextProvider";
import { useState } from "react";
import { useEffect } from "react";
import { p } from "../General/Theme";
import Message from "../SpecialButtons/Message";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function SignUp(props) {
  const { closePopUp } = props;
  const {
    createUser,
    googleSignIn,
    checkEmailAvailabilityGoogle,
    checkEmailAvailabilityPassword,
    getTokenId,
    signout,
  } = UserAuth();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirm_password, setConfirmPassword] = useState();
  const [phone_number, setPhoneNumber] = useState("");
  const [full_name, setFullName] = useState("");
  const [user_id, setUserId] = useState("");
  const [showSignUpDetails, setShowSignUpDetails] = useState(false);
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState({
    generalError: false,
    content: "There was an error, try again later",
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

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

  const handleContinue = async (e) => {
    setIsLoading(true);
    if (email && password) {
      if (password?.length < 6) {
        console.log("Error: Password should be at least 6 characters");
        setOpen({
          ...open,
          generalError: true,
          content: "Password should be at least 6 characters. ",
        });
        return;
      }
      if (password != confirm_password) {
        console.log("Error: The password and confirm password do not match.");
        setOpen({
          ...open,
          generalError: true,
          content: "The password and confirm password do not match. ",
        });
        return;
      }
      /* check if the email is already in use */
      const isAvailable = await checkEmailAvailabilityPassword(email);
      if (isAvailable) {
        setWasSubmitted(true);
        setShowSignUpDetails(true);
      } else {
        setOpen({
          ...open,
          generalError: true,
          content: `The email address '${email}' is already in use by another user.`,
        });
        setIsLoading(false);
        return;
      }
    } else {
      console.log("Error: No password OR email");
      setOpen({
        ...open,
        generalError: true,
        content: "Error: No password OR email",
      });
    }
    setIsLoading(false);
  };

  const handleGoogleSignIn = async (e) => {
    setIsLoading(true);
    let user_info;
    e.preventDefault();
    try {
      await googleSignIn().then(async (result) => {
        user_info = result.user;
        const isAvailable = await checkEmailAvailabilityGoogle(result.user);
        if (isAvailable) {
          const email = user_info.providerData[0].email;
          setEmail(email);
          setPhoneNumber(user_info.phoneNumber);
          setFullName(user_info.displayName);
          setUserId(user_info.uid);
          setWasSubmitted(true);
          setShowSignUpDetails(true);
        } else {
          setOpen({
            ...open,
            generalError: true,
          });
        }
      });
    } catch (e) {
      console.log(e.message);
      setOpen({
        ...open,
        generalError: true,
        content: e.message,
      });
    }
    setIsLoading(false);
  };

  return (
    <Container component="main" maxWidth={showSignUpDetails ? "lg" : "xs"}>
      {open.generalError && (
        <Message
          message={open.content}
          onClose={() =>
            setOpen({
              ...open,
              generalError: false,
            })
          }
          time={4500}
        />
      )}
      {!showSignUpDetails ? (
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
            type={showPassword ? "text" : "password"}
            id="password"
            InputProps={{
              endAdornment: (
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
              ),
            }}
            onChange={(e) => setPassword(e.target.value)}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="confirm-password"
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            id="confirm-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Stack direction="row" alignItems="center" justifyContent="center">
            <Button sx={{ mt: 3, mb: 2 }} onClick={(e) => handleContinue(e)}>
              Continue
            </Button>

            <Button
              onClick={(e) => handleGoogleSignIn(e)}
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
        <SignUpDetails
          email={email}
          password={password}
          phone_number_fromGoogle={phone_number}
          full_name_fromGoogle={full_name}
          user_id_fromGoogle={user_id}
          closePopUp={closePopUp}
        />
      )}
    </Container>
  );
}
