import { Fragment, useEffect, useState } from 'react'
import '../styles/updatePassword.css'
import { clearAuthError, updatePassword } from '../../actions/userActions' 
import { useDispatch, useSelector } from 'react-redux'
import toast, { Toaster } from "react-hot-toast";

export default function UpdatePassword() {

    const [password, setPassword] = useState("")
    const [oldPassword, setOldPassword] = useState("")
    const dispatch = useDispatch()
    const { isUpdated, error } = useSelector(state => state.authState)

    const submitHandler = (e) => {
        e.preventDefault()
        const formData = new FormData();

        formData.append('oldPassword', oldPassword)
        formData.append('password', password)

        dispatch(updatePassword(formData))
    }

    useEffect(() => {
        if (isUpdated) {
            toast.success('Password updated successfully', { position: 'bottom-right' });
            setOldPassword("")
            setPassword('')
            return
        }

        if (error) {
            toast.error(error, { 
                position: 'bottom-right', 
                onOpen: () => { dispatch(clearAuthError()) } 
            });
            return
        }
    }, [isUpdated, error, dispatch])

    return (
        <Fragment>
            <Toaster />
            <div className="upd-password-module">
                <div className="upd-card">
                    
                    {/* Header: Rounded Square Badge + Title & Subtitle */}
                    <div className="upd-header">
                        <div className="upd-top-icon-badge">
                            <i className="fa-solid fa-key"></i>
                        </div>
                        <div className="upd-header-meta">
                            <h2>Change Password</h2>
                            <p>Your security is our top priority.</p>
                        </div>
                    </div>

                    <form onSubmit={submitHandler}>
                        <div className="upd-group">
                            <label htmlFor="old-pwd">CURRENT PASSWORD</label>
                            <div className="upd-input-wrapper">
                                <span className="upd-input-icon-badge" aria-hidden="true">
                                    <i className="fa-solid fa-lock"></i>
                                </span>
                                <input
                                    type="password"
                                    id="old-pwd"
                                    className="upd-input"
                                    placeholder="••••••••"
                                    value={oldPassword}
                                    onChange={e => setOldPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="upd-group">
                            <label htmlFor="new-pwd">NEW PASSWORD</label>
                            <div className="upd-input-wrapper">
                                <span className="upd-input-icon-badge" aria-hidden="true">
                                    <i className="fa-solid fa-key"></i>
                                </span>
                                <input
                                    type="password"
                                    id="new-pwd"
                                    className="upd-input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button type="submit" className="upd-submit-btn">
                            Update Password &rarr;
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}