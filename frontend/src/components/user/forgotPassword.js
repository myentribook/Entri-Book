import { Fragment, useEffect, useState } from 'react';
import '../styles/forgotPassword.css';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, forgotPassword } from '../../actions/userActions';
import toast, { Toaster } from 'react-hot-toast';

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();
    
    const { loading, error, message } = useSelector(state => state.authState);

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('email', email);
        
        dispatch(forgotPassword(formData));
    };

    useEffect(() => {
        if (message) {
            const msgText = (typeof message === 'object' && message.message) ? message.message : message;
            toast.success(msgText, { position: 'bottom-right' });
            setEmail("");
        }

        if (error) {
            const errText = (typeof error === 'object' && error.message) ? error.message : error;
            toast.error(errText, { position: 'bottom-right' });
            dispatch(clearAuthError); 
        }
    }, [message, error, dispatch]);

    return (
        <Fragment>
            <Toaster />
            <div className="auth-v9-viewport-fix">
                <div className="auth-v9-card">
                    
                    {/* Header: Icon & Title on the same line, Paragraph below, centered */}
                    <div className="auth-v9-header">
                        <div className="auth-v9-title-row">
                            <div className="auth-v9-icon">
                                <i className="fa-solid fa-lock"></i>
                            </div>
                            <h1 className="auth-v9-title">Forgot Password?</h1>
                        </div>
                        <p className="auth-v9-desc">
                            No worries, we'll send you reset instructions to your registered email.
                        </p>
                    </div>

                    <form onSubmit={submitHandler}>
                        <div className="auth-v9-group">
                            <label className="auth-v9-label">EMAIL ID</label>
                            <div className="auth-v9-input-wrapper">
                                <i className="fa-regular fa-envelope"></i>
                                <input
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