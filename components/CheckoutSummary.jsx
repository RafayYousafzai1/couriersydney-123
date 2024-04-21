"use client";

import { ActionIcon, Container, Text, Table, Button } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { AccountCircle, LocationOn, AttachMoney } from "@mui/icons-material";
import ProccesBooking from "@/api/ProccesBooking";
import Loading from "./Loading";
import { fetchDocById } from "@/api/firebase/functions/fetch";
const renderDetails = (title, details) => (
  <div>
    <Text tt="uppercase" size="lg" fw={900} c={"rgba(59, 58, 58, 1)"}>
      {title || "Something went wrong"}
    </Text>
    {details &&
      details
        .filter((detail) => detail) // Filter out null or undefined elements
        .map((detail, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Render icon if available */}
            <h5
              tt="uppercase"
              fw={700}
              style={{
                color: "grey",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActionIcon
                variant="light"
                mr={20}
                p={20}
                radius={"lg"}
                c={"red"}
              >
                {detail?.icon ? detail?.icon : null}
              </ActionIcon>{" "}
              {(detail && detail.label) || "Empty"}:
            </h5>
            <h5 tt="uppercase" fw={500} style={{ width: "15rem" }}>
              {(detail && detail.value) || "empty"}
            </h5>
          </div>
        ))}
  </div>
);

const CheckoutSummary = ({ formData, action }) => {
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState(formData);

  console.log(invoice);

  useEffect(() => {
    const proccessBooking = async () => {
      const finaleData = await ProccesBooking(invoice);
      const res = await fetchDocById("GST", "data");
      let gstVal = res.GST;
      let price = finaleData?.totalPrice;
      const gst = (parseFloat(price) * parseFloat(gstVal)) / 100;
      setInvoice({
        ...finaleData,
        totalPriceWithGST: parseFloat(price) + gst, // Corrected: Added parseFloat to ensure proper addition
        gst: gst, // Corrected: Assigned gst to the gst property
      });
      console.log(finaleData);
      setLoading(false);
    };
    proccessBooking();
  }, [formData]);

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const tableHeaderCellStyle = {
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #e0e0e0",
    padding: "10px",
    fontWeight: "bold",
  };

  if (loading === true) {
    return <Loading />;
  }

  return (
    <Container
      size={"sm"}
      style={{
        borderRadius: "1rem",
        padding: "3rem",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Example shadow style
      }}
    >
      {invoice?.requestQuote === true
        ? renderDetails("Booking Summary", [
            {
              icon: <AccountCircle />,
              label: "Service",
              value: invoice?.service,
            },
            {
              icon: <LocationOn />,
              label: "Pickup Address",
              value: invoice?.address?.Origin.label,
            },
            {
              icon: <LocationOn />,
              label: "Drop Address",
              value: invoice?.address?.Destination.label,
            },
            {
              icon: <AttachMoney />,
              label: "Request Quote",
              value: <Button>Go</Button>,
            },
          ])
        : renderDetails("Booking Summary", [
            {
              icon: <AccountCircle />,
              label: "Service",
              value: invoice?.service,
            },
            {
              icon: <LocationOn />,
              label: "Pickup Address",
              value: invoice?.address?.Origin.label,
            },
            {
              icon: <LocationOn />,
              label: "Drop Address",
              value: invoice?.address?.Destination.label,
            },
            invoice && invoice.totalTolls > 0
              ? {
                  icon: <AttachMoney />,
                  label: "Tolls",
                  value: invoice.totalTollsCost.toFixed(2),
                }
              : null,
            {
              icon: <AttachMoney />,
              label: "Price",
              value: invoice?.totalPrice,
            },
            {
              icon: <AttachMoney />,
              label: "GST",
              value: invoice?.gst.toFixed(2),
            },
            {
              icon: <AttachMoney />,
              label: "Price including GST",
              value: (
                invoice?.totalPriceWithGST + invoice.totalTollsCost
              ).toFixed(2),
            },
          ])}

      <Table style={tableStyle}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={tableHeaderCellStyle}>Item</Table.Th>
            <Table.Th style={tableHeaderCellStyle}>Weight</Table.Th>
            <Table.Th style={tableHeaderCellStyle}>Dimensions</Table.Th>
            <Table.Th style={tableHeaderCellStyle}>Type</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {invoice?.items?.map((item, index) => (
            <Table.Tr key={index}>
              <Table.Td>{`Item ${index + 1}`}</Table.Td>
              <Table.Td>{item.weight}</Table.Td>
              <Table.Td>
                Dimensions: {item.length} x {item.width} x {item.height} cm
              </Table.Td>
              <Table.Td>{item.type}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <br />
      <br />
      <br />
      <Button
        fullWidth
        variant="filled"
        color="green"
        mt={2}
        onClick={() => action("checkout")}
        marginTop="lg"
        style={{ borderRadius: "8px" }}
      >
        Confirm Booking
      </Button>
      <Button
        fullWidth
        variant="filled"
        color="red"
        mt={2}
        marginTop="lg"
        style={{ borderRadius: "8px" }}
        onClick={() => action("")}
      >
        Back
      </Button>
    </Container>
  );
};

export default CheckoutSummary;
