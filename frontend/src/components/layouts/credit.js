import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCreditBills, updateCreditBills } from '../../actions/creditActions'; 
import Loader from '../layouts/loader'; 
import '../styles/credit.css';

export default function Credit() {
    const dispatch = useDispatch();
    const { Credit, loading } = useSelector((state) => state.creditState);

    const [modalData, setModalData] = useState({ name: '', amount: '', id: '' });
    const [payAmount, setPayAmount] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); 

    useEffect(() => {
        dispatch(getCreditBills());
    }, [dispatch]);

    const openModal = (id, name, balance) => {
        setModalData({ id, name, amount: balance });
        document.getElementById('payModal').style.display = 'flex';
    };

    const closeModal = () => {
        setPayAmount('');
        document.getElementById('payModal').style.display = 'none';
    };

    const handleConfirm = () => {
        if (!payAmount || Number(payAmount) <= 0) {
            alert("Please enter a valid amount");
            return;
        }
        dispatch(updateCreditBills(modalData.id, { paidAmount: Number(payAmount) }));
        closeModal();
    };

    const filteredBills = Credit ? Credit.filter((bill) => 
        bill.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bill.customerMobile?.includes(searchQuery)
    ) : [];

    return (
        <>
            {loading ? <Loader /> : (
                <div className="credit-page-container">
                    <div className="credit-header-row">
                        <h2 className="credit-title-heading">
                            <i className="fa-solid fa-book" style={{ color: '#0056B3' }}></i> Credit Overview
                        </h2>
                        <input 
                            type="text" 
                            className="credit-search-bar" 
                            placeholder="Search..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="credit-main-card">
                        <table className="credit-info-table">
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Contact</th>
                                    <th>Total</th>
                                    <th>Paid</th>
                                    <th>Due</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBills.length > 0 ? (
                                    filteredBills.map((bill) => {
                                        const isPaid = bill.status?.toLowerCase() === 'paid';
                                        return (
                                            <tr key={bill._id}>
                                                <td data-label="Customer">{bill.customerName}</td>
                                                <td data-label="Contact">{bill.customerMobile}</td>
                                                <td data-label="Total">{bill.grandTotal}</td>
                                                <td data-label="Paid">{bill.paidAmount}</td>
                                                <td data-label="Due">{bill.balanceAmount}</td>
                                                <td data-label="Status">{bill.status}</td>
                                                <td data-label="">
                                                    <button 
                                                        className="credit-pay-button" 
                                                        onClick={() => openModal(bill._id, bill.customerName, bill.balanceAmount)}
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
                                        <td colSpan="7" style={{ textAlign: "center" }}>No credit bills found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div id="payModal" className="credit-modal-overlay">
                        <div className="credit-modal-window">
                            <h2>{modalData.name}</h2>
                            <p>Due Amount: ₹{modalData.amount}</p>
                            <input 
                                type="number" 
                                value={payAmount}
                                onChange={(e) => setPayAmount(e.target.value)}
                                placeholder="Enter amount" 
                            />
                            <div className="credit-modal-footer">
                                <button
                                    className="credit-modal-action-btn"
                                    style={{ background: '#f1f5f9', color: '#64748b' }}
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="credit-modal-action-btn"
                                    style={{ background: '#2563eb', color: 'white' }}
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