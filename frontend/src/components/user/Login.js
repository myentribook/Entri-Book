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
            // This now works because clearAuthError returns a function
            dispatch(clearAuthError());
        }
    }, [isAuthenticated, error, navigate, dispatch]); 

    const submitHandler = (e) => {
        e.preventDefault(); // Added to prevent page refresh on form submit
        dispatch(login(email, password));
    };

    return (
        <Fragment>
            <Toaster />
            <MetaData title={`Login`} />
            <div className="ka-card">
                <h1 className="ka-title">Welcome Back</h1>
                <p className='ka-para'>Where Business Meets Simplicity.</p>

                <form onSubmit={submitHandler}>
                    <div className="ka-input-group">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address"
                            required
                        />
                    </div>
                    <div className="ka-input-group">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="ka-btn-main"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    <Link to='/register' style={{ textDecoration: "none", padding:"15px" , fontWeight:"bold" }} className="register-link">New User ?</Link>
                    <Link to='/password/forgot' style={{ textDecoration: "none" , color: "#DC2626" , fontWeight:"bold" }} className="forgot-password">forgot password</Link>
                </form>
            </div>
        </Fragment>
    );
}