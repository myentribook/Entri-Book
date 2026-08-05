import React from 'react';

export default function LegalInformation() {
  return (
    <div style={{ margin: 0, padding: 0, backgroundColor: '#f8fafc', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", color: '#1f2937', lineHeight: 1.6 }}>
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '40px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>

        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', color: '#111827' }}> Legal Information</h1>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '32px' }}>Last updated: July 2026</p>

        {/* Quick Navigation */}
        <div style={{ backgroundColor: '#f3f4f6', padding: '16px', borderRadius: '6px', border: '1px solid #e5e7eb', marginBottom: '40px', display: 'flex', gap: '24px' }}>
          <a href="#terms" style={{ fontSize: '14px', fontWeight: 700, color: '#1967BA', textDecoration: 'none' }}>Skip to Terms & Conditions</a>
          <span style={{ color: '#d1d5db' }}>|</span>
          <a href="#privacy" style={{ fontSize: '14px', fontWeight: 700, color: '#1967BA', textDecoration: 'none' }}>Skip to Privacy Policy</a>
        </div>

        {/* TERMS & CONDITIONS SECTION */}
        <section id="terms" style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '16px', color: '#111827', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>Terms & Conditions</h2>

          <p style={{ marginBottom: '16px' }}>Welcome to Entri Book! These terms and conditions outline the rules and regulations for the use of our billing and inventory management platform.</p>

          <h3 style={{ fontSize: '18px', fontWeight: 800, marginTop: '24px', marginBottom: '8px', color: '#1f2937' }}>1. Acceptance</h3>
          <p style={{ marginBottom: '16px' }}>By starting to use the application, you accept and agree to these terms.</p>

          <h3 style={{ fontSize: '18px', fontWeight: 800, marginTop: '24px', marginBottom: '8px', color: '#1f2937' }}>2. User Accounts</h3>
          <p style={{ marginBottom: '16px' }}>Please provide accurate details, keep your password secure, and note that you are responsible for all activities happening under your account.</p>

          <h3 style={{ fontSize: '18px', fontWeight: 800, marginTop: '24px', marginBottom: '8px', color: '#1f2937' }}>3. Limitation of Liability</h3>
          <p style={{ marginBottom: '16px' }}>We always try our best to provide a smooth experience, but if unexpected technical issues cause downtime or delays, Entri Book will not be subject to legal claims.</p>

          <h3 style={{ fontSize: '18px', fontWeight: 800, marginTop: '24px', marginBottom: '8px', color: '#1f2937' }}>4. Enforcement</h3>
          <p style={{ marginBottom: '16px' }}>If rules are violated, we reserve the right to suspend the account or take necessary actions.</p>
        </section>

        {/* PRIVACY POLICY SECTION */}
        <section id="privacy">
          <h2 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '16px', color: '#111827', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>Privacy Policy</h2>

          <p style={{ marginBottom: '16px' }}>At Entri Book, we respect your privacy and are committed to protecting your personal data.</p>

          <h3 style={{ fontSize: '18px', fontWeight: 800, marginTop: '24px', marginBottom: '8px', color: '#1f2937' }}>1. Data We Collect</h3>
          <p style={{ marginBottom: '16px' }}>We collect names, email addresses, business details, and customer phone numbers.</p>

          <h3 style={{ fontSize: '18px', fontWeight: 800, marginTop: '24px', marginBottom: '8px', color: '#1f2937' }}>2. Usage</h3>
          <p style={{ marginBottom: '16px' }}>Information is used to run the billing platform, process transactions, and send invoices via WhatsApp.</p>

          <h3 style={{ fontSize: '18px', fontWeight: 800, marginTop: '24px', marginBottom: '8px', color: '#1f2937' }}>3. Security</h3>
          <p style={{ marginBottom: '16px' }}>We keep your data safe and secure with proper security measures.</p>
        </section>

      </div>
    </div>
  );
}