"use client";

import { useState, useEffect } from "react";
import { fetchOptions } from "@/api/firebase/functions/fetch";
import {
  List,
  ListItem,
  Typography,
  TextField,
  Grid,
  Paper,
} from "@mui/material";
import { updateDoc } from "@/api/firebase/functions/upload";
import { Button } from "@mantine/core";

export default function Suburbs() {
  const [suburbs, setSuburbs] = useState([]);
  const [newSuburb, setNewSuburb] = useState("");

  useEffect(() => {
    const getSuburbs = async () => {
      try {
        const res = await fetchOptions();
        setSuburbs(res?.suburb || []);
      } catch (error) {
        console.error("Error fetching suburbs:", error);
      }
    };

    getSuburbs();
  }, []);

  const handleAddSuburb = () => {
    if (newSuburb.trim() !== "") {
      const updatedSuburbs = [...suburbs, newSuburb.trim()];
      setSuburbs(updatedSuburbs);
      saveInDb(updatedSuburbs);
      setNewSuburb("");
    }
  };

  const handleRemoveSuburb = (index) => {
    const updatedSuburbs = [...suburbs];
    updatedSuburbs.splice(index, 1);
    setSuburbs(updatedSuburbs);
    saveInDb(updatedSuburbs);
  };

  const saveInDb = (updatedSuburbs) => {
    updateDoc("data", "options", { suburb: updatedSuburbs });
    console.log("data", "options", { suburb: updatedSuburbs });
  };

  return (
    <>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: "20px" }}>
            <h1>Suburbs</h1>
            <List style={{ marginTop: 16 }}>
              {suburbs &&
                suburbs.map((suburb, index) => (
                  <ListItem
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography>{suburb}</Typography>
                    <Button
                      variant="filled"
                      color="#F14902"
                      onClick={() => handleRemoveSuburb(index)}
                    >
                      Remove
                    </Button>
                  </ListItem>
                ))}
            </List>
            <div
              style={{ display: "flex", alignItems: "center", marginTop: 16 }}
            >
              <TextField
                label="Add Suburb"
                variant="outlined"
                fullWidth
                value={newSuburb}
                onChange={(e) => setNewSuburb(e.target.value)}
                style={{ marginRight: 16 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddSuburb}
              >
                Save
              </Button>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
