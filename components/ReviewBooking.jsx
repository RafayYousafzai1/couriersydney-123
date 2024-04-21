"use client";

import React, { useEffect, useState } from "react";
import { MenuItem, TextField } from "@mui/material";
import { Button, Container } from "@mantine/core";
import Link from "next/link";

import { PlacesAutocomplete, BookCheckout } from "@/components/Index";
import { serviceOptions } from "@/components/static";
import { fetchFrequentAddresses } from "@/api/firebase/functions/fetch";

import DateTimePickers from "@/components/DateTimePickers";
import ItemDimensions from "@/components/ItemDimensions";
// import { CompressOutlined } from "@mui/icons-material";

export default function ReviewBooking({
  form,
  edit,
  action,
  diseble,
  payment,
  noEmail,
}) {
  const [user, setUser] = useState([]);
  // const [edit, setEdit] = useState(edit)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchFrequentAddresses();
        setFrequentAddresses(data);
        const user = JSON.parse(localStorage.getItem("userDoc")) || {} || null;
        setUser(user);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
    fetchData();
  }, []);
  // -------------------------------State
  const initialFormData = {
    contact: "",
    email: "",
    service: "",
    date: null,
    time: null,
    dropReference1: "",
    pickupReference1: "",
    items: [],
    distanceData: {},
    address: {
      Origin: {},
      Destination: {},
    },
  };
  const [formData, setFormData] = useState(form || initialFormData);
  console.log(formData);
  const [frequentAddresses, setFrequentAddresses] = useState([]);
  const [showFrequentOrigins, setShowFrequentOrigins] = useState(true);
  const [showFrequentDestinations, setShowFrequentDestinations] =
    useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
    setFormData({
      ...formData,
      address: {
        Origin: {},
        Destination: {},
      },
    });
    setShowFrequentOrigins(true), setShowFrequentDestinations(true);
  };

  // -----------------------------State Handlers
  const handleCheckOut = () => {
    if (formData.items.length >= 1) {
      setShowCheckout(true);
    } else {
      alert("Please Add Items");
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const styleField = {
    maxWidth: "20rem",
    margin: ".8rem 0",
  };

  return (
    <>
      {showCheckout ? (
        <BookCheckout
          formData={formData}
          cat={"place_bookings"}
          job={true}
          payment={payment}
        />
      ) : (
        <Container
          size={"md"}
          style={{
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              flexWrap: "wrap",
              height: "maxContent",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }} s>
              <h3>Job Information</h3>
              <p>
                Account: {user?.firstName} {user?.lastName}
              </p>
              <TextField
                fullWidth
                style={styleField}
                name="contact"
                label="Contact"
                variant="outlined"
                helperText="Enter contact information"
                size="small"
                value={formData.contact}
                onChange={handleChange}
              />
              {!noEmail ? (
                <TextField
                  fullWidth
                  style={styleField}
                  name="email"
                  label="Email"
                  variant="outlined"
                  helperText="Enter email"
                  size="small"
                  value={formData.email}
                  onChange={handleChange}
                />
              ) : null}
            </div>

            <div style={{ display: "flex", flexDirection: "column" }} s>
              <h3>Service Information</h3>
              <TextField
                fullWidth
                style={styleField}
                name="service"
                select
                size="small"
                label="Level of Service"
                helperText="Please select any level of service"
                variant="outlined"
                value={formData.service}
                onChange={handleChange}
                disabled={diseble ? true : false}
              >
                {serviceOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <p style={{ width: "auto" }}>
                      {option.value}
                      <span
                        style={{
                          fontSize: ".8rem",
                          color: "gray",
                          marginLeft: "1.2rem",
                        }}
                      >
                        {option.disc}
                      </span>
                    </p>
                  </MenuItem>
                ))}
              </TextField>
              <DateTimePickers
                handleDateTimeChange={(e) =>
                  setFormData({
                    ...formData,
                    date: e.date,
                    time: e.time,
                  })
                }
              />
              <br />
              <ItemDimensions
                handleItems={(items) =>
                  setFormData({ ...formData, items: items })
                }
                defaultItems={formData?.items}
                diseble={diseble}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              flexWrap: "wrap",
              height: "maxContent",
              overflow: "hidden",
            }}
            key={refreshKey}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h3>Pickup Details</h3>

              {edit ? (
                <TextField
                  fullWidth
                  style={styleField}
                  name="pickupFrequentAddress"
                  select
                  size="small"
                  label="Frequent Address"
                  helperText="Select address or enter address below"
                  variant="outlined"
                  value={
                    formData.address.Origin ? formData.address.Origin.label : ""
                  }
                  onChange={(event) => {
                    const selectedValue = event.target.value;
                    const selectedOption = frequentAddresses.find(
                      (option) => option.label === selectedValue
                    );
                    setFormData({
                      ...formData,
                      address: {
                        ...formData.address,
                        Origin: selectedOption,
                      },
                    });
                    setShowFrequentOrigins(false);
                  }}
                >
                  {frequentAddresses &&
                    frequentAddresses.map((option, index) => (
                      <MenuItem key={index} value={option.label}>
                        {option.label}
                      </MenuItem>
                    ))}
                </TextField>
              ) : null}

              {edit && showFrequentOrigins ? (
                <PlacesAutocomplete
                  onLocationSelect={(loc) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, Origin: loc },
                    })
                  }
                  pickup={true}
                />
              ) : (
                <TextField
                  fullWidth
                  style={styleField}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: {
                        ...formData.address,
                        Origin: e.target.value,
                      },
                    })
                  }
                  size="small"
                  multiline
                  maxRows={4}
                  value={formData.address.Origin.label}
                />
              )}

              <TextField
                fullWidth
                style={styleField}
                name="pickupReference1"
                label="Reference"
                size="small"
                multiline
                maxRows={4}
                helperText="Enter the reference code"
                value={formData.pickupReference1}
                onChange={handleChange}
              />
            </div>

            <div
              key={refreshKey}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <h3>Drop Details</h3>
              {edit ? (
                <TextField
                  fullWidth
                  style={styleField}
                  name="dropFrequentAddress"
                  select
                  size="small"
                  label="Frequent Address"
                  helperText="Select address or enter address below"
                  variant="outlined"
                  value={
                    formData.address.Destination
                      ? formData.address.Destination.label
                      : ""
                  }
                  onChange={(event) => {
                    const selectedValue = event.target.value;
                    const selectedOption = frequentAddresses.find(
                      (option) => option.label === selectedValue
                    );
                    setFormData({
                      ...formData,
                      address: {
                        ...formData.address,
                        Destination: selectedOption,
                      },
                    });
                    setShowFrequentDestinations(false);
                  }}
                >
                  {frequentAddresses &&
                    frequentAddresses.map((option, index) => (
                      <MenuItem key={index} value={option.label}>
                        {option.label}
                      </MenuItem>
                    ))}
                </TextField>
              ) : null}

              {edit && showFrequentDestinations ? (
                <PlacesAutocomplete
                  onLocationSelect={(loc) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, Destination: loc },
                    })
                  }
                />
              ) : (
                <TextField
                  fullWidth
                  style={styleField}
                  size="small"
                  multiline
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: {
                        ...formData.address,
                        Destination: e.target.value,
                      },
                    })
                  }
                  maxRows={4}
                  value={formData.address.Destination.label}
                />
              )}
            </div>
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Button
              variant="filled"
              mt={10}
              color="#F14902"
              size="md"
              w={230}
              onClick={handleCheckOut}
            >
              Book Job
            </Button>

            <Link href="/ClientServices" style={{ textDecoration: "none" }}>
              <Button
                w={230}
                variant="filled"
                mt={10}
                color="#F14902"
                size="md"
              >
                Client Services
              </Button>
            </Link>
            {action ? null : (
              <Button
                color="lime"
                w={230}
                mt={10}
                variant="filled"
                size="md"
                onClick={handleRefresh}
              >
                Clear Address
              </Button>
            )}
            {action ? (
              <Button
                w={230}
                variant="filled"
                mt={10}
                color="#F14902"
                size="md"
                onClick={() => action("summary")}
              >
                Back
              </Button>
            ) : null}
          </div>
        </Container>
      )}
    </>
  );
}
