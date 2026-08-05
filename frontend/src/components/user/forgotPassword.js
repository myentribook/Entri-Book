import { Fragment, useEffect, useState } from 'react';
import '../styles/forgotPassword.css';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, forgotPassword } from '../../actions/userActions';
import toast, { Toaster } from 'react-hot-toast';

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();
    
    // Access state
    const { loading, error, message } = useSelector(state => state.authState);

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('email', email);
        
        // This works because forgotPassword is a function
        dispatch(forgotPassword(formData));
    };

    useEffect(() => {
        // Handle Success
        if (message) {
            const msgText = (typeof message === 'object' && message.message) ? message.message : message;
            toast.success(msgText, { position: 'bottom-right' });
            setEmail("");
        }

        // Handle Error
        if (error) {
            const errText = (typeof error === 'object' && error.message) ? error.message : error;
            toast.error(errText, { position: 'bottom-right' });
            
            // FIX: Removed parentheses () because clearAuthError is an object
            dispatch(clearAuthError); 
        }
    }, [message, error, dispatch]);

    return (
        <Fragment>
            <Toaster />
            <div className="auth-v9-viewport-fix">
                <div className="auth-v9-card">
                    <div className="auth-v9-icon"><i className="fa-solid fa-lock"></i></div>
                    <h1 className="auth-v9-title">Forgot Password?</h1>
                    <p className="auth-v9-desc">
                        No worries, we'll send you reset instructions to your registered email.
                    </p>

                    <form onSubmit={submitHandler}>
                        <input
                            type="email"
                            className="auth-v9-input"
                            placeholder="name@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" className="auth-v9-btn" disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    );
}