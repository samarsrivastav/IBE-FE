export const formatDateRange = (checkIn: string | undefined, checkOut: string |undefined) => {
    if(!checkIn || !checkOut){
        return;
    }
  const start = new Date(checkIn);
  const end = new Date(checkOut);

  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  const formattedStart = start.toLocaleDateString("en-US", options);
  const formattedEnd = end.toLocaleDateString("en-US", options);

  return `${formattedStart.split(",")[0]} - ${formattedEnd}`;
};
