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

    const { isAuthenticated } = useSelector((state) => state?.authState || {});
    const { purchase = [], loading, error, message } = useSelector(state => state?.purchaseState || {});
    const { products = [] } = useSelector(state => state?.productState || { products: [] });

    const safePurchaseList = Array.isArray(purchase) ? purchase : [];
    const safeProductsList = Array.isArray(products) ? products : [];

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
        if (isAuthenticated === false) {
            setSupplierName('');
            setSupplierBillNo('');
            setSelectedProductId('');
            setQuantity('');
            setConversionFactor('');
            setPurchasePrice('');
            setTempItems([]);
            setKeyword('');
            setSelectedView(null);
            setDropdownOpen(false);
            dispatch(clearPurchaseState());
        }
    }, [isAuthenticated, dispatch]);

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
        const selectedProduct = safeProductsList.find(p => String(p?._id) === String(selectedProductId));
        const q = Number(quantity);
        const p = Number(purchasePrice);
        const cf = Number(conversionFactor || selectedProduct?.conversionFactor || 0);

        const newItem = {
            product: selectedProductId,
            productName: selectedProduct?.name || "Unknown",
            quantity: Number.isFinite(q) ? q : 0,
            conversionFactor: Number.isFinite(cf) ? cf : 0,
            purchasePrice: Number.isFinite(p) ? p : 0,
            amount: (Number.isFinite(q) ? q : 0) * (Number.isFinite(p) ? p : 0)
        };

        setTempItems([...tempItems, newItem]);
        setQuantity(''); setConversionFactor(''); setPurchasePrice(''); setSelectedProductId('');
    };

    const handleSavePurchase = () => {
        if (!supplierName || !supplierBillNo || tempItems.length === 0) return toast.error("Fill all fields and add items");

        const mergedItemsMap = {};

        tempItems.forEach(item => {
            if (!item || typeof item !== 'object') return;
            const itemQty = Number(item.quantity) || 0;
            const itemAmt = Number(item.amount) || 0;
            if (mergedItemsMap[item.product]) {
                mergedItemsMap[item.product].quantity += itemQty;
                mergedItemsMap[item.product].amount += itemAmt;
            } else {
                mergedItemsMap[item.product] = { ...item, quantity: itemQty, amount: itemAmt };
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

        Promise.resolve(dispatch(createPurchase(purchaseData))).then(() => {
            dispatch(getPurchase());
            dispatch(getProducts());
        });

        setTempItems([]);
        setSupplierName('');
        setSupplierBillNo('');
    };

    const numericQty = Number(quantity);
    const numericPrice = Number(purchasePrice);
    const hasValidNumbers = quantity !== '' && purchasePrice !== '' && Number.isFinite(numericQty) && Number.isFinite(numericPrice);
    const computedAmount = hasValidNumbers ? (numericQty * numericPrice).toFixed(2) : "0.00";
    const hasActiveAmount = Boolean(hasValidNumbers && numericQty * numericPrice > 0);
    const selectedProductObj = safeProductsList.find(p => String(p?._id) === String(selectedProductId));
    const safeKeyword = String(keyword || '').toLowerCase();

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
                            <p><strong>Items Count:</strong> {Array.isArray(selectedView.items) ? selectedView.items.length : 0}</p>
                            <ul style={{ listStyle: "none", padding: 0, maxHeight: '200px', overflowY: 'auto' }}>
                                {Array.isArray(selectedView.items) && selectedView.items.map((item, index) => {
                                    const productDetail = safeProductsList.find(p => String(p?._id) === String(item?.product));
                                    const finalProductName = item?.productName && item.productName !== "Unknown"
                                        ? item.productName
                                        : (productDetail?.name || "Product Name Not Found");

                                    const itemQty = Number(item?.quantity) || 0;
                                    const itemPrice = Number(item?.purchasePrice) || 0;
                                    const subTotal = itemQty * itemPrice;

                                    return (
                                        <li key={item?._id || item?.product || index} style={{ marginBottom: "8px", borderBottom: "1px solid #f0f0f0", paddingBottom: "4px" }}>
                                            <strong>{finalProductName}</strong><br />
                                            {itemQty} x {itemPrice} = {subTotal.toFixed(2)}
                                        </li>
                                    );
                                })}
                            </ul>
                            <p style={{ marginTop: "15px" }}>
                                <strong>Grand Total: ₹{(Array.isArray(selectedView.items) ? selectedView.items : []).reduce((acc, item) => acc + ((Number(item?.quantity) || 0) * (Number(item?.purchasePrice) || 0)), 0).toFixed(2)}</strong>
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
                                        {safeProductsList.map((p, index) => (
                                            <div
                                                key={p?._id || p?.id || index}
                                                className={`bill-mgr-custom-option ${String(selectedProductId) === String(p?._id) ? 'is-active' : ''}`}
                                                onClick={() => {
                                                    setSelectedProductId(p?._id || '');
                                                    setDropdownOpen(false);
                                                }}
                                            >
                                                {p?.name || 'Product'}
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
                                        <tr key={item?.product || idx}>
                                            <td className="bill-mgr-td" data-label="Product">{item.productName}</td>
                                            <td className="bill-mgr-td" data-label="Qty">{item.quantity}</td>
                                            <td className="bill-mgr-td" data-label="Conv. F.">{item.conversionFactor}</td>
                                            <td className="bill-mgr-td" data-label="Price">{item.purchasePrice}</td>
                                            <td className="bill-mgr-td" data-label="Total">{(Number(item.amount) || 0).toFixed(2)}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="bill-mgr-td bill-mgr-empty-cell">
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
                                    {safePurchaseList.length > 0 ? safePurchaseList
                                        .filter(item => String(item?.supplierName ?? "").toLowerCase().includes(safeKeyword))
                                        .map((item, index) => (
                                            <tr key={item?._id || item?.id || index}>
                                                <td className="bill-mgr-td" data-label="Supplier">{item?.supplierName}</td>
                                                <td className="bill-mgr-td" data-label="Bill No">{item?.supplierBillNo}</td>
                                                <td className="bill-mgr-td" data-label="Items">{Array.isArray(item?.items) ? item.items.length : 0}</td>
                                                <td className="bill-mgr-td bill-mgr-action-td" data-label="Actions">
                                                    <button type="button" className="bill-mgr-btn bill-mgr-btn-view" onClick={() => setSelectedView(item)}>
                                                        <i className="fa-solid fa-eye"></i> View
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="bill-mgr-td bill-mgr-empty-cell">
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