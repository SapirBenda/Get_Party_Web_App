import * as React from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Stack } from "@mui/material";
import { useState } from "react";

export default function DateTimePickerValue({
  setStartTime,
  setEndTime,
  initialStartTime = dayjs(new Date()).add(24, "hour"),
  initialEndTime = dayjs(new Date()).add(25, "hour"),
}) {
  const [startTimeValue, setStartTimeValue] = useState(initialStartTime);
  const [endtTimeValue, setEndTimeValue] = useState(initialEndTime);

  const handleStartDateChange = (newValue) => {
    setStartTimeValue(dayjs(newValue));
    setStartTime(dayjs(newValue));
  };
  const handleEndDateChange = (newValue) => {
    setEndTimeValue(dayjs(newValue));
    setEndTime(dayjs(newValue));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing="2%"
      >
        <Stack direction="column" spacing="0.8rem" width={"100%"}>
          <DateTimePicker
            label="Beginning *"
            value={startTimeValue}
            minDateTime={dayjs(new Date()).add(23, "hours")}
            onChange={(newValue) => {
              handleStartDateChange(newValue);
              if (newValue.add(1, "hour") >= endtTimeValue)
                handleEndDateChange(newValue.add(1, "hour"));
            }}
            required
            format="DD/MM/YY HH:mm"
          />
        </Stack>
        <Stack direction="column" spacing="0.8rem" width={"100%"}>
          <DateTimePicker
            label="Ending *"
            value={endtTimeValue}
            minDateTime={startTimeValue.add(1, "hour")}
            onChange={(newValue) => handleEndDateChange(newValue)}
            required
            format="DD/MM/YY HH:mm"
          />
        </Stack>
      </Stack>
    </LocalizationProvider>
  );
}
