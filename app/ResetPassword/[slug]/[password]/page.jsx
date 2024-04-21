"use client";

import { useState } from "react";
import { ResetPassword } from "@/api/firebase/functions/auth";
import { Input, Button, Container } from "@mantine/core";

const Page = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const pathArray = window.location.pathname.split("/");

  const email = pathArray[2];
  const password = pathArray[3];
  ("use client");
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation
    if (!newPassword || !confirmPassword) {
      setMessage("Please fill out all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match.");
      return;
    }

    await ResetPassword(email, password, newPassword);
  };

  return (
    <Container size={"sm"} mt={30}>
      <form onSubmit={handleSubmit}>
        <div>
          <p style={{ fontSize: "14px", color: "gray" }}>
            Enter Your New Password
          </p>
          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <p style={{ fontSize: "14px", color: "gray" }}>
            Re Enter Your New Password
          </p>
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div>{message && <p>{message}</p>}</div>
        <br />
        <Button type="submit">Reset Password</Button>
      </form>
    </Container>
  );
};

export default Page;
