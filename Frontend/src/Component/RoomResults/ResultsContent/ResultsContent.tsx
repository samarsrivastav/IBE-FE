import React, { useState, useMemo, useEffect } from "react";
import styles from "./ResultsContent.module.scss";
import RoomCard from "../RoomCard/RoomCard";
import SortComponent from "./SubComp/SortComponent";
import PaginationComponent from "./SubComp/PaginationComponent";
import { Itinerary } from "../../Checkout/Itinerary/Itinerary";

interface ResultsContentProps {
  rooms: any[];
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const ResultsContent: React.FC<ResultsContentProps> = ({ rooms, setStep }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("");

  const [roomsPerPage,setRoomsPerPage] = useState<number>(3);

  useEffect(()=>{
    setSteps()
  },[])
  const setSteps=()=>{
    const setPackage=localStorage.getItem("package")
    console.log(setPackage)

    if(setPackage!==null){
      setRoomsPerPage(2)
    }else{
      setRoomsPerPage(3)
    }
    console.log(roomsPerPage)
  }
  const totalPages = Math.ceil(rooms.length / roomsPerPage);
  const isStoredPackage=localStorage.getItem("package")
  const sortedRooms = useMemo(() => {
    let sorted = [...rooms];

    switch (sortBy) {
      case "priceLow":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "reviewsHigh":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return sorted;
  }, [rooms, sortBy]);

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = sortedRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.results}>
      <div className={styles.results__header}>
        <h1 className={styles.results__title}>Room Results</h1>
        <div className={styles.results__meta}>
          <span className={styles.results__count}>Showing {rooms.length} Results</span>
          <SortComponent sortBy={sortBy} setSortBy={setSortBy} />
        </div>
      </div>

      <div className={styles.results__cards}>
        {currentRooms.length > 0 ? (
          currentRooms.map((room) => <RoomCard room={room} key={room.id} setStep={setStep} />)
        ) : (
          <p>No rooms found</p>
        )}
        {isStoredPackage !== null ? <Itinerary setSteps={setSteps}/> : null}
      </div>

      {rooms.length > roomsPerPage && (
        <PaginationComponent totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
      )}
    </div>
  );
};

export default ResultsContent;
