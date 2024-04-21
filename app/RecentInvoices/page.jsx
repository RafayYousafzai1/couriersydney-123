"use client";
import React, { useEffect, useState } from "react";
import { fetchPlace_booking } from "../../api/firebase/functions/fetch";
import { CAP, RecentInvoices } from "@/components/Index";

export default function Page() {
  const [role, setRole] = useState(null);
  const [place_booking, setPlace_booking] = useState([]);
  // const [status, setStatus] = useState("pending");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedPlace_booking = await fetchPlace_booking();
        setPlace_booking(fetchedPlace_booking);
      } catch (error) {
        console.error("Error fetching place bookings:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const userDoc = JSON.parse(localStorage.getItem("userDoc")) || {};
    const role = userDoc.role || null;
    setRole(role);
  }, []);

  if (role === null) {
    return <CAP status={"notLoggedIn"} />;
  }

  const listItemStyle = {
    cursor: "pointer",
    padding: "8px 16px",
    borderRadius: "4px",
    margin: "4px",
    backgroundColor: "#f0f0f0",
    color: "#333",
  };

  const selectedStyle = {
    ...listItemStyle,
    backgroundColor: "#007bff",
    color: "#fff",
  };

  return (
    <>
      {/* <ul
        style={{
          listStyle: "none",
          padding: 0,
          display: "flex",
          margin: "0 2rem",
        }}
      >
        <li
          onClick={() => setStatus("pending")}
          style={status === "pending" ? selectedStyle : listItemStyle}
        >
          pending
        </li>
        <li
          onClick={() => setStatus("booked")}
          style={status === "booked" ? selectedStyle : listItemStyle}
        >
          booked
        </li>
        <li
          onClick={() => setStatus("etd")}
          style={status === "etd" ? selectedStyle : listItemStyle}
        >
          etd
        </li>
        <li
          onClick={() => setStatus("allocated")}
          style={status === "allocated" ? selectedStyle : listItemStyle}
        >
          allocated
        </li>
        <li
          onClick={() => setStatus("pickedup")}
          style={status === "pickedup" ? selectedStyle : listItemStyle}
        >
          pickedup
        </li>
        <li
          onClick={() => setStatus("delivered")}
          style={status === "delivered" ? selectedStyle : listItemStyle}
        >
          delivered
        </li>
        <li
          onClick={() => setStatus("pod")}
          style={status === "pod" ? selectedStyle : listItemStyle}
        >
          pod
        </li>
      </ul> */}

      <RecentInvoices place_booking={place_booking} />
    </>
  );
}
