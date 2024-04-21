"use client";

import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { TextField } from "@mui/material";
import { useState } from "react";
import "@mantine/dates/styles.css";
import DateTimePickers from "./DateTimePickers";

const UpdateInformation = ({ invoice, handleData }) => {
  const [formData, setFormData] = useState(invoice);
  const [opened, { open, close }] = useDisclosure(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const submit = () => {
    handleData(formData);
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="das" py={20}>
        {/* Modal content */}
        <TextField
          fullWidth
          name="contact"
          label="Contact"
          variant="outlined"
          helperText="Enter contact information"
          size="small"
          value={formData?.contact}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          name="dropReference1"
          label="Reference"
          size="small"
          multiline
          maxRows={4}
          helperText="Enter the reference code"
          value={formData?.reference1}
          onChange={handleChange}
        />
        <DateTimePickers
          handleDateTimeChange={(e) =>
            setFormData({
              ...formData,
              date: e.date,
              time: e.time,
            })
          }
        />
        <Button onClick={submit}>Submit</Button>
      </Modal>

      <p
        style={{ fontWeight: "bold", fontStyle: "italic", color: "blue" }}
        onClick={open}
      >
        Add Details
      </p>
    </>
  );
};

export default UpdateInformation;
