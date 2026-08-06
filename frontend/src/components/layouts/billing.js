import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import toast, { Toaster } from "react-hot-toast";
import axios from 'axios';
import { createBill, getBills } from '../../actions/billingActions';
import { resetBill } from '../../slices/billSlice';
import { getProducts } from '../../actions/productAction';
import Loader from '../layouts/loader';
import '../styles/billing.css';

export default function Billing() {
  const dispatch = useDispatch();
  const { Billing = [], loading, error, message } = useSelector(state => state.billingState || {});
  const { products = [] } = useSelector(state => state.productState || { products: [] });

  const [keyword, setKeyword] = useState('');

  // New state for handling the share modal and selected bill details
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [sharing, setSharing] = useState(false); // Loading state for WhatsApp sharing

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getBills());
    return () => { dispatch(resetBill()); };
  }, [dispatch]);

  const [customerName, setCustomerName] = useState('');
  const [mobilenumber, setMobileNumber] = useState('');
  const [paymentType, setPaymentType] = useState('CASH');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [saleType, setSaleType] = useState('bag');
  const [price, setPrice] = useState('');
  const [tempItems, setTempItems] = useState([]);

  useEffect(() => {
    if (error) toast.error(error);
    if (message) toast.success(message);
  }, [error, message]);

  const handleAddTemp = () => {
    if (!selectedProductId || !quantity || !price) return toast.error("Please fill all product fields");
    const selectedProduct = products.find(p => p._id === selectedProductId);
    const newItem = {
      product: selectedProductId,
      productName: selectedProduct?.name || "Unknown",
      saleType: saleType,
      quantity: Number(quantity),
      price: Number(price),
      total: Number(quantity) * Number(price)
    };
    setTempItems([...tempItems, newItem]);
    setQuantity(''); setPrice(''); setSelectedProductId('');
  };

  const handleSaveInvoice = () => {
    const cleanMobile = mobilenumber.replace(/[^0-9]/g, '');
    if (!customerName || tempItems.length === 0) return toast.error("Please add details and items");
    if (cleanMobile.length !== 10) return toast.error("Please enter a valid 10-digit mobile number");
    dispatch(createBill({
      customerName,
      customerMobile: `91${cleanMobile}`,
      paymentType,
      items: tempItems.map(item => ({ product: item.product, saleType: item.saleType, quantity: item.quantity, price: item.price }))
    }));
    setTempItems([]);
    setCustomerName('');
    setMobileNumber('');
  };

  // Handler to open modal with specific bill
  const handleOpenShareModal = (bill) => {
    setSelectedBill(bill);
    setShowShareModal(true);
  };

  // Updated to pass selectedBill's customerMobile automatically to backend
  const handleConfirmShare = async () => {
    if (!selectedBill) return;
    try {
      setSharing(true);
      const backendUrl = "http://16.171.148.56:8000";
      const config = { withCredentials: true }; 
      
      const requestData = {
        customerMobile: selectedBill.customerMobile
      };

      const { data } = await axios.post(`${backendUrl}/api/v1/share-whatsapp/${selectedBill._id}`, requestData, config);
      
      if (data.success) {
        toast.success("WhatsApp message sent successfully!");
        setShowShareModal(false);
        setSelectedBill(null);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to send WhatsApp message";
      toast.error(errorMsg);
    } finally {
      setSharing(false);
    }
  };

  return (
    <>
      <Toaster />
      {loading ? <Loader /> : (
        <div className="bill-mgr-wrapper">
          <h2 className="bill-mgr-title"><i className="fa-solid fa-file-invoice" style={{ color: "var(--primary)" }}></i> Bill Management</h2>
          <div className="bill-mgr-card">
            <div className="bill-mgr-grid-form">
              <div className="bill-mgr-input-group"><label className="bill-mgr-label">Customer</label><input className="bill-mgr-input" type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Enter name" /></div>
              <div className="bill-mgr-input-group"><label className="bill-mgr-label">Mobile</label><input className="bill-mgr-input" type="text" maxLength="10" value={mobilenumber} onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9]/g, ''))} placeholder="91 0987654321" /></div>
              <div className="bill-mgr-input-group"><label className="bill-mgr-label">Payment</label><select className="bill-mgr-input" value={paymentType} onChange={(e) => setPaymentType(e.target.value)}><option value="CASH">Cash</option><option value="CREDIT">Credit</option></select></div>
            </div>
            <div className="bill-mgr-entry-box">
              <div className="bill-mgr-input-group"><label className="bill-mgr-label">Product</label><select className="bill-mgr-input" value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)}><option value="">Select Item</option>{products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}</select></div>
              <div className="bill-mgr-input-group"><label className="bill-mgr-label">Type</label><select className="bill-mgr-input" value={saleType} onChange={(e) => setSaleType(e.target.value)}><option value="bag">Bag</option><option value="kg">Kg</option></select></div>
              <div className="bill-mgr-input-group"><label className="bill-mgr-label">Qty</label><input className="bill-mgr-input" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" /></div>
              <div className="bill-mgr-input-group"><label className="bill-mgr-label">Price</label><input className="bill-mgr-input" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" /></div>
              <button className="bill-mgr-btn bill-mgr-btn-primary" onClick={handleAddTemp}><i className="fa-solid fa-plus"></i> Add</button>
            </div>
            <div className="bill-mgr-table-wrapper">
              <table className="bill-mgr-table">
                <thead><tr><th className="bill-mgr-th">Product</th><th className="bill-mgr-th">Type</th><th className="bill-mgr-th">Qty</th><th className="bill-mgr-th">Price</th><th className="bill-mgr-th">Total</th></tr></thead>
                <tbody>{tempItems.map((item, idx) => (<tr key={idx}><td className="bill-mgr-td">{item.productName}</td><td className="bill-mgr-td">{item.saleType}</td><td className="bill-mgr-td">{item.quantity}</td><td className="bill-mgr-td">{item.price}</td><td className="bill-mgr-td">{item.total}</td></tr>))}</tbody>
              </table>
              <div className="bill-mgr-save-wrapper"><button className="bill-mgr-save-btn" onClick={handleSaveInvoice} disabled={loading}>{loading ? "Saving..." : "Save Invoice"}</button></div>
            </div>
          </div>
          <div className="bill-mgr-section-header">
            <h2 className="bill-mgr-title"><i className="fa-solid fa-history" style={{ color: "var(--primary)" }}></i>Bill History</h2>
            <input className="bill-mgr-input" type="text" placeholder="Search..." value={keyword} onChange={(e) => setKeyword(e.target.value)} style={{ width: "180px", padding: "0.5rem 1rem" }} />
          </div>
          <div className="bill-mgr-card">
            <div className="bill-mgr-table-wrapper">
              <table className="bill-mgr-table">
                <thead><tr><th className="bill-mgr-th">Customer</th><th className="bill-mgr-th">Date</th><th className="bill-mgr-th">Items</th><th className="bill-mgr-th">Total</th><th className="bill-mgr-th">Actions</th></tr></thead>
                <tbody>
                  {Billing && Billing.length > 0 ? Billing.filter(bill => (bill?.customerName ?? "").toLowerCase().includes(keyword.toLowerCase())).map(bill => (
                    <tr key={bill._id}>
                      <td className="bill-mgr-td" data-label="Customer">{bill.customerName}</td>
                      <td className="bill-mgr-td" data-label="Date">{bill.createdAt ? bill.createdAt.split('T')[0] : 'N/A'}</td>
                      <td className="bill-mgr-td" data-label="Items">{bill.items?.length || 0}</td>
                      <td className="bill-mgr-td" data-label="Total">{bill.grandTotal}</td>
                      <td className="bill-mgr-td" data-label="Actions">
                        <button type="button" onClick={() => handleOpenShareModal(bill)} className="bill-mgr-btn bill-mgr-btn-view" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                          <i className="fa-brands fa-whatsapp"></i> share
                        </button>
                      </td>
                    </tr>
                  )) : <tr><td className="bill-mgr-td" colSpan="5" style={{ textAlign: "center" }}>No bills found</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          {/* Share Modal Popup */}
          {showShareModal && selectedBill && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', width: '400px', maxWidth: '90%', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                <h3 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#333' }}>
                  <i className="fa-solid fa-file-invoice" style={{ color: "var(--primary)" }}></i> Bill Details Preview
                </h3>
                <div style={{ fontSize: '14px', color: '#555', marginBottom: '16px', lineHeight: '1.6' }}>
                  <p><strong>Customer:</strong> {selectedBill.customerName}</p>
                  <p><strong>Mobile:</strong> {selectedBill.customerMobile}</p>
                  <p><strong>Payment Type:</strong> {selectedBill.paymentType}</p>
                  <p><strong>Date:</strong> {selectedBill.createdAt ? selectedBill.createdAt.split('T')[0] : 'N/A'}</p>
                  <div style={{ maxHeight: '120px', overflowY: 'auto', margin: '10px 0', border: '1px solid #eee', padding: '8px', borderRadius: '4px' }}>
                    <strong>Items:</strong>
                    {selectedBill.items?.map((it, i) => (
                      <div key={i} style={{ fontSize: '13px', borderBottom: '1px solid #f9f9f9', padding: '4px 0' }}>
                        {it.product?.name || "Product"} ({it.saleType}) - Qty: {it.quantity} - ₹{it.price * it.quantity}
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#000', marginTop: '8px' }}>Grand Total: ₹{selectedBill.grandTotal}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button onClick={() => setShowShareModal(false)} disabled={sharing} style={{ padding: '8px 16px', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>Cancel</button>
                  <button onClick={handleConfirmShare} disabled={sharing} style={{ padding: '8px 16px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="fa-brands fa-whatsapp"></i> {sharing ? "Sending..." : "Confirm & Send"}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </>
  );
}
