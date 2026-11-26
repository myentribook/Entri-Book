import { Fragment, useEffect, useState } from "react";
import './Home.css';
import MetaData from "./layouts/MetaData";
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardReports } from '../actions/dashboardActions';
import Loader from "./layouts/loader";
import { Link } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const dispatch = useDispatch();

  const { isAuthenticated, loading: authLoading, user } = useSelector((state) => state.authState || state.userState || {});
  const { report, loading, error } = useSelector((state) => state.dashboardState);

  // App Install / Download State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (error) {
      // toast.error(error);
    } else if (isAuthenticated && user) {
      dispatch(getDashboardReports());
    }
  }, [dispatch, error, isAuthenticated, authLoading, user]);

  // Catch PWA Install Prompt Event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Download / Install Button Handler
  const handleInstallClick = async (e) => {
    e.preventDefault();
    if (!deferredPrompt) {
      // toast.success("App browser menu via-va 'Add to Home Screen' pannalaam!");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const dashboardData = [
    {
      bg: "#d8c4f3",
      color: "#4a237a",
      title: "Sales",
      icon: "fa-cash-register",
      text: `Today Sales ₹${report?.todaySales ?? 0} · Monthly Sales ₹${report?.monthSales ?? 0}`
    },
    {
      bg: "#bce3f4",
      color: "#0e4d64",
      title: "Purchase",
      icon: "fa-cart-flatbed",
      text: `Total purchase value ₹${report?.totalPurchase ?? 0}`
    },
    {
      bg: "#bce8cc",
      color: "#165b33",
      title: "Inventory",
      icon: "fa-box",
      text: `Active products ${report?.totalProducts ?? 0}`
    },
    {
      bg: "#f7d6ba",
      color: "#8a3b12",
      title: "Finance",
      icon: "fa-book-open",
      text: `Total monthly Dues ₹${report?.monthDueAmount ?? 0}`
    },
    {
      bg: "#f5c7df",
      color: "#871b4b",
      title: "previous month",
      icon: "fa-calendar-days",
      text: `Revenue generated last month ${report?.previousMonthSales ?? 0}`
    },
    {
      bg: "#f8e2a6",
      color: "#7a4907",
      title: "Growth %",
      icon: "fa-chart-line",
      text: `Growth over previous month ${report?.growthPercentage ?? 0}`
    },
    {
      bg: "#bae6ee",
      color: "#0e4f5c",
      title: "Today Bill Count",
      icon: "fa-file-invoice-dollar",
      text: `Bills created today ${report?.todayBillCount ?? 0}`
    },
  ];

  return (
    (loading || authLoading) ? <Loader /> : (
      <div className="home-wrapper">
        <Fragment>
          <Toaster />
          <MetaData title={'Entri Book'} />
          <div className="section-wrapper">
            <h2 className="upi-title">Business Suite</h2>

            <div className="upi-grid">
              <Link style={{ textDecoration: 'none' }} to="/billing" type="button" className="upi-btn" aria-label="Sales and Billing">
                <div className="icon-circle"><i className="fa-solid fa-receipt"></i></div>
                <span className="upi-label">Sales<br />& Billing</span>
              </Link>

              <Link to="/product" style={{ textDecoration: 'none' }} className="upi-btn" aria-label="Products and Stock">
                <div className="icon-circle"><i className="fa-solid fa-boxes-stacked"></i></div>
                <span className="upi-label">Products<br />& Stock</span>
              </Link>

              <Link to="/credit" type="button" style={{ textDecoration: 'none' }} className="upi-btn" aria-label="Credit Ledger">
                <div className="icon-circle"><i className="fa-solid fa-address-book"></i></div>
                <span className="upi-label">Credit<br /> Ledger</span>
              </Link>

              <Link to="/purchase" style={{ textDecoration: 'none' }} type="button" className="upi-btn" aria-label="Purchase Management">
                <div className="icon-circle"><i className="fa-solid fa-dolly"></i></div>
                <span className="upi-label">Purchase <br /> Management</span>
              </Link>

            </div>

          </div>

          <div className="section-wrapper">
            <h2 className="upi-title">Explore & Guidelines</h2>
            <div className="Explore-guidelines">
              <div className="upi-grid">

                <Link to="/search/product" style={{ textDecoration: 'none' }} type="button" className="upi-btns" aria-label="Search Products">
                  <div className="icon-circles"><i class="fa-solid fa-barcode"></i></div>
                  <span className="upi-label">Search Products</span>
                  <span className="upi-sublabel">Find items</span>
                </Link>

                <Link to="/privacy" style={{ textDecoration: 'none' }} type="button" className="upi-btns" aria-label="Terms & Conditions">
                  <div className="icon-circles"><i class="fa-solid fa-clipboard-list"></i></div>
                  <span className="upi-label">Terms & Conditions</span>
                  <span className="upi-sublabel">Policies & rules</span>
                </Link>

                <Link to="/review" style={{ textDecoration: 'none' }} type="button" className="upi-btns" aria-label="Comment and Reviews">
                  <div className="icon-circles"><i class="fa-solid fa-star-half-stroke"></i></div>
                  <span className="upi-label">Comment & Reviews</span>
                  <span className="upi-sublabel">User feedback</span>
                </Link>

              </div>
            </div>
          </div>

          <div className="section-wrapper">
            <h2 className="upi-title"><i className="fa-solid fa-chart-column" style={{ color: '#0d4b82', marginRight: "10px", fontWeight: 'bold' }}></i> Business Overview</h2>
            <div className="dashboard-grid">
              {dashboardData.map((card, index) => (
                <div key={index} className="card-wrapper">
                  <div className="overview-badge" style={{ backgroundColor: card.bg, color: card.color }}>
                    <i className={`fa-solid ${card.icon}`}></i>
                  </div>
                  <div className="overview-row-content">
                    <span className="overview-row-title">{card.title}</span>
                    <p className="overview-row-subtitle">{card.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="refer-section">
            <div className="footer-hero-banner">
              <div className="footer-hero-copy">
                <div className="refer-title">
                  Love <span style={{ color: "#ff6b81" }}>❤</span> Entri Book ?
                </div>
                <div className="refer-desc">Install Entri Book app on your device.</div>

                {/* Refer Link replaced with App Download Button */}
                <button onClick={handleInstallClick} className="refer-link" style={{ border: 'none', cursor: 'pointer' }}>
                  <i className="fa-solid fa-download" style={{ marginRight: "8px" }}></i>
                  Download App
                </button>
              </div>

              <div className="footer-hero-visual">
                <div className="footer-preview-card">
                  <div className="footer-preview-label">Today Sales</div>
                  <div className="footer-preview-value">₹{report?.todaySales ?? 0}</div>
                </div>
                <div className="footer-preview-card">
                  <div className="footer-preview-label">Monthly Sales</div>
                  <div className="footer-preview-value">₹{report?.monthSales ?? 0}</div>
                </div>
              </div>
            </div>

            <div className="footer-bottom-grid">
              <div className="footer-brand-col">
                <div>
                  <div className="footer-brand-name">
                    <i className="fa-solid fa-book-bookmark" style={{ color: "#0d4b82" }}></i>
                    <span>Entri Book</span>
                  </div>
                  <img
                    src="/Logo512.png"
                    alt="Entri Book"
                    className="footer-heading-logo"
                  />
                </div>
                <div className="footer-meta-text">
                  © Entri Book. All rights reserved.<br />
                  Billing, Stock & Credit Ledger
                </div>
              </div>

              <div>
                <div className="footer-col-title">Business Suite</div>
                <ul className="footer-link-list">
                  <li><Link to="/billing" className="footer-link-item">Sales & Billing</Link></li>
                  <li><Link to="/product" className="footer-link-item">Products & Stock</Link></li>
                  <li><Link to="/credit" className="footer-link-item">Credit Ledger</Link></li>
                  <li><Link to="/purchase" className="footer-link-item">Purchase</Link></li>
                </ul>
              </div>

              <div>
                <div className="footer-col-title">Explore</div>
                <ul className="footer-link-list">
                  <li><Link to="/search/product" className="footer-link-item">Search Products</Link></li>
                  <li><Link to="/review" className="footer-link-item">Comment & Reviews</Link></li>
                </ul>
              </div>

              <div>
                <div className="footer-col-title">Guidelines</div>
                <ul className="footer-link-list">
                  <li><Link to="/privacy" className="footer-link-item">Terms & Conditions</Link></li>
                  <li><Link to="/privacy" className="footer-link-item">Privacy Policy</Link></li>
                </ul>
              </div>

              <div>
                <div className="footer-col-title">Get in touch</div>
                <div className="footer-meta-text">
                  For any queries or issues, contact us via<br />
                  What&apos;s app
                </div>
                <div className="footer-social-row">
                  <a
                    href="https://wa.me/919626992320?text=Hello%20entri"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-icon"
                    aria-label="WhatsApp"
                  >
                    <i className="fa-brands fa-whatsapp"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      </div>
    )
  );
}