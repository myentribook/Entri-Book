import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
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

    return (
        <div className="bill-mgr-wrapper">
            <Toaster />

            {/* Modal Setup */}
            <input type="checkbox" id="view-modal" style={{ display: 'none' }} />
            <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'none', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', width: '90%', maxWidth: '400px' }}>
                    <h3 style={{ marginTop: 0 }}>Purchase Details</h3>
                    {selectedView && (
                        <>
                            <p><strong>Supplier:</strong> {selectedView.supplierName}</p>
                            <p><strong>Bill No:</strong> {selectedView.supplierBillNo}</p>
                            <p><strong>Items Count:</strong> {selectedView.items?.length || 0}</p>
                            <ul style={{ listStyle: "none", padding: 0 }}>
                                {selectedView.items?.map((item, index) => {
                                    const productDetail = products.find(p => String(p._id) === String(item.product));
                                    const finalProductName = item.productName && item.productName !== "Unknown"
                                        ? item.productName
                                        : (productDetail?.name || "Product Name Not Found");

                                    const subTotal = item.quantity * item.purchasePrice;

                                    return (
                                        <li key={index} style={{ marginBottom: "8px", borderBottom: "1px solid #f0f0f0", paddingBottom: "4px" }}>
                                            {finalProductName} - {item.quantity} x {item.purchasePrice} = {subTotal.toFixed(2)}
                                        </li>
                                    );
                                })}
                            </ul>
                            <p style={{ marginTop: "15px" }}>
                                <strong>Grand Total: ${selectedView.items?.reduce((acc, item) => acc + (item.quantity * item.purchasePrice), 0).toFixed(2)}</strong>
                            </p>
                        </>
                    )}
                    <label htmlFor="view-modal" className="bill-mgr-btn bill-mgr-btn-primary" style={{ marginTop: "15px", width: '100%', cursor: 'pointer' }}>Close</label>
                </div>
            </div>

            {loading ? <Loader /> : (
                <>
                    {/* Header Section */}
                    <div className="bill-mgr-header-center">
                        <div className="bill-mgr-badge-icon">
                            <i className="fa-solid fa-file-invoice"></i>
                        </div>
                        <h1 className="bill-mgr-title">Purchase Management</h1>
                        <p className="bill-mgr-subtitle">
                            Create, manage, and track your supplier purchases and stock inventories seamlessly.
                        </p>
                    </div>

                    {/* Main Card */}
                    <div className="bill-mgr-card">
                        <div className="bill-mgr-grid-form">
                            <div className="bill-mgr-input-group">
                                <label className="bill-mgr-label">Supplier Name</label>
                                <input 
                                    type="text" 
                                    className="bill-mgr-input" 
                                    value={supplierName} 
                                    onChange={(e) => setSupplierName(e.target.value)} 
                                    placeholder="Enter name" 
                                />
                            </div>
                            <div className="bill-mgr-input-group">
                                <label className="bill-mgr-label">Supplier Bill No</label>
                                <input 
                                    type="text" 
                                    className="bill-mgr-input" 
                                    value={supplierBillNo} 
                                    onChange={(e) => setSupplierBillNo(e.target.value)} 
                                    placeholder="BILL-2026-001" 
                                />
                            </div>
                        </div>

                        {/* Entry Box */}
                        <div className="bill-mgr-entry-box">
                            <div className="bill-mgr-input-group">
                                <label className="bill-mgr-label">Product</label>
                                <select className="bill-mgr-select" value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)}>
                                    <option value="">Select Item</option>
                                    {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div className="bill-mgr-input-group">
                                <label className="bill-mgr-label">Qty</label>
                                <input type="number" className="bill-mgr-input" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" />
                            </div>
                            <div className="bill-mgr-input-group">
                                <label className="bill-mgr-label">Conv. F.</label>
                                <input type="number" className="bill-mgr-input" value={conversionFactor} onChange={(e) => setConversionFactor(e.target.value)} placeholder="1" />
                            </div>
                            <div className="bill-mgr-input-group">
                                <label className="bill-mgr-label">Price</label>
                                <input type="number" className="bill-mgr-input" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} placeholder="0.00" />
                            </div>
                            <div className="bill-mgr-input-group">
                                <label className="bill-mgr-label">Amount</label>
                                <input type="number" className="bill-mgr-input" readOnly value={quantity && purchasePrice ? (Number(quantity) * Number(purchasePrice)).toFixed(2) : "0.00"} />
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
                                        <th className="bill-mgr-th">Product</th>
                                        <th className="bill-mgr-th">Qty</th>
                                        <th className="bill-mgr-th">Conv. F.</th>
                                        <th className="bill-mgr-th">Price</th>
                                        <th className="bill-mgr-th">Total</th>
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
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: 'var(--text-sub)' }}>
                                                    <div style={{ width: '40px', height: '40px', background: '#EFF6FF', color: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <i className="fa-solid fa-folder-open"></i>
                                                    </div>
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

                    {/* Section Header */}
                    <div className="bill-mgr-section-header">
                        <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>History</h2>
                        <input 
                            type="text" 
                            placeholder="Search purchase..." 
                            value={keyword} 
                            onChange={(e) => setKeyword(e.target.value)} 
                            className="bill-mgr-input"
                            style={{ width: '220px' }}
                        />
                    </div>

                    {/* History Card */}
                    <div className="bill-mgr-card">
                        <div className="bill-mgr-table-wrapper" style={{ margin: 0 }}>
                            <table className="bill-mgr-table">
                                <thead>
                                    <tr>
                                        <th className="bill-mgr-th">Supplier</th>
                                        <th className="bill-mgr-th">Bill No</th>
                                        <th className="bill-mgr-th">Items</th>
                                        <th className="bill-mgr-th" style={{ textAlign: "right" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {error ? (
                                        <tr>
                                            <td colSpan="4" className="bill-mgr-td" style={{ textAlign: "center", padding: "40px 20px" }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: 'var(--text-sub)' }}>
                                                    <div style={{ width: '40px', height: '40px', background: '#FEE2E2', color: '#EF4444', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <i className="fa-solid fa-circle-exclamation"></i>
                                                    </div>
                                                    <span>{error}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : purchase && purchase.length > 0 ? purchase
                                        .filter(item => (item?.supplierName ?? "").toLowerCase().includes(keyword.toLowerCase()))
                                        .map((item) => (
                                            <tr key={item._id}>
                                                <td className="bill-mgr-td">{item.supplierName}</td>
                                                <td className="bill-mgr-td">{item.supplierBillNo}</td>
                                                <td className="bill-mgr-td">{item.items?.length || 0}</td>
                                                <td className="bill-mgr-td" style={{ textAlign: "right" }}>
                                                    <label htmlFor="view-modal" className="bill-mgr-btn bill-mgr-btn-view" onClick={() => setSelectedView(item)}>
                                                        <i className="fa-solid fa-eye"></i> View
                                                    </label>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="bill-mgr-td" style={{ textAlign: "center", padding: "40px 20px" }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: 'var(--text-sub)' }}>
                                                        <div style={{ width: '40px', height: '40px', background: '#EFF6FF', color: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <i className="fa-solid fa-folder-open"></i>
                                                        </div>
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