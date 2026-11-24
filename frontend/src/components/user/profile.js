import { Link } from 'react-router-dom';
import '../styles/profile.css';
import { useSelector } from 'react-redux';

export default function Profile() {
    const { user } = useSelector((state) => state.authState);

    if (!user) {
        return <div className="profile-page-wrapper">Loading...</div>;
    }

    const joinedDate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
          })
        : 'N/A';

    return (
        <div className="profile-page-wrapper">
            <div className="profile-gpay-container">
                {/* Top Banner Contained to 870px Card */}
                <div className="profile-gpay-banner">
                    <div className="profile-gpay-banner-inner">
                        <div className="profile-gpay-user-info">
                            <h2 className="profile-gpay-name">{user.name}</h2>
                            <p className="profile-gpay-subtext">Email: {user.email}</p>
                            <div className="profile-gpay-meta-row">
                                <span className="profile-gpay-gst-text">
                                    {user.gstin ? `GSTIN: ${user.gstin}` : 'GSTIN: Not Added'}
                                </span>
                                <span className="profile-gpay-verified-pill">
                                    <i className="fa-solid fa-circle-check"></i> Admin Account
                                </span>
                            </div>
                        </div>

                        {/* Always Visible Across Laptop & Mobile */}
                        <div className="profile-gpay-header-right">
                            <Link
                                to="/myprofile/update"
                                className="profile-gpay-icon-action"
                                title="Edit Profile"
                                aria-label="Edit Profile"
                            >
                                <i className="fa-regular fa-pen-to-square"></i>
                            </Link>
                            <Link
                                to="/myprofile/update/password"
                                className="profile-gpay-icon-action"
                                title="Change Password"
                                aria-label="Change Password"
                            >
                                <i className="fa-solid fa-key"></i>
                            </Link>
                            <div className="profile-gpay-avatar-wrap">
                                <img
                                    src={
                                        user.avatar && user.avatar.trim() !== ''
                                            ? user.avatar
                                            : '/images/default_avatar.jpg'
                                    }
                                    alt="User Avatar"
                                    className="profile-gpay-avatar"
                                />
                                <span className="profile-gpay-qr-badge">
                                    <i className="fa-solid fa-store"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2 Horizontal Highlight Pill Cards */}
                <div className="profile-gpay-pills-grid">
                    <div className="profile-gpay-pill profile-pill-peach">
                        <div className="profile-pill-icon peach-icon">
                            <i className="fa-solid fa-calendar-check"></i>
                        </div>
                        <div className="profile-pill-text">
                            <span className="profile-pill-title">{joinedDate}</span>
                            <span className="profile-pill-sub">Member since</span>
                        </div>
                    </div>

                    <div className="profile-gpay-pill profile-pill-blue">
                        <div className="profile-pill-icon blue-icon">
                            <i className="fa-solid fa-shield-halved"></i>
                        </div>
                        <div className="profile-pill-text">
                            <span className="profile-pill-title">
                                {user.gstin ? 'GST Verified' : 'Standard Business'}
                            </span>
                            <span className="profile-pill-sub">Account & billing status</span>
                        </div>
                    </div>
                </div>

                {/* Middle Surface Card */}
                <div className="profile-gpay-surface-card">
                    <div className="profile-surface-header">
                        <span className="profile-surface-title">Business & account overview</span>
                        <Link to="/myprofile/update" className="profile-surface-arrow">
                            <i className="fa-solid fa-chevron-right"></i>
                        </Link>
                    </div>

                    <div className="profile-surface-grid">
                        <div className="profile-surface-item">
                            <div className="profile-circle-icon is-solid">
                                <i className="fa-solid fa-store"></i>
                            </div>
                            <div className="profile-surface-item-meta">
                                <span className="profile-item-title">{user.name}</span>
                                <span className="profile-item-sub">Business name</span>
                            </div>
                        </div>

                        <Link to="/myprofile/update" className="profile-surface-item">
                            <div className="profile-circle-icon is-dashed">
                                <i className="fa-solid fa-percent"></i>
                                <span className="profile-circle-plus">
                                    <i
                                        className={`fa-solid ${
                                            user.gstin ? 'fa-check' : 'fa-plus'
                                        }`}
                                    ></i>
                                </span>
                            </div>
                            <div className="profile-surface-item-meta">
                                <span className="profile-item-title">
                                    {user.gstin ? user.gstin : 'Add GSTIN'}
                                </span>
                                <span className="profile-item-sub">Tax registration</span>
                            </div>
                        </Link>

                        <Link to="/myprofile/update/password" className="profile-surface-item">
                            <div className="profile-circle-icon is-dashed">
                                <i className="fa-solid fa-lock"></i>
                                <span className="profile-circle-plus">
                                    <i className="fa-solid fa-rotate"></i>
                                </span>
                            </div>
                            <div className="profile-surface-item-meta">
                                <span className="profile-item-title">Security & PIN</span>
                                <span className="profile-item-sub">Update password</span>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Bottom Action Rows */}
                <div className="profile-gpay-bottom-list">
                    <div className="profile-bottom-row">
                        <div className="profile-bottom-left">
                            <i className="fa-regular fa-envelope profile-bottom-icon"></i>
                            <div className="profile-bottom-text">
                                <span className="profile-bottom-title">{user.email}</span>
                                <span className="profile-bottom-sub">
                                    Registered administrator email address
                                </span>
                            </div>
                        </div>
                        <Link to="/myprofile/update" className="profile-bottom-action-link">
                            Edit
                        </Link>
                    </div>

                    <div className="profile-bottom-row">
                        <div className="profile-bottom-left">
                            <i className="fa-solid fa-file-invoice profile-bottom-icon"></i>
                            <div className="profile-bottom-text">
                                <span className="profile-bottom-title">
                                    {user.gstin || 'No GSTIN configured'}
                                </span>
                                <span className="profile-bottom-sub">
                                    Used automatically on generated customer invoices
                                </span>
                            </div>
                        </div>
                        <Link to="/myprofile/update" className="profile-bottom-action-link">
                            {user.gstin ? 'Update' : 'Add'}
                        </Link>
                    </div>

                    <div className="profile-gpay-footer-links">
                        <Link to="/myprofile/update" className="profile-footer-link-item">
                            <i className="fa-solid fa-user-pen"></i>
                            <span>Edit Profile Details</span>
                        </Link>

                        <Link to="/myprofile/update/password" className="profile-footer-link-item">
                            <i className="fa-solid fa-key"></i>
                            <span>Change Password</span>
                        </Link>

                        <Link to="/dashboard" className="profile-footer-link-item">
                            <i className="fa-regular fa-circle-question"></i>
                            <span>Business Dashboard</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}