import { formatCamelText } from "../../utils/textFormatUtils";

export const useItinerary = () => {
  const storedParams = localStorage.getItem("searchParams");
  let propertyId, guests, rooms, checkIn, checkOut, beds;

  if (storedParams) {
    const params = new URLSearchParams(storedParams);
    propertyId = params.get("propertyId") ?? "";
    guests = params.get("guests") ?? "";
    rooms = params.get("rooms") ?? "";
    checkIn = params.get("checkIn") ?? "";
    checkOut = params.get("checkOut") ?? "";
    beds = params.get("beds") ?? "";
  }

  const selectedRoom = JSON.parse(localStorage.getItem("selectedRoom") || "{}");
  const selectedPackage = JSON.parse(localStorage.getItem("package") || "{}");
  const packagePrice=selectedPackage.price
  const ItineraryRoomTitle = selectedRoom.room?.title
    ? formatCamelText(selectedRoom.room.title)
    : "";

  return {
    packagePrice,
    propertyId,
    guests,
    rooms,
    checkIn,
    checkOut,
    beds,
    selectedRoom,
    selectedPackage,
    ItineraryRoomTitle,
  };
};
