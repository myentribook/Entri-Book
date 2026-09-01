// // // import { Fragment, useEffect } from 'react';
// // // import '../styles/register.css';
// // // import { useDispatch, useSelector } from 'react-redux';
// // // import { register, clearAuthError } from '../../actions/userActions'; // Import clearAuthError
// // // import toast, { Toaster } from 'react-hot-toast';
// // // import MetaData from '../layouts/MetaData';
// // // import { useState } from 'react';
// // // import { useNavigate } from 'react-router-dom';

// // // export default function Register() {
// // //     const [userData, setUserData] = useState({
// // //         name: "", email: "", password: "", city: "", phone: ""
// // //     });
// // //     const [avatar, setAvatar] = useState("");
// // //     const [avatarPreview, setAvatarPreview] = useState("/images/default_avatar.jpg");
// // //     const navigate = useNavigate()
// // //     const { loading, error, isAuthenticated } = useSelector(state => state.authState);
// // //     const dispatch = useDispatch();

// // //     const onChange = (e) => {
// // //         if (e.target.name === 'avatar') {
// // //             const reader = new FileReader();
// // //             reader.onload = () => {
// // //                 if (reader.readyState === 2) {
// // //                     setAvatarPreview(reader.result);
// // //                     setAvatar(e.target.files[0]);
// // //                 }
// // //             };
// // //             reader.readAsDataURL(e.target.files[0]);
// // //         } else {
// // //             setUserData({ ...userData, [e.target.name]: e.target.value });
// // //         }
// // //     };

// // //     const submitHandler = (e) => {
// // //         e.preventDefault();
// // //         const formData = new FormData();
// // //         formData.append('name', userData.name);
// // //         formData.append('email', userData.email);
// // //         formData.append('password', userData.password);
// // //         formData.append('city', userData.city);
// // //         formData.append('phone', userData.phone);
// // //         formData.append('avatar', avatar);

// // //         dispatch(register(formData));
// // //     };

// // //     useEffect(() => {

// // //         if (isAuthenticated) {
// // //             navigate('/')
// // //             return
// // //         }

// // //         if (error) {
// // //             toast.error(error, {
// // //                 position: 'bottom-right'
// // //             });
// // //             // Clear the error in Redux store after displaying the toast
// // //             dispatch(clearAuthError);
// // //             return
// // //         }
// // //     }, [error, dispatch, isAuthenticated , navigate]);

// // //     return (
// // //         <Fragment>
// // //             <Toaster />
// // //             <MetaData title={`Register`} />
// // //             <div className="auth-page-container">
// // //                 <div className="auth-wrapper-v2">
// // //                     <form onSubmit={submitHandler} className="shadow-lg" encType="multipart/form-data">
// // //                         <h1 className="mb-3">Welcome to Entri Book</h1>
// // //                         <p className="subtitle">Create Your Account</p>

// // //                         <div className="form-group">
// // //                             <input name='name' value={userData.name} onChange={onChange} type="text" id="name_field" className="form-control" placeholder="Full name" />
// // //                         </div>

// // //                         <div className="form-group">
// // //                             <input name='email' value={userData.email} onChange={onChange} type="email" id="email_field" className="form-control" placeholder="Email address" />
// // //                         </div>

// // //                         <div className="form-group">
// // //                             <input name='password' value={userData.password} onChange={onChange} type="password" id="password_field" className="form-control" placeholder="Enter password" />
// // //                         </div>

// // //                         <div className="form-group">
// // //                             <div className="avatar-upload-container">
// // //                                 <figure className="avatar-preview">
// // //                                     <img src={avatarPreview} className="rounded-circle" alt="Avatar Preview" />
// // //                                 </figure>
// // //                                 <div className="custom-file">
// // //                                     <input type="file" name="avatar" onChange={onChange} className="custom-file-inputs" id="customFile" />
// // //                                     <label className="custom-file-labels" htmlFor="customFile">Choose File</label>
// // //                                 </div>
// // //                             </div>
// // //                         </div>

// // //                         <div className="form-group">
// // //                             <input name='city' value={userData.city} onChange={onChange} type="text" id="city_field" className="form-control" placeholder="Enter City" />
// // //                         </div>

// // //                         <div className="form-group">
// // //                             <input name='phone' value={userData.phone} onChange={onChange} type="text" id="phone_field" className="form-control" placeholder="Phone number" />
// // //                         </div>

// // //                         <button type="submit" className="submit-btn" disabled={loading}>
// // //                             {loading ? "Registering..." : "Register"}
// // //                         </button>
// // //                     </form>
// // //                 </div>
// // //             </div>
// // //         </Fragment>
// // //     );
// // // }


// // import { Fragment, useEffect } from 'react';
// // import '../styles/register.css';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { register, clearAuthError } from '../../actions/userActions'; // Import clearAuthError
// // import toast, { Toaster } from 'react-hot-toast';
// // import MetaData from '../layouts/MetaData';
// // import { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';

// // export default function Register() {
// //     const [userData, setUserData] = useState({
// //         name: "", email: "", password: "", city: "", phone: ""
// //     });
// //     const [avatar, setAvatar] = useState("");
// //     const [avatarPreview, setAvatarPreview] = useState("/images/default_avatar.jpg");
// //     const navigate = useNavigate()
// //     const { loading, error, isAuthenticated } = useSelector(state => state.authState);
// //     const dispatch = useDispatch();

// //     const onChange = (e) => {
// //         if (e.target.name === 'avatar') {
// //             const reader = new FileReader();
// //             reader.onload = () => {
// //                 if (reader.readyState === 2) {
// //                     setAvatarPreview(reader.result);
// //                     setAvatar(e.target.files[0]);
// //                 }
// //             };
// //             reader.readAsDataURL(e.target.files[0]);
// //         } else {
// //             setUserData({ ...userData, [e.target.name]: e.target.value });
// //         }
// //     };

// //     const submitHandler = (e) => {
// //         e.preventDefault();
// //         const formData = new FormData();
// //         formData.append('name', userData.name);
// //         formData.append('email', userData.email);
// //         formData.append('password', userData.password);
// //         formData.append('city', userData.city);
// //         formData.append('phone', userData.phone);
// //         formData.append('avatar', avatar);

// //         dispatch(register(formData));
// //     };

// //     useEffect(() => {

// //         if (isAuthenticated) {
// //             toast.success("Registration Successful! Please login.", {
// //                 position: 'bottom-right'
// //             });
// //             navigate('/login');
// //             return
// //         }

// //         if (error) {
// //             toast.error(error, {
// //                 position: 'bottom-right'
// //             });
// //             // Clear the error in Redux store after displaying the toast
// //             dispatch(clearAuthError());
// //             return
// //         }
// //     }, [error, dispatch, isAuthenticated, navigate]);

// //     return (
// //         <Fragment>
// //             <Toaster />
// //             <MetaData title={`Register`} />
// //             <div className="auth-page-container">
// //                 <div className="auth-wrapper-v2">
// //                     <form onSubmit={submitHandler} className="shadow-lg" encType="multipart/form-data">
// //                         <h1 className="mb-3">Welcome to Entri Book</h1>
// //                         <p className="subtitle">Create Your Account</p>

// //                         <div className="form-group">
// //                             <input name='name' value={userData.name} onChange={onChange} type="text" id="name_field" className="form-control" placeholder="Full name" />
// //                         </div>

// //                         <div className="form-group">
// //                             <input name='email' value={userData.email} onChange={onChange} type="email" id="email_field" className="form-control" placeholder="Email address" />
// //                         </div>

// //                         <div className="form-group">
// //                             <input name='password' value={userData.password} onChange={onChange} type="password" id="password_field" className="form-control" placeholder="Enter password" />
// //                         </div>

// //                         <div className="form-group">
// //                             <div className="avatar-upload-container">
// //                                 <figure className="avatar-preview">
// //                                     <img src={avatarPreview} className="rounded-circle" alt="Avatar Preview" />
// //                                 </figure>
// //                                 <div className="custom-file">
// //                                     <input type="file" name="avatar" onChange={onChange} className="custom-file-inputs" id="customFile" />
// //                                     <label className="custom-file-labels" htmlFor="customFile">Choose File</label>
// //                                 </div>
// //                             </div>
// //                         </div>

// //                         <div className="form-group">
// //                             <input name='city' value={userData.city} onChange={onChange} type="text" id="city_field" className="form-control" placeholder="Enter City" />
// //                         </div>

// //                         <div className="form-group">
// //                             <input name='phone' value={userData.phone} onChange={onChange} type="text" id="phone_field" className="form-control" placeholder="Phone number" />
// //                         </div>

// //                         <button type="submit" className="submit-btn" disabled={loading}>
// //                             {loading ? "Registering..." : "Register"}
// //                         </button>
// //                     </form>
// //                 </div>
// //             </div>
// //         </Fragment>
// //     );
// // }

// import { Fragment, useEffect } from 'react';
// import '../styles/register.css';
// import { useDispatch, useSelector } from 'react-redux';
// import { register, clearAuthError } from '../../actions/userActions'; // Import clearAuthError
// import toast, { Toaster } from 'react-hot-toast';
// import MetaData from '../layouts/MetaData';
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function Register() {
//     const [userData, setUserData] = useState({
//         name: "", email: "", password: "", city: "", phone: ""
//     });
//     const [avatar, setAvatar] = useState("");
//     const [avatarPreview, setAvatarPreview] = useState("/images/default_avatar.jpg");
//     const navigate = useNavigate()

//     // isAuthenticated-க்கு பதிலாக isRegistered-ஐauthState-ல் இருந்து destructure செய்கிறோம்
//     const { loading, error, isRegistered } = useSelector(state => state.authState);
//     const dispatch = useDispatch();

//     const onChange = (e) => {
//         if (e.target.name === 'avatar') {
//             const reader = new FileReader();
//             reader.onload = () => {
//                 if (reader.readyState === 2) {
//                     setAvatarPreview(reader.result);
//                     setAvatar(e.target.files[0]);
//                 }
//             };
//             reader.readAsDataURL(e.target.files[0]);
//         } else {
//             setUserData({ ...userData, [e.target.name]: e.target.value });
//         }
//     };

//     const submitHandler = (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append('name', userData.name);
//         formData.append('email', userData.email);
//         formData.append('password', userData.password);
//         formData.append('city', userData.city);
//         formData.append('phone', userData.phone);
//         formData.append('avatar', avatar);

//         dispatch(register(formData));
//     };

//     useEffect(() => {

//         if (isRegistered) {
//             toast.success("Registration Successful! Please login.", {
//                 position: 'bottom-right'
//             });
//             navigate('/login');
//             return
//         }

//         if (error) {
//             toast.error(error, {
//                 position: 'bottom-right'
//             });
//             // Clear the error in Redux store after displaying the toast
//             dispatch(clearAuthError());
//             return
//         }
//     }, [error, dispatch, isRegistered, navigate]);

//     return (
//         <Fragment>
//             <Toaster />
//             <MetaData title={`Register`} />
//             <div className="auth-page-container">
//                 <div className="auth-wrapper-v2">
//                     <form onSubmit={submitHandler} className="shadow-lg" encType="multipart/form-data">
//                         <h1 className="mb-3">Welcome to Entri Book</h1>
//                         <p className="subtitle">Create Your Account</p>

//                         <div className="form-group">
//                             <input name='name' value={userData.name} onChange={onChange} type="text" id="name_field" className="form-control" placeholder="Full name" />
//                         </div>

//                         <div className="form-group">
//                             <input name='email' value={userData.email} onChange={onChange} type="email" id="email_field" className="form-control" placeholder="Email address" />
//                         </div>

//                         <div className="form-group">
//                             <input name='password' value={userData.password} onChange={onChange} type="password" id="password_field" className="form-control" placeholder="Enter password" />
//                         </div>

//                         <div className="form-group">
//                             <div className="avatar-upload-container">
//                                 <figure className="avatar-preview">
//                                     <img src={avatarPreview} className="rounded-circle" alt="Avatar Preview" />
//                                 </figure>
//                                 <div className="custom-file">
//                                     <input type="file" name="avatar" onChange={onChange} className="custom-file-inputs" id="customFile" />
//                                     <label className="custom-file-labels" htmlFor="customFile">Choose File</label>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="form-group">
//                             <input name='city' value={userData.city} onChange={onChange} type="text" id="city_field" className="form-control" placeholder="Enter City" />
//                         </div>

//                         <div className="form-group">
//                             <input name='phone' value={userData.phone} onChange={onChange} type="text" id="phone_field" className="form-control" placeholder="Phone number" />
//                         </div>

//                         <button type="submit" className="submit-btn" disabled={loading}>
//                             {loading ? "Registering..." : "Register"}
//                         </button>
//                     </form>
//                 </div>
//             </div>
//         </Fragment>
//     );
// }

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
        formData.append('gstin', userData.gstin)        //--new

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
                        <h1 className="mb-3">Welcome to Entri Book</h1>
                        <p className="subtitle">Create Your Account</p>

                        <div className="form-group">
                            <input name='name' value={userData.name} onChange={onChange} type="text" id="name_field" className="form-control" placeholder="Full name" />
                        </div>

                        <div className="form-group">
                            <input name='email' value={userData.email} onChange={onChange} type="email" id="email_field" className="form-control" placeholder="Email address" />
                        </div>

                        <div className="form-group">
                            <input name='password' value={userData.password} onChange={onChange} type="password" id="password_field" className="form-control" placeholder="Enter password" />
                        </div>

                        <div className="form-group">
                            <div className="avatar-upload-container">
                                <figure className="avatar-preview">
                                    <img src={avatarPreview} className="rounded-circle" alt="Avatar Preview" />
                                </figure>
                                <div className="custom-file">
                                    <input type="file" name="avatar" onChange={onChange} className="custom-file-inputs" id="customFile" />
                                    <label className="custom-file-labels" htmlFor="customFile">Choose File</label>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <input name='city' value={userData.city} onChange={onChange} type="text" id="city_field" className="form-control" placeholder="Enter City" />
                        </div>

                        <div className="form-group">
                            <input name='phone' value={userData.phone} onChange={onChange} type="text" id="phone_field" className="form-control" placeholder="Phone number" />
                        </div>

                    
                            {/* new  */}


                        <div className="form-group">
                            <input
                                name='gstin'
                                value={userData.gstin}
                                onChange={onChange}
                                type="text"
                                id="GSTIN_field"
                                className="form-control"
                                placeholder="GSTIN number"
                            />
                        </div>            



                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    );
}