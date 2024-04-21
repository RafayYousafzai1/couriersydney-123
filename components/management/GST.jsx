"use client";

import React, { useEffect, useState } from "react";
import { TextField, Button, Grid, Paper, Typography } from "@mui/material";
import { updateDoc } from "@/api/firebase/functions/upload";
import { fetchDocById } from "@/api/firebase/functions/fetch";

const GST = () => {
  const [gstPercentage, setGstPercentage] = useState(0);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const getGST = async () => {
      try {
        const res = await fetchDocById("GST", "data");
        console.log(res);
        setGstPercentage(parseFloat(res?.GST || 12)); // Parse the fetched GST value to float
      } catch (error) {
        console.error("Error fetching GST:", error);
      }
    };

    getGST();
  }, []);

  const handleGSTChange = (event) => {
    setGstPercentage(parseFloat(event.target.value));
  };

  const handleSave = () => {
    updateDoc("data", "GST", { GST: gstPercentage }); // Store as numeric value
    setEdit(false);
  };

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12} md={6}>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Typography variant="h5" gutterBottom>
            GST Editor
          </Typography>

          <TextField
            fullWidth
            type="number"
            variant="outlined"
            margin="normal"
            value={gstPercentage || ""}
            onChange={handleGSTChange}
            disabled={!edit}
            label="GST Percentage"
            helperText="Enter the GST percentage"
          />

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

export default GST;
