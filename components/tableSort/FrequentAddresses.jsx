"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { updateFrequentAddress } from "../../api/firebase/functions/upload";
import { Button } from "@mantine/core";

export default function FrequentAddresses({ addresses }) {
  const [modifiedAddresses, setModifiedAddresses] = useState(addresses);
  console.log(addresses);

  const handleDelete = (index) => {
    const updatedAddresses = modifiedAddresses.splice(index, 1);
    setModifiedAddresses(updatedAddresses);
    updateFrequentAddress(updatedAddresses);
  };

  return (
    <div style={{ width: "97vw" }}>
      <TableContainer
        component={Paper}
        style={{ width: "80%", margin: "2rem auto" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {modifiedAddresses &&
              modifiedAddresses.map((row, index) => (
                <TableRow key={index + 1}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row?.label}</TableCell>

                  <TableCell>
                    <Button
                      variant="filled"
                      color="#F14902"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
