import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchProduct } from '../../actions/searchAction';
import Loader from '../layouts/loader';
import '../styles/dashboard.css';

const colorThemes = [
    { bannerBg: 'linear-gradient(135deg, #F3E8FF 0%, #FAF5FF 100%)', iconBg: '#C084FC' },
    { bannerBg: 'linear-gradient(135deg, #E0F2FE 0%, #F0F9FF 100%)', iconBg: '#38BDF8' },
    { bannerBg: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)', iconBg: '#818CF8' },
    { bannerBg: 'linear-gradient(135deg, #FEE2E2 0%, #FEF2F2 100%)', iconBg: '#F87171' },
    { bannerBg: 'linear-gradient(135deg, #CCFBF1 0%, #F0FDFA 100%)', iconBg: '#34D399' },
    { bannerBg: 'linear-gradient(135deg, #DCFCE7 0%, #F0FDF4 100%)', iconBg: '#4ADE80' },
    { bannerBg: 'linear-gradient(135deg, #FFEDD5 0%, #FFF7ED 100%)', iconBg: '#FB923C' },
    { bannerBg: 'linear-gradient(135deg, #FCE7F3 0%, #FDF2F8 100%)', iconBg: '#F472B6' }
];

const defaultAppsData = [
    { name: "Assistant", desc: "Your personal AI assistant.", icon: "M20.38 3.46L16 2a4 4 0 0 1-5.66 0L3.52 8.82a3 3 0 0 0 0 4.24l6.36 6.36a3 3 0 0 0 4.24 0l6.82-6.82a4 4 0 0 1 0-5.66l-.56-.56zM5.64 11.64L11 6.28l1.41 1.41-5.36 5.36-1.41-1.41z", badge: null }
];

function shuffleArray(array) {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export default function SearchProduct() {
    const dispatch = useDispatch();
    const [keyword, setKeyword] = useState('');

    const searchState = useSelector((state) => state.searchState || state.search);
    const products = searchState?.products || searchState?.searchProduct || (Array.isArray(searchState) ? searchState : []);
    const loading = searchState?.loading;

    // Initial load
    useEffect(() => {
        dispatch(searchProduct(''));
    }, [dispatch]);

    // Auto search on typing with a small debounce delay to optimize requests
    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(searchProduct(keyword));
        }, 300);

        return () => clearTimeout(timer);
    }, [keyword, dispatch]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        dispatch(searchProduct(keyword));
    };

    const rawData = products && products.length > 0 ? products : defaultAppsData;

    const [shuffledThemes, setShuffledThemes] = useState(colorThemes);

    useEffect(() => {
        setShuffledThemes(shuffleArray(colorThemes));
    }, [rawData]);

    return (
        <div className="workspace-container">
            <header className="workspace-header">
                <h1 className="workspace-title" style={{ marginBottom: '20px' }}>
                    <i className="fa-solid fa-boxes-stacked" style={{ color: '#0056B3' }}></i> Your Complete Product Catalog
                </h1>


                <form onSubmit={handleSearchSubmit} className="command-box">
                    <input
                        type="text"
                        className="command-input"
                        placeholder="Search products by name..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />

                    <div className="command-footer">
                        <div className="command-badges">
                            <div className="badge">
                                <svg className="badge-icon" viewBox="0 0 24 24">
                                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14h-2v-2h2zm0-4h-2V7h2z" />
                                </svg>
                                Memory Center
                            </div>
                            <div className="badge">
                                <svg className="badge-icon" viewBox="0 0 24 24" style={{ fill: '#3B82F6' }}>
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                search
                            </div>
                        </div>

                        <div className="command-actions">
                            <div className="action-pill">
                                ✦ Best
                            </div>
                            <button type="submit" className="submit-btn" title="Send">
                                <i className="fa-solid fa-trophy"></i>
                            </button>
                        </div>
                    </div>
                </form>
            </header>

            {loading ? <Loader /> : (
                <section className="apps-section">
                    <h2 className="section-label">Products ({rawData.length})</h2>
                    <div className="apps-grid" id="appsGrid">
                        {rawData.map((app, index) => {
                            const theme = shuffledThemes[index % shuffledThemes.length] || colorThemes[0];
                            const appIcon = app.icon || "M20.38 3.46L16 2a4 4 0 0 1-5.66 0L3.52 8.82a3 3 0 0 0 0 4.24l6.36 6.36a3 3 0 0 0 4.24 0l6.82-6.82a4 4 0 0 1 0-5.66l-.56-.56zM5.64 11.64L11 6.28l1.41 1.41-5.36 5.36-1.41-1.41z";

                            const appName = app.name || app.title || 'Product';
                            const appStock = app.stock !== undefined ? app.stock : 'N/A';

                            // Extracting city and phone from app or app.user object
                            const appCity = app.city || app.user?.city || 'N/A';
                            const appPhone = app.phone || app.user?.phone || 'N/A';
                            const userName = app.user?.name || '';

                            return (
                                <div className="app-card" key={app._id || index}>
                                    <div className="card-banner" style={{ background: theme.bannerBg }}>
                                        <div className="app-icon" style={{ backgroundColor: theme.iconBg }}>
                                            <i class="fa-solid fa-box-open"></i>
                                        </div>
                                    </div>
                                    <div className="card-content">
                                        <span className="app-name">{appName}</span>
                                        <span className="app-desc">Stock : {appStock}</span>

                                        <div style={{ marginTop: '8px', borderTop: '1px solid #eee', paddingTop: '6px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                            {userName && (
                                                <span style={{ fontSize: '12px', color: '#333', fontWeight: 'bold' }}> {userName}</span>
                                            )}
                                            <span style={{ fontSize: '12px', color: '#555' }}>City: {appCity}</span>
                                            <span style={{ fontSize: '12px', color: '#555' }}>Phone: {appPhone}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
}