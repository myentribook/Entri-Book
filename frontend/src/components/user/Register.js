import { Fragment, useEffect, useState } from 'react';
import '../styles/register.css';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearAuthError } from '../../actions/userActions';
import toast, { Toaster } from 'react-hot-toast';
import MetaData from '../layouts/MetaData';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [userData, setUserData] = useState({
        name: "", email: "", password: "", city: "", phone: "", gstin: "" //--new
    });
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("/images/default_avatar.jpg");
    const navigate = useNavigate();

    const { loading, error, isRegistered } = useSelector(state => state.authState);
    const dispatch = useDispatch();

    const onChange = (e) => {
        if (e.target.name === 'avatar') {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setAvatar(e.target.files[0]);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setUserData({ ...userData, [e.target.name]: e.target.value });
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', userData.name);
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        formData.append('city', userData.city);
        formData.append('phone', userData.phone);
        formData.append('avatar', avatar);
        formData.append('gstin', userData.gstin);        //--new

        dispatch(register(formData));
    };

    useEffect(() => {
        if (isRegistered) {
            toast.success("Registration Successful! Please login.", {
                position: 'bottom-right'
            });
            navigate('/login');
            return;
        }

        if (error) {
            toast.error(error, {
                position: 'bottom-right'
            });
            dispatch(clearAuthError());
            return;
        }
    }, [error, dispatch, isRegistered, navigate]);

    return (
        <Fragment>
            <Toaster />
            <MetaData title={`Register`} />
            <div className="auth-page-container">
                <div className="auth-wrapper-v2">
                    <form onSubmit={submitHandler} className="shadow-lg" encType="multipart/form-data">
                        
                        {/* Header Badge */}
                        <div className="brand-badge">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                            </svg>  <h1 className="auth-title">Welcome to Entri Book</h1>
                        </div>

                       
                        <p className="subtitle">Create Your Account to access your billing, inventory, and ledger.</p>

                        {/* Full Name */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="name_field">FULL NAME</label>
                            <div className="input-icon-wrapper">
                                <span className="input-icon">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </span>
                                <input 
                                    name='name' 
                                    value={userData.name} 
                                    onChange={onChange} 
                                    type="text" 
                                    id="name_field" 
                                    className="form-control" 
                                    placeholder="Enter your full name" 
                                />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="email_field">EMAIL ID</label>
                            <div className="input-icon-wrapper">
                                <span className="input-icon">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </span>
                                <input 
                                    name='email' 
                                    value={userData.email} 
                                    onChange={onChange} 
                                    type="email" 
                                    id="email_field" 
                                    className="form-control" 
                                    placeholder="name@business.com" 
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="password_field">PASSWORD</label>
                            <div className="input-icon-wrapper">
                                <span className="input-icon">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </span>
                                <input 
                                    name='password' 
                                    value={userData.password} 
                                    onChange={onChange} 
                                    type="password" 
                                    id="password_field" 
                                    className="form-control" 
                                    placeholder="••••••••" 
                                />
                            </div>
                        </div>

                        {/* Profile Picture */}
                        <div className="form-group">
                            <label className="form-label">PROFILE PHOTO</label>
                            <div className="avatar-upload-container">
                                <figure className="avatar-preview">
                                    <img src={avatarPreview} alt="Avatar Preview" />
                                </figure>
                                <div className="custom-file">
                                    <input 
                                        type="file" 
                                        name="avatar" 
                                        onChange={onChange} 
                                        className="custom-file-inputs" 
                                        id="customFile" 
                                    />
                                    <label className="custom-file-labels" htmlFor="customFile">Upload a profile avatar image</label>
                                </div>
                            </div>
                        </div>

                        {/* City */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="city_field">CITY</label>
                            <div className="input-icon-wrapper">
                                <span className="input-icon">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </span>
                                <input 
                                    name='city' 
                                    value={userData.city} 
                                    onChange={onChange} 
                                    type="text" 
                                    id="city_field" 
                                    className="form-control" 
                                    placeholder="Enter your City" 
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="phone_field">PHONE NUMBER</label>
                            <div className="input-icon-wrapper">
                                <span className="input-icon">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </span>
                                <input 
                                    name='phone' 
                                    value={userData.phone} 
                                    onChange={onChange} 
                                    type="text" 
                                    id="phone_field" 
                                    className="form-control" 
                                    placeholder="Enter mobile number" 
                                />
                            </div>
                        </div>

                        {/* GSTIN */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="GSTIN_field">GSTIN NUMBER</label>
                            <div className="input-icon-wrapper">
                                <span className="input-icon">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </span>
                                <input
                                    name='gstin'
                                    value={userData.gstin}
                                    onChange={onChange}
                                    type="text"
                                    id="GSTIN_field"
                                    className="form-control"
                                    placeholder="Enter GSTIN number"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? "Registering..." : (
                                <>
                                    Register Account &rarr;
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    );
}