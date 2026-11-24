import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
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
    const [activeIndex, setActiveIndex] = useState(0);

    const dispatch = useDispatch();
    const { comments = [], loading, error, isCreated } = useSelector((state) => state.commentState || {});

    const trackRef = useRef(null);
    const viewportRef = useRef(null);
    const scrollXRef = useRef(0);
    const isPausedRef = useRef(false);
    const stepAnimRef = useRef(null);

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
            setActiveIndex(0);
            dispatch(clearCommentCreated());
            dispatch(getComments());
        }
    }, [dispatch, error, isCreated]);

    const getCardStepWidth = useCallback(() => {
        const track = trackRef.current;
        if (!track) return 300;
        const firstCard = track.querySelector('.eb-rev-showcase-card');
        if (!firstCard) return 300;
        const cardWidth = firstCard.getBoundingClientRect().width;
        const styles = window.getComputedStyle(track);
        const gap = parseFloat(styles.gap || styles.columnGap || 24) || 24;
        return cardWidth + gap;
    }, []);

    const getOriginalWidth = useCallback(() => {
        const count = comments?.length || 0;
        if (count === 0) return 0;
        return count * getCardStepWidth();
    }, [comments, getCardStepWidth]);

    const updateCardTilts = useCallback(() => {
        const viewport = viewportRef.current;
        const track = trackRef.current;
        if (!viewport || !track) return;

        const viewportRect = viewport.getBoundingClientRect();
        const viewportCenter = viewportRect.left + viewportRect.width / 2;
        const cards = track.querySelectorAll('.eb-rev-showcase-card');

        let closestIdx = 0;
        let minDistance = Infinity;

        cards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.left + rect.width / 2;
            const distanceFromCenter = cardCenter - viewportCenter;
            const absDist = Math.abs(distanceFromCenter);

            // Center card stays upright (0deg); left tilts slightly left, right tilts slightly right
            const normalized = Math.max(-1, Math.min(1, distanceFromCenter / (viewportRect.width * 0.45)));
            const angle = normalized * 4.5;
            const scale = Math.max(0.95, 1 - absDist / (viewportRect.width * 3.2));

            card.style.transform = `translate3d(0, 0, 0) rotate(${angle.toFixed(2)}deg) scale(${scale.toFixed(3)})`;

            const origIdx = Number(card.getAttribute('data-orig-index'));
            if (!Number.isNaN(origIdx) && absDist < minDistance) {
                minDistance = absDist;
                closestIdx = origIdx;
            }
        });

        setActiveIndex((prev) => (prev === closestIdx ? prev : closestIdx));
    }, []);

    // Smooth auto-slide to the left side
    useEffect(() => {
        const track = trackRef.current;
        const viewport = viewportRef.current;
        if (!track || !viewport || !comments || comments.length === 0) return;

        scrollXRef.current = 0;
        const autoSpeed = 0.75; // px per frame towards left
        let animationFrameId = null;

        const normalizeScroll = (val, totalWidth) => {
            if (totalWidth <= 0) return 0;
            let res = val % totalWidth;
            if (res < 0) res += totalWidth;
            return res;
        };

        const step = () => {
            const totalWidth = getOriginalWidth();
            if (!isPausedRef.current && totalWidth > 0) {
                scrollXRef.current = normalizeScroll(scrollXRef.current + autoSpeed, totalWidth);
                track.style.transform = `translate3d(-${scrollXRef.current}px, 0, 0)`;
                updateCardTilts();
            }
            animationFrameId = requestAnimationFrame(step);
        };

        // Initial positioning
        track.style.transform = `translate3d(0px, 0, 0)`;
        updateCardTilts();
        animationFrameId = requestAnimationFrame(step);

        const handleMouseEnter = () => { isPausedRef.current = true; };
        const handleMouseLeave = () => { isPausedRef.current = false; };

        viewport.addEventListener('mouseenter', handleMouseEnter);
        viewport.addEventListener('mouseleave', handleMouseLeave);

        let startX = 0;
        let initialXOffset = 0;

        const handleTouchStart = (e) => {
            isPausedRef.current = true;
            startX = e.touches[0].clientX;
            initialXOffset = scrollXRef.current;
        };

        const handleTouchMove = (e) => {
            const totalWidth = getOriginalWidth();
            if (totalWidth <= 0) return;
            const currentX = e.touches[0].clientX;
            const deltaX = startX - currentX; // swipe left -> positive delta -> moves left
            scrollXRef.current = normalizeScroll(initialXOffset + deltaX, totalWidth);
            track.style.transform = `translate3d(-${scrollXRef.current}px, 0, 0)`;
            updateCardTilts();
        };

        const handleTouchEnd = () => {
            isPausedRef.current = false;
        };

        const handleResize = () => {
            updateCardTilts();
        };

        viewport.addEventListener('touchstart', handleTouchStart, { passive: true });
        viewport.addEventListener('touchmove', handleTouchMove, { passive: true });
        viewport.addEventListener('touchend', handleTouchEnd);
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            if (stepAnimRef.current) cancelAnimationFrame(stepAnimRef.current);
            viewport.removeEventListener('mouseenter', handleMouseEnter);
            viewport.removeEventListener('mouseleave', handleMouseLeave);
            viewport.removeEventListener('touchstart', handleTouchStart);
            viewport.removeEventListener('touchmove', handleTouchMove);
            viewport.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('resize', handleResize);
        };
    }, [comments, getOriginalWidth, updateCardTilts]);

    // Fast single-card slide on arrow click ("prev" / "next")
    const slideByOneCard = (direction) => {
        const track = trackRef.current;
        const totalWidth = getOriginalWidth();
        if (!track || totalWidth <= 0) return;

        if (stepAnimRef.current) {
            cancelAnimationFrame(stepAnimRef.current);
        }

        const stepPx = getCardStepWidth();
        const delta = direction === 'next' ? stepPx : -stepPx;

        const startX = scrollXRef.current;
        const targetX = startX + delta;
        const duration = 220; // fast snappier single-card slide (ms)
        const startTime = performance.now();

        const normalize = (val) => {
            let res = val % totalWidth;
            if (res < 0) res += totalWidth;
            return res;
        };

        const animateStep = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(1, elapsed / duration);
            // Ease-out cubic for snappy, clean single card pass
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = startX + (targetX - startX) * eased;

            scrollXRef.current = normalize(current);
            track.style.transform = `translate3d(-${scrollXRef.current}px, 0, 0)`;
            updateCardTilts();

            if (progress < 1) {
                stepAnimRef.current = requestAnimationFrame(animateStep);
            } else {
                stepAnimRef.current = null;
            }
        };

        stepAnimRef.current = requestAnimationFrame(animateStep);
    };

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
        const avatarColors = ['#B8D4E3', '#F5B041', '#F7DC6F', '#D7BDE2'];
        const avatarBg = avatarColors[index % avatarColors.length];
        const formattedDate = item.createdAt
            ? new Date(item.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            })
            : 'Verified Customer';

        return (
            <div
                className={`eb-rev-showcase-card ${type === 'orig' ? 'eb-rev-card-original' : 'eb-rev-card-clone'}`}
                data-orig-index={index}
                key={`${type}-${item._id || item.id || index}`}
            >
                <div className="eb-rev-card-top-center">
                    <div className="eb-rev-user-avatar" style={{ backgroundColor: avatarBg }}>
                        <span>{(item.name || 'C').charAt(0).toUpperCase()}</span>
                    </div>
                    <h4 className="eb-rev-card-author">— {item.name || 'Anonymous'}</h4>
                    <span className="eb-rev-user-role">{formattedDate}</span>
                </div>

                <div className="eb-rev-rating-row">
                    <div className="eb-rev-stars-row" aria-label="5 out of 5 stars">
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                    </div>
                    <span className="eb-rev-rating-score">5.0</span>
                </div>

                <p className="eb-rev-card-message">“{item.comment || item.text}”</p>
            </div>
        );
    };

    const totalComments = comments?.length || 0;

    return (
        <Fragment>
            <Toaster position="top-center" />
            <div className="eb-rev-workspace-container">
                {/* Decorative Plus / Dot Accents */}
                <span className="eb-rev-plus eb-rev-plus-tl" aria-hidden="true">+</span>
                <span className="eb-rev-plus eb-rev-plus-tr" aria-hidden="true">+</span>

                {/* Header with Headings + Right Corner Post Button */}
                <header className="eb-rev-workspace-header">
                    <div className="eb-rev-top-bar">
                        <div className="eb-rev-heading-center-group">
                            <div className="eb-rev-script-row">
                                {/* <span className="eb-rev-speech-bubble">💬</span> */}
                                <span className="eb-rev-script-title">Beyond Expectations.</span>
                            </div>
                            <div className="eb-rev-bold-row">
                                <span className="eb-rev-big-star">★</span>
                                <h1 className="eb-rev-workspace-title">Empowering Businesses Through Better Billing.</h1>
                            </div>
                        </div>

                        <button
                            type="button"
                            className={`eb-rev-post-toggle-btn ${isModalOpen ? 'is-active' : ''}`}
                            onClick={() => setIsModalOpen(true)}
                            title="Post a Review"
                        >
                            <i className="fa-solid fa-pen-to-square"></i>
                            <span>Post</span>
                        </button>
                    </div>
                </header>

                {/* Main Carousel Section */}
                {loading ? <Loader /> : (
                    <section className="eb-rev-feed-section">
                        <div className="eb-rev-feed-viewport" ref={viewportRef}>
                            <div className="eb-rev-feed-track" ref={trackRef}>
                                {totalComments > 0 ? (
                                    <>
                                        {comments.map((item, idx) => renderReviewCard(item, idx, 'orig'))}
                                        {comments.map((item, idx) => renderReviewCard(item, idx, 'clone'))}
                                        {comments.map((item, idx) => renderReviewCard(item, idx, 'clone2'))}
                                    </>
                                ) : (
                                    <p className="eb-rev-empty-msg">No reviews yet. Click "Post" to be the first!</p>
                                )}
                            </div>
                        </div>

                        {/* Indicator Dots + Left/Right Fast Single-Card Arrows Below */}
                        {totalComments > 0 && (
                            <div className="eb-rev-controls-wrapper">
                                {/* <div className="eb-rev-dots-indicator" aria-hidden="true">
                                    {comments.slice(0, Math.min(totalComments, 6)).map((_, idx) => (
                                        <span
                                            key={idx}
                                            className={`eb-rev-indicator-dot ${activeIndex % Math.min(totalComments, 6) === idx ? 'is-active' : ''}`}
                                        />
                                    ))}
                                </div> */}

                                <div className="eb-rev-arrow-controls">
                                    <button
                                        type="button"
                                        className="eb-rev-arrow-btn eb-rev-arrow-prev"
                                        onClick={() => slideByOneCard('prev')}
                                        aria-label="Previous review card"
                                        title="Slide Right (Previous Card)"
                                    >
                                        ←
                                    </button>
                                    <button
                                        type="button"
                                        className="eb-rev-arrow-btn eb-rev-arrow-next"
                                        onClick={() => slideByOneCard('next')}
                                        aria-label="Next review card"
                                        title="Slide Left (Next Card)"
                                    >
                                        →
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="eb-rev-footer-tag">@EntriBook</div>
                    </section>
                )}

                {/* Center Popup Modal for Posting Reviews */}
                {isModalOpen && (
                    <div className="eb-rev-modal-backdrop" onClick={() => setIsModalOpen(false)}>
                        <div className="eb-rev-modal-box" onClick={(e) => e.stopPropagation()}>
                            <button
                                type="button"
                                className="eb-rev-modal-close"
                                onClick={() => setIsModalOpen(false)}
                                aria-label="Close"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>

                            <div className="eb-rev-modal-header">
                                <span className="eb-rev-modal-badge">★ Customer Feedback</span>
                                <h2>Share Your Review</h2>
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
        </Fragment>
    );
}