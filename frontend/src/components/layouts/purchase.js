import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { getPurchase, createPurchase } from '../../actions/purchaseActions';
import { clearPurchaseState } from '../../slices/purchaseSlices';
import { getProducts } from '../../actions/productAction';
import toast, { Toaster } from "react-hot-toast";
import Loader from '../layouts/loader';
import '../styles/purchase.css';

export default function Purchase() {
    const dispatch = useDispatch();

    const { purchase = [], loading, error, message } = useSelector(state => state.purchaseState || {});
    const { products = [] } = useSelector(state => state.productState || { products: [] });

    // Toast logic
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
        if (message) {
            toast.success(message);
        }
    }, [error, message]);

    const [supplierName, setSupplierName] = useState('');
    const [supplierBillNo, setSupplierBillNo] = useState('');
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [conversionFactor, setConversionFactor] = useState('');
    const [purchasePrice, setPurchasePrice] = useState('');
    const [tempItems, setTempItems] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [selectedView, setSelectedView] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        dispatch(getPurchase());
        dispatch(getProducts());

        return () => {
            dispatch(clearPurchaseState());
        };
    }, [dispatch]);

    const handleAddTemp = () => {
        if (!selectedProductId || !quantity || !purchasePrice) return toast.error("Please fill all product fields");
        const selectedProduct = products.find(p => p._id === selectedProductId);
        const q = Number(quantity);
        const p = Number(purchasePrice);
        const cf = Number(conversionFactor || selectedProduct?.conversionFactor || 0);

        const newItem = {
            product: selectedProductId,
            productName: selectedProduct?.name || "Unknown",
            quantity: q,
            conversionFactor: cf,
            purchasePrice: p,
            amount: q * p
        };

        setTempItems([...tempItems, newItem]);
        setQuantity(''); setConversionFactor(''); setPurchasePrice(''); setSelectedProductId('');
    };

    const handleSavePurchase = () => {
        if (!supplierName || !supplierBillNo || tempItems.length === 0) return toast.error("Fill all fields and add items");

        const mergedItemsMap = {};

        tempItems.forEach(item => {
            if (mergedItemsMap[item.product]) {
                mergedItemsMap[item.product].quantity += Number(item.quantity);
                mergedItemsMap[item.product].amount += item.amount;
            } else {
                mergedItemsMap[item.product] = { ...item };
            }
        });

        const finalItems = Object.values(mergedItemsMap);

        const purchaseData = {
            supplierName,
            supplierBillNo,
            items: finalItems.map(item => ({
                product: item.product,
                quantity: item.quantity,
                conversionFactor: item.conversionFactor,
                purchasePrice: item.purchasePrice
            }))
        };

        dispatch(createPurchase(purchaseData)).then(() => {
            dispatch(getPurchase());
            dispatch(getProducts());
        });

        setTempItems([]);
        setSupplierName('');
        setSupplierBillNo('');
    };

    const computedAmount = quantity && purchasePrice ? (Number(quantity) * Number(purchasePrice)).toFixed(2) : "0.00";
    const hasActiveAmount = Boolean(quantity && purchasePrice && Number(quantity) * Number(purchasePrice) > 0);
    const selectedProductObj = products.find(p => String(p._id) === String(selectedProductId));

    return (
        <div className="bill-mgr-wrapper">
            <Toaster />

            {/* Modal Setup - Controlled via selectedView state */}
            {selectedView && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '24px', borderRadius: '18px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}>
                        <h3 style={{ marginTop: 0, color: '#0f172a', fontWeight: 700 }}>Purchase Details</h3>
                        <>
                            <p><strong>Supplier:</strong> {selectedView.supplierName}</p>
                            <p><strong>Bill No:</strong> {selectedView.supplierBillNo}</p>
                            <p><strong>Items Count:</strong> {selectedView.items?.length || 0}</p>
                            <ul style={{ listStyle: "none", padding: 0, maxHeight: '200px', overflowY: 'auto' }}>
                                {selectedView.items?.map((item, index) => {
                                    const productDetail = products.find(p => String(p._id) === String(item.product));
                                    const finalProductName = item.productName && item.productName !== "Unknown"
                                        ? item.productName
                                        : (productDetail?.name || "Product Name Not Found");

                                    const subTotal = Number(item.quantity) * Number(item.purchasePrice);

                                    return (
                                        <li key={index} style={{ marginBottom: "8px", borderBottom: "1px solid #f0f0f0", paddingBottom: "4px" }}>
                                            <strong>{finalProductName}</strong><br />
                                            {item.quantity} x {item.purchasePrice} = {subTotal.toFixed(2)}
                                        </li>
                                    );
                                })}
                            </ul>
                            <p style={{ marginTop: "15px" }}>
                                <strong>Grand Total: ₹{selectedView.items?.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.purchasePrice)), 0).toFixed(2)}</strong>
                            </p>
                        </>
                        <button 
                            className="bill-mgr-btn bill-mgr-btn-primary" 
                            style={{ marginTop: "15px", width: '100%', cursor: 'pointer' }}
                            onClick={() => setSelectedView(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {loading ? <Loader /> : (
                <>
                    {/* Left-Aligned Header Section */}
                    <div className="bill-mgr-header-left">
                        <div className="bill-mgr-badge-icon">
                            <i className="fa-solid fa-file-invoice"></i>
                        </div>
                        <div className="bill-mgr-title-group">
                            <h1 className="bill-mgr-title">Purchase Management</h1>
                            <p className="bill-mgr-subtitle">
                                Create, manage, and track your supplier purchases and stock inventories seamlessly.
                            </p>
                        </div>
                    </div>

                    {/* Main Card */}
                    <div className="bill-mgr-card">
                        <div className="bill-mgr-grid-form">
                            <div className="bill-mgr-input-group">
                                <input 
                                    type="text" 
                                    className="bill-mgr-input" 
                                    value={supplierName} 
                                    onChange={(e) => setSupplierName(e.target.value)} 
                                    placeholder=" " 
                                />
                                <label className="bill-mgr-label">Supplier Name</label>
                            </div>
                            <div className="bill-mgr-input-group">
                                <input 
                                    type="text" 
                                    className="bill-mgr-input" 
                                    value={supplierBillNo} 
                                    onChange={(e) => setSupplierBillNo(e.target.value)} 
                                    placeholder=" " 
                                />
                                <label className="bill-mgr-label">Supplier Bill No</label>
                            </div>
                        </div>

                        {/* Entry Box */}
                        <div className="bill-mgr-entry-box">
                            <div className="bill-mgr-input-group bill-mgr-product-group" ref={dropdownRef}>
                                <button
                                    type="button"
                                    className={`bill-mgr-custom-select-btn ${dropdownOpen ? 'is-open' : ''}`}
                                    onClick={() => setDropdownOpen(prev => !prev)}
                                >
                                    <span className={selectedProductObj ? 'selected-text' : 'placeholder-text'}>
                                        {selectedProductObj ? selectedProductObj.name : 'Select Item'}
                                    </span>
                                    <i className={`fa-solid ${dropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'} bill-mgr-chevron`}></i>
                                </button>
                                <label className={`bill-mgr-label bill-mgr-label-static ${dropdownOpen ? 'is-focused' : ''}`}>Product</label>

                                {dropdownOpen && (
                                    <div className="bill-mgr-custom-menu">
                                        <div
                                            className={`bill-mgr-custom-option ${selectedProductId === '' ? 'is-active' : ''}`}
                                            onClick={() => {
                                                setSelectedProductId('');
                                                setDropdownOpen(false);
                                            }}
                                        >
                                            Select Item
                                        </div>
                                        {products.map(p => (
                                            <div
                                                key={p._id}
                                                className={`bill-mgr-custom-option ${String(selectedProductId) === String(p._id) ? 'is-active' : ''}`}
                                                onClick={() => {
                                                    setSelectedProductId(p._id);
                                                    setDropdownOpen(false);
                                                }}
                                            >
                                                {p.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="bill-mgr-input-group">
                                <input type="number" className="bill-mgr-input" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder=" " />
                                <label className="bill-mgr-label">Qty</label>
                            </div>
                            <div className="bill-mgr-input-group">
                                <input type="number" className="bill-mgr-input" value={conversionFactor} onChange={(e) => setConversionFactor(e.target.value)} placeholder=" " />
                                <label className="bill-mgr-label">Bag Weight</label>
                            </div>
                            <div className="bill-mgr-input-group">
                                <input type="number" className="bill-mgr-input" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} placeholder=" " />
                                <label className="bill-mgr-label">Price</label>
                            </div>
                            <div className="bill-mgr-input-group">
                                <input 
                                    type="text" 
                                    className="bill-mgr-input bill-mgr-amount-input" 
                                    readOnly 
                                    value={hasActiveAmount ? computedAmount : ""} 
                                    placeholder={hasActiveAmount ? "" : "0.00"} 
                                />
                                <label className="bill-mgr-label">Amount</label>
                            </div>
                            <button className="bill-mgr-btn bill-mgr-btn-primary" onClick={handleAddTemp}>
                                <i className="fa-solid fa-plus"></i> Add
                            </button>
                        </div>

                        {/* Temp Items Table */}
                        <div className="bill-mgr-table-wrapper">
                            <table className="bill-mgr-table">
                                <thead>
                                    <tr>
                                        <th className="bill-mgr-th">PRODUCT</th>
                                        <th className="bill-mgr-th">QTY</th>
                                        <th className="bill-mgr-th">CONV. F.</th>
                                        <th className="bill-mgr-th">PRICE</th>
                                        <th className="bill-mgr-th">TOTAL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tempItems.length > 0 ? tempItems.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="bill-mgr-td">{item.productName}</td>
                                            <td className="bill-mgr-td">{item.quantity}</td>
                                            <td className="bill-mgr-td">{item.conversionFactor}</td>
                                            <td className="bill-mgr-td">{item.purchasePrice}</td>
                                            <td className="bill-mgr-td">{item.amount.toFixed(2)}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="bill-mgr-td" style={{ textAlign: "center", padding: "40px 20px" }}>
                                                <div className="bill-mgr-empty-state">
                                                    <i className="fa-regular fa-file-lines"></i>
                                                    <span>No items added yet</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Save Purchase Wrapper */}
                        <div className="bill-mgr-save-wrapper">
                            <button className="bill-mgr-save-btn" onClick={handleSavePurchase}>
                                Save Purchase &rarr;
                            </button>
                        </div>
                    </div>

                    {/* Integrated History & Search Card */}
                    <div className="bill-mgr-card">
                        <div className="bill-mgr-card-top-bar">
                            <div className="bill-mgr-section-header">
                                <span className="bill-mgr-section-icon">
                                    <i className="fa-solid fa-clock-rotate-left"></i>
                                </span>
                                <span>History</span>
                            </div>
                            <div className="bill-mgr-search-box">
                                <i className="fa-solid fa-magnifying-glass bill-mgr-search-icon"></i>
                                <input 
                                    type="text" 
                                    placeholder="Search purchase..." 
                                    value={keyword} 
                                    onChange={(e) => setKeyword(e.target.value)} 
                                    className="bill-mgr-search-input"
                                />
                            </div>
                        </div>

                        <div className="bill-mgr-table-wrapper" style={{ margin: 0 }}>
                            <table className="bill-mgr-table">
                                <thead>
                                    <tr>
                                        <th className="bill-mgr-th">SUPPLIER</th>
                                        <th className="bill-mgr-th">BILL NO</th>
                                        <th className="bill-mgr-th">ITEMS</th>
                                        <th className="bill-mgr-th" style={{ textAlign: "right" }}>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {purchase && purchase.length > 0 ? purchase
                                        .filter(item => (item?.supplierName ?? "").toLowerCase().includes(keyword.toLowerCase()))
                                        .map((item) => (
                                            <tr key={item._id}>
                                                <td className="bill-mgr-td">{item.supplierName}</td>
                                                <td className="bill-mgr-td">{item.supplierBillNo}</td>
                                                <td className="bill-mgr-td">{item.items?.length || 0}</td>
                                                <td className="bill-mgr-td" style={{ textAlign: "right" }}>
                                                    <button type="button" className="bill-mgr-btn bill-mgr-btn-view" onClick={() => setSelectedView(item)}>
                                                        <i className="fa-solid fa-eye"></i> View
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="bill-mgr-td" style={{ textAlign: "center", padding: "40px 20px" }}>
                                                    <div className="bill-mgr-empty-state">
                                                        <i className="fa-regular fa-file-lines"></i>
                                                        <span>No purchase found</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}