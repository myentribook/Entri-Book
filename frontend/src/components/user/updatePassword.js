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
                    
                    {/* Header: Icon & Heading side-by-side, Paragraph below, centered */}
                    <div className="upd-header">
                        <div className="upd-title-row">
                            <div className="upd-top-icon-badge">
                                <i className="fa-solid fa-key"></i>
                            </div>
                            <h2>Change Password</h2>
                        </div>
                        <p>Your security is our top priority.</p>
                    </div>

                    <form onSubmit={submitHandler}>
                        <div className="upd-group">
                            <label htmlFor="old-pwd">CURRENT PASSWORD</label>
                            <div className="upd-input-wrapper">
                                <i className="fa-solid fa-lock"></i>
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
                                <i className="fa-solid fa-key"></i>
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