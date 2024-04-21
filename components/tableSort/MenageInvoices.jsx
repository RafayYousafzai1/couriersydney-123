"use client";
import { Button } from "@mantine/core";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useRouter } from "next/navigation";
import PdfButton from "../PdfButton";
import { deleteDocument } from "@/api/firebase/functions/upload";

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

export default function MenageInvoices({ invoice, title }) {
  console.log(invoice);

  const router = useRouter();
  const handleEdit = (id) => {
    router.push(`/admin/Invoices/${id}`);
  };

  const renderTableRow = (row) => (
    <TableRow key={row.docId}>
      <TableCell>{row?.returnType || "0"}</TableCell>
      <TableCell>{row.docId}</TableCell>
      <TableCell>
        {row?.createdAt
          ? new Date(
              row.createdAt.seconds * 1000 + row.createdAt.nanoseconds / 1000000
            ).toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : ""}
      </TableCell>

      <TableCell>{row?.userName}</TableCell>
      <TableCell>${row?.totalPriceWithGST?.toFixed(2)}</TableCell>
      <TableCell>{row.service}</TableCell>
      <TableCell>{row?.currentStatus || "Pending"}</TableCell>
      <TableCell>{row?.progressInformation?.booked || "Pending"}</TableCell>
      {/* <TableCell>{row?.progressInformation?.delivered || "Pending"}</TableCell> */}
      {/* <TableCell style={{ textTransform: "capitalize" }}>
        ${row?.totalPrice}
      </TableCell> */}
      {/* <TableCell>{row?.serviceInformation?.service || row.service}</TableCell> */}

      <TableCell>
        <Button
          variant="light"
          color="blue"
          radius="md" // Set the radius to medium for rounded corners
          size="xs" // Set the size to medium for consistent height and padding
          style={{ margin: 5 }} // Set custom margin-right
          onClick={() => handleEdit(row.docId)}
        >
          Edit
        </Button>
        <Button
          variant="light"
          color="dark"
          radius="md" // Set the radius to medium for rounded corners
          size="xs" // Set the size to medium for consistent height and padding
          style={{ margin: 5 }} // Set custom margin-right
          onClick={() => router.push(`/admin/Invoices/${row.docId}/pod`)}
        >
          POD
        </Button>
        <Button
          variant="light"
          style={{ margin: 5 }} // Set custom margin-right
          color="red"
          radius="md" // Set the radius to medium for rounded corners
          size="xs" // Set the size to medium for consistent height and padding
          onClick={async () => {
            await deleteDocument("place_bookings", row.docId);
            window.location.reload();
          }}
        >
          Delete
        </Button>
        {/* <br /> */}
        <PdfButton size="xs" invoice={row} />
      </TableCell>
    </TableRow>
  );

  return (
    <TableContainer
      component={Paper}
      style={{ width: "80%", margin: "2rem auto" }}
    >
      <h1>Manage {title}</h1>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Job Type</TableCell>
            <TableCell>Job Number</TableCell>
            <TableCell>Date & Time</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Invoice</TableCell>
            <TableCell>Service</TableCell>
            <TableCell>Current Status</TableCell>
            {/* <TableCell>Time</TableCell> */}
            {/* <TableCell>Total Price</TableCell> */}
            <TableCell>Booked</TableCell>
            {/* <TableCell>Delivered</TableCell> */}
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{invoice && invoice.map(renderTableRow)}</TableBody>
      </Table>
    </TableContainer>
  );
}
