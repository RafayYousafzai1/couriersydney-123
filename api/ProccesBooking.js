import { calculatePrice } from "@/api/priceCalculator";
import { calculateDistance } from "@/api/distanceCalculator";
import { fetchTolls } from "@/api/fetchTolls";
// import { fetchDocById } from "./firebase/functions/fetch";

async function processBooking(data) {
  // Calculate distance between origin and destination
  const distance = await calculateDistance(
    data.address.Origin.coordinates,
    data.address.Destination.coordinates
  );
  const distanceData = distance?.rows[0]?.elements[0];

  let tolls = { totalTolls: 0, totalTollsCost: 0 }; // Initialize tolls object

  if (data.service !== "Standard") {
    tolls = await fetchTolls(
      data.address.Origin.coordinates,
      data.address.Destination.coordinates
    );
  }

  // Calculate invoice data including price
  const invoiceData = await calculatePrice({
    ...data,
    distanceData: distanceData,
    totalTolls: tolls?.totalTolls || 0,
    totalTollsCost: tolls?.totalTollsCost || 0,
  });

  return { ...invoiceData };
}

export default processBooking;
