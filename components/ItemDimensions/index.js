"use client";

import React, { useState } from "react";
import {
  TextField,
  InputAdornment,
  Box,
  IconButton,
  MenuItem,
} from "@mui/material";
import { useDisclosure } from "@mantine/hooks";
import { Button, Modal, Table } from "@mantine/core";
import DeleteIcon from "@mui/icons-material/Delete";
import { goodsDescriptionOption } from "../static";

export default function ItemDimensions({
  handleItems,
  defaultItems,
  diseble,
  add,
}) {
  const initForm = {
    weight: "",
    height: "",
    width: "",
    length: "",
    type: "",
    qty: "",
  };

  const [items, setItems] = useState(defaultItems || []);
  const [opened, { open, close }] = useDisclosure(false);
  const [formData, setFormData] = useState(initForm);
  console.log(items);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name !== "weight" && parseInt(value) > 1000) {
      setFormData({ ...formData, [name]: 1000 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = () => {
    if (
      !formData.weight ||
      !formData.height ||
      !formData.width ||
      !formData.length ||
      !formData.type ||
      !formData.qty
    ) {
      alert("Please fill in all fields");
      return;
    }

    close();

    const newItem = {
      weight: formData.weight,
      height: formData.height,
      width: formData.width,
      length: formData.length,
      type: formData.type,
      qty: formData.qty,
    };

    setItems((prevItems) => [...prevItems, newItem]);
    setFormData(initForm);
    handleItems([...items, newItem]); // It seems redundant to call setItems and handleItems with the same value. Consider removing one of them.
  };

  const handleDelete = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    margin: "1rem 0",
  };

  const tableHeaderCellStyle = {
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #e0e0e0",
    padding: "10px",
    fontWeight: "bold",
  };

  return (
    <div>
      {!add ? (
        <Button fullWidth variant="filled" onClick={open}>
          Add Item
        </Button>
      ) : null}
      <Modal opened={opened} onClose={close} title="New Item" centered>
        <br />
        <Box>
          <TextField
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">kg</InputAdornment>
              ),
            }}
            type="number"
            fullWidth
            style={{ marginBottom: ".5rem" }}
            label="Weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
          />
          <TextField
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">cm</InputAdornment>
              ),
            }}
            type="number"
            fullWidth
            style={{ marginBottom: ".5rem" }}
            label="Height"
            name="height"
            value={formData.height}
            onChange={handleChange}
          />
          <TextField
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">cm</InputAdornment>
              ),
            }}
            type="number"
            fullWidth
            style={{ marginBottom: ".5rem" }}
            label="Width"
            name="width"
            value={formData.width}
            onChange={handleChange}
          />
          <TextField
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">cm</InputAdornment>
              ),
            }}
            type="number"
            fullWidth
            style={{ marginBottom: ".5rem" }}
            label="Length"
            name="length"
            value={formData.length}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            name="type"
            select
            size="small"
            label="Item Type"
            helperText="Please select the type of your item"
            variant="outlined"
            value={formData.type}
            onChange={handleChange}
          >
            {goodsDescriptionOption &&
              goodsDescriptionOption.map((option, index) => (
                <MenuItem key={index} value={option.value}>
                  {option.value}
                </MenuItem>
              ))}
          </TextField>
        </Box>
        <TextField
          InputProps={{
            endAdornment: <InputAdornment position="start">kg</InputAdornment>,
          }}
          type="number"
          fullWidth
          style={{ marginBottom: ".5rem" }}
          label="Quantity"
          name="qty"
          value={formData.qty}
          onChange={handleChange}
        />
        <Button style={{ width: "100%" }} onClick={handleSubmit}>
          Submit
        </Button>
      </Modal>
      <div>
        <Table style={tableStyle}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={tableHeaderCellStyle}>Weight</Table.Th>
              <Table.Th style={tableHeaderCellStyle}>Dimensions</Table.Th>
              <Table.Th style={tableHeaderCellStyle}>Type</Table.Th>
              {diseble ? null : (
                <Table.Th style={tableHeaderCellStyle}>Delete</Table.Th>
              )}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {items?.map((item, index) => (
              <Table.Tr key={index}>
                <Table.Td>{item.weight}</Table.Td>
                <Table.Td>
                  {item.length} x {item.width} x {item.height} cm
                </Table.Td>
                <Table.Td>{item.type}</Table.Td>
                {diseble ? null : (
                  <Table.Td>
                    <IconButton
                      onClick={() => handleDelete(index)}
                      aria-label="delete"
                      style={{ marginRight: "1rem" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Table.Td>
                )}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        <h5>Total Items {items?.length}</h5>
      </div>
    </div>
  );
}
