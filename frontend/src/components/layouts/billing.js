import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import toast, { Toaster } from "react-hot-toast";
import axios from 'axios';
import { createBill, getBills } from '../../actions/billingActions';
import { resetBill } from '../../slices/billSlice';
import { getProducts } from '../../actions/productAction';
import Loader from '../layouts/loader';
import '../styles/billing.css';

function FloatingField({ label, helperText, hasValue, children, className = '' }) {
  return (
    <div className={`bill-mgr-input-group ${className}`}>
      <div className={`bill-mgr-floating-box ${hasValue ? 'has-value' : ''}`}>
        {children}
        <label className="bill-mgr-floating-label">{label}</label>
      </div>
      {helperText && <span className="bill-mgr-helper-text">{helperText}</span>}
    </div>
  );
}

function FloatingSelect({ label, value, onChange, options, placeholderOption }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const safeOptions = Array.isArray(options) ? options : [];
  const selectedOption = safeOptions.find((opt) => String(opt.value) === String(value));
  const hasValue = Boolean(selectedOption) || (Boolean(placeholderOption) && value !== '');

  const emitChange = (nextValue) => {
    if (typeof onChange === 'function') {
      onChange({ target: { value: nextValue } });
    }
    setIsOpen(false);
  };

  return (
    <div className="bill-mgr-input-group">
      <div
        ref={dropdownRef}
        className={`bill-mgr-floating-box bill-mgr-custom-select-wrap ${hasValue ? 'has-value' : ''} ${isOpen ? 'is-open' : ''}`}
      >
        <button
          type="button"
          className="bill-mgr-input bill-mgr-floating-control bill-mgr-custom-select-trigger"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className={`bill-mgr-custom-select-text ${!selectedOption ? 'is-placeholder' : ''}`}>
            {selectedOption ? selectedOption.label : (placeholderOption || '')}
          </span>
          <i className={`fa-solid ${isOpen ? 'fa-chevron-up' : 'fa-chevron-down'} bill-mgr-custom-select-arrow`}></i>
        </button>

        <label className="bill-mgr-floating-label">{label}</label>

        {isOpen && (
          <div className="bill-mgr-custom-dropdown-menu" role="listbox">
            {placeholderOption && (
              <button
                type="button"
                role="option"
                aria-selected={value === ''}
                className={`bill-mgr-custom-dropdown-item is-placeholder-item ${value === '' ? 'is-selected' : ''}`}
                onClick={() => emitChange('')}
              >
                {placeholderOption}
              </button>
            )}
            {safeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={String(opt.value) === String(value)}
                className={`bill-mgr-custom-dropdown-item ${String(opt.value) === String(value) ? 'is-selected' : ''}`}
                onClick={() => emitChange(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Billing() {
  const dispatch = useDispatch();

  const { bills = [], loading, error, message } = useSelector(state => state?.billingState || {});
  const { products = [] } = useSelector(state => state?.productState || { products: [] });

  const safeProducts = Array.isArray(products) ? products : [];
  const safeBills = Array.isArray(bills) ? bills : [];

  const [keyword, setKeyword] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getBills());
    return () => { dispatch(resetBill()); };
  }, [dispatch]);

  const [customerName, setCustomerName] = useState('');
  const [mobilenumber, setMobileNumber] = useState('');
  const [paymentType, setPaymentType] = useState('CASH');
  const [cgstPercent, setCgstPercent] = useState(0);
  const [sgstPercent, setSgstPercent] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [saleType, setSaleType] = useState('bag');
  const [price, setPrice] = useState('');
  const [tempItems, setTempItems] = useState([]);

  useEffect(() => {
    if (error) {
      toast.error(String(error));
    }
    if (message) {
      toast.success(String(message));
      dispatch(getBills()); // Refresh bill history on success message
    }
  }, [error, message, dispatch]);

  const handleAddTemp = () => {
    const qtyNum = Number(quantity);
    const priceNum = Number(price);
    if (!selectedProductId || quantity === '' || price === '') return toast.error("Please fill all product fields");
    if (!Number.isFinite(qtyNum) || qtyNum <= 0 || !Number.isFinite(priceNum) || priceNum < 0) {
      return toast.error("Please enter valid quantity and price");
    }
    const selectedProduct = safeProducts.find(p => String(p?._id) === String(selectedProductId));
    const newItem = {
      product: selectedProductId,
      productName: selectedProduct?.name || "Unknown",
      saleType: saleType,
      quantity: qtyNum,
      price: priceNum,
      total: qtyNum * priceNum
    };
    setTempItems(prev => [...prev, newItem]);
    setQuantity(''); setPrice(''); setSelectedProductId('');
  };

  const handleSaveInvoice = () => {
    const trimmedCustomerName = String(customerName || '').trim();
    const cleanMobile = String(mobilenumber || '').replace(/[^0-9]/g, '');
    if (!trimmedCustomerName || tempItems.length === 0) return toast.error("Please add details and items");
    if (cleanMobile.length !== 10) return toast.error("Please enter a valid 10-digit mobile number");

    const safeCgst = Number.isFinite(Number(cgstPercent)) ? Number(cgstPercent) : 0;
    const safeSgst = Number.isFinite(Number(sgstPercent)) ? Number(sgstPercent) : 0;

    Promise.resolve(
      dispatch(createBill({
        customerName: trimmedCustomerName,
        customerMobile: `91${cleanMobile}`,
        paymentType,
        paymentMode: paymentType,
        cgstPercent: safeCgst,
        sgstPercent: safeSgst,
        items: tempItems.map(item => ({
          product: item.product,
          saleType: item.saleType,
          quantity: item.quantity,
          price: item.price
        }))
      }))
    ).then(() => {
      // Force immediate fetch if action resolves successfully
      dispatch(getBills());
    }).catch(() => {
      // Error is handled via state/toast without unhandled rejection
    });

    setTempItems([]);
    setCustomerName('');
    setMobileNumber('');
    setCgstPercent(0);
    setSgstPercent(0);
  };

  const handleOpenShareModal = (bill) => {
    setSelectedBill(bill || null);
    setShowShareModal(true);
  };

  const handleConfirmShare = async () => {
    if (!selectedBill || !selectedBill._id) {
      toast.error("Please select a bill");
      return;
    }

    try {
      setSharing(true);

      const requestData = {
        customerMobile: selectedBill.customerMobile
      };

      const { data } = await axios.post(
        `/api/v1/share-whatsapp/${selectedBill._id}`,
        requestData,
        {
          withCredentials: true,
          timeout: 20000
        }
      );

      if (data?.success) {
        toast.success("WhatsApp message accepted by Meta!");
        setShowShareModal(false);
        setSelectedBill(null);
      } else {
        toast.error(data?.message || "WhatsApp message could not be sent");
      }

    } catch (err) {
      console.error(
        "Share Bill Error:",
        err?.response?.data || err?.message
      );

      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to send WhatsApp message";

      toast.error(errorMsg);

    } finally {
      setSharing(false);
    }
  };

  const itemsSubTotal = tempItems.reduce((sum, item) => sum + (Number(item?.total) || 0), 0);
  const computedGrandTotal =
    itemsSubTotal +
    (itemsSubTotal * (Number(cgstPercent) || 0)) / 100 +
    (itemsSubTotal * (Number(sgstPercent) || 0)) / 100;

  const normalizedKeyword = String(keyword || '').toLowerCase();

  const filteredBills = safeBills.length > 0
    ? safeBills
      .filter(bill => {
        // Relaxed filter to prevent hiding bills if paymentType/paymentMode is missing or formatted differently
        const pType = String(bill?.paymentType ?? bill?.paymentMode ?? "CASH").trim().toUpperCase();
        return pType === 'CASH' || pType === '';
      })
      .filter(bill =>
        String(bill?.customerName ?? "").toLowerCase().includes(normalizedKeyword) ||
        String(bill?.invoiceNo ?? "").toLowerCase().includes(normalizedKeyword)
      )
    : [];

  return (
    <>
      <Toaster />
      {loading ? <Loader /> : (
        <div className="bill-mgr-wrapper">
          <div className="bill-mgr-header-row">
            <div className="bill-mgr-badge-icon"><i className="fa-solid fa-file-invoice"></i></div>
            <div className="bill-mgr-header-text">
              <h2 className="bill-mgr-title">Bill Management</h2>
              <p className="bill-mgr-subtitle">Create, manage, and share your customer retail invoices seamlessly.</p>
            </div>
          </div>

          <div className="bill-mgr-card">
            <div className="bill-mgr-grid-form">
              <FloatingField label="Customer" hasValue={String(customerName).trim().length > 0}>
                <input
                  className="bill-mgr-input bill-mgr-floating-control"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder=" "
                />
              </FloatingField>

              <FloatingField label="Mobile" hasValue={String(mobilenumber).trim().length > 0}>
                <input
                  className="bill-mgr-input bill-mgr-floating-control"
                  type="text"
                  maxLength="10"
                  value={mobilenumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder=" "
                />
              </FloatingField>

              <FloatingSelect
                label="Payment"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                options={[
                  { value: 'CASH', label: 'Cash' },
                  { value: 'CREDIT', label: 'Credit' }
                ]}
              />

              <FloatingField label="CGST %" hasValue={cgstPercent !== '' && cgstPercent !== null && cgstPercent !== undefined}>
                <input
                  className="bill-mgr-input bill-mgr-floating-control"
                  type="number"
                  value={cgstPercent}
                  onChange={(e) => setCgstPercent(e.target.value)}
                  placeholder=" "
                />
              </FloatingField>

              <FloatingField label="SGST %" hasValue={sgstPercent !== '' && sgstPercent !== null && sgstPercent !== undefined}>
                <input
                  className="bill-mgr-input bill-mgr-floating-control"
                  type="number"
                  value={sgstPercent}
                  onChange={(e) => setSgstPercent(e.target.value)}
                  placeholder=" "
                />
              </FloatingField>
            </div>

            <div className="bill-mgr-entry-box">
              <FloatingSelect
                label="Product"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                placeholderOption="Select Item"
                options={safeProducts.map(p => ({ value: p._id, label: p.name }))}
              />

              <FloatingSelect
                label="Type"
                value={saleType}
                onChange={(e) => setSaleType(e.target.value)}
                options={[
                  { value: 'bag', label: 'Unit' },
                  { value: 'kg', label: 'Kg' }
                ]}
              />

              <FloatingField label="Qty" hasValue={String(quantity).trim().length > 0}>
                <input
                  className="bill-mgr-input bill-mgr-floating-control"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder=" "
                />
              </FloatingField>

              <FloatingField label="Price - 1 kg or 1 bag" hasValue={String(price).trim().length > 0}>
                <input
                  className="bill-mgr-input bill-mgr-floating-control"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder=" "
                />
              </FloatingField>

              <button type="button" className="bill-mgr-btn bill-mgr-btn-primary" onClick={handleAddTemp}>
                <i className="fa-solid fa-plus"></i> Add
              </button>
            </div>


            <div className="bill-mgr-table-wrapper">
              <table className="bill-mgr-table">
                <thead>
                  <tr>
                    <th className="bill-mgr-th">PRODUCT</th>
                    <th className="bill-mgr-th">TYPE</th>
                    <th className="bill-mgr-th">QTY</th>
                    <th className="bill-mgr-th">PRICE</th>
                    <th className="bill-mgr-th">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {tempItems.length > 0 ? (
                    tempItems.map((item, idx) => (
                      <tr key={idx}>
                        <td className="bill-mgr-td" data-label="Product Name">{item.productName}</td>
                        <td className="bill-mgr-td" data-label="Type">{item.saleType}</td>
                        <td className="bill-mgr-td" data-label="Quantity">{item.quantity}</td>
                        <td className="bill-mgr-td" data-label="Price">{item.price}</td>
                        <td className="bill-mgr-td" data-label="Total">{item.total}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="bill-mgr-td bill-mgr-empty-cell" colSpan="5">
                        <div className="bill-mgr-empty-state">
                          <i className="fa-solid fa-box-open bill-mgr-empty-icon"></i>
                          <span className="bill-mgr-empty-text">No products added yet</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="bill-mgr-save-wrapper">
                <div className="bill-mgr-grand-total">
                  <span className="bill-mgr-grand-total-label">Grand Total</span>
                  <span className="bill-mgr-grand-total-value">₹{(Number.isFinite(computedGrandTotal) ? computedGrandTotal : 0).toFixed(2)}</span>
                </div>
                <button type="button" className="bill-mgr-save-btn" onClick={handleSaveInvoice} disabled={loading}>
                  <i className="fa-regular fa-floppy-disk"></i> {loading ? "Saving..." : "Save Invoice →"}
                </button>
              </div>
            </div>
          </div>

          <div className="bill-mgr-card bill-mgr-history-card">
            <div className="bill-mgr-section-header">
              <h2 className="bill-mgr-subheading">
                <span className="bill-mgr-history-icon"><i className="fa-solid fa-clock-rotate-left"></i></span>
                Bill History
              </h2>
              <div className="bill-mgr-search-box">
                <i className="fa-solid fa-magnifying-glass bill-mgr-search-icon"></i>
                <input
                  className="bill-mgr-search-input"
                  type="text"
                  placeholder="Search Bills ..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>

            <div className="bill-mgr-table-wrapper">
              <table className="bill-mgr-table">
                <thead>
                  <tr>
                    <th className="bill-mgr-th">CUSTOMER</th>
                    <th className="bill-mgr-th">DATE</th>
                    <th className="bill-mgr-th">ITEMS</th>
                    <th className="bill-mgr-th">TOTAL</th>
                    <th className="bill-mgr-th">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBills.length > 0 ? filteredBills
                    .map((bill, idx) => (
                      <tr key={bill?._id || idx}>
                        <td className="bill-mgr-td" data-label="Customer">{bill?.customerName || 'N/A'} ({bill?.invoiceNo || 'N/A'})</td>
                        <td className="bill-mgr-td" data-label="Date">{bill?.createdAt ? String(bill.createdAt).split('T')[0] : 'N/A'}</td>
                        <td className="bill-mgr-td" data-label="Item">{Array.isArray(bill?.items) ? bill.items.length : 0}</td>
                        <td className="bill-mgr-td" data-label="Price">₹{bill?.grandTotal ?? 0}</td>
                        <td className="bill-mgr-td" data-label="Action">
                          <button type="button" onClick={() => handleOpenShareModal(bill)} className="bill-mgr-btn bill-mgr-btn-view" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#25D366' }}>
                            <i className="fa-brands fa-whatsapp"></i> Share
                          </button>
                        </td>
                      </tr>
                    )) : (
                    <tr>
                      <td className="bill-mgr-td bill-mgr-empty-cell" colSpan="5">
                        <div className="bill-mgr-empty-state">
                          <i className="fa-regular fa-file-lines bill-mgr-empty-icon"></i>
                          <span className="bill-mgr-empty-text">No bills found</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {showShareModal && selectedBill && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', width: '400px', maxWidth: '90%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' }}>
                <h3 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#0F172A', fontWeight: '800' }}>
                  <i className="fa-solid fa-file-invoice" style={{ color: "var(--primary)" }}></i> Bill Details Preview
                </h3>
                <div style={{ fontSize: '14px', color: '#475569', marginBottom: '16px', lineHeight: '1.6' }}>
                  <p><strong>Customer:</strong> {selectedBill?.customerName || 'N/A'}</p>
                  <p><strong>Mobile:</strong> {selectedBill?.customerMobile || 'N/A'}</p>
                  <p><strong>Payment Type:</strong> {selectedBill?.paymentType || selectedBill?.paymentMode || 'N/A'}</p>
                  <p><strong>Date:</strong> {selectedBill?.createdAt ? String(selectedBill.createdAt).split('T')[0] : 'N/A'}</p>
                  <p><strong>GSTIN :</strong> {selectedBill?.gstin || 'N/A'}</p>
                  <div style={{ maxHeight: '120px', overflowY: 'auto', margin: '10px 0', border: '1px solid #E2E8F0', padding: '8px', borderRadius: '8px' }}>
                    <strong>Items:</strong>
                    {Array.isArray(selectedBill?.items) && selectedBill.items.map((it, i) => (
                      <div key={i} style={{ fontSize: '13px', borderBottom: '1px solid #F1F5F9', padding: '4px 0' }}>
                        - {it?.product?.name || it?.productName || "Product"} ({it?.saleType || 'N/A'}) - Qty: {it?.quantity ?? 0} | ₹{it?.total ?? 0}
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: '14px', color: '#64748B' }}>SubTotal: ₹{selectedBill?.subTotal ?? 0}</p>
                  <p style={{ fontSize: '14px', color: '#64748B' }}>Tax (CGST+SGST): ₹{selectedBill?.totalTax ?? 0}</p>
                  <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#0F172A', marginTop: '4px' }}>Grand Total: ₹{selectedBill?.grandTotal ?? 0}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" onClick={() => setShowShareModal(false)} disabled={sharing} style={{ padding: '10px 16px', background: '#E2E8F0', color: '#334155', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                  <button type="button" onClick={handleConfirmShare} disabled={sharing} style={{ padding: '10px 16px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
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