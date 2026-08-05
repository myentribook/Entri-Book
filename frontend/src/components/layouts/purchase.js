import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { getPurchase, createPurchase } from '../../actions/purchaseActions';
import { clearPurchaseState } from '../../slices/purchaseSlices'; // Ensure this matches your slice export
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

        // Fix: Clear purchase data on component unmount
        return () => {
            dispatch(clearPurchaseState());
        };
    }, [dispatch]);

    const handleAddTemp = () => {
        if (!selectedProductId || !quantity || !purchasePrice) return toast.error("Please fill all product fields");
        const selectedProduct = products.find(p => p._id === selectedProductId);
        const q = Number(quantity);
        const p = Number(purchasePrice);
        const cf = Number(conversionFactor || 0);

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

        const purchaseData = {
            supplierName,
            supplierBillNo,
            items: tempItems.map(item => ({
                product: item.product,
                quantity: item.quantity,
                conversionFactor: item.conversionFactor,
                purchasePrice: item.purchasePrice
            }))
        };

        dispatch(createPurchase(purchaseData)).then(() => {
            dispatch(getPurchase());
        });

        setTempItems([]);
        setSupplierName('');
        setSupplierBillNo('');
    };

    return (
        <>
            <Toaster />

            <input type="checkbox" id="view-modal" className="modal-checkbox" />
            <div className="modal-overlay">
                <div className="modal-content">
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
                                        <li key={index} style={{ marginBottom: "5px", borderBottom: "1px solid #eee" }}>
                                            {finalProductName} - {item.quantity} x {item.purchasePrice} = {subTotal.toFixed(2)}
                                        </li>
                                    );
                                })}
                            </ul>
                            <p><strong>Grand Total: {selectedView.items?.reduce((acc, item) => acc + (item.quantity * item.purchasePrice), 0).toFixed(2)}</strong></p>
                        </>
                    )}
                    <label htmlFor="view-modal" className="btn btn-primary">Close</label>
                </div>
            </div>

            {loading ? <Loader /> : (
                <div className="wrapper">
                    <h2 style={{ paddingBottom: '30px', fontWeight: "bolder" }}><i className="fa-solid fa-cart-shopping" style={{ color: '#0056B3' }}></i> Purchase Management</h2>
                    <div className="card">
                        <div className="grid-form">
                            <div className="input-group"><label>Supplier Name</label><input type="text" value={supplierName} onChange={(e) => setSupplierName(e.target.value)} placeholder="ABC " /></div>
                            <div className="input-group"><label>Supplier Bill Number</label><input type="text" value={supplierBillNo} onChange={(e) => setSupplierBillNo(e.target.value)} placeholder="e.g. BILL-2026-001" /></div>
                        </div>

                        <div className="entry-box">
                            <div className="input-group">
                                <label>Product</label>
                                <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)}>
                                    <option value="">Select Item</option>
                                    {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div className="input-group"><label>Qty</label><input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" /></div>
                            <div className="input-group"><label>Conv. F.</label><input type="number" value={conversionFactor} onChange={(e) => setConversionFactor(e.target.value)} placeholder="1" /></div>
                            <div className="input-group"><label>Price</label><input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} placeholder="0.00" /></div>
                            <div className="input-group"><label>Amount</label><input type="number" readOnly value={quantity && purchasePrice ? (Number(quantity) * Number(purchasePrice)).toFixed(2) : "0.00"} /></div>
                            <button className="btn btn-primary" onClick={handleAddTemp}><i className="fa-solid fa-plus"></i> Add</button>
                        </div>

                        <div className="table-wrapper">
                            <table>
                                <thead><tr><th>Product</th><th>Qty</th><th>Conv. F.</th><th>Price</th><th>Amount</th></tr></thead>
                                <tbody>
                                    {tempItems.map((item, idx) => (
                                        <tr key={idx}><td>{item.productName}</td><td>{item.quantity}</td><td>{item.conversionFactor}</td><td>{item.purchasePrice}</td><td>{item.amount.toFixed(2)}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="dificultly-wrapper">
                                <button className="dificultly-btn" onClick={handleSavePurchase}><i className="fa-solid fa-check"></i> Save</button>
                            </div>
                        </div>
                    </div>

                    <div className="section-header">
                        <h2 style={{ paddingBottom: '30px', fontWeight: "bolder" }}><i className="fa-solid fa-clock-rotate-left" style={{ color: '#0056B3' }}></i> Purchase History</h2>
                        <input type="text" placeholder="Search purchase..." value={keyword} onChange={(e) => setKeyword(e.target.value)} style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '13px', width: '200px' }} />
                    </div>

                    <div className="card">
                        <div className="table-wrapper history-scroll">
                            <table>
                                <thead><tr><th>Supplier</th><th>Bill No</th><th>Items</th><th>Actions</th></tr></thead>
                                <tbody>
                                    {error ? (
                                        <tr><td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>{error}</td></tr>
                                    ) : purchase && purchase.length > 0 ? purchase
                                        .filter(item => (item?.supplierName ?? "").toLowerCase().includes(keyword.toLowerCase()))
                                        .map((item) => (
                                            <tr key={item._id}>
                                                <td>{item.supplierName}</td>
                                                <td>{item.supplierBillNo}</td>
                                                <td>{item.items?.length || 0}</td>
                                                <td><label htmlFor="view-modal" className="btn btn-view" onClick={() => setSelectedView(item)}><i className="fa-solid fa-eye"></i> View</label></td>
                                            </tr>
                                        )) : <tr><td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>No purchase found</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}