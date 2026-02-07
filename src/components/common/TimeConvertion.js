export function toReadableTime(timestamp) {
  if (!timestamp) return "";

  const date = new Date(timestamp);

  const day = date.getDate().toString().padStart(2, "0");

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = months[date.getMonth()];
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  if (hours === 0) {
    hours = 12;
  }

  return (
    day + " " + month + ", " + year + " " + hours + ":" + minutes + " " + ampm
  );
}

// usage example:
// const timeStamp = toReadableTime(item.createdAt);
