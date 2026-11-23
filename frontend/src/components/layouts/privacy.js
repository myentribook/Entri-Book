import React from 'react';
import '../styles/legal.css';

export default function LegalInformation() {
  return (
    <div className="legal-page-wrapper">
      <div className="legal-container">
        {/* Centered Header + Subtitle */}
        <header className="legal-header">
          <div className="legal-header-badge">
            <i className="fa-solid fa-scale-balanced"></i>
          </div>
          <h1 className="legal-title">Legal Information</h1>
          <p className="legal-subtitle">
            Review the terms, responsibilities, and privacy standards governing your use of Entri Book.
          </p>
          <span className="legal-updated-pill">
            <i className="fa-regular fa-clock"></i> Last updated: July 2026
          </span>
        </header>

        {/* Quick Navigation */}
        <nav className="legal-quick-nav" aria-label="Legal sections navigation">
          <a href="#terms" className="legal-nav-pill">
            <i className="fa-solid fa-file-contract"></i>
            <span>Skip to Terms &amp; Conditions</span>
          </a>
          <a href="#privacy" className="legal-nav-pill">
            <i className="fa-solid fa-shield-halved"></i>
            <span>Skip to Privacy Policy</span>
          </a>
        </nav>

        {/* TERMS & CONDITIONS SECTION */}
        <section id="terms" className="legal-section-card">
          <div className="legal-section-top">
            <span className="legal-section-icon legal-icon-blue">
              <i className="fa-solid fa-file-lines"></i>
            </span>
            <div>
              <h2 className="legal-section-title">Terms &amp; Conditions</h2>
              <p className="legal-section-intro">
                Welcome to Entri Book! These terms and conditions outline the rules and regulations for the use of our billing and inventory management platform.
              </p>
            </div>
          </div>

          <div className="legal-clauses-list">
            <div className="legal-clause-item">
              <span className="legal-clause-num">01</span>
              <div>
                <h3 className="legal-clause-heading">Acceptance</h3>
                <p className="legal-clause-text">
                  By starting to use the application, you accept and agree to these terms.
                </p>
              </div>
            </div>

            <div className="legal-clause-item">
              <span className="legal-clause-num">02</span>
              <div>
                <h3 className="legal-clause-heading">User Accounts</h3>
                <p className="legal-clause-text">
                  Please provide accurate details, keep your password secure, and note that you are responsible for all activities happening under your account.
                </p>
              </div>
            </div>

            <div className="legal-clause-item">
              <span className="legal-clause-num">03</span>
              <div>
                <h3 className="legal-clause-heading">Limitation of Liability</h3>
                <p className="legal-clause-text">
                  We always try our best to provide a smooth experience, but if unexpected technical issues cause downtime or delays, Entri Book will not be subject to legal claims.
                </p>
              </div>
            </div>

            <div className="legal-clause-item">
              <span className="legal-clause-num">04</span>
              <div>
                <h3 className="legal-clause-heading">Enforcement</h3>
                <p className="legal-clause-text">
                  If rules are violated, we reserve the right to suspend the account or take necessary actions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PRIVACY POLICY SECTION */}
        <section id="privacy" className="legal-section-card">
          <div className="legal-section-top">
            <span className="legal-section-icon legal-icon-purple">
              <i className="fa-solid fa-lock"></i>
            </span>
            <div>
              <h2 className="legal-section-title">Privacy Policy</h2>
              <p className="legal-section-intro">
                At Entri Book, we respect your privacy and are committed to protecting your personal data.
              </p>
            </div>
          </div>

          <div className="legal-clauses-list">
            <div className="legal-clause-item">
              <span className="legal-clause-num">01</span>
              <div>
                <h3 className="legal-clause-heading">Data We Collect</h3>
                <p className="legal-clause-text">
                  We collect names, email addresses, business details, and customer phone numbers.
                </p>
              </div>
            </div>

            <div className="legal-clause-item">
              <span className="legal-clause-num">02</span>
              <div>
                <h3 className="legal-clause-heading">Usage</h3>
                <p className="legal-clause-text">
                  Information is used to run the billing platform, process transactions, and send invoices via WhatsApp.
                </p>
              </div>
            </div>

            <div className="legal-clause-item">
              <span className="legal-clause-num">03</span>
              <div>
                <h3 className="legal-clause-heading">Security</h3>
                <p className="legal-clause-text">
                  We keep your data safe and secure with proper security measures.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}