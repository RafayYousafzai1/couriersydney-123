"use client";

import { deleteDocument } from "@/api/firebase/functions/upload";
import { Loader, CAP } from "@/components/Index";
import React, { useEffect, useState } from "react";

export default function PaymentErrorPage() {
  useEffect(() => {
    const handlePaymentError = async () => {
      try {
        const url = new URL(window.location.href);
        const id = url.pathname.split("/").pop();
        await deleteDocument("stripe", id);
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    };

    handlePaymentError();
  }, []);

  const containerStyle = {
    maxWidth: "400px",
    margin: "20px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    textAlign: "center",
  };

  const errorTextStyle = {
    color: "#dc3545", // Red color for error messages
    fontSize: "18px",
    fontWeight: "bold",
  };

  const [role, setRole] = useState(null);
  useEffect(() => {
    const role = (JSON.parse(localStorage.getItem("userDoc")) || {}).role || null;
    setRole(role)
  }, []);

  if (role === null) {
    return <CAP status={"notLoggedIn"} />;
  }

  return (
    <div style={containerStyle}>
      <p style={errorTextStyle}>
        Your payment was not successful. Or An error occurred!
      </p>
      <p>Please contact customer support for assistance.</p>
      <p>Thank you for shopping with us!</p>
    </div>
  );
}
