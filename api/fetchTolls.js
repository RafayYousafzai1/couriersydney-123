async function fetchTolls(origin, destination) {
  const url = `https://get-tolls.vercel.app/api/distance?originLat=${origin.lat}&originLng=${origin.lng}&destLat=${destination.lat}&destLng=${destination.lng}`;
  console.log(url);
  try {
    const response = await fetch(url);
    const tolls = await response.json();
    return tolls;
  } catch (error) {
    console.error("Error fetching tolls:", error);
  }
}

export { fetchTolls };
