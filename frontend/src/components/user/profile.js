import { Link } from 'react-router-dom';
import '../styles/profile.css';
import { useSelector } from 'react-redux';

export default function Profile() {
    const { user } = useSelector((state) => state.authState);

    if (!user) {
        return <div className="profile-page-wrapper">Agidaldaldal...</div>;
    }

    return (
        <div className="profile-page-wrapper">
            <div className="profile-page-card-container">
                <div className="profile-page-header-box">
                    <div className="profile-page-avatar-container">
                        <img
                            src={user.avatar && user.avatar.trim() !== '' ? user.avatar : '/images/default_avatar.jpg'}
                            className="profile-page-img"
                            alt="User Avatar"
                        />
                        <div className="profile-page-status-badge"></div>
                    </div>
                    <h3 className="profile-page-title">
                        <span style={{ background: '#e8f0fe', padding: '8px 12px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="fa-solid fa-store" style={{ color: 'var(--pp-accent)' }}></i>
                        </span>
                        {user.name}
                    </h3>
                    <p className="profile-page-desc">Administrator Account & Business Profile</p>
                </div>

                <div className="profile-page-grid-form">
                    {/* Name Field */}
                    <div className="profile-page-input-box">
                        <label>NAME</label>
                        <div className="profile-page-input-field-wrapper">
                            <i className="fa-regular fa-user"></i>
                            <input
                                type="text"
                                defaultValue={user.name || ''}
                                disabled
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="profile-page-input-box">
                        <label>EMAIL ADDRESS</label>
                        <div className="profile-page-input-field-wrapper">
                            <i className="fa-regular fa-envelope"></i>
                            <input
                                type="email"
                                defaultValue={user.email || ''}
                                disabled
                            />
                        </div>
                    </div>

                    {/* GSTIN Number */}
                    <div className="profile-page-input-box">
                        <label>GSTIN NUMBER</label>
                        <div className="profile-page-input-field-wrapper">
                            <i className="fa-solid fa-percent"></i>
                            <input
                                type="text"
                                defaultValue={user.gstin || ''}
                                disabled
                            />
                        </div>
                    </div>

                    {/* Joined Date */}
                    <div className="profile-page-input-box">
                        <label>JOINED</label>
                        <div className="profile-page-input-field-wrapper">
                            <i className="fa-solid fa-calendar-days"></i>
                            <input
                                type="text"
                                defaultValue={String(user.createdAt || '').substring(0, 10)}
                                disabled
                            />
                        </div>
                    </div>
                </div>

                <div className="profile-page-actions">
                    <Link
                        to="/myprofile/update"
                        className="profile-page-btn"
                    >
                        <i className="fa-solid fa-user-pen"></i> Edit Profile Details
                    </Link>
                    <Link 
                        to="/myprofile/update/password" 
                        className="profile-page-btn profile-page-btn-secondary"
                    >
                        <i className="fa-solid fa-key"></i> Change Password
                    </Link>
                </div>
            </div>
        </div>
    );
}