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
                    <div className="ka-brand-header">
                        <div className="ka-avatar-icon">
                            <i className="fa-solid fa-store"></i>
                        </div>
                        <div className="ka-header-text">
                            <span className="ka-brand-title">Shop Owner Sign In</span>
                            <p className='ka-para'>Access your billing, inventory, and ledger in one place.</p>
                        </div>
                    </div>

                    <form onSubmit={submitHandler}>
                        <div className="ka-input-group">
                            <label>EMAIL ID</label>
                            <div className="ka-input-wrapper">
                                <span className="ka-input-icon-badge" aria-hidden="true">
                                    <i className="fa-regular fa-envelope"></i>
                                </span>
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
                                <span className="ka-input-icon-badge" aria-hidden="true">
                                    <i className="fa-solid fa-lock"></i>
                                </span>
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
                                <i className="fa-solid fa-chevron-right ka-link-chevron" aria-hidden="true"></i>
                            </Link>
                            <Link to='/password/forgot' className="forgot-password">
                                <i className="fa-solid fa-key"></i> Forgot Password?
                                <i className="fa-solid fa-chevron-right ka-link-chevron" aria-hidden="true"></i>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </Fragment>
    );
}