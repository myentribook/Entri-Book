import { Fragment, useEffect } from "react";
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

  useEffect(() => {
    if (authLoading) return;

    if (error) {
      // toast.error(error, {
      //   position: 'bottom-right'
      // });
    } else if (isAuthenticated && user) {
      dispatch(getDashboardReports());
    }
  }, [dispatch, error, isAuthenticated, authLoading, user]);

  const dashboardData = [
    {
      bg: "#ebe4ff",
      title: "Sales",
      icon: "fa-cash-register",
      text: `Today's Sales: ₹${report?.todaySales ?? 0}\nMonthly Sales: ₹${report?.monthSales ?? 0}`
    },
    {
      bg: "#e0f2fe",
      title: "Purchase",
      icon: "fa-cart-flatbed",
      text: `Total inventory purchase value is ₹${report?.totalPurchase ?? 0}.`
    },
    {
      bg: "#dcfce7",
      title: "Inventory",
      icon: "fa-box",
      text: `Manage your stock. Current products: ${report?.totalProducts ?? 0}.`
    },
    {
      bg: "#ffecd9",
      title: "Finance",
      icon: "fa-book-open",
      text: `Total monthly dues: ₹${report?.monthDueAmount ?? 0}.`
    },
    {
      bg: "#FCE7F3",
      title: "previous month",
      icon: "fa-calendar-days",
      text: `Revenue generated last month: ${report?.previousMonthSales ?? 0}.`
    },
    {
      bg: "#FEF3C7",
      title: "Growth %",
      icon: "fa-chart-line",
      text: `Growth over previous month:: ${report?.growthPercentage ?? 0}.`
    },
    {
      bg: "#CFFAFE",
      title: "Today Bill Count",
      icon: "fa-file-invoice-dollar",
      text: `Bills created today: ${report?.todayBillCount ?? 0}.`
    },
  ];

  return (
    (loading || authLoading) ? <Loader /> : (
      <div className="home-wrapper">
        <Fragment>
          <Toaster />
          <MetaData title={'Entri Book'} />
          <div className="section-wrapper">
            <h2 className="upi-title"></h2>
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
                <div className="icon-circle"><i className="fa-solid fa-hand-holding-dollar"></i></div>
                <span className="upi-label">Credit<br /> Ledger</span>
              </Link>

              <Link to="/purchase" style={{ textDecoration: 'none' }} type="button" className="upi-btn" aria-label="Purchase Management">
                <div className="icon-circle"><i className="fa-solid fa-truck-loading"></i></div>
                <span className="upi-label">Purchase <br /> Management</span>
              </Link>

              <Link to="/search/product" style={{ textDecoration: 'none' }} type="button" className="upi-btn" aria-label="Search Products">
                <div className="icon-circle"><i className="fas fa-search"></i></div>
                <span className="upi-label">Search<br />Products</span>
              </Link>

              <Link to="/privacy" style={{ textDecoration: 'none' }} type="button" className="upi-btn" aria-label="Purchase Management">
                <div className="icon-circle"><i className="fa-solid fa-file-contract"></i></div>
                <span className="upi-label">Terms & <br />Conditions</span>
              </Link>

               <Link to="/review" style={{ textDecoration: 'none' }} type="button" className="upi-btn" aria-label="Purchase Management">
                <div className="icon-circle"><i className="fa-solid fa-award"></i></div>
                <span className="upi-label">Comment & <br /> Reviews</span>
               </Link>
            </div>
          </div>

          <div className="section-wrapper">
            <h2 className="upi-title">Business Overview</h2>
            <div className="dashboard-grid">
              {dashboardData.map((card, index) => (
                <div key={index} className="card-wrapper">
                  <div className="card-content" style={{ backgroundColor: card.bg }}>
                    <p style={{ fontSize: "0.95rem", color: "#333", lineHeight: "1.6", whiteSpace: "pre-line" }}>
                      {card.text}
                    </p>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 8px" }}>
                    <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>{card.title}</span>
                    <i className={`fa-solid ${card.icon}`} style={{ fontSize: "25px", color: "#0056b3" }}></i>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="refer-section">
            <div className="refer-title">
              Love <span style={{ color: "#ff4d4d" }}>❤</span> Entri Book ?
            </div>
            <div className="refer-desc">Help another shop owner simplify billing and inventory management.</div>
            <a href="#refer" className="refer-link">
              Simple. Fast. Reliable.
              <i className="fa-solid fa-arrow-right" style={{ marginLeft: "8px" }}></i>
            </a>
          </div>
        </Fragment>
      </div>
    )
  );
}