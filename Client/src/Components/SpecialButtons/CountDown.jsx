import { Box, Stack, Typography } from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import clock from "./Clock.gif"

export default function CountDown({ eventTime }) {
  // We need ref in this, because we are dealing
  // with JS setInterval to keep track of it and
  // stop it when needed
  const Ref = useRef(null);

  const [timer, setTimer] = useState("00:00:00:00");
  const fixFormate = (num) => {
    return num > 9 ? num : "0" + num;
  };

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return {
      total,
      days,
      hours,
      minutes,
      seconds,
    };
  };

  const startTimer = (e) => {
    let { total, days, hours, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      setTimer(
        fixFormate(days) +
          ":" +
          fixFormate(hours) +
          ":" +
          fixFormate(minutes) +
          ":" +
          fixFormate(seconds)
      );
    }
  };

  const clearTimer = (e) => {
    let { total, days, hours, minutes, seconds } = getTimeRemaining(eventTime);
    const remaining = `${fixFormate(days)}:${fixFormate(hours)}:${fixFormate(
      minutes
    )}:${fixFormate(seconds)}`;
    setTimer(remaining);

    // If you try to remove this line the
    // updating of timer Variable will be
    // after 1000ms or 1sec
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();
    let { total, days, hours, minutes, seconds } = getTimeRemaining(eventTime);

    deadline.setDate(deadline.getDate() + days);
    deadline.setHours(fixFormate(deadline.getHours() + hours));
    deadline.setMinutes(deadline.getMinutes() + minutes);
    deadline.setSeconds(deadline.getSeconds() + seconds);
    return deadline;
  };

  useEffect(() => {
    clearTimer(getDeadTime());
    // Clear the interval when the component unmounts
    return () => {
      if (Ref.current) clearInterval(Ref.current);
    };
  }, [eventTime]); // Add eventTime as a dependency

  const timer_array = timer.split(":")

  return (
    <Stack
      direction="column"
      spacing="2rem"
      alignItems="center"
      justifyContent="center"
      mt="2rem"
    >
      {/* <Box
        component="iframe"
        src="https://embed.lottiefiles.com/animation/46436"
        sx={{
          width: "20rem",
          height: "20rem",
          backgroundColor: "transperent",
          borderColor: "transparent",
        }}
      /> */}
      <img src={clock} width="250px"/>
      <Stack
        direction="row"
        spacing="1.5rem"
        alignItems="center"
        justifyContent="center"
      >
        <Stack direction="column" alignItems="center" justifyContent="baseline">
          <Typography variant="eventHeader">{timer_array[0]}</Typography>
          <Typography>Days</Typography>
        </Stack>

        <Stack direction="column" alignItems="center" justifyContent="center">
          <Typography variant="eventHeader">{timer_array[1]}</Typography>
          <Typography>Hours</Typography>
        </Stack>
        <Stack direction="column" alignItems="center" justifyContent="center">
          <Typography variant="eventHeader">{timer_array[2]}</Typography>
          <Typography>Minutes</Typography>
        </Stack>
        <Stack direction="column" alignItems="center" justifyContent="center">
          <Typography variant="eventHeader">{timer_array[3]}</Typography>
          <Typography>Seconds</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
