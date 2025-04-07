export const formatDate = (isoDate: string): string => {
  const dateObj = new Date(isoDate);
  return dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const calculateRoomTotal = (dailyRates: { amount: number }[]) =>
  dailyRates.reduce((total, day) => total + day.amount, 0);


export const calculateTaxes = (roomTotal: number) => {
  const taxes = JSON.parse(localStorage.getItem("taxes") ?? "[]");
  const country = JSON.parse(localStorage.getItem("billingInfo") ?? "{}").country;

  console.log(taxes[country].resortFeePercent,country,taxes[country].occupancyTaxPercent);

  const resortFee = taxes[country]?.resortFeePercent || 10;
  const occupancyTax = taxes[country]?.occupancyTaxPercent || 20;
  
  return [
    { name: "Resort fee", amount: parseFloat((resortFee* 0.01 * roomTotal).toFixed(2)) },
    { name: "Occupancy tax", amount: parseFloat((occupancyTax* 0.01 * roomTotal).toFixed(2)) },
  ];
};

export const calculateDueNow = (
    roomTotal: number,
    taxes: { amount: number }[],
    packageName: string
  ): number => {
    const taxTotal = taxes.reduce((sum, t) => sum + t.amount, 0);
    const isFullUpfront = packageName.toLowerCase() === "upfront payment discount";
    const dueNow = isFullUpfront
      ? roomTotal + taxTotal
      : parseFloat((roomTotal * 0.10).toFixed(2)) + taxTotal;
  
    return parseFloat(dueNow.toFixed(2));
  };
  

  export const calculateDueAtResort = (
    roomTotal: number,
    dueNow: number
  ): number => {
    const taxTotal = calculateTaxes(roomTotal).reduce((s, t) => s + t.amount, 0);
    return parseFloat((roomTotal + taxTotal - dueNow).toFixed(2));
  };
  
  export const fetchRateData = async (
    packageTitle: string,
    checkIn: string | undefined,
    checkOut: string | undefined
  ): Promise<any[]> => {
    const selectedRoom = JSON.parse(localStorage.getItem("selectedRoom") ?? "{}");
    console.log(packageTitle, checkIn, checkOut,selectedRoom.room.roomTypeId);
    console.log("selectedRoom", selectedRoom);
    if (!selectedRoom.room.roomTypeId || !checkIn || !checkOut) return [];
  
    try {
      const response = await fetch(import.meta.env.VITE_ITINARY_RATE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomTypeId: selectedRoom.room.roomTypeId,
          startDate: checkIn,
          endDate: checkOut,
          promotionTitle: packageTitle,
        }),
      });
  
      if (!response.ok) throw new Error("Failed to fetch daily rate data");
  
      return await response.json();
    } catch (error) {
      console.error("Error fetching rate data:", error);
      return [];
    }
  };
  

  
