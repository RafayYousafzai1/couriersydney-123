"use client";

import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mantine/core";
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

  const columns = [
    { field: "returnType", headerName: "Job Type", width: 130 },
    { field: "docId", headerName: "Job Number", width: 130 },
    {
      field: "createdAt",
      headerName: "Date & Time",
      width: 200,
      valueGetter: (value, row) =>
        row?.createdAt
          ? new Date(
              row?.createdAt?.seconds * 1000 +
                row.createdAt.nanoseconds / 1000000
            ).toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : "dsa",
    },
    {
      field: "totalPriceWithGST",
      headerName: "Price",
      width: 130,
      valueGetter: (value) => value.toFixed(2),
    },
    { field: "service", headerName: "Invoice", width: 130 },
    { field: "currentStatus", headerName: "Service", width: 130 },
    {
      field: "actions",
      headerName: "Action",
      width: 300,
      renderCell: (params) => (
        <>
          <Button
            variant="light"
            color="blue"
            radius="md"
            size="xs"
            style={{ margin: 5 }}
            onClick={() => handleEdit(params.row.docId)}
          >
            Edit
          </Button>
          <Button
            variant="light"
            color="dark"
            radius="md"
            size="xs"
            style={{ margin: 5 }}
            onClick={() =>
              router.push(`/admin/Invoices/${params.row.docId}/pod`)
            }
          >
            POD
          </Button>
          <Button
            variant="light"
            style={{ margin: 5 }}
            color="red"
            radius="md"
            size="xs"
            onClick={async () => {
              await deleteDocument("place_bookings", params.row.docId);
              window.location.reload();
            }}
          >
            Delete
          </Button>
          <PdfButton size="xs" invoice={params.row} />
        </>
      ),
    },
  ];

  // Add unique identifiers to each row if not already present
  const rowsWithIds = invoice.map((row, index) => ({ ...row, id: index + 1 }));

  return (
    <div style={{ height: 500, width: "100%", marginLeft: 50 }}>
      <DataGrid rows={rowsWithIds} columns={columns} pageSize={10} />
    </div>
  );
}
