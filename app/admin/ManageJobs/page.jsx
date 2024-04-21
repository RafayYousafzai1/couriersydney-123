"use client";
import { MenageInvoices, Stats, CAP } from "@/components/Index";
import { useEffect, useState } from "react";
import { getCollection } from "@/api/firebase/functions/fetch";

export default function Page() {
  const [place_job, setPlace_job] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedPlace_job = await getCollection("place_job");
        setPlace_job(fetchedPlace_job);
        console.log("ds", fetchedPlace_job);
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

  return (
    <>
      <Stats />
      <MenageInvoices invoice={place_job} title={"Job"} />;
    </>
  );
}
