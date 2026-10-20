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
    
    const { isAuthenticated, error, loading } = useSelector(state => state.authState);

    const submitHandler = (e) => {
        e.preventDefault();
        
        if (loading) return;

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters", { position: 'bottom-right' });
            return;
        }
        
        if (password !== confirmPassword) {
            toast.error("Passwords do not match", { position: 'bottom-right' });
            return;
        }

        const passwordsData = {
            password,
            confirmPassword
        };
        
        dispatch(resetPassword(passwordsData, token));
    };

    useEffect(() => {
        if (isAuthenticated) {
            toast.success('Password reset successfully', { position: 'bottom-right' });
            navigate('/');
        }

        if (error) {
            toast.error(error, { position: 'bottom-right' });
            dispatch(clearAuthError()); 
        }
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
                    
                    {/* Header: Icon & Title side-by-side, Description below, centered */}
                    <div className="reset-password-header">
                        <div className="reset-password-title-row">
                            <div className="reset-password-icon">
                                <i className="fa-solid fa-key"></i>
                            </div>
                            <h1 className="reset-password-title">Set new password</h1>
                        </div>
                        <p className="reset-password-desc">Must be at least 6 characters. Enter same password in both of the field</p>
                    </div>

                    <form onSubmit={submitHandler}>
                        <div className="input-group">
                            <label>PASSWORD</label>
                            <div className="reset-input-wrapper">
                                <i className="fa-solid fa-lock"></i>
                                <input 
                                    type="password" 
                                    className="reset-input" 
                                    placeholder="••••••••"
                                    value={password} 
                                    onChange={e => setPassword(e.target.value)} 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>CONFIRM PASSWORD</label>
                            <div className="reset-input-wrapper">
                                <i className="fa-solid fa-key"></i>
                                <input 
                                    type="password" 
                                    className="reset-input" 
                                    placeholder="••••••••"
                                    value={confirmPassword} 
                                    onChange={e => setConfirmPassword(e.target.value)} 
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