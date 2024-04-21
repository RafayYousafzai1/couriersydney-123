"use client";

import { useEffect, useState } from "react";
import { MenuItem, TextField } from "@mui/material";
import { Button } from "@mantine/core";
import { serviceOptions } from "@/components/static";
import { PlacesAutocomplete, CAP } from "@/components/Index";
import { fetchFrequentAddresses } from "@/api/firebase/functions/fetch";
import ItemDimensions from "@/components/ItemDimensions";
import ReviewBooking from "@/components/ReviewBooking";
import CheckoutSummary from "@/components/CheckoutSummary";

export default function Page() {
  const initialFormData = {
    contact: "",
    service: "",
    date: null,
    time: null,
    pieces: "",
    dropReference1: "",
    items: [],
    distanceData: {},
    address: {
      Origin: {},
      Destination: {},
    },
  };

  const [formData, setFormData] = useState(initialFormData);
  const [show, setShow] = useState("");
  const [frequentAddresses, setFrequentAddresses] = useState([]);
  const [showFrequentOrigins, setShowFrequentOrigins] = useState(true);
  const [showFrequentDestinations, setShowFrequentDestinations] =
    useState(true);
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
  console.log(frequentAddresses, formData);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchFrequentAddresses();
        setFrequentAddresses(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const styleField = {
    width: "100%",
    margin: ".8rem 0",
    minWidth: "10rem",
  };

  const [user, setUser] = useState(null);
  useEffect(() => {
    const role = JSON.parse(localStorage.getItem("userDoc")) || {} || null;
    setUser(role);
  }, []);

  if (user && user.role === null) {
    return <CAP status={"notLoggedIn"} />;
  }

  if (show === "checkout") {
    return (
      <ReviewBooking
        form={formData}
        cat={"place_job"}
        edit={false}
        action={(e) => {
          setShow(e);
        }}
        back={true}
        diseble={true}
      />
    );
  } else if (show === "summary") {
    if (formData.items.length >= 1) {
      return (
        <CheckoutSummary
          formData={formData}
          action={(e) => {
            setShow(e);
          }}
        />
      );
    } else {
      alert("Please Add Items");
    }
  }
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "25rem",
          margin: "auto",
        }}
      >
        <h1>PRICE A JOB</h1>
        <div style={styleField} key={refreshKey}>
          <TextField
            style={styleField}
            name="pickupFrequentAddress"
            select
            size="small"
            label="Frequent Address"
            helperText="Select address or enter address below"
            variant="outlined"
            value={formData?.address?.Origin?.label}
            onChange={(event) => {
              const selectedValue = event.target.value;
              const selectedOption = frequentAddresses.find(
                (option) => option.label === selectedValue
              );
              setFormData({
                ...formData,
                address: { ...formData.address, Origin: selectedOption },
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

          {showFrequentOrigins === true ? (
            <PlacesAutocomplete
              onLocationSelect={(loc) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, Origin: loc },
                })
              }
              pickup={true}
              width={true}
            />
          ) : null}
          <TextField
            style={styleField}
            name="dropFrequentAddress"
            select
            size="small"
            label="Frequent Address"
            helperText="Select address or enter address below"
            variant="outlined"
            value={formData?.address?.Destination?.label}
            onChange={(event) => {
              const selectedValue = event.target.value;
              const selectedOption = frequentAddresses.find(
                (option) => option.label === selectedValue
              );
              setFormData({
                ...formData,
                address: { ...formData.address, Destination: selectedOption },
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
          {showFrequentDestinations === true ? (
            <PlacesAutocomplete
              onLocationSelect={(loc) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, Destination: loc },
                })
              }
              width={true}
            />
          ) : null}
        </div>

        <TextField
          size="small"
          label="Level of Service"
          helperText="Please select any level of service"
          style={styleField}
          name="service"
          select
          value={formData.service}
          onChange={handleChange}
          variant="outlined"
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

        <ItemDimensions
          handleItems={(items) => setFormData({ ...formData, items: items })}
          defaultItems={formData?.items}
        />
        <Button
          w={180}
          color="#F14902"
          mt={3}
          variant="filled"
          onClick={() => {
            setShow("summary");
          }}
        >
          Price A Job
        </Button>
        <Button w={180} color="#F14902" mt={3} variant="filled">
          Client Service
        </Button>
        <Button
          w={180}
          color="lime"
          mt={3}
          variant="filled"
          onClick={handleRefresh}
        >
          Clear Address
        </Button>
      </div>
    </>
  );
}
