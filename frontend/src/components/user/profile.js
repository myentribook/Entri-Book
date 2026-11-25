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
                {/* Top Card Header */}
                <div className="contact-card-header">
                    <h2 className="contact-card-title">Account Profile</h2>
                    <Link to="/myprofile/update" className="contact-card-top-link">
                        Edit Details
                    </Link>
                </div>

                {/* Dashed Highlight Box with Avatar, User Info & Options Menu Trigger */}
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
                        <i className="fa-solid fa-plus" aria-hidden="true"></i>
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

                {/* Icon + Uppercase Label + Value Rows */}
                <div className="contact-details-list">
                    <div className="contact-detail-row">
                        <div className="contact-detail-icon" aria-hidden="true">
                            <i className="fa-solid fa-envelope"></i>
                        </div>
                        <div className="contact-detail-content">
                            <span className="contact-detail-label">EMAIL ADDRESS</span>
                            <span className="contact-detail-value">{user.email}</span>
                        </div>
                    </div>

                    <div className="contact-detail-row">
                        <div className="contact-detail-icon" aria-hidden="true">
                            <i className="fa-solid fa-file-invoice"></i>
                        </div>
                        <div className="contact-detail-content">
                            <span className="contact-detail-label">GSTIN / TAX STATUS</span>
                            <span className="contact-detail-value">
                                {user.gstin ? `${user.gstin} (Active)` : 'Not Added'}
                            </span>
                        </div>
                    </div>

                    <div className="contact-detail-row">
                        <div className="contact-detail-icon" aria-hidden="true">
                            <i className="fa-solid fa-calendar-check"></i>
                        </div>
                        <div className="contact-detail-content">
                            <span className="contact-detail-label">MEMBER SINCE</span>
                            <span className="contact-detail-value">{joinedDate}</span>
                        </div>
                    </div>

                    <div className="contact-detail-row">
                        <div className="contact-detail-icon" aria-hidden="true">
                            <i className="fa-solid fa-location-dot"></i>
                        </div>
                        <div className="contact-detail-content">
                            <span className="contact-detail-label">DASHBOARD</span>
                            <Link to="/" className="contact-detail-link-value">
                                Go to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}