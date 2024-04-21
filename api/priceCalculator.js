import { fetchDocById } from "./firebase/functions/fetch";

async function calculatePrice(data) {
  const minPrices = await fetchDocById("MinServicesPrices", "data");
  const perKmRates = await fetchDocById("perKmRates", "data");

  const serviceType = data?.service;
  const distanceValueMiles = parseFloat(
    data.distanceData.distance.text.match(/\d+/)[0]
  );

  // Convert miles to kilometers (1 mile is approximately 1.60934 kilometers)
  const distanceValueKm = distanceValueMiles * 1.60934;

  let totalPrice;
  let requestQuote = false;
  let palletSpaces = 0; // Initialize pallet spaces count
  let returnType; // Initialize the return type

  // Determine the job code based on weight, dimensions, and cubic capacity
  const { items } = data;
  const totalWeight = items.reduce(
    (total, item) => total + parseInt(item.weight),
    0
  );
  const totalCubicCapacity = items.reduce((total, item) => {
    const volume = (item.length * item.width * item.height) / 4000;
    return total + volume;
  }, 0);

  // Calculate the number of pallet spaces
  palletSpaces = Math.ceil(totalCubicCapacity);

  const longestItemLength = Math.max(...items.map((item) => item.length));

  // Determine if any item is on a pallet
  const hasPallet = items.some((item) => item.type === "Pallet");
  const hasSkid = items.some((item) => item.type === "Skid");

  // Determine if any pipes exceed the weight and length criteria
  const hasPipes = items.some(
    (item) => item.type === "Pipes" && item.weight > 100 && item.length > 3
  );

  if (hasPallet || hasPipes) {
    // For pallets or pipes exceeding criteria, calculate at appropriate rates based on cubic weight
    const basePrice = distanceValueKm * perKmRates["1T"];

    if (totalCubicCapacity <= 1000) {
      totalPrice = basePrice < minPrices["1T"] ? minPrices["1T"] : basePrice;
      returnType = "1T"; // Set the return type
    } else if (totalCubicCapacity >= 1000 && totalCubicCapacity <= 2000) {
      totalPrice = minPrices["2T"];
      returnType = "2T"; // Set the return type
    } else {
      totalPrice = minPrices["4T"];
      returnType = "4T"; // Set the return type
    }
  } else if (
    totalWeight <= 25 &&
    items.every((item) => item.length < 100) &&
    totalCubicCapacity <= 25
  ) {
    // CG/CX/CD
    const basePrice = distanceValueKm * perKmRates["Courier"];
    totalPrice =
      basePrice < minPrices["Courier"] ? minPrices["Courier"] : basePrice;
    returnType = "H1"; // Set the return type
  } else if (
    totalWeight <= 500 &&
    longestItemLength <= 400 &&
    totalCubicCapacity <= 500
  ) {
    // HTG/HTX/HTD
    const basePrice = distanceValueKm * perKmRates["HT"];
    // totalPrice = basePrice < minPrices["HT"] ? minPrices["HT"] : basePrice;
    totalPrice = Math.max(basePrice, minPrices["HT"]); // Ensure price is not less than minimum HT price
    returnType = "H1"; // Set the return type
  } else if (totalWeight <= 1000 && totalCubicCapacity <= 1000) {
    // 1TG/1TX/1TD
    const basePrice = distanceValueKm * perKmRates["1T"];
    totalPrice = basePrice < minPrices["1T"] ? minPrices["1T"] : basePrice;
    returnType = "1T"; // Set the return type
  } else if (totalWeight <= 2000 && totalCubicCapacity <= 2000) {
    // 2T
    totalPrice = minPrices["2T"];
    returnType = "2T"; // Set the return type
  } else if (totalWeight <= 4000 && totalCubicCapacity <= 4000) {
    // 4T
    totalPrice = minPrices["4T"];
    returnType = "4T"; // Set the return type
  } else {
    // Anything over 4000kgs or 4 pallet spaces
    requestQuote = true;
  }

  // Service charges are not applied for 2T or 4T jobs
  if (!requestQuote && returnType !== "2T" && returnType !== "4T") {
    // Apply express or direct service fees
    if (serviceType === "Express") {
      totalPrice *= 1.5;
    } else if (serviceType === "Direct") {
      totalPrice *= 2;
    }
  }

  // Round the totalPrice to two decimal places
  if (!requestQuote && typeof totalPrice !== "string") {
    totalPrice = totalPrice.toFixed(2);
  }

  return {
    ...data,
    totalPrice: totalPrice,
    palletSpaces: palletSpaces,
    requestQuote,
    returnType: returnType, // Include the return type in the returned object
  };
}

export { calculatePrice };
