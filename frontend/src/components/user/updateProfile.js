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
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("/images/default_avatar.jpg");
    const dispatch = useDispatch();

    // 1. Guard Clause: Prevents crash while user data is being fetched
    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
            if (user.avatar) {
                setAvatarPreview(user.avatar);
            }
        }
    }, [user]);

    // 2. Notification Handling
    useEffect(() => {
        if (isUpdated) {
            toast.success('Profile updated successfully', { position: 'bottom-right' });
            dispatch(clearUpdateProfile());
            return
        }
        if (error) {
            toast.error(error, {
                position: 'bottom-right'
            });
            dispatch(clearAuthError());
            return 
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
        if (avatar) {
            formData.append('avatar', avatar);
        }
        dispatch(updateProfile(formData));
    };

    // 3. UI Guard: If user is not yet loaded, return null or a loader
    if (!user) return <div className="text-center mt-5">Loading profile...</div>;

    return (
        <Fragment>
            <Toaster />
            <div className="profile-component-wrapper">
                <div className="pc-container">
                    <h2 className="pc-heading">Edit Profile</h2>
                    <p className="pc-subtext">Update your personal information and profile picture.</p>

                    <form onSubmit={submitHandler} id="profileForm">
                        <div className="pc-avatar-section d-flex align-items-center mb-4">
                            <div>
                                <figure className="avatar mr-3 item-rtl">
                                    <img
                                        src={avatarPreview}
                                        className="rounded-circle"
                                        alt="Avatar Preview"
                                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                    />
                                </figure>
                            </div>

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
                                    Change Photo
                                </label>
                            </div>
                        </div>

                        <div className="pc-form-group">
                            <label>FULL NAME</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="pc-input"
                            />
                        </div>

                        <div className="pc-form-group">
                            <label>EMAIL ADDRESS</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="pc-input"
                            />
                        </div>

                        <button type="submit" className="pc-btn-submit">Save Changes</button>
                    </form>
                </div>
            </div>
        </Fragment>
    );
}