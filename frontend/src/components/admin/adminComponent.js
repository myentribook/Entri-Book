import '../styles/admin.css';
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import { getUsers } from '../../actions/statusAction'; 
import { getComments, deleteComment } from '../../actions/commentAction'; // Import comment actions
import { updateUserLiveStatus } from '../../slices/statusSlice';
import Loader from '../layouts/loader'; 
import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:8000'; 

export default function AdminPannel({ userList }) {
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.authState || {});
    
    // StatusState mattum illama CommentState-um eduthurom
    const { userStatus, users: storeUsers, loading: statusLoading } = useSelector((state) => state.StatusState || {});
    const { comments, loading: commentLoading } = useSelector((state) => state.commentState || {});

    useEffect(() => {
        dispatch(getUsers());
        dispatch(getComments()); // Page load aagum podhu comments fetch pannum

        // Socket connection with admin auth
        const socket = io(SOCKET_URL, {
            auth: {
                userId: user?._id || user?.id
            }
        });

        socket.on('connect', () => {
            console.log("Admin Socket Connected Successfully:", socket.id);
        });

        socket.on('userStatusChanged', (data) => {
            console.log("Live Status Changed Event Received:", data);
            dispatch(updateUserLiveStatus(data));
        });

        return () => {
            socket.disconnect();
        };
    }, [dispatch, user]);

    const finalUserList = userList && userList.length > 0 ? userList : storeUsers;

    // Delete button click pannum podhu call aagum function
    const handleDeleteComment = (id) => {
        dispatch(deleteComment(id));
    };

    const isLoading = statusLoading || commentLoading;

    return (
        <>
            {isLoading ? <Loader /> : (
                <div className="entri-page-container">
                    <div className="entri-admin-wrapper">
                        <div className="entri-admin-header">
                            <h1 className="entri-header-title" style={{ fontWeight: 800, fontFamily: 'sans-serif', fontSize: '24px' }}>Entri Book - Admin Panel</h1>
                        </div>

                        <div className="entri-nav-tabs">
                            <button className="entri-nav-tab entri-active-tab" onClick={(e) => switchEntriTab('users', e.currentTarget)}>Users & Last Seen</button>
                            <button className="entri-nav-tab" onClick={(e) => switchEntriTab('comments', e.currentTarget)}>Comments & Delete</button>
                        </div>

                        {/* Users Tab View */}
                        <div id="entri-users-page" className="entri-page-view entri-page-active">
                            <div className="entri-list-container">
                                {finalUserList && finalUserList.length > 0 ? (
                                    finalUserList.map((userData) => {
                                        const liveStatus = userStatus[userData._id];
                                        const isOnline = liveStatus ? liveStatus.isOnline : userData.isOnline;
                                        const lastSeen = liveStatus ? liveStatus.lastSeen : userData.lastSeen;
                                        const timeDisplay = isOnline ? 'Active Now' : (lastSeen ? new Date(lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Unknown');

                                        return (
                                            <div className="entri-list-item" key={userData._id}>
                                                <div className="entri-item-icon">👤</div>
                                                <div className="entri-item-content">
                                                    <div className="entri-item-row">
                                                        <span className="entri-item-title">{userData.name}</span>
                                                        <span className="entri-item-time" style={{ color: isOnline ? '#2ecc71' : '#95a5a6', fontWeight: 'bold' }}>
                                                            {timeDisplay}
                                                        </span>
                                                    </div>
                                                    <p className="entri-item-desc">
                                                        Status: <span style={{ color: isOnline ? '#2ecc71' : '#e74c3c', fontWeight: 'bold' }}>{isOnline ? 'Online' : 'Offline'}</span> • Role: {userData.role || 'Member'}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p style={{ padding: '20px', textAlign: 'center' }}>No users found.</p>
                                )}
                            </div>
                        </div>

                        {/* Comments Tab View - Real Data Mapping */}
                        <div id="entri-comments-page" className="entri-page-view">
                            <div className="entri-list-container">
                                {comments && comments.length > 0 ? (
                                    comments.map((comment) => (
                                        <div className="entri-list-item" key={comment._id} id={`entri-comment-${comment._id}`}>
                                            <div className="entri-item-icon">💬</div>
                                            <div className="entri-item-content">
                                                <div className="entri-item-row">
                                                    {/* User name - ungaloda backend structure ku etrapa mathikonga (e.g. comment.user?.name or comment.name) */}
                                                    <span className="entri-item-title">{comment.user?.name || comment.name || 'User'}</span>
                                                    <span className="entri-item-time">
                                                        {comment.createdAt ? new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                    </span>
                                                </div>
                                                <p className="entri-item-desc">{comment.comment || comment.content}</p>
                                                <button 
                                                    className="entri-delete-btn" 
                                                    onClick={() => handleDeleteComment(comment._id)}
                                                >
                                                    Delete Comment
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ padding: '20px', textAlign: 'center' }}>No comments found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );

    function switchEntriTab(tabName, element) {
        document.querySelectorAll('.entri-nav-tab').forEach(tab => tab.classList.remove('entri-active-tab'));
        element.classList.add('entri-active-tab');

        document.querySelectorAll('.entri-page-view').forEach(view => view.classList.remove('entri-page-active'));
        if (tabName === 'users') {
            document.getElementById('entri-users-page').classList.add('entri-page-active');
        } else {
            document.getElementById('entri-comments-page').classList.add('entri-page-active');
        }
    }
}