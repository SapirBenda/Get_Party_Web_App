import * as React from "react";
import Button from "@mui/material/Button";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import { Box, Stack, Typography } from "@mui/material";
import { UserAuth } from "../General/ContextProvider";
import Message from "../SpecialButtons/Message";
import { p } from "../General/Theme";

export default function ForgotPassword({ setShowForgotPassword }) {
  const { forgotPasswordSendResetEmail } = UserAuth();

  const [email, setEmail] = useState();
  const [open, setOpen] = useState({
    generalError: false,
    content: "There was an error, try again later",
  });

  const forgotPasswordHandler = async (e) => {
    try {
      await forgotPasswordSendResetEmail(email);
      setShowForgotPassword(false);
    } catch (error) {
      setOpen({
        ...open,
        generalError: true,
        content: error,
      });
      console.log("Error: " + error);
    }
  };

  return (
    // <Container component="main" maxWidth="xs">
    <Box component="form" noValidate sx={{ mt: 1 }}>
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

      <Stack direction="column" width="100%" mt={1}>
        <Typography my="0.5rem" textAlign="center" fontSize="1.3rem" color={p}>
          RESET YOUR PASSWORD
        </Typography>
        <Typography fontSize="0.8rem" textAlign="center">
          Please enter your email address below, and we will send you an email
          with further instructions
        </Typography>
        <Stack direction="row" spacing={1} mt={2}>
          <TextField
            required
            name="email"
            label="Email"
            type="email"
            value={email}
            fullWidth
            onChange={(e) => setEmail(e.target.value)}
          />
        </Stack>
        <Stack
          direction="row"
          justifyContent="center"
          spacing={1}
          mb={1}
          mt={2}
        >
          <Button variant="outlined" onClick={forgotPasswordHandler}>
            Reset Password
          </Button>
        </Stack>
      </Stack>
    </Box>

    // </Container>
  );
}
