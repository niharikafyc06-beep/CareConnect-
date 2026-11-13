
import "./App.css";
import NurseFinder from "./NurseFinder";
import MyBookings from "./MyBookings";
import Chatbot from "./Chatbot";

function App() {
  return (
    <div className="app">

      {/* Navigation */}
      <nav className="navbar">
        <a href="#home" className="brand">
          <span className="brand-icon">✚</span>
          CareConnect
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#professionals">Find Professionals</a>
          <a href="#my-bookings">My Bookings</a>
          <a href="#about">About Us</a>
        </div>

        <a href="#professionals" className="nav-button">
          Get Started
        </a>
      </nav>

      {/* Hero */}
      <section className="hero" id="home">
        <div className="hero-content">
          <span className="hero-tag">
            YOUR HEALTH, OUR PRIORITY
          </span>

          <h1>
            Quality Healthcare,
            <span> Right at Your Doorstep.</span>
          </h1>

          <p>
            Connect with home healthcare professionals and
            explore convenient care services for you and
            your loved ones.
          </p>

          <div className="hero-actions">
            <a href="#professionals" className="primary-btn">
              Find Healthcare Professionals →
            </a>

            <a href="#services" className="secondary-btn">
              Explore Services
            </a>
          </div>

          <div className="hero-points">
            <span>✓ Convenient home care</span>
            <span>✓ Simple professional search</span>
            <span>✓ Family-focused experience</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-circle">
            <div className="medical-symbol">✚</div>

            <div className="floating-card card-one">
              <span>♡</span>
              <div>
                <strong>Care with comfort</strong>
                <small>At your doorstep</small>
              </div>
            </div>

            <div className="floating-card card-two">
              <span>✚</span>
              <div>
                <strong>Healthcare support</strong>
                <small>Made simpler</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="highlights">
        <div>
          <strong>Home First</strong>
          <span>Explore care from home</span>
        </div>

        <div>
          <strong>Easy Discovery</strong>
          <span>Find suitable professionals</span>
        </div>

        <div>
          <strong>Family Focused</strong>
          <span>Designed around loved ones</span>
        </div>
      </section>

      {/* Services */}
      <section className="services-section" id="services">
        <div className="section-heading">
          <span>WHAT WE OFFER</span>

          <h2>Healthcare support for everyday needs</h2>

          <p>
            Explore services designed to make accessing
            home healthcare more convenient.
          </p>
        </div>

        <div className="service-grid">
          <article className="service-card">
            <div className="service-icon">🩺</div>
            <h3>Home Nursing</h3>
            <p>
              Explore nursing support and patient care services at home.
            </p>
          </article>

          <article className="service-card">
            <div className="service-icon">🧓</div>
            <h3>Elderly Care</h3>
            <p>
              Discover assistance options for elderly family members.
            </p>
          </article>

          <article className="service-card">
            <div className="service-icon">🏃</div>
            <h3>Physiotherapy</h3>
            <p>
              Find physiotherapy professionals for rehabilitation support.
            </p>
          </article>

          <article className="service-card">
            <div className="service-icon">👨‍⚕️</div>
            <h3>Doctor Visits</h3>
            <p>
              Explore options for professional medical consultations.
            </p>
          </article>
        </div>
      </section>

      {/* Professional Finder */}
      <div id="professionals">
        <NurseFinder />
      </div>

      {/* My Bookings */}
      <MyBookings />

      {/* About */}
      <section className="about-section" id="about">
        <div className="about-icon">✚</div>

        <div>
          <span>WHY CARECONNECT?</span>

          <h2>Making home healthcare easier to discover.</h2>

          <p>
            CareConnect brings healthcare discovery into one
            convenient experience. Our goal is to help families
            explore care options and connect with professionals
            more easily.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div>
          <h2>✚ CareConnect</h2>
          <p>Your trusted home healthcare companion.</p>
        </div>

        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#professionals">Find Professionals</a>
          <a href="#my-bookings">My Bookings</a>
        </div>

        <p className="copyright">
          © 2026 CareConnect. All rights reserved.
        </p>
      </footer>

      {/* AI Chatbot */}
      <Chatbot />

    </div>
  );
}

export default App;
