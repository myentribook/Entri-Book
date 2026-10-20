import { Fragment, useEffect, useState } from 'react';
import '../styles/updateProfile.css';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, updateProfile } from '../../actions/userActions';
import toast, { Toaster } from "react-hot-toast";
import { clearUpdateProfile } from '../../slices/authSlice';

export default function UpdateProfile() {
    const { error, user, isUpdated } = useSelector(state => state.authState);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [gstin, setGstin] = useState("");
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("/images/default_avatar.jpg");

    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
            setGstin(user.gstin || "");
            if (user.avatar) {
                setAvatarPreview(user.avatar);
            }
        }
    }, [user]);

    useEffect(() => {
        if (isUpdated) {
            toast.success('Profile updated successfully', { position: 'bottom-right' });
            dispatch(clearUpdateProfile());
            return;
        }
        if (error) {
            toast.error(error, { position: 'bottom-right' });
            dispatch(clearAuthError());
            return;
        }
    }, [isUpdated, error, dispatch]);

    const onChangeAvatar = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result);
                setAvatar(e.target.files[0]);
            }
        };
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('gstin', gstin);
        if (avatar) {
            formData.append('avatar', avatar);
        }
        dispatch(updateProfile(formData));
    };

    if (!user) return <div className="text-center mt-5" style={{ color: '#0d4b82', fontWeight: 600 }}>Loading profile...</div>;

    return (
        <Fragment>
            <Toaster />
            <div className="profile-component-wrapper">
                <div className="pc-container">
                    
                    {/* Header Box inspired by reference style */}
                    <div className="pc-header-box">
                        <div className="pc-top-icon-badge">
                            <i className="fa-solid fa-user-pen"></i>
                        </div>
                        <h2 className="pc-heading">Edit Profile</h2>
                        <p className="pc-subtext">Update your personal information and profile picture.</p>
                    </div>

                    <form onSubmit={submitHandler} id="profileForm">
                        {/* Avatar Section */}
                        <div className="pc-avatar-section">
                            <figure className="avatar">
                                <img
                                    src={avatarPreview}
                                    className="rounded-circle"
                                    alt="Avatar Preview"
                                />
                            </figure>
                            <div className="custom-file">
                                <input
                                    type="file"
                                    name="avatar"
                                    className="custom-file-input"
                                    id="customFile"
                                    onChange={onChangeAvatar}
                                    style={{ display: 'none' }}
                                />
                                <label className="custom-file-label" htmlFor="customFile">
                                    <i className="fa-solid fa-camera" style={{ marginRight: '6px' }}></i> Change Photo
                                </label>
                            </div>
                        </div>

                        <div className="pc-form-group">
                            <label>FULL NAME</label>
                            <div className="pc-input-wrapper">
                                <i className="fa-regular fa-user"></i>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="pc-input"
                                    placeholder="Enter your name"
                                />
                            </div>
                        </div>

                        <div className="pc-form-group">
                            <label>EMAIL ADDRESS</label>
                            <div className="pc-input-wrapper">
                                <i className="fa-regular fa-envelope"></i>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="pc-input"
                                    placeholder="name@business.com"
                                />
                            </div>
                        </div>

                        <div className="pc-form-group">
                            <label>GSTIN NUMBER</label>
                            <div className="pc-input-wrapper">
                                <i className="fa-solid fa-percent"></i>
                                <input
                                    type="text"
                                    value={gstin}
                                    onChange={e => setGstin(e.target.value)}
                                    className="pc-input"
                                    placeholder="Enter your GSTIN"
                                />
                            </div>
                        </div>

                        <button type="submit" className="pc-btn-submit">
                            Save Changes &rarr;
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    );
}