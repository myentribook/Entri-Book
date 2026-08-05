import { Fragment, useEffect, useState } from 'react'
import '../styles/updatePassword.css'
// FIX 1: Use lowercase 'updatePassword' to match the export
import { clearAuthError, updatePassword } from '../../actions/userActions' 
import { useDispatch, useSelector } from 'react-redux'
import toast, { Toaster } from "react-hot-toast";

export default function UpdatePassword() {

    const [password, setPassword] = useState("")
    const [oldPassword, setOldPassword] = useState("")
    const dispatch = useDispatch()
    const { isUpdated ,error } = useSelector(state => state.authState)

    const submitHandler = (e) => {
        e.preventDefault()
        const formData = new FormData(); // Added missing parentheses

        formData.append('oldPassword', oldPassword)
        formData.append('password', password)

        // FIX 2: Use the correct function name
        dispatch(updatePassword(formData))
    }

    useEffect(() => {
        if (isUpdated) {
            toast.success('Profile updated successfully', { position: 'bottom-right' });
            setOldPassword("")
            setPassword('')
            return
        }

        if (error) {
            // FIX 3: Added () to execute the clearAuthError action
            toast.error(error, { 
                position: 'bottom-right', 
                onOpen: () => { dispatch(clearAuthError()) } 
            });
            return
        }
    },[isUpdated , error, dispatch]) // Added dispatch to dependency array

    return (
        <Fragment>
            <Toaster />
            <div className="upd-password-module">
                <div className="upd-card">
                    <div className="upd-header">
                        <h2>Change Password</h2>
                        <p>Your security is our top priority.</p>
                    </div>

                    <form onSubmit={submitHandler}>
                        <div className="upd-group">
                            <label htmlFor="old-pwd">Current Password</label>
                            <input
                                type="password"
                                id="old-pwd"
                                className="upd-input"
                                placeholder="Enter current password"
                                value={oldPassword}
                                onChange={e => setOldPassword(e.target.value)}
                            />
                        </div>

                        <div className="upd-group">
                            <label htmlFor="new-pwd">New Password</label>
                            <input
                                type="password"
                                id="new-pwd"
                                className="upd-input"
                                placeholder="Create new password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="upd-submit-btn">
                            Update Password
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}