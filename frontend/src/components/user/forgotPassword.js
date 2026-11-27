import { Fragment, useEffect, useState } from 'react';
import '../styles/forgotPassword.css';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, forgotPassword } from '../../actions/userActions';
import toast, { Toaster } from 'react-hot-toast';

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();
    
    const { loading, error, message } = useSelector(state => state.authState || {});

    const submitHandler = (e) => {
        e.preventDefault();
        if (loading) return;

        const trimmedEmail = email.trim();
        if (!trimmedEmail) return;

        const formData = new FormData();
        formData.append('email', trimmedEmail);
        
        dispatch(forgotPassword(formData));
    };

    useEffect(() => {
        let isMounted = true;

        if (message) {
            const msgText =
                typeof message === 'object' && message !== null
                    ? (message.message || 'Reset link sent successfully.')
                    : String(message);

            if (isMounted && msgText) {
                toast.success(msgText, { id: 'forgot-password-success', position: 'bottom-right' });
                setEmail("");
            }
        }

        if (error) {
            const errText =
                typeof error === 'object' && error !== null
                    ? (error.message || 'Something went wrong. Please try again.')
                    : String(error);

            if (isMounted && errText) {
                toast.error(errText, { id: 'forgot-password-error', position: 'bottom-right' });
            }

            if (typeof clearAuthError === 'function') {
                dispatch(clearAuthError());
            } else {
                dispatch(clearAuthError);
            }
        }

        return () => {
            isMounted = false;
        };
    }, [message, error, dispatch]);

    return (
        <Fragment>
            <Toaster />
            <div className="auth-v9-viewport-fix">
                <div className="auth-v9-card">
                    
                    {/* Header: Rounded Square Icon + Title & Subtitle */}
                    <div className="auth-v9-header">
                        <div className="auth-v9-icon">
                            <i className="fa-solid fa-lock"></i>
                        </div>
                        <div className="auth-v9-header-meta">
                            <h1 className="auth-v9-title">Forgot Password?</h1>
                            <p className="auth-v9-desc">
                                No worries, we'll send you reset instructions to your registered email.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={submitHandler}>
                        <div className="auth-v9-group">
                            <label htmlFor="forgot-password-email" className="auth-v9-label">EMAIL ID</label>
                            <div className="auth-v9-input-wrapper">
                                <span className="auth-v9-input-icon-badge" aria-hidden="true">
                                    <i className="fa-regular fa-envelope"></i>
                                </span>
                                <input
                                    id="forgot-password-email"
                                    type="email"
                                    className="auth-v9-input"
                                    placeholder="name@business.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="auth-v9-btn" disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Link \u2192"}
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    );
}