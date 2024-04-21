"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchDocById } from "@/api/firebase/functions/fetch";
import DropzoneButton from "@/components/Dropzone/index";
import { format } from "date-fns";
import {
  updateDoc,
  uploadImageToFirestore,
} from "@/api/firebase/functions/upload";
import { statuses } from "@/components/static";
import { Button, Image } from "@mantine/core";

export default function Page() {
  const pathname = usePathname();
  const [invoice, setInvoice] = useState(null);
  const [images, setImages] = useState([]);
  const [refreash, setRefreash] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchInvoice = async () => {
      const match = pathname && pathname.match(/\/([^/]+)\/pod$/);
      const id = match && match[1];

      if (id) {
        const data = await fetchDocById(id, "place_bookings");
        setInvoice(data);
        setImages(data?.images || []);
      }
    };

    fetchInvoice();
  }, [pathname]);

  const handleSave = async () => {
    if (!images.length) {
      console.log("No images to save.");
      return;
    }

    try {
      // Clear the images state
      setImages([]);

      const uploadedImageUrls = await Promise.all(
        images.map(async (image, index) => {
          const url = await uploadImageToFirestore(image);
          setImages([...images, url]);
          return url;
        })
      );

      console.log("All images uploaded successfully:", uploadedImageUrls);

      // Set the new image URLs in the state
      await updateStatus(uploadedImageUrls);

      router.push(`/admin/Invoices/${invoice.docId}`);

      // Do any further processing here, such as updating status or navigating
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const updateStatus = async (uploadedImageUrls) => {
    const currentStatus = statuses[5].val;
    const currentDate = format(new Date(), "MM/dd/yyyy");

    const data = {
      ...invoice,
      progressInformation: {
        ...invoice.progressInformation,
        [currentStatus]: currentDate,
      },
      currentStatus: currentStatus,
    };

    setInvoice(data);

    const updatedInvoice = await updateDoc("place_bookings", invoice.docId, {
      ...data,
      images: uploadedImageUrls,
    });
    console.log(updatedInvoice);
  };

  // Function to remove a specific image
  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
        backgroundColor: "#f7f7f7",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      {invoice ? (
        <>
          <h1 style={{ marginBottom: "1rem", color: "#333" }}>
            One Off Bookings
          </h1>

          <DropzoneButton
            key={refreash}
            handleImage={(blob) => {
              setImages([...images, blob]);
              setRefreash(refreash + 1);
            }}
          />

          {images.map((image, index) => (
            <div key={index} style={{ marginBottom: "1rem" }}>
              <Image
                src={image}
                alt={`Image ${index}`}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  marginRight: "0.5rem",
                }}
              />
              <Button
                variant="light"
                color="red"
                size="sm"
                ml={6}
                onClick={() => removeImage(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            variant="filled"
            color="green"
            onClick={handleSave}
            style={{ marginTop: "1rem" }}
          >
            Save & Deliver
          </Button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
