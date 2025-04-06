export const formatDate = ([year, month, day]: number[]): string => {
  const dateObj = new Date(year, month - 1, day);
  return dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const calculateRoomTotal = (dailyRates: { amount: number }[]) =>
  dailyRates.reduce((total, day) => total + day.amount, 0);

export const calculateTaxes = (roomTotal: number) => [
  { name: "Resort fee", amount: parseFloat((roomTotal * 0.1).toFixed(2)) },
  { name: "Occupancy tax", amount: parseFloat((roomTotal * 0.1).toFixed(2)) },
];

export const calculateDueNow = (
    roomTotal: number,
    taxes: { amount: number }[],
    packageName: string
  ): number => {
    const taxTotal = taxes.reduce((sum, t) => sum + t.amount, 0);
    const isFullUpfront = packageName.toLowerCase() === "100% upfront";
  
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
  
export const fetchRateData = async (): Promise<any[]> => {
  try {
    const response = await fetch("/data/dummyDailyRates.json");
    if (!response.ok) throw new Error("Failed to fetch rate data");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

  
