import React, { useEffect, useState, useRef } from "react";
import "./BookingSummaryPage.scss";
import { ExpandableSection } from "../../Component/ExpandableSection/ExpandableSection";
import axios from "axios";
import { useParams } from "react-router-dom";
import { formatCamelText } from "../../utils/textFormatUtils";
import { sendConfirmationEmail } from "./utils";
import { Loader, AlertCircle } from "lucide-react";
import CancelRoomButton from "../../Component/ExpandableSection/CancelButton/CancelButton";
import { Alert, Snackbar } from "@mui/material";
import useAnalytics from "../../Hooks/useAnalytics";

const DeletedBookingState = (): React.ReactElement => {
  const analytics = useAnalytics();
  
  const handleHomeReturn = () => {
    analytics.logEvent('BookingSummary', 'Click', 'ReturnToHome_DeletedBooking');
    window.location.href = '/';
  };
  
  return (
    <div className="deleted-booking-state">
      <div className="deleted-booking-state__container">
        <AlertCircle size={48} className="deleted-booking-state__icon" />
        <h1>Booking Deleted</h1>
        <p>This booking has been cancelled and is no longer active.</p>
        <p>If you believe this is an error, please contact our support team.</p>
        <button 
          className="deleted-booking-state__button"
          onClick={handleHomeReturn}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

const BookingSummaryPage = (): React.ReactElement => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [isPrinting, setIsPrinting] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const analytics = useAnalytics();
  const dataFetched = useRef(false);

  useEffect(() => {
    // Track booking summary page view with booking ID - this should only happen once
    if (bookingId) {
      analytics.logEvent('BookingSummary', 'View', `BookingID: ${bookingId}`);
    }

    // Only fetch if we haven't already fetched data and we have a booking ID
    if (!dataFetched.current && bookingId) {
      const fetchBookingData = async () => {
        try {
          const response = await axios.get(import.meta.env.VITE_CONFIRMATION_PAGE_API+bookingId);
          const data = response.data;

          if (data) {
            // Check if the booking is active
            if (data.confirmationDetails?.isActive === false) {
              setBookingData({ ...data, isDeleted: true });
              // Track deleted booking view
              analytics.logEvent('BookingSummary', 'ViewDeletedBooking', `BookingID: ${bookingId}`);
            } else {
              setBookingData(data);
              // Track successful booking data load
              analytics.logEvent('BookingSummary', 'DataLoaded', `BookingID: ${bookingId}`);
            }
          }
          // Mark that we've fetched data
          dataFetched.current = true;
        } catch (error) {
          console.error("Failed to fetch booking data:", error);
          setError("Failed to fetch booking details. Please try again later.");
          // Track error
          analytics.logEvent('BookingSummary', 'Error', `Failed to fetch booking ${bookingId}`);
          // Mark that we've attempted to fetch data
          dataFetched.current = true;
        }
      };

      fetchBookingData();
    }
  }, [bookingId]); // Remove analytics from dependency array

  const handlePrint = () => {
    // Track print button click
    analytics.logEvent('BookingSummary', 'Click', `Print_BookingID: ${bookingId}`);
    
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
    // Track email button click
    analytics.logEvent('BookingSummary', 'Click', `Email_BookingID: ${bookingId}`);
    
    setIsEmailSending(true);
    try {
      const response = await sendConfirmationEmail(
        bookingId,
        travelerInfo.email
      );
      if (response.status === 200) {
        console.log("Confirmation email sent successfully!");
        // Track successful email send
        analytics.logEvent('BookingSummary', 'EmailSent', `Success_BookingID: ${bookingId}`);
      }
    } catch (error) {
      alert("Failed to send confirmation email. Please try again.");
      console.error("Failed to send confirmation email:", error);
      // Track email error
      analytics.logEvent('BookingSummary', 'Error', `EmailFailed_BookingID: ${bookingId}`);
    } finally {
      setIsEmailSending(false);
    }
  };

  // Create a tracking wrapper for the cancel button
  const trackCancelClick = () => {
    analytics.logEvent('BookingSummary', 'Click', `Cancel_BookingID: ${bookingId}`);
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
              <div onClick={trackCancelClick}>
                <CancelRoomButton
                  email={travelerInfo.email}
                  confirmationId={bookingId}
                />
              </div>
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
