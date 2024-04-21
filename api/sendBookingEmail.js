import emailjs from "emailjs-com";

async function sendBookingEmail(data, id, name) {
  const formattedInfo = data?.items.map((item, index) => {
    const { weight, height, width, length, type } = item;
    const volume = height * width * length;
    return `Type: ${type}, Weight: ${weight}, Height: ${height}, Width: ${width}, Length: ${length}, Volume: ${volume}`;
  });

  console.log(formattedInfo.join("\n"));
  try {
    const templateParams = {
      destination: data?.address?.Destination?.label || "",
      origin: data?.address?.Origin?.label || "",
      name: name || "",
      id: id || "",
      items: formattedInfo.join("\n"),
    };

    await emailjs.send(
      "service_f67p0db", // Your service ID from email.js
      "template_na429zf", // Your template ID from email.js
      templateParams,
      "Mo93nAQPsQ-HJMrAi" // Your user ID from email.js
    );

    console.log("Email sent successfully");
    return true;
  } catch (error) {
    console.error("Error while processing data:", error);
    return null; // Return null to indicate error
  }
}

export default sendBookingEmail;
