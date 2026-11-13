
import { useState } from "react";
import {
  MapPin,
  Star,
  BriefcaseMedical,
  CalendarDays,
  ArrowRight,
  X
} from "lucide-react";
import "./NurseFinder.css";

const API_URL = "http://127.0.0.1:8000";

const demoProfessionals = [
  {
    id: 1,
    name: "Priya Sharma",
    qualification: "BSc Nursing",
    experience: 5,
    services: ["nursing"],
    skills: ["Elderly care", "Wound care", "Patient monitoring"],
    city: "Delhi",
    rating: 4.8,
    verified: true,
    available: true
  },
  {
    id: 2,
    name: "Anjali Verma",
    qualification: "GNM Nursing",
    experience: 2,
    services: ["nursing"],
    skills: ["Patient care"],
    city: "Delhi",
    rating: 4.2,
    verified: true,
    available: true
  },
  {
    id: 3,
    name: "Rahul Kumar",
    qualification: "BSc Nursing",
    experience: 6,
    services: ["nursing"],
    skills: ["Patient care"],
    city: "Noida",
    rating: 4.9,
    verified: true,
    available: true
  }
];

function NurseFinder() {
  const [city, setCity] = useState("Delhi");
  const [service, setService] = useState("nursing");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);

  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [notes, setNotes] = useState("");

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingError, setBookingError] = useState("");

  const today = new Date().toLocaleDateString("en-CA");

  const searchNurses = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const response = await fetch(`${API_URL}/api/ai/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service,
          city,
          professionals: demoProfessionals
        })
      });

      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();
      setResults(data.recommendations || []);

      if (!data.recommendations?.length) {
        setError("No matching demo profiles found. Try another city.");
      }
    } catch {
      setError("Unable to connect. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

  const submitBooking = async (event) => {
    event.preventDefault();
    setBookingLoading(true);
    setBookingError("");
    setBookingMessage("");

    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_name: patientName,
          phone,
          service: "Home Nursing",
          professional_name: selectedPerson.name,
          city: selectedPerson.city,
          appointment_date: appointmentDate,
          notes
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Booking request failed.");
      }

      setBookingMessage(
        `Request submitted! Your booking ID is ${data.booking_id}. Status: ${data.status}.`
      );

      setPatientName("");
      setPhone("");
      setAppointmentDate("");
      setNotes("");

    } catch (err) {
      setBookingError(err.message || "Unable to submit booking.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <section className="nurse-finder">
      <div className="finder-heading">
        <span>CARECONNECT PROFESSIONALS</span>
        <h2>Find the Right Care for Your Family</h2>
        <p>
          Discover home healthcare professionals according
          to your location and care requirements.
        </p>
      </div>

      <form className="finder-form" onSubmit={searchNurses}>
        <div>
          <label>Healthcare Service</label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option value="nursing">Home Nursing</option>
          </select>
        </div>

        <div>
          <label>Your Location</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter your city"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search Professionals"}
          <ArrowRight size={17} />
        </button>
      </form>

      {error && <p className="finder-error">{error}</p>}

      {results.length > 0 && (
        <div className="nurse-results">
          <div className="results-heading">
            <div>
              <span>YOUR SEARCH RESULTS</span>
              <h3>Recommended Professionals</h3>
            </div>
            <p>{results.length} matching profiles</p>
          </div>

          <div className="nurse-grid">
            {results.map((person) => (
              <article className="nurse-card" key={person.id}>
                <div className="profile-top">
                  <div className="nurse-avatar">
                    {person.name.split(" ").map(word => word[0]).join("").slice(0, 2)}
                  </div>
                  <span className="availability">
                    Demo profile
                  </span>
                </div>

                <h3>{person.name}</h3>
                <p className="qualification">{person.qualification}</p>

                <div className="nurse-details">
                  <span><Star size={15} fill="#f5b942" color="#f5b942" /> {person.rating}</span>
                  <span><BriefcaseMedical size={15} /> {person.experience} years</span>
                  <span><MapPin size={15} /> {person.city}</span>
                </div>

                <div className="skills-list">
                  {person.skills?.map(skill => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>

                <div className="match-score">
                  <strong>{person.match_score}%</strong>
                  <span>Demo match score</span>
                </div>

                <p className="match-reason">{person.reason}</p>

                <button
                  type="button"
                  className="profile-button"
                  onClick={() => {
                    setSelectedPerson(person);
                    setBookingMessage("");
                    setBookingError("");
                  }}
                >
                  View Profile & Book <ArrowRight size={16} />
                </button>
              </article>
            ))}
          </div>

          <p className="demo-notice">
            Fictional demonstration profiles only. Credentials,
            ratings and availability have not been verified.
            Booking requests are not confirmed appointments.
          </p>
        </div>
      )}

      {!loading && results.length === 0 && !error && (
        <div className="finder-empty">
          <CalendarDays size={30} />
          <h3>Start your search</h3>
          <p>Enter your city to explore matching demo profiles.</p>
        </div>
      )}

      {selectedPerson && (
        <div
          className="profile-overlay"
          onClick={() => setSelectedPerson(null)}
        >
          <div
            className="profile-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              type="button"
              onClick={() => setSelectedPerson(null)}
            >
              <X size={22} />
            </button>

            <div className="nurse-avatar large-avatar">
              {selectedPerson.name.split(" ").map(word => word[0]).join("").slice(0, 2)}
            </div>

            <h2>{selectedPerson.name}</h2>
            <p>{selectedPerson.qualification}</p>

            <div className="modal-details">
              <p><BriefcaseMedical size={17} /> {selectedPerson.experience} years experience</p>
              <p><MapPin size={17} /> {selectedPerson.city}</p>
              <p>Demo profile – not verified</p>
            </div>

            <h4>Skills</h4>
            <div className="skills-list">
              {selectedPerson.skills?.map(skill => (
                <span key={skill}>{skill}</span>
              ))}
            </div>

            <hr />

            <h3 className="booking-title">Request an Appointment</h3>
            <p className="booking-subtitle">
              Enter your details to submit a booking request.
            </p>

            <form className="booking-form" onSubmit={submitBooking}>
              <label>Patient Name</label>
              <input
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Enter patient name"
                minLength={2}
                maxLength={100}
                required
              />

              <label>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                pattern="[0-9]{10,15}"
                maxLength={15}
                required
              />

              <label>Preferred Appointment Date</label>
              <input
                type="date"
                value={appointmentDate}
                min={today}
                onChange={(e) => setAppointmentDate(e.target.value)}
                required
              />

              <label>Additional Requirements</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe your care requirements (optional)"
                maxLength={500}
                rows={3}
              />

              <button
                type="submit"
                className="profile-button"
                disabled={bookingLoading}
              >
                {bookingLoading ? "Submitting..." : "Submit Booking Request"}
              </button>
            </form>

            {bookingMessage && (
              <p className="booking-success">{bookingMessage}</p>
            )}

            {bookingError && (
              <p className="booking-error">{bookingError}</p>
            )}

            <p className="booking-placeholder">
              This submits a pending demo request. It does not
              confirm a professional's availability or appointment.
              Avoid entering sensitive medical information.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default NurseFinder;
