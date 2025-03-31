import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Package, Room } from "../slice/roomDataSlice";

interface FetchPropertiesType {
  PropertyId: number;
  beds: number;
  checkIn: string;
  checkOut: string;
  guests?: Object;
  needsAccessibleRoom?: boolean;
  rooms: number;

}
export const fetchRoomDetails = createAsyncThunk(
  "rooms/fetchRoomDetails",
  async (searchData: FetchPropertiesType) => {
    if (searchData.PropertyId && (searchData.PropertyId !== 8 && searchData.PropertyId !== 20)) {
      throw new Error("Property not accesible");
    }
    const totalGuest = searchData.guests
      ? Object.values(searchData.guests).reduce((sum, count) => sum + count, 0)
      : 1;
    const [roomsRes, packagesRes] = await Promise.all([
      axios.post<Room[]>(`${import.meta.env.VITE_ROOM_TYPE_API_URL}`, {
        propertyId: searchData.PropertyId ?? 8,
        startDate: searchData.checkIn,
        endDate: searchData.checkOut,
        numberOfGuests: totalGuest,
        numberOfRooms: searchData.rooms,
        totalBeds: searchData.beds,
        pageSize: 10,
      }),
      axios.post<{ roomTypeId: number; packages: Package[] }[]>(
        `${import.meta.env.VITE_PACKAGES_TYPE_API_URL}`,
        {
          propertyId: searchData.PropertyId,
          startDate: searchData.checkIn,
          endDate: searchData.checkOut,
        }
      ),
    ]);

    const packagesMap = new Map(
      packagesRes.data.map((p) => [p.roomTypeId, p.packages])
    );

    const mergedRooms = roomsRes.data.map((room) => {
      const packages = packagesMap.get(room.room_type_id) || [];
      const promotionPackage = packages.filter((pkg) => pkg.type === "package");

      const minPricePackage = promotionPackage.reduce(
        (min, pkg) => (Number(pkg.price) < Number(min.price) ? pkg : min),
        promotionPackage[0] || { price: null, title: null }
      );

      return {
        ...room,
        promotion: packages,
        specialDeal: minPricePackage.price
          ? { text: `${minPricePackage.title}` }
          : null,
      };
    });

    return mergedRooms;
  }
);
