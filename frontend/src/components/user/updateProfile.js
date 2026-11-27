import { Fragment, useEffect, useState } from 'react';
import '../styles/updateProfile.css';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, updateProfile } from '../../actions/userActions';
import toast, { Toaster } from "react-hot-toast";
import { clearUpdateProfile } from '../../slices/authSlice';

export default function UpdateProfile() {
    const { error, user, isUpdated } = useSelector(state => state.authState || {});

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
            if (typeof user.avatar === 'string' && user.avatar.trim() !== "") {
                setAvatarPreview(user.avatar.trim());
            } else {
                setAvatarPreview("/images/default_avatar.jpg");
            }
        }
    }, [user]);

    useEffect(() => {
        let isMounted = true;

        if (isUpdated) {
            if (isMounted) {
                toast.success('Profile updated successfully', {
                    id: 'update-profile-success',
                    position: 'bottom-right'
                });
            }
            if (typeof clearUpdateProfile === 'function') {
                dispatch(clearUpdateProfile());
            } else {
                dispatch(clearUpdateProfile);
            }
            return;
        }
        if (error) {
            const errText =
                typeof error === 'object' && error !== null
                    ? (error.message || 'Profile update failed. Please try again.')
                    : String(error);

            if (isMounted && errText) {
                toast.error(errText, {
                    id: 'update-profile-error',
                    position: 'bottom-right'
                });
            }

            if (typeof clearAuthError === 'function') {
                dispatch(clearAuthError());
            } else {
                dispatch(clearAuthError);
            }
            return;
        }

        return () => {
            isMounted = false;
        };
    }, [isUpdated, error, dispatch]);

    const onChangeAvatar = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2 && typeof reader.result === 'string') {
                setAvatarPreview(reader.result);
                setAvatar(file);
            }
        };
        reader.onerror = () => {
            toast.error("Failed to read selected image.", {
                id: 'update-profile-avatar-error',
                position: 'bottom-right'
            });
        };
        reader.readAsDataURL(file);
    };

    const handleAvatarError = (e) => {
        if (e.currentTarget.src !== window.location.origin + '/images/default_avatar.jpg') {
            setAvatarPreview('/images/default_avatar.jpg');
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        if (!trimmedName || !trimmedEmail) {
            toast.error("Please enter both full name and email address.", {
                id: 'update-profile-required-error',
                position: 'bottom-right'
            });
            return;
        }

        const formData = new FormData();
        formData.append('name', trimmedName);
        formData.append('email', trimmedEmail);
        formData.append('gstin', gstin.trim());
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

                    {/* Header Box */}
                    <div className="pc-header-box">
                        <div className="pc-title-row">
                            <div className="pc-top-icon-badge">
                                <i className="fa-solid fa-user-pen"></i>
                            </div>
                            <h2 className="pc-heading">Edit Profile</h2>
                        </div>
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
                                    onError={handleAvatarError}
                                />
                            </figure>
                            <div className="custom-file">
                                <input
                                    type="file"
                                    name="avatar"
                                    accept="image/*"
                                    className="custom-file-input"
                                    id="customFile"
                                    onChange={onChangeAvatar}
                                    style={{ display: 'none' }}
                                />
                                <label className="custom-file-label" htmlFor="customFile">
                                    <i className="fa-solid fa-camera" style={{ marginRight: '6px' }}></i> CHANGE PHOTO
                                </label>
                            </div>
                        </div>

                        <div className="pc-form-group">
                            <label htmlFor="update-profile-name">FULL NAME</label>
                            <div className="pc-input-wrapper">
                                <i className="fa-regular fa-user"></i>
                                <input
                                    id="update-profile-name"
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="pc-input"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                        </div>

                        <div className="pc-form-group">
                            <label htmlFor="update-profile-email">EMAIL ADDRESS</label>
                            <div className="pc-input-wrapper">
                                <i className="fa-regular fa-envelope"></i>
                                <input
                                    id="update-profile-email"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="pc-input"
                                    placeholder="name@business.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="pc-form-group">
                            <label htmlFor="update-profile-gstin">GSTIN NUMBER</label>
                            <div className="pc-input-wrapper">
                                <i className="fa-solid fa-percent"></i>
                                <input
                                    id="update-profile-gstin"
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