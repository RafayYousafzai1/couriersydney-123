"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@mantine/core";
import { useEffect, useState } from "react";
import Loading from "./Loading";

const CAP = ({ status }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "70vh",
  };

  const paperStyle = {
    padding: "20px",
    textAlign: "center",
    maxWidth: "600px",
    margin: "auto",
  };

  const logoStyle = {
    marginBottom: "15px",
    height: "60%",
    width: "100%",
  };

  let message = "";
  let loginButtonVariant = "filled";
  let signupButtonVariant = "light";
  let homeButton = null;

  switch (status) {
    case "notLoggedIn":
      message =
        "You are not logged in. Please log in or sign up to access the cool features.";
      break;
    case "notAdmin":
      message = "You are not an admin. Only admins can access this feature.";
      loginButtonVariant = "light";
      signupButtonVariant = "filled";
      break;
    case "alreadyLoggedIn":
      message = "You are already logged in.";
      signupButtonVariant = "filled";
      loginButtonVariant = "light";
      homeButton = (
        <Link href="/" passHref>
          <Button variant="filled" color="lime">
            Go Home
          </Button>
        </Link>
      );
      break;
    // Add more cases as needed
    default:
      message = "Unknown status. Please try again later.";
      break;
  }

  return (
    <div style={containerStyle}>
      {isLoading ? (
        <Loading />
      ) : (
        <div style={paperStyle}>
          <Image
            src="/business-man-depressed-stressed-watching-decrease-graph-stock-financial-trade-market-diagram_1150-39760.jpg"
            alt="Logo"
            width={600}
            height={600}
            style={logoStyle}
          />
          <h1 style={{ color: "#333333" }}>Welcome to Direct Transport Solutions!</h1>
          <p style={{ color: "#555555" }}>{message}</p>
          {status !== "notAdmin" && (
            <>
              {homeButton}
              <Link href="/Signin">
                <Button
                  variant={loginButtonVariant}
                  style={{ margin: "0 1rem" }}
                  color="#F14902"
                >
                  Log In
                </Button>
              </Link>
              <Link href="/Signup">
                <Button variant={signupButtonVariant} color="#F14902">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CAP;
