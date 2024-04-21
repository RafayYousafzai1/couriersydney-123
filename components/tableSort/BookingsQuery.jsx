import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Button } from "@mantine/core";
import Link from "next/link";

const formatTimestamp = (timestamp) => {
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
};

const BookingTable = ({ bookings }) => {
  return (
    <TableContainer component={Paper} className="table-container">
      <Table className="booking-table">
        <TableHead>
          <TableRow>
            <TableCell>Job No</TableCell>
            <TableCell>Date & Time</TableCell>
            <TableCell>Ref1</TableCell>
            <TableCell>From</TableCell>
            <TableCell>To</TableCell>
            <TableCell>Service</TableCell>
            <TableCell>Current Status</TableCell>
            <TableCell>Cost</TableCell>
            <TableCell>Booked</TableCell>
            <TableCell>Delivered</TableCell>
            <TableCell>Items</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.docId}>
              <TableCell>{booking.docId}</TableCell>
              <TableCell>{formatTimestamp(booking.createdAt)}</TableCell>
              <TableCell>{booking.pickupReference1}</TableCell>
              <TableCell>{booking.address.Origin.label}</TableCell>
              <TableCell>{booking.address.Destination.label}</TableCell>
              <TableCell>{booking.service}</TableCell>
              <TableCell>{booking?.currentStatus || "Pending"}</TableCell>
              <TableCell>${booking.totalPrice}</TableCell>
              <TableCell>
                {booking?.progressInformation?.booked || "- - -"}
              </TableCell>
              <TableCell>
                {booking?.progressInformation?.delivered || "- - -"}
              </TableCell>
              <TableCell>
                <ul>
                  {booking.items.map((item, index) => (
                    <li key={index}>
                      Height: {item.height}, Width: {item.width}, Length:{" "}
                      {item.length}, Weight: {item.weight}
                    </li>
                  ))}
                </ul>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const BookingsQuery = ({ bookings }) => {
  return (
    <section
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <h2>Track Booking</h2>
      <BookingTable bookings={bookings} />
      <Link style={{ textDecoration: "none" }} href="/ClientServices">
        <Button variant="filled" color="#F14902" size="lg">
          Client Services
        </Button>
      </Link>
    </section>
  );
};

export default BookingsQuery;
