"use client";

import React, { useState, useEffect } from "react";
import { fetchDocById } from "@/api/firebase/functions/fetch";
import { updateDoc } from "@/api/firebase/functions/upload";
import {
  Button,
  List,
  ListItem,
  Typography,
  TextField,
  Grid,
  Paper,
} from "@mui/material";

export default function PerKmRates() {
  const [edit, setEdit] = useState(false);
  const [rates, setRates] = useState({});

  useEffect(() => {
    const perKmRates = async () => {
      try {
        const res = await fetchDocById("perKmRates", "data");
        setRates(res);
        console.log(res);
      } catch (error) {
        console.error("Error fetching suburbs:", error);
      }
    };

    perKmRates();
  }, []);

  const handleRateChange = (key, value) => {
    setRates((prevRates) => ({
      ...prevRates,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      updateDoc("data", "perKmRates", rates);
      setEdit(false);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12} md={6}>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Typography variant="h5" gutterBottom>
            Services Price
          </Typography>
          <List>
            {Object.entries(rates).map(([key, value]) => (
              <ListItem key={key}>
                <TextField
                  type="number"
                  disabled={!edit}
                  value={value}
                  fullWidth
                  margin="normal"
                  label={key}
                  onChange={(e) => handleRateChange(key, e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <Typography variant="body1" sx={{ mr: 1 }}>
                        $
                      </Typography>
                    ),
                  }}
                />
              </ListItem>
            ))}
          </List>

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
}
