import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, MapPin } from "lucide-react";
import styles from "./RoomCard.module.scss";
import { RoomModal } from "../RoomModal/RoomModal";
import { RoomDetail } from "../../../Redux/slice/roomDataSlice";
import { currencySymbolMap } from "../../../Constant/CurrencyConstant";
import { useCurrencyConverter } from "../../../Config/CustomHooks/useCurrency";
import { useDispatch, useSelector } from "react-redux";
import { selectSelectedRoom, setSelectedRoom } from "../../../Redux/slice/selectRoomTypeSlice";
import { formatCamelText } from "../../../utils/textFormatUtils";

interface RoomCardProps {
  room: RoomDetail;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, setStep }) => {
  const dispatch = useDispatch();
  const selectedRoom = useSelector(selectSelectedRoom);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    if (localStorage.getItem("step") === "1" || localStorage.getItem("step") === null) {
      localStorage.setItem("step", "2");
      setStep(2);
    }

    dispatch(setSelectedRoom({
      room: {
        title: room.room_type_name,
        size: room.area_in_square_feet,
        maxOccupancy: room.max_capacity,
        bedSize: room.bedType,
        description: room.description || "No description available",
        amenities: room.amenities || [],
        packages: room.promotion || [],
        images: room.images,
      },
      onClose: () => {},
    }));

    setIsModalOpen(true);
  };

  useEffect(() => {
    const step = localStorage.getItem("step");
    if (selectedRoom?.room?.title === room.room_type_name && step && step >= "2") {
      setIsModalOpen(true);
    }
  }, [selectedRoom, room.room_type_name]);

  const closeModal = () => {
    const selectedPackage=localStorage.getItem("package")
    if ((selectedPackage===null || selectedPackage=="") && localStorage.getItem("step") === "2") {
      localStorage.setItem("step", "1");
      setStep(1);
    }
    setIsModalOpen(false);
  }

  const standardRoom = room.promotion?.find((pkg) => pkg.type === "standard");
  const { convertedPrice, currency } = useCurrencyConverter(Number(standardRoom?.price));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev === room.images.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [room.images.length]);

  return (
    <div className={styles.card}>
      <div className={styles.imageCarousel}>
        <img src={room.images[currentImageIndex]} alt={room.room_type_name} className={styles.image} />
        <button
          onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? room.images.length - 1 : prev - 1))}
          className={styles.navButton + " " + styles.left}
        >
          <ChevronLeft className={styles.icon} />
        </button>
        <button
          onClick={() => setCurrentImageIndex((prev) => (prev === room.images.length - 1 ? 0 : prev + 1))}
          className={styles.navButton + " " + styles.right}
        >
          <ChevronRight className={styles.icon} />
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{formatCamelText(room.room_type_name)}</h3>
          {room.rating === 0 && <span className={styles.noRating}>New Property</span>}
          {room.rating > 0 && (
            <div className={styles.rating}>
              <div className="stars__section" style={{ width: "100%",textAlign:"right" }}>
                <Star className={styles.starIcon} fill="#26266D" />
                <span>{room.rating}</span>
              </div>
              <span className={styles.reviews}>({room.reviews} reviews)</span>
            </div>
          )}
        </div>

        <div className={styles.location}>
          <MapPin className={styles.mapIcon} />
          <span>{room.location}</span>
        </div>

        <div className={styles.details}>
          <p>Inclusive <span>{room.area_in_square_feet} ft</span></p>
          <p><img src="./guest-icon.png" alt="" /><span>1-{room.max_capacity}</span></p>
          <p><img src="./bedType.png" alt="" /><span>{room.bedType}</span></p>
        </div>

        {room.specialDeal && (
          <div className={styles.deal}>
            <div className={styles.deal__heading}>Special deal</div>
            <p>{room.specialDeal.text}</p>
          </div>
        )}

        <div className={styles.footer}>
          <div>
            <span className={styles.price}>{currencySymbolMap.get(currency)}{convertedPrice.price}</span>
            <span className={styles.perNight}>per night</span>
          </div>
          <button className={styles.selectButton} onClick={openModal}>
            SELECT ROOM
          </button>
        </div>
      </div>

      {isModalOpen && selectedRoom && (
        <RoomModal
          onClose={closeModal}
          room={selectedRoom.room}
        />
      )}
    </div>
  );
};

export default RoomCard;
