"use client";

import CheckoutSessions from "@/api/CheckoutSessions";
import {
  Email,
  AccountCircle,
  Today,
  AccessTime,
  LocationOn,
  AttachMoney,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Text, Button, Table, Container, ActionIcon } from "@mantine/core";

import {
  addFrequentAddress,
  postInvoice,
  updateDoc,
} from "@/api/firebase/functions/upload";
import { useRouter } from "next/navigation";
import Loading from "./Loading";
import ProccesBooking from "@/api/ProccesBooking";
import { fetchDocById } from "@/api/firebase/functions/fetch";
import "@mantine/dates/styles.css";
import sendBookingEmail from "@/api/sendBookingEmail";

export default function BookCheckout({ formData, cat, action, back, payment }) {
  const nav = useRouter();

  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState(formData);
  // console.log(invoice);

  useEffect(() => {
    const proccessBooking = async () => {
      const finaleData = await ProccesBooking(formData);
      const res = await fetchDocById("GST", "data");
      let gstVal = res.GST;
      let price = finaleData?.totalPrice;
      const gst = (parseFloat(price) * parseFloat(gstVal)) / 100;
      setInvoice({
        ...finaleData,
        totalPriceWithGST: parseFloat(price) + gst, // Corrected: Added parseFloat to ensure proper addition
        gst: gst, // Corrected: Assigned gst to the gst property
      });
      setLoading(false);
    };
    proccessBooking();
  }, []);

  // Function to handle form submission
  const handleSubmit = async () => {
    if (invoice) {
      if (payment === true) {
        const res = await postInvoice(
          { ...invoice, payment: "pending" },
          "stripe"
        );
        const stripe = await CheckoutSessions(
          (invoice?.totalPriceWithGST + invoice.totalTollsCost).toFixed(2),
          res
        );
        updateDoc("stripe", res.docRefId, {
          ...invoice,
          payment: "pending",
          stripeSessionId: stripe.sessionId,
        });
        nav.push(stripe.url);
      } else {
        const res = await postInvoice(invoice, "place_bookings");
        sendBookingEmail(invoice, res, res.name);
        await Promise.all([
          addFrequentAddress(invoice?.address?.Origin),
          addFrequentAddress(invoice?.address?.Destination),
        ]);
        nav.push(`/RecentInvoices/${res}`);
      }
    }
  };

  if (loading === true) {
    return <Loading />;
  }

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

  return (
    <Container
      size={"sm"}
      style={{
        borderRadius: "1rem",
        padding: "3rem",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Example shadow style
      }}
    >
      {renderDetails("Booking Informations", [
        { icon: <Email />, label: "Contact", value: invoice?.contact },
        { icon: <AccountCircle />, label: "Email", value: invoice?.email },
        { icon: <AccessTime />, label: "Service", value: invoice?.service },
        { icon: <Today />, label: "Date", value: invoice?.date },
        { icon: <AccessTime />, label: "Time", value: invoice?.time },
      ])}
      {renderDetails("Pickup and Drop-off Information", [
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
          icon: <AccessTime />,
          label: "reference",
          value: invoice?.pickupReference1,
        },
      ])}

      {invoice.requestQuote
        ? renderDetails("Prices", [
            {
              icon: <AttachMoney />,
              label: "Request Quote",
              value: <Button>Go</Button>,
            },
          ])
        : renderDetails("Prices", [
            invoice && invoice.totalTolls > 0
              ? {
                  icon: <AttachMoney />,
                  label: "Tolls",
                  value: invoice.totalTollsCost.toFixed(2),
                }
              : null,
            {
              icon: <AttachMoney />,
              label: "GST",
              value: invoice?.gst.toFixed(2),
            },
            {
              icon: <AttachMoney />,
              label: "Price",
              value: invoice?.totalPrice,
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
        onClick={handleSubmit}
        marginTop="lg"
        style={{ borderRadius: "8px" }}
      >
        Confirm Booking
      </Button>
      {back ? (
        <Button
          fullWidth
          variant="filled"
          color="red"
          mt={2}
          marginTop="lg"
          style={{ borderRadius: "8px" }}
          onClick={() => action("summary")}
        >
          Back
        </Button>
      ) : null}
    </Container>
  );
}
