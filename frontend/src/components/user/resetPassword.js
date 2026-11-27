import React, { Fragment, useEffect, useState } from 'react';
import '../styles/resetPassword.css';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, resetPassword } from '../../actions/userActions';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useParams();
    
    const { isAuthenticated, error, loading } = useSelector(state => state.authState || {});

    const submitHandler = (e) => {
        e.preventDefault();
        
        if (loading) return;

        if (!token || typeof token !== 'string' || !token.trim()) {
            toast.error("Invalid or missing reset token.", {
                id: 'reset-password-token-error',
                position: 'bottom-right'
            });
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters", {
                id: 'reset-password-length-error',
                position: 'bottom-right'
            });
            return;
        }
        
        if (password !== confirmPassword) {
            toast.error("Passwords do not match", {
                id: 'reset-password-mismatch-error',
                position: 'bottom-right'
            });
            return;
        }

        const passwordsData = {
            password,
            confirmPassword
        };
        
        dispatch(resetPassword(passwordsData, token));
    };

    useEffect(() => {
        let isMounted = true;

        if (isAuthenticated && isMounted) {
            toast.success('Password reset successfully', {
                id: 'reset-password-success',
                position: 'bottom-right'
            });
            navigate('/', { replace: true });
        }

        if (error) {
            const errText =
                typeof error === 'object' && error !== null
                    ? (error.message || 'Password reset failed. Please try again.')
                    : String(error);

            if (isMounted && errText) {
                toast.error(errText, {
                    id: 'reset-password-error',
                    position: 'bottom-right'
                });
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
    }, [isAuthenticated, error, dispatch, navigate]);

    return (
        <Fragment>
            <Toaster 
                position="bottom-right" 
                reverseOrder={false} 
                containerStyle={{ zIndex: 999999 }}
            />
            <div className="reset-password-container-module">
                <div className="reset-password-card">
                    
                    {/* Header: Rounded Square Icon + Title & Description */}
                    <div className="reset-password-header">
                        <div className="reset-password-icon">
                            <i className="fa-solid fa-key"></i>
                        </div>
                        <div className="reset-password-header-meta">
                            <h1 className="reset-password-title">Set new password</h1>
                            <p className="reset-password-desc">Must be at least 6 characters. Enter same password in both of the field</p>
                        </div>
                    </div>

                    <form onSubmit={submitHandler}>
                        <div className="input-group">
                            <label htmlFor="reset-new-password">PASSWORD</label>
                            <div className="reset-input-wrapper">
                                <span className="reset-input-icon-badge" aria-hidden="true">
                                    <i className="fa-solid fa-lock"></i>
                                </span>
                                <input 
                                    id="reset-new-password"
                                    type="password" 
                                    className="reset-input" 
                                    placeholder="••••••••"
                                    value={password} 
                                    onChange={e => setPassword(e.target.value)} 
                                    autoComplete="new-password"
                                    required 
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="reset-confirm-password">CONFIRM PASSWORD</label>
                            <div className="reset-input-wrapper">
                                <span className="reset-input-icon-badge" aria-hidden="true">
                                    <i className="fa-solid fa-key"></i>
                                </span>
                                <input 
                                    id="reset-confirm-password"
                                    type="password" 
                                    className="reset-input" 
                                    placeholder="••••••••"
                                    value={confirmPassword} 
                                    onChange={e => setConfirmPassword(e.target.value)} 
                                    autoComplete="new-password"
                                    required 
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="reset-btn" 
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Reset Password \u2192"}
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    );
}