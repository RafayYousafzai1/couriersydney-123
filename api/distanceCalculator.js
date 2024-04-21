async function calculateDistance(origin, destination) {
  try {
    const originStr = `${origin.lat},${origin.lng}`;
    const destinationStr = `${destination.lat},${destination.lng}`;
    const response = await fetch(
      `https://e-distance-matrix.vercel.app/api/distance?originStr=${originStr}&destinationStr=${destinationStr}`
    );

    const data = await response.json();
    console.log(data);
    return data.distanceData;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export { calculateDistance };
