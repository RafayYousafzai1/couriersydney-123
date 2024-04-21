"use client";
import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";
import { CAP } from "@/components/Index";
import Link from "next/link";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

export default function Page() {
  const router = useRouter();
  const initialFormData = {
    date: null,
    orderNo: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  const handleDateChange = (date) => {
    setFormData({ ...formData, date: date });
  };

  const handleSubmit = async () => {
    const requiredFields = ["date", "orderNo"];

    // Check if any required field is missing
    if (requiredFields.some((field) => !formData[field])) {
      alert("Please fill in all required fields.");
      return;
    }
    router.push(`/JobInquiry/${formData.orderNo}`);
  };

  const styleField = {
    width: "16rem",
  };

  const containerStyle = {
    marginTop: "5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    flexDirection: "column",
    gap: "1rem",
  };

  const [role, setRole] = useState(null);
  useEffect(() => {
    const role =
      (JSON.parse(localStorage.getItem("userDoc")) || {}).role || null;
    setRole(role);
  }, []);

  if (role === null) {
    return <CAP status={"notLoggedIn"} />;
  }

  return (
    <section style={containerStyle}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Select Date"
          value={formData.date}
          onChange={handleDateChange}
        />
      </LocalizationProvider>
      <TextField
        style={styleField}
        name="orderNo"
        label="Job Number"
        multiline
        maxRows={4}
        value={formData.orderNo}
        onChange={(e) => setFormData({ ...formData, orderNo: e.target.value })}
      />
      <Button
        style={styleField}
        variant="filled"
        color="#F14902"
        onClick={handleSubmit}
      >
        RUN QUERY
      </Button>
      <Link href="/ClientServices" style={{ textDecoration: "none" }}>
        <Button
          style={styleField}
          variant="filled"
          mt={10}
          color="#F14902"
          size="md"
        >
          Client Services
        </Button>
      </Link>
    </section>
  );
}
