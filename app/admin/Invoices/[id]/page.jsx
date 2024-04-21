"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchDocById } from "@/api/firebase/functions/fetch";
import { InvoicesDetials, CAP } from "@/components/Index";
import { format } from "date-fns";
import { updateDoc } from "@/api/firebase/functions/upload";
import { Button, Input, Modal, NumberInput, Text } from "@mantine/core";
import { statuses } from "@/components/static";
import { useDisclosure } from "@mantine/hooks";

const ChangeStatusButton = ({ status, onClick }) => (
  <Button w={180} variant="filled" color="#F14902" m={3} onClick={onClick}>
    {status}
  </Button>
);

export default function Page() {
  const pathname = usePathname();
  const [invoice, setInvoice] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const [load, setLoad] = useState(false); // Added loading state

  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      const match = pathname && pathname.match(/\/([^/]+)$/);
      const id = match && match[1];

      if (id) {
        const data = await fetchDocById(id, "place_bookings");
        setInvoice(data);
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchInvoice();
  }, [pathname]);

  useEffect(() => {
    const userRole =
      (JSON.parse(localStorage.getItem("userDoc")) || {}).role || null;
    setRole(userRole);
  }, []);

  const updateInvoice = async (updatedData) => {
    await updateDoc("place_bookings", invoice.docId, updatedData);
  };

  const updateStatus = async (newStatusIndex) => {
    if (!invoice || newStatusIndex >= statuses.length) {
      return;
    }

    const currentStatus = statuses[newStatusIndex].val;
    const currentDate = format(new Date(), "MM/dd/yyyy");

    const updatedData = {
      ...invoice,
      progressInformation: {
        ...invoice.progressInformation,
        [currentStatus]: currentDate,
      },
      currentStatus: currentStatus,
    };

    setInvoice(updatedData);

    const updatedInvoice = await updateInvoice(updatedData);
    // console.log(updatedInvoice);
  };

  const handleSubmit = async () => {
    setLoad(true);
    const res = await fetchDocById("GST", "data");
    let gstVal = res.GST;
    let price = parseFloat(invoice?.totalPrice);
    let tollsCost = parseFloat(invoice?.totalTollsCost);
    const gst = (price * parseFloat(gstVal)) / 100;
    const totalPriceWithGST = price + gst;

    const updatedInvoice = {
      ...invoice,
      totalPriceWithGST: parseFloat(totalPriceWithGST.toFixed(2)),
      gst: parseFloat(gst.toFixed(2)),
      totalTollsCost: parseFloat(tollsCost),
    };

    // setInvoice(updatedInvoice);
    await updateInvoice(updatedInvoice);
    setLoad(false);
    close()
  };

  if (role === null || loading) {
    // Added loading state
    return <p>Loading...</p>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {invoice ? (
        <>
          <Modal opened={opened} onClose={close} title="Modify Pricing">
            <NumberInput
              min={10}
              decimalScale={2}
              label="Tolls"
              mb={6}
              value={invoice.totalTollsCost}
              onChange={(e) => setInvoice({ ...invoice, totalTollsCost: e })}
            />
            <NumberInput
F              min={10}
              decimalScale={2}
              label="Price"
              mb={6}
              value={invoice.totalPrice}
              onChange={(e) => setInvoice({ ...invoice, totalPrice: e })}
            />
            <Button onClick={handleSubmit} bg={load ? "pink" : "green"}>
              {load ? "Calculating Please Wait" : "Calculate & Update"}
            </Button>
          </Modal>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "1rem",
              flexDirection: "column",
            }}
          >
            <Text tt="uppercase" size="lg" fw={500} c={"gray"}>
              Change Status:
            </Text>
            {statuses.map((status, index) => (
              <ChangeStatusButton
                key={index}
                status={status.status}
                onClick={() => updateStatus(index)}
              />
            ))}
          </div>
          <InvoicesDetials invoice={invoice} />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "1rem",
              flexDirection: "column",
            }}
          ></div>
          <Button onClick={open}>Modify Pricing</Button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
