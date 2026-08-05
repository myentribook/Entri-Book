import { Link } from 'react-router-dom';
import '../styles/profile.css';
import { useSelector } from 'react-redux';

export default function Profile() {
    const { user } = useSelector((state) => state.authState);

    // Guard clause handles the null/loading state
    if (!user) {
        return <div className="profile-page-wrapper">Loading profile...</div>;
    }

    return (
        <div className="profile-page-wrapper">
            {/* Left Section */}
            <div className="profile-page-sidebar-card">
                <div className="profile-page-avatar-container">
                    <img
                        src={user.avatar && user.avatar.trim() !== '' ? user.avatar : '/images/default_avatar.jpg'}
                        className="profile-page-img"
                        alt="User Avatar"
                    />
                    <div className="profile-page-status-badge"></div>
                </div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>{user.name}</h3>
                <p className="profile-page-user-role">
                    <i className="fa-solid fa-shield-halved"></i> Administrator
                </p>
            </div>

            {/* Right Section */}
            <div className="profile-page-main-card">
                <div className="profile-page-section-title">
                    <i className="fa-solid fa-sliders"></i> General Information
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
                    <div className="profile-page-input-box" style={{ gridColumn: 'span 2' }}>
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


                    <div className="profile-page-input-box" style={{ gridColumn: 'span 2' }}>
                        <label>JOINED</label>
                        <div className="profile-page-input-field-wrapper">
                            <i class="fa-solid fa-calendar-days"></i>
                            <input
                                type="email"
                                defaultValue={String(user.createdAt || '').substring(0, 10)}
                                disabled
                            />
                        </div>
                    </div>

                </div>

                <Link
                    to="/myprofile/update"
                    className="profile-page-btn"
                    style={{ textDecoration: 'none' }}
                >
                    <i className="fa-solid fa-user-pen"></i> Edit Profile Details
                </Link>
                <Link to='/myprofile/update/password' style={{ textDecoration: 'none' }} className="profile-page-btn">
                    <i class="fa-solid fa-key"></i>Change Password
                </Link>
            </div>
        </div>
    );
}