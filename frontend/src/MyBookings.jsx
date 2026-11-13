
import { useState } from "react";
import { Search, CalendarDays, ClipboardList } from "lucide-react";
import "./MyBookings.css";

const API_URL = "http://127.0.0.1:8000";

function MyBookings() {
  const [phone, setPhone] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const findBookings = async (event) => {
    event.preventDefault();

    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(false);
    setBookings([]);

    try {
      const response = await fetch(
        `${API_URL}/api/bookings?phone=${encodeURIComponent(phone.trim())}`
      );

      if (!response.ok) {
        throw new Error("Unable to fetch bookings.");
      }

      const result = await response.json();

      setBookings(result.bookings || []);
      setSearched(true);
    } catch (err) {
      setError("Could not connect to CareConnect. Please check the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="my-bookings" id="my-bookings">
      <div className="bookings-heading">
        <span>YOUR CARE JOURNEY</span>
        <h2>Track Your Bookings</h2>
        <p>
          Check the appointment requests you have submitted
          through CareConnect.
        </p>
      </div>

      <form className="booking-search" onSubmit={findBookings}>
        <input
          type="tel"
          placeholder="Enter your booking phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          maxLength={15}
          required
        />

        <button type="submit" disabled={loading}>
          <Search size={18} />
          {loading ? "Searching..." : "Find Bookings"}
        </button>
      </form>

      {error && <p className="booking-search-error">{error}</p>}

      {searched && bookings.length === 0 && (
        <div className="no-bookings">
          <ClipboardList size={38} />
          <h3>No bookings found</h3>
          <p>
            We couldn't find any appointment requests for this number.
          </p>
        </div>
      )}

      {bookings.length > 0 && (
        <div className="booking-results">
          <h3>Your Appointment Requests ({bookings.length})</h3>

          <div className="booking-list">
            {bookings.map((booking) => (
              <article className="booking-card" key={booking.id}>
                <div className="booking-card-top">
                  <div className="booking-card-icon">
                    <CalendarDays size={23} />
                  </div>

                  <span
                    className={`booking-status ${(
                      booking.status || "Pending"
                    ).toLowerCase()}`}
                  >
                    {booking.status || "Pending"}
                  </span>
                </div>

                <h3>{booking.service}</h3>

                <p>
                  <strong>Booking ID:</strong> #{booking.id}
                </p>

                <p>
                  <strong>Professional:</strong>{" "}
                  {booking.professional_name}
                </p>

                <p>
                  <strong>Appointment date:</strong>{" "}
                  {booking.appointment_date}
                </p>

                <p>
                  <strong>City:</strong> {booking.city}
                </p>

                {booking.notes && (
                  <p>
                    <strong>Notes:</strong> {booking.notes}
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      )}

      <p className="booking-privacy-note">
        Demo feature: booking lookup currently uses a phone number only.
        Do not use real patient information until secure authentication
        and access controls are implemented.
      </p>
    </section>
  );
}

export default MyBookings;
