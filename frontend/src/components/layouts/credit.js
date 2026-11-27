import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCreditBills, updateCreditBills } from '../../actions/creditActions'; 
import Loader from '../layouts/loader'; 
import '../styles/credit.css';

export default function Credit() {
    const dispatch = useDispatch();
    const { Credit, loading } = useSelector((state) => state?.creditState || {});
    const { isAuthenticated, user } = useSelector((state) => state?.authState || {});

    const [modalData, setModalData] = useState({ name: '', amount: '', id: '' });
    const [payAmount, setPayAmount] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); 

    const isLoggedIn = isAuthenticated !== false && Boolean(user || isAuthenticated === undefined);

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(getCreditBills());
        } else {
            setModalData({ name: '', amount: '', id: '' });
            setPayAmount('');
            setSearchQuery('');
            const modal = document.getElementById('payModal');
            if (modal) modal.style.display = 'none';
        }
    }, [dispatch, isLoggedIn]);

    const openModal = (id, name, balance) => {
        if (!isLoggedIn) return;
        setModalData({ id: id || '', name: name || '', amount: balance ?? '' });
        const modal = document.getElementById('payModal');
        if (modal) modal.style.display = 'flex';
    };

    const closeModal = () => {
        setPayAmount('');
        const modal = document.getElementById('payModal');
        if (modal) modal.style.display = 'none';
    };

    const handleConfirm = () => {
        if (!isLoggedIn) return;
        if (!payAmount || Number(payAmount) <= 0 || !Number.isFinite(Number(payAmount))) {
            alert("Please enter a valid amount");
            return;
        }
        dispatch(updateCreditBills(modalData.id, { paidAmount: Number(payAmount) }));
        closeModal();
    };

    const safeCreditList = isLoggedIn && Array.isArray(Credit) ? Credit : [];
    const normalizedQuery = String(searchQuery || '').toLowerCase();

    const filteredBills = safeCreditList.length > 0 ? safeCreditList.filter((bill) => 
        String(bill?.customerName || '').toLowerCase().includes(normalizedQuery) ||
        String(bill?.customerMobile || '').includes(searchQuery)
    ) : [];

    return (
        <>
            {loading ? <Loader /> : (
                <div className="credit-page-container">
                    <div className="credit-header-row">
                        <div className="credit-title-wrapper">
                            <div className="credit-icon-box">
                                <i className="fa-solid fa-book"></i>
                            </div>
                            <div>
                                <h2 className="credit-title-heading">Credits</h2>
                                <p className="credit-subtitle-text">
                                    Track, manage, and settle your customer credit balances and due payments seamlessly.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="credit-main-card">
                        <div className="credit-card-top-bar">
                            <div className="credit-section-header">
                                <span className="credit-section-icon">
                                    <i className="fa-solid fa-clock-rotate-left"></i>
                                </span>
                                <span>Credit Bills</span>
                            </div>
                            <div className="credit-search-box">
                                <i className="fa-solid fa-magnifying-glass credit-search-icon"></i>
                                <input 
                                    type="text" 
                                    className="credit-search-bar" 
                                    placeholder="Search Credits ..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="credit-table-scroll">
                            <table className="credit-info-table">
                                <thead>
                                    <tr>
                                        <th>CUSTOMER</th>
                                        <th>CONTACT</th>
                                        <th>TOTAL</th>
                                        <th>PAID</th>
                                        <th>DUE</th>
                                        <th>STATUS</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBills.length > 0 ? (
                                        filteredBills.map((bill, idx) => {
                                            const isPaid = String(bill?.status || '').toLowerCase() === 'paid';
                                            return (
                                                <tr key={bill?._id || idx}>
                                                    <td data-label="Customer">{bill?.customerName || 'N/A'}</td>
                                                    <td data-label="Contact">{bill?.customerMobile || 'N/A'}</td>
                                                    <td data-label="Total">{bill?.grandTotal ?? 0}</td>
                                                    <td data-label="Paid">{bill?.paidAmount ?? 0}</td>
                                                    <td data-label="Due">{bill?.balanceAmount ?? 0}</td>
                                                    <td data-label="Status">{bill?.status || 'N/A'}</td>
                                                    <td data-label="Action">
                                                        <button 
                                                            type="button"
                                                            className="credit-pay-button" 
                                                            onClick={() => openModal(bill?._id, bill?.customerName, bill?.balanceAmount)}
                                                            disabled={isPaid}
                                                            style={{
                                                                opacity: isPaid ? 0.6 : 1,
                                                                cursor: isPaid ? 'not-allowed' : 'pointer'
                                                            }}
                                                        >
                                                            <i className="fa-solid fa-wallet"></i> settle
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="credit-empty-cell">
                                                <div className="credit-empty-state">
                                                    <i className="fa-regular fa-file-lines"></i>
                                                    <span>No credit bills found</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div id="payModal" className="credit-modal-overlay" style={{ display: 'none' }}>
                        <div className="credit-modal-window">
                            <h2>{modalData?.name || ''}</h2>
                            <p>Due Amount: ₹{modalData?.amount ?? ''}</p>
                            <div className="credit-modal-input-group">
                                <input 
                                    type="number" 
                                    value={payAmount}
                                    onChange={(e) => setPayAmount(e.target.value)}
                                    placeholder=" " 
                                />
                                <label className="credit-modal-label">Enter Amount</label>
                            </div>
                            <div className="credit-modal-footer">
                                <button
                                    type="button"
                                    className="credit-modal-action-btn"
                                    style={{ background: '#f1f5f9', color: '#64748b' }}
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="credit-modal-action-btn"
                                    style={{ background: '#062c54', color: 'white' }}
                                    onClick={handleConfirm}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}