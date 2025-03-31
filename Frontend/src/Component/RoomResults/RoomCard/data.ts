import { Room } from "./RoomCard";

const sampleRooms: Room[] = [
    {
      id: 1,
      name: "Long Beautiful Resort Name",
      rating: 4.8,
      reviews: 124,
      location: "New York, USA",
      size: "50 sqm",
      maxOccupancy: "1-2",
      bedType: "King Bed",
      price: 250,
      specialDeal: {
        text: "Limited-time offer"
      },
      images: [
        "./favicon.png",
        "./image.png",
      ],
    },
    {
      id: 2,
      name: "Cozy Standard Room",
      rating: 0,
      reviews: 0,
      location: "Paris, France",
      size: "30 sqm",
      maxOccupancy: "2-4",
      bedType: "Queen Bed",
      price: 180,
      specialDeal: {
        text: "Includes free breakfast"
      },
      images: [
        "./favicon.png",
        "./image.png",
      ],
    },
    {
      id: 3,
      name: "Ocean View Suite",
      rating: 4.9,
      reviews: 210,
      location: "Maldives",
      size: "60 sqm",
      maxOccupancy: "4-6",
      bedType: "Two Queen Beds",
      price: 400,
      images: [
        "./favicon.png",
        "./image.png",
      ],
    },
  ];
  
  export default sampleRooms;
  