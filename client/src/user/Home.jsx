import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import heroImg from '../assets/hero.png';

const Home = () => {
  const navigate = useNavigate();

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  // Fare Estimator State
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [cabType, setCabType] = useState('Sedan');
  const [distance, setDistance] = useState(12); // default km
  const [estimate, setEstimate] = useState(0);

  // Load user session on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminToken = localStorage.getItem('adminToken');
    const storedName = localStorage.getItem('userName');

    if (token) {
      setIsLoggedIn(true);
      setUserName(storedName || 'User');
    }
    if (adminToken) {
      setIsAdminLoggedIn(true);
    }
  }, []);

  // Update fare estimate dynamically
  useEffect(() => {
    const rates = {
      Sedan: { base: 60, perKm: 12 },
      SUV: { base: 100, perKm: 18 },
      Luxury: { base: 200, perKm: 30 },
    };

    const selectedRate = rates[cabType] || rates.Sedan;
    const calculatedFare = selectedRate.base + distance * selectedRate.perKm;
    setEstimate(calculatedFare);
  }, [cabType, distance]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    setIsAdminLoggedIn(false);
    setUserName('');
    navigate('/');
  };

  const handleBookShortcut = () => {
    if (isLoggedIn) {
      navigate('/uhome');
    } else {
      navigate('/login');
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column text-light bg-dark" style={{ overflowX: 'hidden' }}>
      
      {/* 1. STICKY GLASSMORPHIC NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark sticky-top px-3 py-3">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-primary fs-3" to="/">
            <i className="bi bi-taxi-front-fill text-primary"></i>
            <span>Ucab</span>
          </Link>
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#landingNavbar"
            aria-controls="landingNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="landingNavbar">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-3">
              <li className="nav-item">
                <button onClick={() => scrollToSection('features')} className="nav-link btn btn-link border-0 text-start py-1">
                  Features
                </button>
              </li>
              <li className="nav-item">
                <button onClick={() => scrollToSection('fleets')} className="nav-link btn btn-link border-0 text-start py-1">
                  Our Fleets
                </button>
              </li>
              <li className="nav-item">
                <button onClick={() => scrollToSection('estimator')} className="nav-link btn btn-link border-0 text-start py-1">
                  Fare Estimator
                </button>
              </li>
              <li className="nav-item">
                <button onClick={() => scrollToSection('reviews')} className="nav-link btn btn-link border-0 text-start py-1">
                  Reviews
                </button>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-3">
              {isLoggedIn ? (
                <>
                  <span className="text-secondary d-none d-md-inline">
                    Welcome back, <strong className="text-primary">{userName}</strong>
                  </span>
                  <Link to="/uhome" className="btn btn-primary px-4 py-2 shadow-sm">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="btn btn-outline-danger px-3 py-2">
                    Logout
                  </button>
                </>
              ) : isAdminLoggedIn ? (
                <>
                  <span className="text-secondary d-none d-md-inline">
                    Admin Session Active
                  </span>
                  <Link to="/ahome" className="btn btn-danger px-4 py-2 shadow-sm">
                    Admin Panel
                  </Link>
                  <button onClick={handleLogout} className="btn btn-outline-danger px-3 py-2">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline-light px-4 py-2">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn btn-primary px-4 py-2 shadow-lg">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="container py-5 my-md-4 animate-fade-in">
        <div className="row g-5 align-items-center">
          {/* Hero Content */}
          <div className="col-lg-6">
            <div className="hero-badge">
              <i className="bi bi-stars"></i>
              <span>Premium Ride-Hailing Service</span>
            </div>
            
            <h1 className="display-3 fw-extrabold mb-3 lh-sm" style={{ fontWeight: 800 }}>
              Premium Ride Experience, <span className="text-gradient-gold">Redefined.</span>
            </h1>
            
            <p className="lead text-secondary fs-5 mb-5 lh-base">
              Experience the pinnacle of luxury, reliability, and safety. Book your professional chauffeur-driven ride instantly and travel with complete peace of mind.
            </p>

            <div className="d-flex flex-wrap gap-3 mb-5">
              {isLoggedIn ? (
                <Link to="/uhome" className="btn btn-primary btn-lg px-5 py-3 shadow-lg fs-6">
                  Book A Cab Now <i className="bi bi-arrow-right ms-2"></i>
                </Link>
              ) : isAdminLoggedIn ? (
                <Link to="/ahome" className="btn btn-danger btn-lg px-5 py-3 shadow-lg fs-6">
                  Access Admin Dashboard <i className="bi bi-arrow-right ms-2"></i>
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg px-5 py-3 shadow-lg fs-6">
                    Get Started <i className="bi bi-arrow-right ms-2"></i>
                  </Link>
                  <button onClick={() => scrollToSection('fleets')} className="btn btn-outline-light btn-lg px-4 py-3 fs-6">
                    Explore Fleets
                  </button>
                </>
              )}
            </div>

            {/* Quick Stats Grid */}
            <div className="row g-4 border-top border-secondary pt-4" style={{ borderColor: 'rgba(255,255,255,0.08) !important' }}>
              <div className="col-6 col-sm-3">
                <h4 className="fw-bold text-primary mb-1">15k+</h4>
                <p className="small text-secondary mb-0">Riders Served</p>
              </div>
              <div className="col-6 col-sm-3">
                <h4 className="fw-bold text-primary mb-1">120+</h4>
                <p className="small text-secondary mb-0">Elite Drivers</p>
              </div>
              <div className="col-6 col-sm-3">
                <h4 className="fw-bold text-primary mb-1">4.9★</h4>
                <p className="small text-secondary mb-0">Customer Rating</p>
              </div>
              <div className="col-6 col-sm-3">
                <h4 className="fw-bold text-primary mb-1">&lt;15m</h4>
                <p className="small text-secondary mb-0">Avg Pickup Time</p>
              </div>
            </div>
          </div>

          {/* Hero Illustration / Preview Image */}
          <div className="col-lg-6 text-center text-lg-end">
            <div className="position-relative d-inline-block animate-float">
              {/* Decorative radial background glow behind the image */}
              <div className="position-absolute translate-middle-x" style={{
                width: '120%',
                height: '120%',
                top: '-10%',
                left: '50%',
                background: 'radial-gradient(circle, rgba(255, 184, 0, 0.08) 0%, transparent 70%)',
                zIndex: -1,
                pointerEvents: 'none'
              }}></div>
              
              <img
                src={heroImg}
                alt="Premium Cab Service"
                className="img-fluid rounded-4 shadow-lg border border-secondary"
                style={{
                  maxHeight: '480px',
                  objectFit: 'cover',
                  borderColor: 'rgba(255, 255, 255, 0.06) !important',
                  boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6)'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. PREMIUM SERVICES / WHY CHOOSE US */}
      <section id="features" className="py-5 bg-dark" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="container py-4">
          <div className="text-center max-w-600 mx-auto mb-5">
            <h2 className="display-5 fw-bold text-gradient-gold mb-3">Why Travel with Ucab?</h2>
            <p className="text-secondary fs-5">We are dedicated to providing the safest, most comfortable, and professional travel solutions.</p>
          </div>

          <div className="row g-4 mt-2">
            {/* Card 1 */}
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 hover-glow-card p-4">
                <div className="card-body p-0">
                  <div className="d-inline-flex p-3 rounded-3 bg-primary bg-opacity-10 text-primary mb-4">
                    <i className="bi bi-shield-check fs-3"></i>
                  </div>
                  <h4 className="fw-bold mb-3">Vetted Chauffeurs</h4>
                  <p className="text-secondary mb-0">Every driver is strictly background verified, professionally trained, and committed to security.</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 hover-glow-card p-4">
                <div className="card-body p-0">
                  <div className="d-inline-flex p-3 rounded-3 bg-primary bg-opacity-10 text-primary mb-4">
                    <i className="bi bi-geo-alt fs-3"></i>
                  </div>
                  <h4 className="fw-bold mb-3">Live Fleet Tracking</h4>
                  <p className="text-secondary mb-0">Monitor your driver in real-time, share your ETA with friends/family, and stay in control.</p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 hover-glow-card p-4">
                <div className="card-body p-0">
                  <div className="d-inline-flex p-3 rounded-3 bg-primary bg-opacity-10 text-primary mb-4">
                    <i className="bi bi-wallet2 fs-3"></i>
                  </div>
                  <h4 className="fw-bold mb-3">No Surge Guarantee</h4>
                  <p className="text-secondary mb-0">Our rates are fixed. No sudden price spikes or hidden service fees. You pay exactly what you see.</p>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 hover-glow-card p-4">
                <div className="card-body p-0">
                  <div className="d-inline-flex p-3 rounded-3 bg-primary bg-opacity-10 text-primary mb-4">
                    <i className="bi bi-headset fs-3"></i>
                  </div>
                  <h4 className="fw-bold mb-3">24/7 Concierge</h4>
                  <p className="text-secondary mb-0">Our support desk is always online to help with bookings, custom routes, or retrieve lost items.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FLEET SHOWCASE */}
      <section id="fleets" className="py-5 bg-dark bg-opacity-75" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="container py-4">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
            <h2 className="display-5 fw-bold text-gradient-gold mb-3">Choose Your Ride</h2>
            <p className="text-secondary fs-5">A premium collection of high-end vehicles customized for every travel requirement.</p>
          </div>

          <div className="row g-4 mt-2">
            {/* Cab 1: Sedan */}
            <div className="col-lg-4">
              <div className="card h-100 hover-glow-card p-4">
                <div className="card-body p-0 d-flex flex-column justify-content-between">
                  <div>
                    <span className="badge bg-secondary bg-opacity-25 text-light mb-3">Standard Economy</span>
                    <h3 className="fw-bold mb-2">Elegant Sedan</h3>
                    <p className="text-secondary mb-4 small">Perfect for comfortable daily commutes and business travel.</p>
                    
                    <div className="border-top border-bottom border-secondary py-3 my-4" style={{ borderColor: 'rgba(255,255,255,0.08) !important' }}>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-secondary"><i className="bi bi-people me-2"></i> Capacity</span>
                        <span className="fw-semibold">4 Passengers</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-secondary"><i className="bi bi-briefcase me-2"></i> Luggage Capacity</span>
                        <span className="fw-semibold">2 Medium Bags</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-secondary"><i className="bi bi-coin me-2"></i> Base Price</span>
                        <span className="text-primary fw-bold">₹60 + ₹12/km</span>
                      </div>
                    </div>

                    <ul className="list-unstyled mb-5 d-flex flex-column gap-2 text-secondary small">
                      <li><i className="bi bi-check-circle-fill text-primary me-2"></i> Temperature Control AC</li>
                      <li><i className="bi bi-check-circle-fill text-primary me-2"></i> High-speed USB Charging Ports</li>
                      <li><i className="bi bi-check-circle-fill text-primary me-2"></i> Professional Navigation Assistant</li>
                    </ul>
                  </div>

                  <button onClick={handleBookShortcut} className="btn btn-outline-primary w-100 py-3 fw-bold">
                    Select Sedan
                  </button>
                </div>
              </div>
            </div>

            {/* Cab 2: SUV */}
            <div className="col-lg-4">
              <div className="card h-100 hover-glow-card p-4" style={{ borderColor: 'rgba(255,184,0,0.15) !important' }}>
                <div className="card-body p-0 d-flex flex-column justify-content-between">
                  <div>
                    <span className="badge bg-primary bg-opacity-25 text-primary mb-3">Most Popular</span>
                    <h3 className="fw-bold mb-2">Executive SUV</h3>
                    <p className="text-secondary mb-4 small">Spacious travel for family outings, airport runs, or group commutes.</p>
                    
                    <div className="border-top border-bottom border-secondary py-3 my-4" style={{ borderColor: 'rgba(255,255,255,0.08) !important' }}>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-secondary"><i className="bi bi-people me-2"></i> Capacity</span>
                        <span className="fw-semibold">6 Passengers</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-secondary"><i className="bi bi-briefcase me-2"></i> Luggage Capacity</span>
                        <span className="fw-semibold">4 Large Bags</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-secondary"><i className="bi bi-coin me-2"></i> Base Price</span>
                        <span className="text-primary fw-bold">₹100 + ₹18/km</span>
                      </div>
                    </div>

                    <ul className="list-unstyled mb-5 d-flex flex-column gap-2 text-secondary small">
                      <li><i className="bi bi-check-circle-fill text-primary me-2"></i> Rear Captain Seats & AC</li>
                      <li><i className="bi bi-check-circle-fill text-primary me-2"></i> High Roof & Ample Legroom</li>
                      <li><i className="bi bi-check-circle-fill text-primary me-2"></i> Refreshments & Water Onboard</li>
                    </ul>
                  </div>

                  <button onClick={handleBookShortcut} className="btn btn-primary w-100 py-3 fw-bold">
                    Select SUV
                  </button>
                </div>
              </div>
            </div>

            {/* Cab 3: Luxury */}
            <div className="col-lg-4">
              <div className="card h-100 hover-glow-card p-4">
                <div className="card-body p-0 d-flex flex-column justify-content-between">
                  <div>
                    <span className="badge bg-secondary bg-opacity-25 text-light mb-3">VIP Service</span>
                    <h3 className="fw-bold mb-2">Luxury Elite</h3>
                    <p className="text-secondary mb-4 small">Travel in style and premium status for special events or VIP transfers.</p>
                    
                    <div className="border-top border-bottom border-secondary py-3 my-4" style={{ borderColor: 'rgba(255,255,255,0.08) !important' }}>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-secondary"><i className="bi bi-people me-2"></i> Capacity</span>
                        <span className="fw-semibold">4 Passengers</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-secondary"><i className="bi bi-briefcase me-2"></i> Luggage Capacity</span>
                        <span className="fw-semibold">3 Medium Bags</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-secondary"><i className="bi bi-coin me-2"></i> Base Price</span>
                        <span className="text-primary fw-bold">₹200 + ₹30/km</span>
                      </div>
                    </div>

                    <ul className="list-unstyled mb-5 d-flex flex-column gap-2 text-secondary small">
                      <li><i className="bi bi-check-circle-fill text-primary me-2"></i> Hand-stitched Leather Seats</li>
                      <li><i className="bi bi-check-circle-fill text-primary me-2"></i> Premium Surround Sound System</li>
                      <li><i className="bi bi-check-circle-fill text-primary me-2"></i> High-speed In-ride Wi-Fi</li>
                    </ul>
                  </div>

                  <button onClick={handleBookShortcut} className="btn btn-outline-primary w-100 py-3 fw-bold">
                    Select Luxury
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE FARE ESTIMATOR */}
      <section id="estimator" className="py-5 bg-dark" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="container py-4">
          <div className="row g-5 align-items-center">
            {/* Estimator Controls */}
            <div className="col-lg-6">
              <span className="text-primary fw-bold text-uppercase tracking-wider small"><i className="bi bi-calculator me-2"></i>Fare Calculator</span>
              <h2 className="display-5 fw-bold text-gradient-gold mt-2 mb-4">Estimate Your Travel</h2>
              <p className="text-secondary mb-4 fs-6">Plan your budgets upfront. Select your route parameters and cab configurations below to get an instant receipt breakdown.</p>
              
              <div className="glass-card p-4 border border-secondary" style={{ background: 'rgba(25, 27, 36, 0.4) !important' }}>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-bold">Pickup Location</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Airport Terminal 2"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-bold">Drop-off Location</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Downtown Central Hotel"
                      value={drop}
                      onChange={(e) => setDrop(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label text-secondary small fw-bold mb-3 d-block">Select Vehicle Type</label>
                  <div className="row g-2">
                    {['Sedan', 'SUV', 'Luxury'].map((type) => (
                      <div className="col-4" key={type}>
                        <button
                          type="button"
                          className={`btn w-100 py-3 d-flex flex-column align-items-center gap-1 border ${
                            cabType === type
                              ? 'btn-primary border-primary text-dark'
                              : 'btn-dark border-secondary text-secondary'
                          }`}
                          onClick={() => setCabType(type)}
                          style={{
                            borderRadius: '10px',
                            background: cabType === type ? 'var(--accent-gradient)' : 'rgba(20, 21, 28, 0.5)'
                          }}
                        >
                          <i className={`bi fs-4 ${
                            type === 'Sedan' ? 'bi-car-front-fill' : type === 'SUV' ? 'bi-truck-flatbed' : 'bi-stars'
                          }`}></i>
                          <span className="small fw-bold">{type}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <label className="form-label text-secondary small fw-bold mb-0">Estimate Distance</label>
                    <span className="text-primary fw-bold">{distance} km</span>
                  </div>
                  <input
                    type="range"
                    className="form-range"
                    min="1"
                    max="100"
                    value={distance}
                    onChange={(e) => setDistance(parseInt(e.target.value))}
                    style={{ accentColor: 'var(--primary-accent)' }}
                  />
                  <div className="d-flex justify-content-between text-secondary" style={{ fontSize: '0.75rem' }}>
                    <span>1 km</span>
                    <span>100 km</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Estimator Dynamic Receipt */}
            <div className="col-lg-6">
              <div className="glass-card p-4 border border-secondary shadow-lg position-relative" style={{
                background: 'linear-gradient(145deg, rgba(30, 32, 45, 0.6) 0%, rgba(20, 21, 28, 0.7) 100%) !important'
              }}>
                <div className="d-flex justify-content-between align-items-center pb-3 border-bottom border-secondary mb-4" style={{ borderColor: 'rgba(255,255,255,0.08) !important' }}>
                  <h4 className="fw-bold mb-0 text-light"><i className="bi bi-receipt-cutoff text-primary me-2"></i>Fare Receipt</h4>
                  <span className="badge bg-primary bg-opacity-25 text-primary py-2 px-3 fw-bold" style={{ letterSpacing: '1px' }}>ESTIMATE</span>
                </div>

                <div className="mb-4">
                  <div className="text-center py-4 bg-dark bg-opacity-50 rounded-3 border border-secondary mb-4" style={{ borderColor: 'rgba(255,255,255,0.04) !important' }}>
                    <p className="small text-secondary mb-1">TOTAL ESTIMATED FARE</p>
                    <h1 className="display-4 fw-extrabold text-primary mb-0">₹{estimate}</h1>
                    <p className="text-secondary small mt-2 mb-0">Includes all taxes and toll charges</p>
                  </div>

                  <div className="d-flex flex-column gap-3 text-secondary">
                    <div className="d-flex justify-content-between">
                      <span>Pickup Route</span>
                      <span className="text-light text-end max-w-250 text-truncate">{pickup || 'Not set'}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Drop Route</span>
                      <span className="text-light text-end max-w-250 text-truncate">{drop || 'Not set'}</span>
                    </div>
                    <hr className="border-secondary my-1" style={{ opacity: 0.15 }} />
                    <div className="d-flex justify-content-between">
                      <span>Base Fare (First 2 km)</span>
                      <span className="text-light">₹{cabType === 'Sedan' ? 60 : cabType === 'SUV' ? 100 : 200}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Distance Charge ({distance} km)</span>
                      <span className="text-light">₹{distance * (cabType === 'Sedan' ? 12 : cabType === 'SUV' ? 18 : 30)}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Night Surge & Tolls</span>
                      <span className="text-success fw-bold">FREE</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-top border-secondary" style={{ borderColor: 'rgba(255,255,255,0.08) !important' }}>
                  <button onClick={handleBookShortcut} className="btn btn-primary w-100 py-3 fw-bold shadow-lg">
                    Book Ride Now <i className="bi bi-chevron-right ms-2"></i>
                  </button>
                  <p className="text-center text-secondary small mt-3 mb-0">
                    *Actual fare may vary slightly based on traffic parameters.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="py-5 bg-dark" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="container py-4">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
            <h2 className="display-5 fw-bold text-gradient-gold mb-3">Booking Made Simple</h2>
            <p className="text-secondary fs-5">Get a premium ride set up on your smartphone in less than 60 seconds.</p>
          </div>

          <div className="row g-4 mt-2">
            {/* Step 1 */}
            <div className="col-sm-6 col-lg-3 text-center">
              <div className="how-it-works-step p-3">
                <div className="step-icon mb-4 shadow-sm">
                  <i className="bi bi-geo-alt fs-2"></i>
                </div>
                <div className="step-number">1</div>
                <h4 className="fw-bold text-light mb-2">Set Route</h4>
                <p className="small text-secondary px-3">Choose your origin and destination routes instantly on the portal.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="col-sm-6 col-lg-3 text-center">
              <div className="how-it-works-step p-3">
                <div className="step-icon mb-4 shadow-sm">
                  <i className="bi bi-car-front fs-2"></i>
                </div>
                <div className="step-number">2</div>
                <h4 className="fw-bold text-light mb-2">Choose Fleet</h4>
                <p className="small text-secondary px-3">Filter based on pricing, passenger count, and utility requirements.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="col-sm-6 col-lg-3 text-center">
              <div className="how-it-works-step p-3">
                <div className="step-icon mb-4 shadow-sm">
                  <i className="bi bi-credit-card fs-2"></i>
                </div>
                <div className="step-number">3</div>
                <h4 className="fw-bold text-light mb-2">Pay securely</h4>
                <p className="small text-secondary px-3">Link cards or settle fares easily with cash post-ride confirmation.</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="col-sm-6 col-lg-3 text-center">
              <div className="how-it-works-step p-3">
                <div className="step-icon mb-4 shadow-sm">
                  <i className="bi bi-emoji-smile fs-2"></i>
                </div>
                <div className="step-number">4</div>
                <h4 className="fw-bold text-light mb-2">Enjoy ride</h4>
                <p className="small text-secondary px-3">Sit back, grab onboard refreshments, and enjoy a premium travel experience.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section id="reviews" className="py-5 bg-dark bg-opacity-75" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="container py-4">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
            <h2 className="display-5 fw-bold text-gradient-gold mb-3">Loved by Riders</h2>
            <p className="text-secondary fs-5">Read direct reviews from our premium corporate and daily riders.</p>
          </div>

          <div className="row g-4 mt-2">
            {/* Testimonial 1 */}
            <div className="col-md-4">
              <div className="card h-100 testimonial-card p-4">
                <div className="card-body p-0 d-flex flex-column justify-content-between">
                  <div>
                    <div className="text-primary mb-3">
                      <i className="bi bi-star-fill me-1"></i>
                      <i className="bi bi-star-fill me-1"></i>
                      <i className="bi bi-star-fill me-1"></i>
                      <i className="bi bi-star-fill me-1"></i>
                      <i className="bi bi-star-fill"></i>
                    </div>
                    <p className="text-secondary fs-6 mb-4 font-italic">
                      "Ucab has completely changed how I commute to my corporate office. The chauffeurs are incredibly polite, the luxury cabs are spotless, and the pricing is completely transparent."
                    </p>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center fw-bold text-dark" style={{ width: '45px', height: '45px', background: 'var(--accent-gradient)' }}>
                      AJ
                    </div>
                    <div>
                      <h6 className="fw-bold text-light mb-0">Ananya Joshi</h6>
                      <small className="text-secondary">Creative Director, Apex Design</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="col-md-4">
              <div className="card h-100 testimonial-card p-4">
                <div className="card-body p-0 d-flex flex-column justify-content-between">
                  <div>
                    <div className="text-primary mb-3">
                      <i className="bi bi-star-fill me-1"></i>
                      <i className="bi bi-star-fill me-1"></i>
                      <i className="bi bi-star-fill me-1"></i>
                      <i className="bi bi-star-fill me-1"></i>
                      <i className="bi bi-star-fill"></i>
                    </div>
                    <p className="text-secondary fs-6 mb-4 font-italic">
                      "I highly recommend the Executive SUV service. We booked one for our family airport transfer; the luggage space was fantastic, the ride was perfectly smooth, and we had zero delays."
                    </p>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center fw-bold text-dark" style={{ width: '45px', height: '45px', background: 'var(--accent-gradient)' }}>
                      RS
                    </div>
                    <div>
                      <h6 className="fw-bold text-light mb-0">Rohan Sharma</h6>
                      <small className="text-secondary">Software Engineer, Google</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="col-md-4">
              <div className="card h-100 testimonial-card p-4">
                <div className="card-body p-0 d-flex flex-column justify-content-between">
                  <div>
                    <div className="text-primary mb-3">
                      <i className="bi bi-star-fill me-1"></i>
                      <i className="bi bi-star-fill me-1"></i>
                      <i className="bi bi-star-fill me-1"></i>
                      <i className="bi bi-star-fill me-1"></i>
                      <i className="bi bi-star-half"></i>
                    </div>
                    <p className="text-secondary fs-6 mb-4 font-italic">
                      "What stands out is their 'No Surge Guarantee'. In peak hours when other apps charge 3x rates, Ucab honors its upfront calculation. Fantastic value and outstanding service!"
                    </p>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center fw-bold text-dark" style={{ width: '45px', height: '45px', background: 'var(--accent-gradient)' }}>
                      MK
                    </div>
                    <div>
                      <h6 className="fw-bold text-light mb-0">Meera Kulkarni</h6>
                      <small className="text-secondary">Independent Consultant</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. DYNAMIC BOTTOM CALL-TO-ACTION */}
      <section className="py-5 bg-dark" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="container py-5 text-center">
          <div className="glass-card py-5 px-4 max-w-800 mx-auto shadow-lg" style={{
            background: 'linear-gradient(135deg, rgba(20, 21, 28, 0.8) 0%, rgba(10, 11, 15, 0.9) 100%)',
            borderColor: 'rgba(255,184,0,0.1) !important'
          }}>
            <h2 className="display-4 fw-extrabold text-light mb-3">Ready to Upgrade Your Travel?</h2>
            <p className="lead text-secondary mb-5 px-lg-5">
              Sign up today and experience the gold standard of urban ride-hailing services. Seamless bookings, professional drivers.
            </p>
            <div className="d-flex justify-content-center gap-3">
              {isLoggedIn ? (
                <Link to="/uhome" className="btn btn-primary btn-lg px-5 py-3 shadow-lg fw-bold">
                  Book A Ride Now
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg px-5 py-3 shadow-lg fw-bold">
                    Register Now
                  </Link>
                  <Link to="/login" className="btn btn-outline-light btn-lg px-5 py-3 fw-bold">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-dark pt-5 pb-4 mt-auto border-top border-secondary" style={{ borderColor: 'rgba(255,255,255,0.05) !important' }}>
        <div className="container">
          <div className="row g-4 mb-5">
            <div className="col-lg-4">
              <Link className="d-flex align-items-center gap-2 fw-bold text-primary fs-4 mb-3 text-decoration-none" to="/">
                <i className="bi bi-taxi-front-fill"></i>
                <span>Ucab</span>
              </Link>
              <p className="text-secondary small mb-4">
                Premium, reliable, and secure urban transportation at your service. Experience professional chauffeurs, live tracking, and flat rates.
              </p>
              <div className="d-flex gap-3">
                <a href="#" className="btn btn-dark btn-sm rounded-circle d-flex align-items-center justify-content-center border-secondary" style={{ width: '36px', height: '36px' }}>
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="btn btn-dark btn-sm rounded-circle d-flex align-items-center justify-content-center border-secondary" style={{ width: '36px', height: '36px' }}>
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a href="#" className="btn btn-dark btn-sm rounded-circle d-flex align-items-center justify-content-center border-secondary" style={{ width: '36px', height: '36px' }}>
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" className="btn btn-dark btn-sm rounded-circle d-flex align-items-center justify-content-center border-secondary" style={{ width: '36px', height: '36px' }}>
                  <i className="bi bi-linkedin"></i>
                </a>
              </div>
            </div>

            <div className="col-6 col-md-3 col-lg-2 offset-lg-1">
              <h6 className="fw-bold text-light mb-3">Our Services</h6>
              <ul className="list-unstyled d-flex flex-column gap-2 small">
                <li><a href="#" className="footer-link">Daily Commutes</a></li>
                <li><a href="#" className="footer-link">Airport Transfers</a></li>
                <li><a href="#" className="footer-link">Corporate Travel</a></li>
                <li><a href="#" className="footer-link">Intercity Rides</a></li>
              </ul>
            </div>

            <div className="col-6 col-md-3 col-lg-2">
              <h6 className="fw-bold text-light mb-3">Company</h6>
              <ul className="list-unstyled d-flex flex-column gap-2 small">
                <li><button onClick={() => scrollToSection('features')} className="btn btn-link p-0 footer-link border-0 text-start">About Us</button></li>
                <li><a href="#" className="footer-link">Safety Standards</a></li>
                <li><a href="#" className="footer-link">Careers</a></li>
                <li><a href="#" className="footer-link">Contact Us</a></li>
              </ul>
            </div>

            <div className="col-md-6 col-lg-3">
              <h6 className="fw-bold text-light mb-3">Download App</h6>
              <p className="text-secondary small mb-3">Get the mobile experience. Track rides and drivers on the go.</p>
              <div className="d-flex flex-column gap-2">
                <button className="btn btn-dark border-secondary py-2 px-3 text-start d-flex align-items-center gap-2 rounded-3">
                  <i className="bi bi-play-btn fs-4 text-primary"></i>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>GET IT ON</div>
                    <div className="fw-bold small" style={{ color: '#f1f5f9' }}>Google Play</div>
                  </div>
                </button>
                <button className="btn btn-dark border-secondary py-2 px-3 text-start d-flex align-items-center gap-2 rounded-3">
                  <i className="bi bi-apple fs-4 text-primary"></i>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>DOWNLOAD ON THE</div>
                    <div className="fw-bold small" style={{ color: '#f1f5f9' }}>App Store</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <hr className="border-secondary my-4" style={{ opacity: 0.15 }} />

          <div className="row align-items-center g-3">
            <div className="col-md-6 text-center text-md-start">
              <p className="small text-secondary mb-0">
                &copy; {new Date().getFullYear()} Ucab Technologies Inc. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <div className="d-flex justify-content-center justify-content-md-end align-items-center gap-3">
                <span className="small text-secondary">Are you an administrator?</span>
                <Link to="/alogin" className="btn btn-sm btn-outline-secondary px-3 py-1 fw-semibold">
                  Admin Access
                </Link>
                <Link to="/aregister" className="btn btn-sm btn-outline-danger px-3 py-1 fw-semibold">
                  Admin Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
