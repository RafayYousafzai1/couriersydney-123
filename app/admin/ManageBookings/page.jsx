"use client";
import { MenageInvoices, Stats, CAP } from "@/components/Index";
import { useEffect, useState } from "react";
import { getCollection } from "@/api/firebase/functions/fetch";

export default function Page() {
  // const [status, setStatus] = useState("pending");
  const [place_booking, setPlace_booking] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedPlace_booking = await getCollection("place_bookings");
        setPlace_booking(fetchedPlace_booking);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchData();
  }, []);

  const [role, setRole] = useState(null);
  useEffect(() => {
    const role =
      (JSON.parse(localStorage.getItem("userDoc")) || {}).role || null;
    setRole(role);
  }, []);

  if (role === null) {
    return <CAP status={"notLoggedIn"} />;
  }

  // const filtered =
  //   status === "pending"
  //     ? place_booking.filter((booking) => !booking.progressInformation)
  //     : place_booking.filter((booking) => {
  //         const progressInfo = booking.progressInformation || {};
  //         return Object.keys(progressInfo).some((key) => key === status);
  //       });

  // const filtered = place_booking.filter((booking) => {
  //   const progressInfo = booking.progressInformation;

  //   if (!progressInfo) {
  //     return status === "pending";
  //   }

  //   const statuses = Object.keys(progressInfo);

  //   if (status === "pending") {
  //     return statuses.length === 0;
  //   }

  //   const latestStatusDate = Math.max(
  //     ...statuses.map((key) => new Date(progressInfo[key]).getTime())
  //   );
  //   const selectedStatusDate = new Date(progressInfo[status]).getTime();

  //   return latestStatusDate === selectedStatusDate;
  // });

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
      <Stats />
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
      <MenageInvoices invoice={place_booking} title={"Booking"} />;
    </>
  );
}
