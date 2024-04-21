"use client";
import { fetchDocById } from "@/api/firebase/functions/fetch";
import { InvoicesDetials } from "@/components/Index";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CAP } from "@/components/Index";

export default function Page() {
  const pathname = usePathname();
  const [invoice, setInvoice] = useState(null);

  console.log(invoice);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const match = pathname && pathname.match(/\/([^/]+)$/);
        const id = match && match[1];

        if (id) {
          let data = await fetchDocById(id, "place_bookings");

          if (!data) {
            data = await fetchDocById(id, "place_job");
            setInvoice(data);
          }

          setInvoice(data);
        }
      } catch (error) {
        // Handle errors
        console.error("Error fetching invoice:", error);
      }
    };

    fetchInvoice();
  }, [pathname]);

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
    <div>{invoice ? <InvoicesDetials invoice={invoice} /> : <p>Loading...</p>}</div>
  );
}
