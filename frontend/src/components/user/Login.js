// import { Fragment, useEffect } from 'react';
// import '../styles/login.css';
// import MetaData from '../layouts/MetaData';
// import { useState } from 'react';
// import { clearAuthError, login } from '../../actions/userActions';
// import { useDispatch, useSelector } from 'react-redux';
// import toast, { Toaster } from 'react-hot-toast';
// import { Link, useNavigate } from 'react-router-dom';

// export default function Login() {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const { loading, error, isAuthenticated } = useSelector(state => state.authState);

//     useEffect(() => {
//         if (isAuthenticated) {
//             navigate('/');
//         }

//         if (error) {
//             toast.error(error, { position: 'bottom-right' });
//             // This now works because clearAuthError returns a function
//             dispatch(clearAuthError());
//         }
//     }, [isAuthenticated, error, navigate, dispatch]); 

//     const submitHandler = (e) => {
//         e.preventDefault(); // Added to prevent page refresh on form submit
//         dispatch(login(email, password));
//     };

//     return (
//         <Fragment>
//             <Toaster />
//             <MetaData title={`Login`} />
//             <div className="ka-card">
//                 <h1 className="ka-title">Welcome Back</h1>
//                 <p className='ka-para'>Where Business Meets Simplicity.</p>

//                 <form onSubmit={submitHandler}>
//                     <div className="ka-input-group">
//                         <input
//                             type="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             placeholder="Email address"
//                             required
//                         />
//                     </div>
//                     <div className="ka-input-group">
//                         <input
//                             type="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             placeholder="Enter password"
//                             autoComplete="current-password"
//                             required
//                         />
//                     </div>

//                     <button
//                         type="submit"
//                         className="ka-btn-main"
//                         disabled={loading}
//                     >
//                         {loading ? "Logging in..." : "Login"}
//                     </button>
//                     <Link to='/register' style={{ textDecoration: "none", padding:"15px" , fontWeight:"bold" }} className="register-link">New User ?</Link>
//                     <Link to='/password/forgot' style={{ textDecoration: "none" , color: "#DC2626" , fontWeight:"bold" }} className="forgot-password">forgot password</Link>
//                 </form>
//             </div>
//         </Fragment>
//     );
// }

import { Fragment, useEffect } from 'react';
import '../styles/login.css';
import MetaData from '../layouts/MetaData';
import { useState } from 'react';
import { clearAuthError, login } from '../../actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, isAuthenticated } = useSelector(state => state.authState);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }

        if (error) {
            toast.error(error, { position: 'bottom-right' });
            dispatch(clearAuthError());
        }
    }, [isAuthenticated, error, navigate, dispatch]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    };

    return (
        <Fragment>
            <Toaster />
            <MetaData title={`Login`} />
            <div className="ka-login-page-wrapper">
                <div className="ka-card">
                    <h1 className="ka-title"> <i className="fa-solid fa-store"></i> Shop Owner Sign In</h1>
                    <p className='ka-para'>Access your billing, inventory, and ledger in one place.</p>

                    <form onSubmit={submitHandler}>
                        <div className="ka-input-group">
                            <label>EMAIL ID</label>
                            <div className="ka-input-wrapper">
                                <i className="fa-regular fa-envelope"></i>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@business.com"
                                />
                            </div>
                        </div>
                        <div className="ka-input-group">
                            <label>PASSWORD</label>
                            <div className="ka-input-wrapper">
                                <i className="fa-solid fa-lock"></i>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="ka-btn-main"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login to Account →"}
                        </button>

                        <div className="ka-footer-links">
                            <Link to='/register' className="register-link">
                                <i className="fa-solid fa-user-plus"></i> Register ?
                            </Link>
                            <Link to='/password/forgot' className="forgot-password">
                                <i className="fa-solid fa-key"></i> Forgot Password?
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </Fragment>
    );
}