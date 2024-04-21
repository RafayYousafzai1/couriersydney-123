"use client";

import React, { useEffect, useState } from "react";
import { CAP } from "@/components/Index";
import ReviewBooking from "@/components/ReviewBooking";

export default function Page() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userDoc")) || {} || null;
    setUser(user);
  }, []);
  const role = (user && user.role) || null;

  if (role === null) {
    return <CAP status={"notLoggedIn"} />;
  } else if (role !== null && role === "user") {
    return <p>Restricted</p>;
  }

  return <ReviewBooking edit={true} />;
}
