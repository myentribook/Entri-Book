import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getComments, addComment } from '../../actions/commentAction';
import { clearCommentError, clearCommentCreated } from '../../slices/commentSlice';
import toast, { Toaster } from "react-hot-toast";
import confetti from 'canvas-confetti';
import Loader from '../layouts/loader';
import '../styles/reviews.css';

export default function Reviews() {
    const [name, setName] = useState('');
    const [comment, setComment] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            setIsModalOpen(false);
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

        const getOriginalHeight = () => {
            let height = 0;
            const originalItems = track.querySelectorAll('.eb-rev-card-original');
            originalItems.forEach(item => {
                height += item.offsetHeight + 22;
            });
            return height;
        };

        let contentHeight = getOriginalHeight();

        const step = () => {
            if (!isPaused && contentHeight > 0) {
                currentScrollY += speed;
                if (currentScrollY >= contentHeight) {
                    currentScrollY -= contentHeight;
                }
                track.style.transform = `translate3d(0, -${currentScrollY}px, 0)`;
            }
            animationFrameId = requestAnimationFrame(step);
        };

        animationFrameId = requestAnimationFrame(step);

        const handleMouseEnter = () => { isPaused = true; };
        const handleMouseLeave = () => { isPaused = false; };

        viewport.addEventListener('mouseenter', handleMouseEnter);
        viewport.addEventListener('mouseleave', handleMouseLeave);

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
        if (!trimmedComment) {
            toast.error("Please enter your review!");
            return;
        }

        confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.6 },
            zIndex: 9999
        });

        dispatch(addComment({ name: trimmedName || 'Anonymous', comment: trimmedComment }));
    };

    const renderReviewCard = (item, index, type) => {
        const isYellow = index % 2 === 0;
        const avatarColors = ['#B8D4E3', '#F5B041', '#F7DC6F', '#D7BDE2'];
        const avatarBg = avatarColors[index % avatarColors.length];

        return (
            <div
                className={`eb-rev-showcase-card ${isYellow ? 'eb-rev-card-yellow' : 'eb-rev-card-white'} ${type === 'orig' ? 'eb-rev-card-original' : 'eb-rev-card-clone'}`}
                key={`${type}-${item._id || item.id || index}`}
            >
                <div className="eb-rev-card-top">
                    <div className="eb-rev-user-meta">
                        <div className="eb-rev-user-avatar" style={{ backgroundColor: avatarBg }}>
                            <span>{(item.name || 'C').charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="eb-rev-user-info">
                            <h4>{item.name || 'Anonymous'}</h4>
                            <span className="eb-rev-user-role">
                                {item.createdAt
                                    ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                                    : 'Customers'}
                            </span>
                        </div>
                    </div>

                    <div className="eb-rev-stars-pill">
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                    </div>
                </div>

                <p className="eb-rev-card-message">{item.comment || item.text}</p>
            </div>
        );
    };

    return (
        <Fragment>
            <Toaster position="top-center" />
            {loading ? <Loader /> : (
                <div className="eb-rev-page-wrapper">
                    <div className="eb-rev-dots eb-rev-dots-tl"></div>
                    <div className="eb-rev-dots eb-rev-dots-tr"></div>
                    <div className="eb-rev-dots eb-rev-dots-bl"></div>
                    <div className="eb-rev-dots eb-rev-dots-br"></div>

                    {/* Right Corner "Post" Button */}
                    <button
                        type="button"
                        className="eb-rev-top-post-btn"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Post
                    </button>

                    <div className="eb-rev-center-stage">
                        <header className="eb-rev-hero-header">
                            <div className="eb-rev-script-row">
                                <span className="eb-rev-speech-bubble">💬</span>
                                <span className="eb-rev-script-title">What Our Customers Say</span>
                            </div>
                            <div className="eb-rev-bold-row">
                                <span className="eb-rev-big-star">★</span>
                                <h1>Real Reviews, Real Love</h1>
                            </div>
                        </header>

                        <div className="eb-rev-feed-viewport" ref={viewportRef}>
                            <div className="eb-rev-feed-track" ref={trackRef}>
                                {comments && comments.length > 0 ? (
                                    <>
                                        {comments.map((item, idx) => renderReviewCard(item, idx, 'orig'))}
                                        {comments.map((item, idx) => renderReviewCard(item, idx, 'clone'))}
                                    </>
                                ) : (
                                    <p className="eb-rev-empty-msg">No reviews yet. Click "Post" to be the first!</p>
                                )}
                            </div>
                        </div>

                        <div className="eb-rev-footer-tag">@EntriBook</div>
                    </div>

                    {/* Center Popup Window for Posting Reviews */}
                    {isModalOpen && (
                        <div className="eb-rev-modal-backdrop" onClick={() => setIsModalOpen(false)}>
                            <div className="eb-rev-modal-box" onClick={(e) => e.stopPropagation()}>
                                <button
                                    type="button"
                                    className="eb-rev-modal-close"
                                    onClick={() => setIsModalOpen(false)}
                                    aria-label="Close"
                                >
                                    ✕
                                </button>

                                <div className="eb-rev-modal-header">
                                    <h2>Customer Reviews</h2>
                                </div>

                                <form onSubmit={handleFormSubmit} className="eb-rev-modal-form">
                                    <div className="eb-rev-input-group">
                                        <label htmlFor="ebRevName">Name</label>
                                        <input
                                            type="text"
                                            id="ebRevName"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter your name"
                                            autoFocus
                                        />
                                    </div>

                                    <div className="eb-rev-input-group">
                                        <label htmlFor="ebRevComment">Comment</label>
                                        <textarea
                                            id="ebRevComment"
                                            rows="4"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Write your review..."
                                            required
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="eb-rev-modal-submit-btn"
                                        disabled={loading}
                                    >
                                        {loading ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Fragment>
    );
}