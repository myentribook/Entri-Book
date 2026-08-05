import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getComments, addComment } from '../../actions/commentAction';
import { clearCommentError, clearCommentCreated } from '../../slices/commentSlice';
import toast, { Toaster } from "react-hot-toast";
import Loader from '../layouts/loader';
import '../styles/reviews.css';

export default function Reviews() {
    const [name, setName] = useState('');
    const [comment, setComment] = useState('');
    const dispatch = useDispatch();

    const { comments = [], loading, error, isCreated } = useSelector((state) => state.commentState || {});

    const trackRef = useRef(null);
    const viewportRef = useRef(null);

    useEffect(() => {
        dispatch(getComments());

        if (error) {
            toast.error(error);
            dispatch(clearCommentError());
        }

        if (isCreated) {
            toast.success('Thank you for your feedback!');
            setName('');
            setComment('');
            dispatch(clearCommentCreated());
            dispatch(getComments());
        }
    }, [dispatch, error, isCreated]);

    useEffect(() => {
        const track = trackRef.current;
        const viewport = viewportRef.current;
        if (!track || !viewport) return;

        let currentScrollY = 0;
        const speed = 0.6;
        let isPaused = false;
        let animationFrameId = null;

        // Calculate exact original content block height including gap (16px)
        const getOriginalHeight = () => {
            let height = 0;
            const originalItems = track.querySelectorAll('.eb-rev-comment-item-original');
            originalItems.forEach(item => {
                height += item.offsetHeight + 16;
            });
            return height;
        };

        let contentHeight = getOriginalHeight();

        const step = () => {
            if (!isPaused) {
                currentScrollY += speed;
                // Seamless reset loop back to top without visual flicker
                if (currentScrollY >= contentHeight) {
                    currentScrollY -= contentHeight;
                }
                track.style.transform = `translate3d(0, -${currentScrollY}px, 0)`;
            }
            animationFrameId = requestAnimationFrame(step);
        };

        animationFrameId = requestAnimationFrame(step);

        // Hover events
        const handleMouseEnter = () => { isPaused = true; };
        const handleMouseLeave = () => { isPaused = false; };

        viewport.addEventListener('mouseenter', handleMouseEnter);
        viewport.addEventListener('mouseleave', handleMouseLeave);

        // Touch swipe variables
        let startY = 0;
        let initialYOffset = 0;

        const handleTouchStart = (e) => {
            isPaused = true;
            startY = e.touches[0].clientY;
            initialYOffset = currentScrollY;
        };

        const handleTouchMove = (e) => {
            const currentY = e.touches[0].clientY;
            const deltaY = startY - currentY;
            currentScrollY = initialYOffset + deltaY;

            if (currentScrollY >= contentHeight) {
                currentScrollY -= contentHeight;
                initialYOffset -= contentHeight;
            } else if (currentScrollY < 0) {
                currentScrollY += contentHeight;
                initialYOffset += contentHeight;
            }
            track.style.transform = `translate3d(0, -${currentScrollY}px, 0)`;
        };

        const handleTouchEnd = () => {
            isPaused = false;
        };

        viewport.addEventListener('touchstart', handleTouchStart, { passive: true });
        viewport.addEventListener('touchmove', handleTouchMove, { passive: true });
        viewport.addEventListener('touchend', handleTouchEnd);

        return () => {
            cancelAnimationFrame(animationFrameId);
            viewport.removeEventListener('mouseenter', handleMouseEnter);
            viewport.removeEventListener('mouseleave', handleMouseLeave);
            viewport.removeEventListener('touchstart', handleTouchStart);
            viewport.removeEventListener('touchmove', handleTouchMove);
            viewport.removeEventListener('touchend', handleTouchEnd);
        };
    }, [comments]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const trimmedName = name.trim();
        const trimmedComment = comment.trim();
        if (!trimmedComment) return;

        // Confetti burst animation trigger
        const container = document.getElementById('ebRevBtnContainer');
        const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
        for (let i = 0; i < 24; i++) {
            const particle = document.createElement('div');
            particle.classList.add('eb-rev-confetti-particle');
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            const angle = Math.random() * Math.PI * 2;
            const distance = 60 + Math.random() * 80;
            particle.style.setProperty('--end-x', `${Math.cos(angle) * distance}px`);
            particle.style.setProperty('--end-y', `${Math.sin(angle) * distance}px`);
            particle.style.setProperty('--end-rot', `${Math.random() * 360}deg`);
            container.appendChild(particle);
            particle.classList.add('eb-rev-burst-active');
            setTimeout(() => particle.remove(), 700);
        }

        dispatch(addComment({ name: trimmedName || 'Anonymous', comment: trimmedComment }));
    };

    return (
        <Fragment>
            <Toaster />
            {loading ? <Loader /> : (
                <div className="eb-rev-root-box">
                    <div className="eb-rev-main-container">
                        <div className="eb-rev-inner-wrapper">
                            {/* Page Header */}
                            <header className="eb-rev-page-heading-block">
                                <h1>Community Feedback & Reviews</h1>
                                <p>See what shop owners are saying about Entri Book</p>
                            </header>

                            {/* Main Content Grid */}
                            <div className="eb-rev-content-grid">

                                {/* Card 1: Leave a Comment Form */}
                                <div className="eb-rev-custom-card">
                                    <div>
                                        <h2> Leave Your Feedback</h2>
                                        <form id="ebRevCommentForm" onSubmit={handleFormSubmit}>
                                            <div className="eb-rev-form-control-group">
                                                <label htmlFor="ebRevAuthorNameInput">Your Name & Shop</label>
                                                <input
                                                    type="text"
                                                    id="ebRevAuthorNameInput"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="e.g. VetriVel (Velan Stores)"
                                                />
                                            </div>
                                            <div className="eb-rev-form-control-group">
                                                <label htmlFor="ebRevMessageInput">Your Comment / Review</label>
                                                <textarea
                                                    id="ebRevMessageInput"
                                                    rows="5"
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    placeholder="Share your experience using the app..."
                                                ></textarea>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="eb-rev-btn-action-wrapper" id="ebRevBtnContainer">
                                        <button type="submit" form="ebRevCommentForm" className="eb-rev-submit-trigger-btn" disabled={loading}>
                                            {loading ? 'Posting...' : 'Post Feedback Now'}
                                        </button>
                                    </div>
                                </div>

                                {/* Card 2: SaaS Vertical Infinite Testimonial Slider */}
                                <div className="eb-rev-custom-card">
                                    <h2> Recent Comments</h2>
                                    <div className="eb-rev-comments-viewport-pane" ref={viewportRef}>
                                        <div className="eb-rev-comments-scroll-track" ref={trackRef}>
                                            {/* Original Set */}
                                            {comments && comments.map((item) => (
                                                <div className="eb-rev-comment-single-item eb-rev-comment-item-original" key={`orig-${item._id || item.id}`}>
                                                    <div className="eb-rev-comment-header-row">
                                                        <div className="eb-rev-author-details-wrap">
                                                            <div className="eb-rev-avatar-initial-circle">{(item.name || 'Anonymous').charAt(0).toUpperCase()}</div>
                                                            <span className="eb-rev-author-name-text">{item.name || 'Anonymous'}</span>
                                                        </div>
                                                        <span className="eb-rev-comment-date-stamp">
                                                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : item.date}
                                                        </span>
                                                    </div>
                                                    <p className="eb-rev-comment-body-text">{item.comment || item.text}</p>
                                                </div>
                                            ))}

                                            {/* Cloned Set for Seamless Infinite Loop */}
                                            {comments && comments.map((item) => (
                                                <div className="eb-rev-comment-single-item eb-rev-comment-item-clone" key={`clone-${item._id || item.id}`}>
                                                    <div className="eb-rev-comment-header-row">
                                                        <div className="eb-rev-author-details-wrap">
                                                            <div className="eb-rev-avatar-initial-circle">{(item.name || 'Anonymous').charAt(0).toUpperCase()}</div>
                                                            <span className="eb-rev-author-name-text">{item.name || 'Anonymous'}</span>
                                                        </div>
                                                        <span className="eb-rev-comment-date-stamp">
                                                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : item.date}
                                                        </span>
                                                    </div>
                                                    <p className="eb-rev-comment-body-text">{item.comment || item.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
}