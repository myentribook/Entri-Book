import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, Image } from 'react-bootstrap';
import { logout } from '../../actions/userActions';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/header.css';
// import headingLogo from '../../public/headingLogo.png'

export default function Header() {
    const { isAuthenticated, user } = useSelector((state) => state?.authState || {});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async (e) => {
        if (e && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }
        try {
            await dispatch(logout());
            navigate('/');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const avatarSrc =
        user && typeof user.avatar === 'string' && user.avatar.trim() !== ''
            ? user.avatar
            : '/images/default_avatar.jpg';
    const userName = user && typeof user.name === 'string' && user.name.trim() !== '' ? user.name : 'User';
    const isAdmin = Boolean(user && user.role === 'admin');

    return (
        <nav className="floating-navbar header-container">
            <div className="logo-link">
                <div className="logo">
                    {isAuthenticated ? (
                        <Dropdown className='d-inline'>
                            <Dropdown.Toggle id='header-dropdown-toggle' className="border-0 bg-transparent p-0">
                                <figure className='avatar avatar-nav-custom m-0'>
                                    <Image
                                        src={avatarSrc}
                                        roundedCircle
                                        alt={userName}
                                    />
                                </figure>
                            </Dropdown.Toggle>

                            <Dropdown.Menu align="end" className="header-dropdown-menu">
                                <Dropdown.Header className="header-user-name">
                                    {userName}
                                </Dropdown.Header>
                                <Dropdown.Divider />
                                {isAdmin && (
                                    <Dropdown.Item as={Link} className='text-dark' to="/admin" style={{ fontWeight: 'bold' }}>
                                        admin
                                    </Dropdown.Item>
                                )}
                                <Dropdown.Item as={Link} className='text-dark' to="/myprofile" style={{ fontWeight: 'bold' }}>
                                    Profile
                                </Dropdown.Item>

                                <Dropdown.Item
                                    onClick={logoutHandler}
                                    className='text-danger'
                                    style={{ fontWeight: 'bold' }}
                                >
                                    Logout
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : (
                        <Link to="/login" className="user-icon-btn" aria-label="Login">
                            <div className='user-login-page'>
                                <i className="fa-solid fa-user"></i>
                            </div>
                        </Link>
                    )}
                    <span style={{ marginLeft: "25px" }} className='app-name'>
                        entri<span className='app-name'>book<span className='dotin'>.in</span></span>
                    </span>
                </div>
            </div>

            <div className="nav-actions">
                <Link to="/subscription" style={{ textDecoration: 'none' }} className="sub-btn-unique" aria-label="Subscribe">
                    <div className='subscription-btn'>
                        <span className="sub-pill-icon"><i className="fa-solid fa-crown"></i></span>
                        <span className="sub-pill-text">Upgrade</span>
                    </div>
                </Link>
            </div>
        </nav>
    );
}