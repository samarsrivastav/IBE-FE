import { JSX, useEffect, useState } from "react";
import "./BookingSummaryPage.scss";
import { ExpandableSection } from "../../Component/ExpandableSection/ExpandableSection";
import axios from "axios";
import { useParams } from "react-router-dom";
import { formatCamelText } from "../../utils/textFormatUtils";
import { sendConfirmationEmail } from "./utils";
import { Loader, AlertCircle } from "lucide-react";
import CancelRoomButton from "../../Component/ExpandableSection/CancelButton/CancelButton";
import { Alert, Snackbar } from "@mui/material";

const DeletedBookingState = (): JSX.Element => {
  return (
    <div className="deleted-booking-state">
      <div className="deleted-booking-state__container">
        <AlertCircle size={48} className="deleted-booking-state__icon" />
        <h1>Booking Deleted</h1>
        <p>This booking has been cancelled and is no longer active.</p>
        <p>If you believe this is an error, please contact our support team.</p>
        <button 
          className="deleted-booking-state__button"
          onClick={() => window.location.href = '/'}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

const BookingSummaryPage = (): JSX.Element => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [isPrinting, setIsPrinting] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_CONFIRMATION_PAGE_API+bookingId);
        const data = response.data;

        if (data) {
          // Check if the booking is active
          if (data.confirmationDetails?.isActive === false) {
            setBookingData({ ...data, isDeleted: true });
          } else {
            setBookingData(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch booking data:", error);
        setError("Failed to fetch booking details. Please try again later.");
      }
    };

    fetchBookingData();
  }, [bookingId]);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        setIsPrinting(false);
      }, 1000);
    }, 300);
  };

  if (error) {
    return (
      <div className="error-state">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  if (!bookingData) return <Loader/>;

  // If booking is deleted, show the deleted state
  if (bookingData.isDeleted) {
    return <DeletedBookingState />;
  }

  const {
    confirmationDetails,
    travelerInfo,
    billingInfo,
    paymentInfo,
    imageUrl,
  } = bookingData;

  const handleEmail = async () => {
    setIsEmailSending(true);
    try {
      const response = await sendConfirmationEmail(
        bookingId,
        travelerInfo.email
      );
      if (response.status === 200) {
        console.log("Confirmation email sent successfully!");
      }
    } catch (error) {
      alert("Failed to send confirmation email. Please try again.");
      console.error("Failed to send confirmation email:", error);
    } finally {
      setIsEmailSending(false);
    }
  };

  return (
    <div className="confirmation-page">
      <div className="confirmation-page__container">
        <main className="confirmation-page__main">
          <div className="confirmation-page__main-title">
            <h1>Upcoming reservation #{bookingId}</h1>
            <div className="actions">
              <button onClick={handlePrint}>Print</button>
              <button onClick={handleEmail} disabled={isEmailSending}>
                {isEmailSending ? (
                  <Loader className="email-loader" size={16} />
                ) : (
                  "Email"
                )}
              </button>
            </div>
          </div>

          <div className="confirmation-page__card">
            <div className="confirmation-page__card-header">
              <div className="confirmation-page__card-header-title">
                <h2>Room 1: {formatCamelText(confirmationDetails.roomName)}</h2>
                <span>
                  {confirmationDetails.adultCount} adults,{" "}
                  {confirmationDetails.childCount} child
                </span>
              </div>
              <CancelRoomButton
                email={travelerInfo.email}
                confirmationId={bookingId}
              />
            </div>

            <div className="confirmation-page__card-content">
              <div className="room-details">
                <img className="room-details__image" alt="Room" src={imageUrl} />

                <div className="room-details__info">
                  <div className="dates">
                    <div className="dates__card">
                      <span>Check in</span>
                      <span>{new Date(confirmationDetails.startDate).getDate()}</span>
                      <span>
                        {new Date(confirmationDetails.startDate).toLocaleString("default", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="dates__card">
                      <span>Check Out</span>
                      <span>{new Date(confirmationDetails.endDate).getDate()}</span>
                      <span>
                        {new Date(confirmationDetails.endDate).toLocaleString("default", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {confirmationDetails.promotionTitle && (
                    <div className="package">
                      <h3>{confirmationDetails.promotionTitle}</h3>
                      <p>
                        {confirmationDetails.promotionDescription}
                        <br />
                        <br />
                        Free cancellation available.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="priceDetails">
                <span>${confirmationDetails.nightlyRate}/night total</span>
              </div>

              <div className="separator" />

              <div className="booking-summary">
                <ExpandableSection
                  title="Room Total summary"
                  items={[
                    {
                      label: "Nightly rate",
                      value: confirmationDetails.nightlyRate,
                      type: "price",
                    },
                    {
                      label: "Subtotal",
                      value: confirmationDetails.subTotal,
                      type: "price",
                    },
                    {
                      label: "Taxes, Surcharges, Fees",
                      value: confirmationDetails.taxes,
                      type: "price",
                    },
                    {
                      label: "Total for stay",
                      value: confirmationDetails.totalCost,
                      type: "price",
                    },
                  ]}
                  forceExpand={isPrinting}
                />

                <div className="separator" />

                <ExpandableSection
                  title="Guest Information"
                  items={[
                    {
                      label: "First Name",
                      value: travelerInfo.firstName,
                      type: "text",
                    },
                    {
                      label: "Last Name",
                      value: travelerInfo.lastName,
                      type: "text",
                    },
                    {
                      label: "Phone",
                      value: travelerInfo.phoneNumber,
                      type: "text",
                    },
                    {
                      label: "Email",
                      value: travelerInfo.email,
                      type: "text",
                    },
                  ]}
                  forceExpand={isPrinting}
                />

                <div className="separator" />

                <ExpandableSection
                  title="Billing Address"
                  items={[
                    {
                      label: "First Name",
                      value: billingInfo.firstName,
                      type: "text",
                    },
                    {
                      label: "Last Name",
                      value: billingInfo.lastName,
                      type: "text",
                    },
                    {
                      label: "Address",
                      value:
                        billingInfo.mailingAddress1 +
                        (billingInfo.mailingAddress2
                          ? `, ${billingInfo.mailingAddress2}`
                          : ""),
                      type: "text",
                    },
                    { label: "Country", value: billingInfo.country, type: "text" },
                    { label: "City", value: billingInfo.city, type: "text" },
                    { label: "State", value: billingInfo.state, type: "text" },
                    { label: "Email", value: billingInfo.email, type: "text" },
                  ]}
                  forceExpand={isPrinting}
                />

                <div className="separator" />

                <ExpandableSection
                  title="Payment Information"
                  items={[
                    {
                      label: "Card Number",
                      value: paymentInfo.cardNumber,
                      type: "text",
                    },
                  ]}
                  forceExpand={isPrinting}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BookingSummaryPage;
