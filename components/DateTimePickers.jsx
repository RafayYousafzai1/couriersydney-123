import { DateTimePicker } from "@mantine/dates";
import React from "react";

export default function DateTimePickers({ handleDateTimeChange }) {
  const handleDateTimeChanges = (dateString) => {
    const date = new Date(dateString);

    // Format date as "MM/DD/YYYY"
    const formattedDate = `${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date
      .getDate()
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;

    // Format time as "hh:mm AM/PM"
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const amPm = date.getHours() >= 12 ? "PM" : "AM";
    const formattedTime = `${hours}:${minutes} ${amPm}`;

    handleDateTimeChange({
      date: formattedDate,
      time: formattedTime,
    });
  };

  return (
    <DateTimePicker
      valueFormat="DD MMM YYYY hh:mm A"
      label="Ready date and time"
      placeholder="Pick date and time"
      onChange={handleDateTimeChanges}
    />
  );
}
