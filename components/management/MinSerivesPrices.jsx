"use client";
import React, { useEffect, useState } from "react";
import { TextField, Button, Grid, Paper, Typography } from "@mui/material";
import { updateDoc } from "@/api/firebase/functions/upload";
import { fetchDocById } from "@/api/firebase/functions/fetch";

const MinPricesEditor = () => {
  const [prices, setPrices] = useState({});
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const getPrices = async () => {
      try {
        // Assuming fetchOptions returns something related to suburbs
        const res = await fetchDocById("MinServicesPrices", "data");
        setPrices(res);
      } catch (error) {
        console.error("Error fetching suburbs:", error);
      }
    };

    getPrices();
  }, []);

  const handlePriceChange = (key) => (event) => {
    const newPrices = { ...prices, [key]: event.target.value };
    setPrices(newPrices);
  };

  const handleSave = () => {
    console.log("Updated Prices:", prices);
    updateDoc("data", "MinServicesPrices", prices);

    setEdit(false);
  };

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12} md={6}>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Typography variant="h5" gutterBottom>
            Minimum Prices Editor
          </Typography>

          {prices &&
            Object.keys(prices).map((key) => (
              <TextField
                key={key}
                fullWidth
                label={key}
                variant="outlined"
                margin="normal"
                value={prices[key]}
                onChange={handlePriceChange(key)}
                disabled={!edit}
              />
            ))}

          {edit ? (
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setEdit(true)}
            >
              Edit
            </Button>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default MinPricesEditor;
