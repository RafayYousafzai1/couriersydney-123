"use client";
import { useState } from "react";
import Loading from "./Loading";
import { useRouter } from "next/navigation";
import { Container, Typography, Grid, Card, CardContent } from "@mui/material";
import { Paper, Text, Button, Table } from "@mantine/core";
import { calculatePrice } from "@/api/priceCalculator";
import { calculateDistance } from "@/api/distanceCalculator";

export default function BookCheckout({ formData }) {
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState([]);
  const router = useRouter();

  // Function to truncate long strings
  const truncateString = (str, num = 20) =>
    str.length > num ? str.slice(0, num) + "..." : str;

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      const distance = await calculateDistance(
        formData.address.Origin.coordinates,
        formData.address.Destination.coordinates
      );
      const distanceData = distance?.rows[0]?.elements[0];
      const invoiceData = await calculatePrice({
        ...formData,
        distanceData: distanceData,
      });
      // setInvoice(invoiceData);
      console.log(invoiceData);
      // setLoading(true);
    } catch (distanceError) {
      console.error("Error calculating distance:", distanceError);
      return;
    }
  };

  if (loading === true) {
    return <Loading />;
  }

  const cardStyle = {
    border: "1px solid #e0e0e0",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    marginBottom: "20px",
  };

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

  return (
    <Container>
      <Typography variant="h4" gutterBottom style={{ marginBottom: "20px" }}>
        Booking Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card style={cardStyle}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <Typography variant="body1" gutterBottom>
                Contact: {formData?.contact}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Service: {formData?.service}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card style={cardStyle}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Item Details
              </Typography>

              <Table style={tableStyle}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th style={tableHeaderCellStyle}>Item</Table.Th>
                    <Table.Th style={tableHeaderCellStyle}>Weight</Table.Th>
                    <Table.Th style={tableHeaderCellStyle}>Dimensions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {formData?.items.map((item, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>{`Item ${index + 1}`}</Table.Td>
                      <Table.Td>{item.weight}</Table.Td>
                      <Table.Td>
                        Dimensions: {item.length} x {item.width} x {item.height}{" "}
                        cm
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card style={cardStyle}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pickup and Drop-off Information
              </Typography>
              <Typography variant="body1" gutterBottom>
                Pickup Address: {formData?.address?.Origin.label}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Drop-off Address: {formData?.address?.Destination.label}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Paper padding="md" marginTop="lg" style={{ marginBottom: "20px" }}>
        <Text align="center">
          Goods Description: {formData?.goodsDescription}
        </Text>
      </Paper>
      <Button
        fullWidth
        variant="outline"
        color="blue"
        onClick={handleSubmit}
        marginTop="lg"
        style={{ borderRadius: "8px" }}
      >
        Confirm Booking
      </Button>
    </Container>
  );
}
