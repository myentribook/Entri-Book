import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../layouts/loader';
import '../styles/profile.css';

export default function Profile() {
    const { user, loading } = useSelector((state) => state.authState);

    if (loading) {
        return <Loader />;
    }

    if (!user) {
        return <div className="profile-page-wrapper">No profile data available.</div>;
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
                {/* Top Hero Header */}
                <div className="profile-gpay-banner">
                    <div className="profile-gpay-banner-inner">
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
                        </div>

                        <div className="profile-gpay-user-info">
                            <h2 className="profile-gpay-name">Account Profile</h2>
                            <p className="profile-gpay-subtext">
                                {user.name} &bull; {user.email}
                            </p>
                        </div>

                        <div className="profile-gpay-header-right">
                            <Link
                                to="/myprofile/update"
                                className="profile-gpay-icon-action"
                                title="Edit Profile"
                                aria-label="Edit Profile"
                            >
                                <i className="fa-regular fa-pen-to-square"></i>
                                <span>Edit Profile</span>
                            </Link>
                            <Link
                                to="/myprofile/update/password"
                                className="profile-gpay-icon-action"
                                title="Change Password"
                                aria-label="Change Password"
                            >
                                <i className="fa-solid fa-key"></i>
                                <span>Password</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Highlight Strip Card (Equivalent to Item Summary Card) */}
                <div className="profile-gpay-pills-grid">
                    <div className="profile-gpay-pill">
                        <div className="profile-pill-icon">
                            <i className="fa-solid fa-store" aria-hidden="true"></i>
                        </div>
                        <div className="profile-pill-text">
                            <span className="profile-pill-title">{user.name}</span>
                            <span className="profile-pill-sub">Account Name</span>
                        </div>
                    </div>

                    <div className="profile-gpay-pill">
                        <div className="profile-pill-icon">
                            <i
                                className={`fa-solid ${
                                    user.gstin ? 'fa-certificate' : 'fa-calendar-check'
                                }`}
                                aria-hidden="true"
                            ></i>
                        </div>
                        <div className="profile-pill-text">
                            <span className="profile-pill-title">
                                {user.gstin ? 'GST Active' : joinedDate}
                            </span>
                            <span className="profile-pill-sub">
                                {user.gstin ? 'Tax Registered' : 'Member Since'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Profile Summary Card (Equivalent to Order Summary Table Card) */}
                <div className="profile-gpay-surface-card">
                    <div className="profile-surface-header">
                        <span className="profile-surface-title">Account Summary</span>
                        <Link to="/myprofile/update" className="profile-surface-arrow" aria-label="Update Details">
                            <i className="fa-solid fa-chevron-right"></i>
                        </Link>
                    </div>

                    <div className="profile-surface-grid">
                        <div className="profile-surface-item">
                            <span className="profile-item-sub">Full Name</span>
                            <div className="profile-surface-item-meta">
                                <span className="profile-item-title">{user.name}</span>
                            </div>
                        </div>

                        <div className="profile-surface-item">
                            <span className="profile-item-sub">Email Address</span>
                            <div className="profile-surface-item-meta">
                                <span className="profile-item-title">{user.email}</span>
                            </div>
                        </div>

                        <div className="profile-surface-item">
                            <span className="profile-item-sub">GSTIN</span>
                            <div className="profile-surface-item-meta">
                                <span className="profile-item-title">
                                    {user.gstin ? user.gstin : 'Not Added'}
                                </span>
                            </div>
                        </div>

                        <div className="profile-surface-item">
                            <span className="profile-item-sub">Member Since</span>
                            <div className="profile-surface-item-meta">
                                <span className="profile-item-title">{joinedDate}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Action Rows + Dark Pill CTA + Green Status Caption */}
                <div className="profile-gpay-bottom-list">
                    <div className="profile-bottom-row">
                        <div className="profile-bottom-left">
                            <i className="fa-solid fa-file-invoice profile-bottom-icon"></i>
                            <div className="profile-bottom-text">
                                <span className="profile-bottom-title">
                                    {user.gstin || 'No GSTIN configured'}
                                </span>
                                <span className="profile-bottom-sub">
                                    Used automatically on customer invoices
                                </span>
                            </div>
                        </div>
                        <Link to="/myprofile/update" className="profile-bottom-action-link">
                            {user.gstin ? 'Update' : 'Add'}
                        </Link>
                    </div>

                    <div className="profile-gpay-footer-links">
                        <Link to="/myprofile/update" className="profile-footer-link-item primary-cta">
                            <span>Edit Profile</span>
                        </Link>

                        <div className="profile-secondary-links-row">
                            <Link to="/myprofile/update/password" className="profile-footer-link-item secondary-link">
                                <i className="fa-solid fa-key"></i>
                                <span>Change Password</span>
                            </Link>

                            <Link to="/" className="profile-footer-link-item secondary-link">
                                <i className="fa-solid fa-house"></i>
                                <span>Go to Dashboard</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}