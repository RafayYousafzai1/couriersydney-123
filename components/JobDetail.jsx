import React from "react";
import { Typography, Paper } from "@mui/material";
import { Divider, Text } from "@mantine/core";

const renderDetails = (title, details) => (
  <div>
    <Divider />
    <Text tt="uppercase" size="xl" fw={900} c={"rgba(59, 58, 58, 1)"}>
      {title || "some thing went wrong"}
    </Text>
    {details &&
      details.map((detail, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h4 tt="uppercase" fw={700} style={{ color: "grey" }}>
            {(detail && detail.label) || "empty"}:
          </h4>
          <h4 tt="uppercase" fw={500}>
            {(detail && detail.value) || "empty"}
          </h4>
        </div>
      ))}
  </div>
);

function getFormattedDateJob(dateStr) {
  const [month, day, year] = dateStr.split("/");
  const formattedDate = new Date(`${month}/${day}/${year}`);

  if (isNaN(formattedDate)) {
    console.error(`Invalid date: ${dateStr}`);
    return null;
  }

  const dayOfMonth = formattedDate.getDate();
  const monthName = new Intl.DateTimeFormat("en", {
    month: "short",
  }).format(formattedDate);
  const yearDigits = formattedDate.getFullYear();

  return `${dayOfMonth}-${monthName.toUpperCase()}-${yearDigits}`;
}

const InvoiceDetails = (invoice, job) => {
  return (
    <section
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: "40rem",
          padding: 20,
          margin: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "70%",
        }}
      >
        <Text tt="uppercase" size="xl" fw={900} c={"rgba(59, 58, 58, 1)"}>
          Invoice Details
        </Text>
        <div style={{ width: "80%" }}>
          <>
            {renderDetails("Account", [
              { label: "Email", value: invoice.userEmail },
              { label: "Account", value: invoice.userName },
              { label: "Job Number", value: invoice.docId },
            ])}

            {renderDetails("Service Information", [
              { label: "Service", value: invoice.service },
              { label: "Piece", value: invoice.pieces },
              { label: "Weight", value: invoice.weight },
              { label: "Cost", value: `$ ${invoice.totalPrice}` },
              {
                label: "Date Created",
                value: getFormattedDateJob(invoice.date),
              },
              // { label: "Time Created", value: invoice.time },
            ])}

            {renderDetails(
              "Progress Information",
              invoice.progressInformation && [
                {
                  label: "Booked",
                  value: invoice.progressInformation.booked || "Pending",
                },
                {
                  label: "E.T.D.",
                  value: invoice.progressInformation.etd || "Pending",
                },
                {
                  label: "Allocated",
                  value: invoice.progressInformation.allocated || "Pending",
                },
                {
                  label: "Pick Up",
                  value: invoice.progressInformation.pickedup || "Pending",
                },
                {
                  label: "Delivered",
                  value: invoice.progressInformation.delivered || "Pending",
                },
                {
                  label: "P.O.D.",
                  value: invoice.progressInformation.pod || "Pending",
                },
              ]
            )}
            {renderDetails("Pickup Details", [
              { label: "Suburb", value: invoice.pickupSuburb },
              {
                label: "Address",
                value: invoice.pickupDetails.label,
              },
              {
                label: "Delivered",
                value: invoice.progressInformation.delivered || "Pending",
              },
            ])}

            {renderDetails("Drop Details", [
              { label: "Suburb", value: invoice.dropSuburb },
              {
                label: "Address",
                value: invoice.dropDetails.label,
              },
              {
                label: "Delivered",
                value: invoice.progressInformation.delivered || "Pending",
              },
            ])}
          </>
        </div>
      </div>
    </section>
  );
};

export default InvoiceDetails;
