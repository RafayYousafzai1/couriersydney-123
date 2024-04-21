"use client";
import ItemDimensions from "@/components/ItemDimensions/index";
import React, { useEffect, useState } from "react";
import { Paper } from "@mui/material";
import { Container, Text, Image } from "@mantine/core";

const renderSection = (title, details) => (
  <Container size={"lg"}>
    <br />
    <br />
    <Text tt="uppercase" size="xl" fw={900} c={"rgba(59, 58, 58, 1)"}>
      {title || "something went wrong"}
    </Text>
    {details &&
      details.map(({ label, value }, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h4 tt="uppercase" size="lg" fw={700} style={{ color: "grey" }}>
            {label || "empty"}:
          </h4>
          <h4 tt="uppercase" size="lg" fw={500}>
            {value || "empty"}
          </h4>
        </div>
      ))}
  </Container>
);

const InvoiceDetails = ({ invoice }) => {
  const {
    distanceData,
    totalPrice,
    userName,
    time,
    service,
    userEmail,
    date,
    contact,
    docId,
    address,
    images,
  } = invoice;

  console.log(invoice);

  const [pickupAddress, setPickupAddress] = useState("Empty");
  const [dropAddress, setDropAddress] = useState("Empty");

  useEffect(() => {
    if (address && address.Origin && address.Destination) {
      setPickupAddress(address.Origin.label);
      setDropAddress(address.Destination.label);
    }
  }, [address]);

  const basicInfo = [
    { label: "User Name", value: userName },
    { label: "Time", value: time },
    { label: "Service", value: service },
    {
      label: "Total Price",
      value: (
        invoice?.totalPriceWithGST ||
        0 + invoice?.totalTollsCost ||
        0
      ).toFixed(2),
    },
    { label: "Date", value: date },
    { label: "Contact", value: contact },
    { label: "Doc ID", value: docId },
    { label: "User Email", value: userEmail },
  ];

  const addressInfo = [
    { label: "Pickup Address", value: pickupAddress },
    { label: "Pickup Reference", value: invoice?.pickupReference1 },
    { label: "Drop Address", value: dropAddress },
    // { label: "Drop Reference", value: invoice?.dropReference1 },
  ];

  const distanceInfo = [
    { label: "Distance", value: distanceData.distance.text },
    { label: "Duration", value: distanceData.duration.text },
  ];

  const pricesInfo = [
    {
      label: "Tolls",
      value: invoice?.totalTollsCost,
    },

    {
      label: "Price",
      value: invoice?.totalPrice,
    },
    {
      label: "GST",
      value: invoice?.gst.toFixed(2),
    },
    {
      label: "Price including GST",
      value: (invoice?.totalPriceWithGST || 0 + invoice.totalTollsCost).toFixed(
        2
      ),
    },
  ];

  return (
    <section>
      <h1
        style={{ marginLeft: "35vw", fontSize: "2rem", fontWeight: "bolder" }}
      >
        Booking Details
      </h1>
      <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
        {renderSection("Basic Information", basicInfo)}
        {renderSection("Address Information", addressInfo)}
        {renderSection("Distance Information", distanceInfo)}
        {renderSection("Prices Information", pricesInfo)}

        <Container size={"lg"}>
          <ItemDimensions
            defaultItems={invoice?.items}
            diseble={true}
            add={true}
          />
          <h2>POD</h2>

          {images &&
            images.map((url, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  width: "100%",
                }}
              >
                <Image
                  src={url}
                  alt={`Image ${url}`}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginRight: "0.5rem",
                  }}
                />
              </div>
            ))}
        </Container>
      </Paper>
    </section>
  );
};

export default InvoiceDetails;
