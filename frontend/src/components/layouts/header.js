import React from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import { Dropdown, Image } from 'react-bootstrap';

import { logout } from '../../actions/userActions';

import 'bootstrap/dist/css/bootstrap.min.css';

import '../styles/header.css';

// import headingLogo from '../../public/headingLogo.png'


export default function Header() {

    const { isAuthenticated, user } = useSelector(state => state.authState);

    const dispatch = useDispatch();

    const navigate = useNavigate();



    const logoutHandler = async (e) => {

        e.preventDefault();

        try {

            await dispatch(logout());

            navigate('/');

        } catch (error) {

            console.error("Logout failed:", error);

        }

    };



    return (

        <nav className="floating-navbar header-container">

            <Link to="/" className="logo-link">

                <div className="logo">

                    {isAuthenticated ? (

                        <Dropdown className='d-inline'>

                            <Dropdown.Toggle id='header-dropdown-toggle' className="border-0 bg-transparent p-0">

                                <figure className='avatar avatar-nav-custom m-0'>

                                    <Image

                                        src={user?.avatar || '/images/default_avatar.jpg'}

                                        roundedCircle

                                        alt={user?.name || 'User'}

                                    />

                                </figure>

                            </Dropdown.Toggle>



                            <Dropdown.Menu align="end" className="header-dropdown-menu">

                                <Dropdown.Header className="header-user-name">

                                    {user?.name || 'User'}

                                </Dropdown.Header>

                                <Dropdown.Divider />

                                {user?.role === 'admin' && <Dropdown.Item as={Link} onClick={() => { navigate('/admin') }} className='text-dark' to="/admin" style={{ fontWeight: 'bold' }} >  admin</Dropdown.Item>}

                                <Dropdown.Item as={Link} onClick={() => { navigate('/myprofile') }} className='text-dark' to="/myprofile" style={{ fontWeight: 'bold' }} >  Profile</Dropdown.Item>



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

                           <div className='user-login-page'> <i className="fa-solid fa-user"></i></div>

                        </Link>

                    )}  <span style={{ marginLeft: "25px" }} className='app-name' >entri<span className='app-name'>book<span className='dotin'>.in</span></span></span>

                </div>

            </Link>



            <div className="nav-actions">

                <Link to="/subscription" style={{ textDecoration: 'none' }} className="sub-btn-unique" aria-label="Subscribe">

                    <div className='subscription-btn'> <i class="fa-regular fa-bell"></i></div>

                </Link>

            </div>

        </nav>

    );

}
