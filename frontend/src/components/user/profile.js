import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import '../styles/profile.css';

export default function Profile() {
    const dispatch = useDispatch();
    const { user, loading } = useSelector((state) => state.authState);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [gstin, setGstin] = useState('');
    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg');

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setGstin(user.gstin || '');
            setAvatar('');
            setAvatarPreview(
                user.avatar && user.avatar.trim() !== ''
                    ? user.avatar
                    : '/images/default_avatar.jpg'
            );
        }
    }, [user]);

    if (!user) {
        return <div className="gpay-profile-wrapper"></div>;
    }

    const joinedDate = String(user.createdAt || '').substring(0, 10);
    const currentAvatar =
        user.avatar && user.avatar.trim() !== ''
            ? user.avatar
            : '/images/default_avatar.jpg';

    const openEditModal = (e) => {
        if (e) e.preventDefault();
        setName(user.name || '');
        setEmail(user.email || '');
        setGstin(user.gstin || '');
        setAvatar('');
        setAvatarPreview(currentAvatar);
        setIsEditOpen(true);
    };

    const closeEditModal = () => {
        setIsEditOpen(false);
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2 && typeof reader.result === 'string') {
                setAvatarPreview(reader.result);
                setAvatar(reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSaveChanges = (e) => {
        e.preventDefault();

        // Replace `updateProfile` below with your actual Redux action import if needed
        // Example:
        // const formData = new FormData();
        // formData.append('name', name);
        // formData.append('email', email);
        // formData.append('gstin', gstin);
        // if (avatar) formData.append('avatar', avatar);
        // dispatch(updateProfile(formData));

        console.log('Saving profile on same page:', { name, email, gstin, avatar });
        setIsEditOpen(false);
    };

    return (
        <div className="gpay-profile-wrapper">
            {/* Top Banner Header */}
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
                            <button
                                type="button"
                                onClick={openEditModal}
                                className="gpay-top-icon-btn"
                                title="Edit Profile"
                            >
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </button>
                            <button type="button" className="gpay-top-icon-btn" title="Notifications">
                                <i className="fa-regular fa-bell"></i>
                            </button>
                            <Link to="/myprofile/update/password" className="gpay-top-icon-btn" title="Security">
                                <i className="fa-regular fa-circle-question"></i>
                            </Link>

                            <div className="gpay-avatar-wrapper">
                                <img
                                    src={currentAvatar}
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
                {/* Two Pill Action Buttons */}
                <div className="gpay-pills-row">
                    <button
                        type="button"
                        onClick={openEditModal}
                        className="gpay-action-pill gpay-pill-peach"
                    >
                        <i className="fa-solid fa-user-pen"></i>
                        <div className="gpay-pill-text">
                            <h4>Edit Profile Details</h4>
                            <p>Update name, email, avatar & GSTIN</p>
                        </div>
                    </button>

                    <Link to="/myprofile/update/password" className="gpay-action-pill gpay-pill-blue">
                        <i className="fa-solid fa-key"></i>
                        <div className="gpay-pill-text">
                            <h4>Change Password</h4>
                            <p>Update account login credentials</p>
                        </div>
                    </Link>
                </div>

                {/* Central Surface Card */}
                <div className="gpay-main-card">
                    <div className="gpay-card-header">
                        <h2>Account & Business Overview</h2>
                        <button
                            type="button"
                            onClick={openEditModal}
                            className="gpay-card-chevron"
                            aria-label="Edit Profile"
                        >
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>

                    <div className="gpay-details-grid">
                        <div className="gpay-detail-item">
                            <div className="gpay-circle-icon-wrap">
                                <i className="fa-solid fa-store"></i>
                            </div>
                            <p className="gpay-detail-title">{user.name || 'Not Set'}</p>
                            <p className="gpay-detail-subtitle">Business / Admin Name</p>
                        </div>

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

                {/* Middle Rows */}
                <div className="gpay-bottom-rows">
                    <div className="gpay-list-row">
                        <div className="gpay-list-left">
                            <i className="fa-regular fa-envelope gpay-list-icon"></i>
                            <div className="gpay-list-text">
                                <h4>Registered Email Address</h4>
                                <p>{user.email || 'No email linked'}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={openEditModal}
                            className="gpay-text-action"
                        >
                            Edit
                        </button>
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

                {/* Bottom Footer Navigation Row */}
                <div className="gpay-footer-links">
                    <button
                        type="button"
                        onClick={openEditModal}
                        className="gpay-footer-item"
                    >
                        <i className="fa-solid fa-gear"></i>
                        <span>Profile Settings</span>
                    </button>

                    <Link to="/myprofile/update/password" className="gpay-footer-item">
                        <i className="fa-regular fa-circle-user"></i>
                        <span>Manage Security</span>
                    </Link>

                    <button
                        type="button"
                        onClick={openEditModal}
                        className="gpay-footer-item"
                    >
                        <i className="fa-regular fa-circle-question"></i>
                        <span>Update GSTIN</span>
                    </button>
                </div>
            </div>

            {/* Same-Page Edit Profile Modal */}
            {isEditOpen && (
                <div className="edit-modal-backdrop" onClick={closeEditModal}>
                    <div
                        className="edit-profile-modal-card"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="edit-modal-close-btn"
                            onClick={closeEditModal}
                            aria-label="Close Edit Profile"
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>

                        <div className="edit-profile-header">
                            <div className="edit-profile-title-row">
                                <span className="edit-profile-badge">
                                    <i className="fa-solid fa-user-pen"></i>
                                </span>
                                <h2>Edit Profile</h2>
                            </div>
                            <p className="edit-profile-subtitle">
                                Update your personal information and profile picture.
                            </p>
                        </div>

                        <form onSubmit={handleSaveChanges}>
                            {/* Avatar Picker Box */}
                            <div className="edit-photo-box">
                                <img
                                    src={avatarPreview}
                                    alt="Profile Preview"
                                    className="edit-photo-preview"
                                />
                                <button
                                    type="button"
                                    className="edit-change-photo-btn"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <i className="fa-solid fa-camera"></i>
                                    <span>CHANGE PHOTO</span>
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    style={{ display: 'none' }}
                                />
                            </div>

                            {/* Full Name */}
                            <div className="edit-field-group">
                                <label htmlFor="edit-full-name">FULL NAME</label>
                                <div className="edit-input-box">
                                    <i className="fa-regular fa-user"></i>
                                    <input
                                        id="edit-full-name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter full name"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email Address */}
                            <div className="edit-field-group">
                                <label htmlFor="edit-email">EMAIL ADDRESS</label>
                                <div className="edit-input-box">
                                    <i className="fa-regular fa-envelope"></i>
                                    <input
                                        id="edit-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter email address"
                                        required
                                    />
                                </div>
                            </div>

                            {/* GSTIN Number */}
                            <div className="edit-field-group">
                                <label htmlFor="edit-gstin">GSTIN NUMBER</label>
                                <div className="edit-input-box">
                                    <i className="fa-solid fa-percent"></i>
                                    <input
                                        id="edit-gstin"
                                        type="text"
                                        value={gstin}
                                        onChange={(e) => setGstin(e.target.value)}
                                        placeholder="Enter GSTIN number"
                                    />
                                </div>
                            </div>

                            {/* Save Button */}
                            <button
                                type="submit"
                                className="edit-save-changes-btn"
                                disabled={loading}
                            >
                                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                                <i className="fa-solid fa-arrow-right"></i>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}