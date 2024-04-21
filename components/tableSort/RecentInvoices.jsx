"use client";
import React from "react";
import { Button } from "@mantine/core";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { PdfButton } from "@/components/Index";

export default function RecentInvoices({ place_booking, place_job }) {
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const hourFormat = hours % 12 || 12;

    return `${day} ${months[monthIndex]} ${year} at ${hourFormat}:${minutes
      .toString()
      .padStart(2, "0")} ${period}`;
  }

  const router = useRouter();

  const handleNavigate = (id) => {
    router.push(`/RecentInvoices/${id}`);
  };

  const renderTableRow = (row, cat) => (
    <TableRow key={row.docId}>
      <TableCell>{cat}</TableCell>
      <TableCell>{row.docId}</TableCell>
      <TableCell>{formatTimestamp(row.createdAt)}</TableCell>
      <TableCell>$ {row.totalPrice}</TableCell>
      {/* <TableCell>
        {(row.progressInformation && row.progressInformation.booked) ||
          "Not Yet"}
      </TableCell>
      <TableCell>
        {(row.progressInformation && row.progressInformation.delivered) ||
          "Pending"}
      </TableCell> */}
      <TableCell>{row?.currentStatus || "pending"}</TableCell>
      <TableCell>
        <Button
          variant="light"
          color="#F14902"
          onClick={() => handleNavigate(row.docId)}
        >
          View
        </Button>
      </TableCell>
      <TableCell>
        <PdfButton invoice={row} />
      </TableCell>
    </TableRow>
  );

  return (
    <TableContainer
      component={Paper}
      style={{ width: "80%", margin: "2rem auto" }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Job Type</TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Date & Time</TableCell>
            <TableCell>Invoice</TableCell>
            {/* <TableCell>Booked</TableCell> */}
            {/* <TableCell>Delivered</TableCell> */}
            <TableCell>Status</TableCell>
            <TableCell>View</TableCell>
            <TableCell>Download Invoice</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {place_booking &&
            place_booking.map((row) => renderTableRow(row, "Booking"))}
          {place_job && place_job.map((row) => renderTableRow(row, "Job"))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
