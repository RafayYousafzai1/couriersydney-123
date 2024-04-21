"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchDocById } from "@/api/firebase/functions/fetch";
import { InvoicesDetials, Loader, CAP } from "@/components/Index";

export default function Page() {
  const pathname = usePathname();
  const [invoice, setInvoice] = useState(null);
  const [isJob, setIsJob] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      const match = pathname && pathname.match(/\/([^/]+)$/);
      const id = match && match[1];

      if (id) {
        let data = await fetchDocById(id, "place_bookings");

        if (!data) {
          data = await fetchDocById(id, "place_job");
          setIsJob(true);
        }

        setInvoice(data);
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
    <div>
      {invoice ? (
        <>
          {isJob ? (
            <InvoicesDetials invoice={invoice} />
          ) : (
            <InvoicesDetials invoice={invoice} />
          )}
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}
