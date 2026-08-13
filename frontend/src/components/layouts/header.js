// import React from 'react';

// import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate

// import { useDispatch, useSelector } from 'react-redux';

// import { Dropdown, Image } from 'react-bootstrap';

// import { logout } from '../../actions/userActions';

// import 'bootstrap/dist/css/bootstrap.min.css';

// import '../styles/header.css';



// export default function Header() {

//     const { isAuthenticated, user } = useSelector(state => state.authState);

//     const dispatch = useDispatch();

//     const navigate = useNavigate();



//     const logoutHandler = async (e) => {

//         e.preventDefault(); // Prevents default link/button behavior

//         try {

//             await dispatch(logout());

//             navigate('/'); // Redirect to login after successful logout

//         } catch (error) {

//             console.error("Logout failed:", error);

//         }

//     };



//     return (

//         <nav className="floating-navbar header-container">

//             <Link to="/" className="logo-link">

//                 <div className="logo">

//                     <i className="fa-solid fa-cloud"></i> Entri Book

//                 </div>

//             </Link>



//             <div className="nav-actions">

//                 <Link to='/subscription' style={{ textDecoration: 'none' }} className="sub-btn-unique" aria-label="Subscribe">

//                     <i class="fa-solid fa-crown"></i> subscription

//                 </Link>



//                 {isAuthenticated ? (

//                     <Dropdown className='d-inline'>

//                         <Dropdown.Toggle id='header-dropdown-toggle' className="border-0 bg-transparent p-0">

//                             <figure className='avatar avatar-nav-custom m-0'>

//                                 {/* Added Optional Chaining here to prevent crash */}

//                                 <Image

//                                     src={user?.avatar || '/images/default_avatar.jpg'}

//                                     roundedCircle

//                                     alt={user?.name || 'User'}

//                                 />

//                             </figure>

//                         </Dropdown.Toggle>



//                         <Dropdown.Menu align="end" className="header-dropdown-menu">

//                             <Dropdown.Header className="header-user-name">

//                                 {user?.name || 'User'} {/* Added Optional Chaining */}

//                             </Dropdown.Header>

//                             <Dropdown.Divider />

//                             <Dropdown.Item as={Link} onClick={() => { navigate('/myprofile') }} className='text-dark' to="/myprofile">Profile</Dropdown.Item>



//                             {/* Removed href, handled via onClick and Navigate */}

//                             <Dropdown.Item

//                                 onClick={logoutHandler}

//                                 className='text-danger'

//                             >

//                                 Logout

//                             </Dropdown.Item>

//                         </Dropdown.Menu>

//                     </Dropdown>

//                 ) : (

//                     <Link to="/login" className="user-icon-btn" aria-label="Login">

//                         <i className="fa-regular fa-user"></i>

//                     </Link>

//                 )}

//             </div>

//         </nav>

//     );

// }



// import React from 'react';

// import { Link, useNavigate } from 'react-router-dom';

// import { useDispatch, useSelector } from 'react-redux';

// import { Dropdown, Image } from 'react-bootstrap';

// import { logout } from '../../actions/userActions';

// import 'bootstrap/dist/css/bootstrap.min.css';

// import '../styles/header.css';



// export default function Header() {

//     const { isAuthenticated, user } = useSelector(state => state.authState);

//     const dispatch = useDispatch();

//     const navigate = useNavigate();



//     const logoutHandler = async (e) => {

//         e.preventDefault();

//         try {

//             await dispatch(logout());

//             navigate('/');

//         } catch (error) {

//             console.error("Logout failed:", error);

//         }

//     };



//     return (

//         <nav className="floating-navbar header-container">

//             <Link to="/" className="logo-link">

//                 <div className="logo">

//                     <i className="fa-solid fa-cloud"></i> Entri Book

//                 </div>

//             </Link>



//             <div className="nav-actions">

//                 {/* <Link to="/subscription" style={{ textDecoration: 'none' }} className="sub-btn-unique" aria-label="Subscribe">

//                     <i className="fa-solid fa-crown"></i> subscription

//                 </Link> */}



//                 <Link to="/subscription" style={{ textDecoration: 'none' }} className="sub-btn-unique" aria-label="Subscribe">

//                     <i className="fa-solid fa-crown"></i> subscription

//                 </Link>



//                 {isAuthenticated ? (

//                     <Dropdown className='d-inline'>

//                         <Dropdown.Toggle id='header-dropdown-toggle' className="border-0 bg-transparent p-0">

//                             <figure className='avatar avatar-nav-custom m-0'>

//                                 <Image

//                                     src={user?.avatar || '/images/default_avatar.jpg'}

//                                     roundedCircle

//                                     alt={user?.name || 'User'}

//                                 />

//                             </figure>

//                         </Dropdown.Toggle>



//                         <Dropdown.Menu align="end" className="header-dropdown-menu">

//                             <Dropdown.Header className="header-user-name">

//                                 {user?.name || 'User'}

//                             </Dropdown.Header>

//                             <Dropdown.Divider />

//                             <Dropdown.Item as={Link} onClick={() => { navigate('/myprofile') }} className='text-dark' to="/myprofile">Profile</Dropdown.Item>



//                             <Dropdown.Item

//                                 onClick={logoutHandler}

//                                 className='text-danger'

//                             >

//                                 Logout

//                             </Dropdown.Item>

//                         </Dropdown.Menu>

//                     </Dropdown>

//                 ) : (

//                     <Link to="/login" className="user-icon-btn" aria-label="Login">

//                         <i className="fa-regular fa-user"></i>

//                     </Link>

//                 )}

//             </div>

//         </nav>

//     );

// }





import React from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import { Dropdown, Image } from 'react-bootstrap';

import { logout } from '../../actions/userActions';

import 'bootstrap/dist/css/bootstrap.min.css';

import '../styles/header.css';



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

                    <i className="fa-solid fa-cloud"></i> Entri Book

                </div>

            </Link>



            <div className="nav-actions">

                <Link to="/subscription" style={{ textDecoration: 'none' }} className="sub-btn-unique" aria-label="Subscribe">

                    <i className="fa-solid fa-crown"></i> subscribe

                </Link>



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

                            {user?.role === 'admin' && <Dropdown.Item as={Link} onClick={() => { navigate('/admin') }} className='text-dark' to="/admin">Admin</Dropdown.Item>}

                            <Dropdown.Item as={Link} onClick={() => { navigate('/myprofile') }} className='text-dark' to="/myprofile">Profile</Dropdown.Item>



                            <Dropdown.Item

                                onClick={logoutHandler}

                                className='text-danger'

                            >

                                Logout

                            </Dropdown.Item>

                        </Dropdown.Menu>

                    </Dropdown>

                ) : (

                    <Link to="/login" className="user-icon-btn" aria-label="Login">

                        <i className="fa-regular fa-user"></i>

                    </Link>

                )}

            </div>

        </nav>

    );

}
