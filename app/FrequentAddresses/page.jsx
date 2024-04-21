"use client";
import { CAP, FrequentAddresses, PlacesAutocomplete } from "@/components/Index";
import { fetchFrequentAddresses } from "@/api/firebase/functions/fetch";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import Loading from "@/components/Loading";
import { useDisclosure } from "@mantine/hooks";
import { Button, Modal } from "@mantine/core";
import { addFrequentAddress } from "@/api/firebase/functions/upload";

export default function Page() {
  const [address, setAddress] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const addresses = await fetchFrequentAddresses();
        setAddress(addresses);
        setIsLoading(false); // Set isLoading to false when data is ready
      } catch (error) {
        console.error("Error fetching addresses:", error);
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

  const handleSubmit = async () => {
    addFrequentAddress(address);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "97vw",
        flexDirection: "column",
      }}
    >
      <Button onClick={open}>Add New Address</Button>

      <Modal opened={opened} onClose={close} title="Write Address">
        {/* <Box sx={style}> */}
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Write Your Address
        </Typography>

        <div style={{ height: "50vh" }}>
          <PlacesAutocomplete
            onLocationSelect={(loc) => setAddress(loc)}
            width={true}
          />
        </div>
        <Button onClick={handleSubmit}>Add Address</Button>
        {/* </Box> */}
      </Modal>

      <FrequentAddresses singleBtn={false} addresses={address} />
    </div>
  );
}
