import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../layouts/loader';
import '../styles/profile.css';

export default function Profile() {
    const { user, loading } = useSelector((state) => state.authState);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuContainerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuContainerRef.current &&
                !menuContainerRef.current.contains(event.target)
            ) {
                setMenuOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

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

    const avatarSrc =
        user.avatar && user.avatar.trim() !== ''
            ? user.avatar
            : '/images/default_avatar.jpg';

    return (
        <div className="profile-page-wrapper">
            <div className="contact-card-shell">
                {/* Top Header: Rounded Square Avatar + Name & Subtitle + Options */}
                <div className="contact-hero-box" ref={menuContainerRef}>
                    <div className="contact-hero-left">
                        <div className="contact-avatar-ring">
                            <img
                                src={avatarSrc}
                                alt={user.name || 'User Avatar'}
                                className="contact-avatar-img"
                            />
                        </div>

                        <div className="contact-hero-meta">
                            <h3 className="contact-user-name">{user.name}</h3>
                            <p className="contact-user-role">
                                {user.gstin ? `GSTIN • ${user.gstin}` : 'Standard Account'}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className={`contact-options-btn ${menuOpen ? 'is-active' : ''}`}
                        aria-label="Profile options"
                        aria-expanded={menuOpen}
                        aria-haspopup="menu"
                        onClick={() => setMenuOpen((prev) => !prev)}
                    >
                        <i className="fa-solid fa-ellipsis-vertical" aria-hidden="true"></i>
                    </button>

                    {menuOpen && (
                        <div className="contact-options-dropdown" role="menu">
                            <Link
                                to="/myprofile/update"
                                role="menuitem"
                                className="contact-dropdown-item"
                                onClick={() => setMenuOpen(false)}
                            >
                                <i className="fa-regular fa-pen-to-square" aria-hidden="true"></i>
                                <span>Edit Profile</span>
                            </Link>

                            <Link
                                to="/myprofile/update/password"
                                role="menuitem"
                                className="contact-dropdown-item is-highlighted"
                                onClick={() => setMenuOpen(false)}
                            >
                                <i className="fa-solid fa-key" aria-hidden="true"></i>
                                <span>Update Passkey</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Section 1: Account & Profile Details */}
                <div className="contact-details-list">
                    <div className="contact-detail-row">
                        <div className="contact-detail-left">
                            <div className="contact-detail-icon" aria-hidden="true">
                                <i className="fa-solid fa-user"></i>
                            </div>
                            <span className="contact-detail-label">Personal Data</span>
                        </div>
                        <span className="contact-detail-value">{user.email}</span>
                        <i className="fa-solid fa-chevron-right contact-row-chevron" aria-hidden="true"></i>
                    </div>

                    <Link to="/myprofile/update" className="contact-detail-row is-link-row">
                        <div className="contact-detail-left">
                            <div className="contact-detail-icon" aria-hidden="true">
                                <i className="fa-solid fa-gear"></i>
                            </div>
                            <span className="contact-detail-label">Edit Details</span>
                        </div>
                        <i className="fa-solid fa-chevron-right contact-row-chevron" aria-hidden="true"></i>
                    </Link>

                    <div className="contact-detail-row">
                        <div className="contact-detail-left">
                            <div className="contact-detail-icon" aria-hidden="true">
                                <i className="fa-solid fa-file-invoice"></i>
                            </div>
                            <span className="contact-detail-label">GSTIN / Tax Status</span>
                        </div>
                        <span className="contact-detail-value">
                            {user.gstin ? `${user.gstin} (Active)` : 'Not Added'}
                        </span>
                        <i className="fa-solid fa-chevron-right contact-row-chevron" aria-hidden="true"></i>
                    </div>

                    <div className="contact-detail-row">
                        <div className="contact-detail-left">
                            <div className="contact-detail-icon" aria-hidden="true">
                                <i className="fa-solid fa-calendar-check"></i>
                            </div>
                            <span className="contact-detail-label">Member Since</span>
                        </div>
                        <span className="contact-detail-value">{joinedDate}</span>
                        <i className="fa-solid fa-chevron-right contact-row-chevron" aria-hidden="true"></i>
                    </div>
                </div>

                <div className="contact-section-divider" role="separator"></div>

                {/* Section 2: Quick Actions & Security */}
                <div className="contact-details-list">
                    <Link to="/" className="contact-detail-row is-link-row">
                        <div className="contact-detail-left">
                            <div className="contact-detail-icon" aria-hidden="true">
                                <i className="fa-solid fa-location-dot"></i>
                            </div>
                            <span className="contact-detail-label">Go to Dashboard</span>
                        </div>
                        <i className="fa-solid fa-chevron-right contact-row-chevron" aria-hidden="true"></i>
                    </Link>

                    <Link to="/myprofile/update/password" className="contact-detail-row is-link-row">
                        <div className="contact-detail-left">
                            <div className="contact-detail-icon" aria-hidden="true">
                                <i className="fa-solid fa-key"></i>
                            </div>
                            <span className="contact-detail-label">Update Passkey</span>
                        </div>
                        <i className="fa-solid fa-chevron-right contact-row-chevron" aria-hidden="true"></i>
                    </Link>
                </div>

                {/* Bottom Soft Support / Help Banner */}
                <Link to="/myprofile/update" className="contact-help-banner">
                    <i className="fa-solid fa-headset contact-help-icon" aria-hidden="true"></i>
                    <span className="contact-help-text">
                        Need to update your account? Edit Profile
                    </span>
                </Link>
            </div>
        </div>
    );
}