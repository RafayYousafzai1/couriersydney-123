"use client";

import { useState } from "react";
import { ResetPassword } from "@/api/firebase/functions/auth";
import { Input, Button, Container } from "@mantine/core";

const Page = () => {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation
    if (!email || !oldPassword || !newPassword || !confirmPassword) {
      setMessage("Please fill out all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match.");
      return;
    }

    await ResetPassword(email, oldPassword, newPassword);
  };

  return (
    <Container size={"sm"} mt={30}>
      <form onSubmit={handleSubmit}>
        <div>
          <p style={{ fontSize: "14px", color: "gray" }}>Enter Your Email</p>
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <p style={{ fontSize: "14px", color: "gray" }}>
            Enter Your Old Password
          </p>
          <Input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
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
