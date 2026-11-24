import { Link } from 'react-router-dom';
import '../styles/profile.css';
import { useSelector } from 'react-redux';

export default function Profile() {
    const { user } = useSelector((state) => state.authState);

    if (!user) {
        return <div className="gpay-profile-wrapper"></div>;
    }

    const joinedDate = String(user.createdAt || '').substring(0, 10);

    return (
        <div className="gpay-profile-wrapper">
            {/* Top Banner Header (Clean Mint Background, No Illustration) */}
            <div className="gpay-top-banner">
                <div className="gpay-container">
                    <div className="gpay-header-content">
                        <div className="gpay-user-info">
                            <h1>{user.name}</h1>
                            <p className="gpay-user-subtext">Email: {user.email}</p>
                            <div className="gpay-user-meta-row">
                                <span className="gpay-gst-text">
                                    {user.gstin ? `GSTIN: ${user.gstin}` : 'No GSTIN Linked'}
                                </span>
                                <span className="gpay-verified-pill">
                                    <i className="fa-solid fa-circle-check"></i> Administrator Account
                                </span>
                            </div>
                        </div>

                        <div className="gpay-header-right">
                            <Link to="/myprofile/update" className="gpay-top-icon-btn" title="Edit Profile">
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </Link>
                            <button type="button" className="gpay-top-icon-btn" title="Notifications">
                                <i className="fa-regular fa-bell"></i>
                            </button>
                            <Link to="/myprofile/update/password" className="gpay-top-icon-btn" title="Security">
                                <i className="fa-regular fa-circle-question"></i>
                            </Link>

                            <div className="gpay-avatar-wrapper">
                                <img
                                    src={
                                        user.avatar && user.avatar.trim() !== ''
                                            ? user.avatar
                                            : '/images/default_avatar.jpg'
                                    }
                                    className="gpay-avatar-img"
                                    alt="User Avatar"
                                />
                                <span className="gpay-avatar-badge">
                                    <i className="fa-solid fa-store"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Body */}
            <div className="gpay-container">
                {/* Two Pill Action Buttons (Matching Reward & Referral Pills) */}
                <div className="gpay-pills-row">
                    <Link to="/myprofile/update" className="gpay-action-pill gpay-pill-peach">
                        <i className="fa-solid fa-user-pen"></i>
                        <div className="gpay-pill-text">
                            <h4>Edit Profile Details</h4>
                            <p>Update name, email, avatar & GSTIN</p>
                        </div>
                    </Link>

                    <Link to="/myprofile/update/password" className="gpay-action-pill gpay-pill-blue">
                        <i className="fa-solid fa-key"></i>
                        <div className="gpay-pill-text">
                            <h4>Change Password</h4>
                            <p>Update account login credentials</p>
                        </div>
                    </Link>
                </div>

                {/* Central Surface Card (Matching "Set up payment methods 1/3") */}
                <div className="gpay-main-card">
                    <div className="gpay-card-header">
                        <h2>Account & Business Overview</h2>
                        <Link to="/myprofile/update" className="gpay-card-chevron">
                            <i className="fa-solid fa-chevron-right"></i>
                        </Link>
                    </div>

                    <div className="gpay-details-grid">
                        {/* Item 1: Account Holder */}
                        <div className="gpay-detail-item">
                            <div className="gpay-circle-icon-wrap">
                                <i className="fa-solid fa-store"></i>
                            </div>
                            <p className="gpay-detail-title">{user.name || 'Not Set'}</p>
                            <p className="gpay-detail-subtitle">Business / Admin Name</p>
                        </div>

                        {/* Item 2: GSTIN */}
                        <div className="gpay-detail-item">
                            <div className="gpay-circle-icon-wrap dashed">
                                <div className="gpay-circle-inner">
                                    <i className="fa-solid fa-percent"></i>
                                </div>
                                <span className="gpay-mini-plus">
                                    <i className="fa-solid fa-check"></i>
                                </span>
                            </div>
                            <p className="gpay-detail-title">{user.gstin || 'Not Provided'}</p>
                            <p className="gpay-detail-subtitle">GSTIN Number</p>
                        </div>

                        {/* Item 3: Joined Date */}
                        <div className="gpay-detail-item">
                            <div className="gpay-circle-icon-wrap dashed">
                                <div className="gpay-circle-inner">
                                    <i className="fa-solid fa-calendar-days"></i>
                                </div>
                                <span className="gpay-mini-plus">
                                    <i className="fa-solid fa-check"></i>
                                </span>
                            </div>
                            <p className="gpay-detail-title">{joinedDate || 'N/A'}</p>
                            <p className="gpay-detail-subtitle">Member Since</p>
                        </div>
                    </div>
                </div>

                {/* Middle Rows (Matching "Pay with credit cards" & "Your QR code") */}
                <div className="gpay-bottom-rows">
                    <div className="gpay-list-row">
                        <div className="gpay-list-left">
                            <i className="fa-regular fa-envelope gpay-list-icon"></i>
                            <div className="gpay-list-text">
                                <h4>Registered Email Address</h4>
                                <p>{user.email || 'No email linked'}</p>
                            </div>
                        </div>
                        <Link to="/myprofile/update" className="gpay-text-action">
                            Edit
                        </Link>
                    </div>

                    <div className="gpay-list-row">
                        <div className="gpay-list-left">
                            <i className="fa-solid fa-shield-halved gpay-list-icon"></i>
                            <div className="gpay-list-text">
                                <h4>Account Role & Access</h4>
                                <p>Administrator privileges enabled</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer Navigation Row (Matching Settings / Manage Account / Get Help) */}
                <div className="gpay-footer-links">
                    <Link to="/myprofile/update" className="gpay-footer-item">
                        <i className="fa-solid fa-gear"></i>
                        <span>Profile Settings</span>
                    </Link>

                    <Link to="/myprofile/update/password" className="gpay-footer-item">
                        <i className="fa-regular fa-circle-user"></i>
                        <span>Manage Security</span>
                    </Link>

                    <Link to="/myprofile/update" className="gpay-footer-item">
                        <i className="fa-regular fa-circle-question"></i>
                        <span>Update GSTIN</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}