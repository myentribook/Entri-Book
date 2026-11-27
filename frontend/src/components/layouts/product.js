import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../actions/productAction';
import { clearProductState } from '../../slices/productSlice';
import '../styles/product.css';
import Loader from '../layouts/loader';
import Search from './productSearch';
import MetaData from '../layouts/MetaData';
import toast, { Toaster } from "react-hot-toast";

export default function Product() {
    const dispatch = useDispatch();
    const { products, loading, message, error } = useSelector((state) => state?.productState || {});

    const [keyword, setKeyword] = useState('');
    const [newProductName, setNewProductName] = useState('');
    const [newHsnCode, setNewHsnCode] = useState('');
    const [editData, setEditData] = useState({ id: '', name: '', hsnCode: '' });
    const [deleteId, setDeleteId] = useState(null);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    // Fetch all products once on initial mount (similar to Credit component)
    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    useEffect(() => {
        if (message || error) {
            if (error) toast.error(error);
            dispatch(clearProductState());
        }
    }, [message, error, dispatch]);

    const handleAdd = () => {
        if (!newProductName.trim()) return;
        dispatch(createProduct({ name: newProductName, hsnCode: newHsnCode }));
        setNewProductName('');
        setNewHsnCode('');
    };

    const handleUpdate = () => {
        if (!editData?.id) return;
        dispatch(updateProduct(editData.id, { name: editData.name, hsnCode: editData.hsnCode }));
        setShowEdit(false);
    };

    const handleDelete = () => {
        if (!deleteId) return;
        dispatch(deleteProduct(deleteId));
        setShowDelete(false);
        setDeleteId(null);
    };

    // Client-side instant filtering based on product name or HSN code
    const safeKeyword = String(keyword || '').toLowerCase();
    const filteredProducts = Array.isArray(products)
        ? products.filter((p) => {
            if (!p || typeof p !== 'object') return false;
            const nameMatch = String(p.name || '').toLowerCase().includes(safeKeyword);
            const hsnMatch = String(p.hsnCode || '').toLowerCase().includes(safeKeyword);
            return nameMatch || hsnMatch;
        })
        : [];

    return (
        <Fragment>
            <Toaster />
            <MetaData title={`Product Management`} />
            {loading ? <Loader /> : (
                <div className="prod-mgr-wrapper">
                    <div className="prod-mgr-container">
                        
                        {/* Left-Aligned Header & Subtitle Container */}
                        <div className="prod-mgr-top-header">
                            <div className="prod-mgr-top-icon">
                                <i className="fa-solid fa-box-open"></i>
                            </div>
                            <div className="prod-mgr-title-group">
                                <h2 className="prod-mgr-main-title">Product Management</h2>
                                <p className="prod-mgr-subtitle">Create, organize, and manage your inventory items and HSN codes seamlessly.</p>
                            </div>
                        </div>

                        {/* Product Name, HSN Code and Save Button Container */}
                        <div className="prod-mgr-card">
                            <div className="prod-mgr-add-container">
                                <div className="prod-mgr-input-group">
                                    <input value={newProductName} onChange={(e) => setNewProductName(e.target.value)} placeholder=" " />
                                    <label className="prod-mgr-label">Product Name</label>
                                </div>
                                <div className="prod-mgr-input-group">
                                    <input value={newHsnCode} onChange={(e) => setNewHsnCode(e.target.value)} placeholder=" " />
                                    <label className="prod-mgr-label">HSN Code</label>
                                </div>
                                <button className="prod-mgr-btn-add" onClick={handleAdd}>+ Save</button>
                            </div>
                        </div>

                        {/* Integrated Stock List & Search Card */}
                        <div className="prod-mgr-card prod-mgr-list-card">
                            <div className="prod-mgr-card-top-bar">
                                <div className="prod-mgr-section-header">
                                    <span className="prod-mgr-section-icon">
                                        <i className="fa-solid fa-scroll"></i>
                                    </span>
                                    <span>Stock List</span>
                                </div>
                                <div className="prod-mgr-search-box">
                                    <Search keyword={keyword} setKeyword={setKeyword} />
                                </div>
                            </div>

                            <div className="prod-mgr-table-view">
                                <div className="prod-mgr-table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>PRODUCT</th>
                                                <th>HSN CODE</th>
                                                <th>STOCK</th>
                                                <th>CONV. FACTOR</th>
                                                <th>ACTIONS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredProducts.length > 0 ? (
                                                filteredProducts.map((p, index) => (
                                                    <tr key={p._id || p.id || index}>
                                                        <td><div className="prod-mgr-info-card">{p.name}</div></td>
                                                        <td>{p.hsnCode || '-'}</td>
                                                        <td>{p.stock ?? 0}</td>
                                                        <td>{p.conversionFactor ?? 0}</td>
                                                        <td>
                                                            <div className="prod-mgr-action-btns">
                                                                <button className="prod-mgr-btn-icon prod-mgr-btn-edit" onClick={() => { setEditData({ id: p._id, name: p.name || '', hsnCode: p.hsnCode || '' }); setShowEdit(true); }}><i className="fa-solid fa-pen"></i></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="prod-mgr-empty-cell">
                                                        <div className="prod-mgr-empty-state">
                                                            <i className="fa-regular fa-file-lines"></i>
                                                            <span>No products found</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showEdit && (
                <div className="prod-mgr-modal-overlay">
                    <div className="prod-mgr-modal">
                        <h3 className='pro-input-pop'>Update Product</h3>
                        <div className="prod-mgr-modal-inputs">
                            <div className="prod-mgr-input-group">
                                <input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} placeholder=" " />
                                <label className="prod-mgr-label">Product Name</label>
                            </div>
                            <div className="prod-mgr-input-group">
                                <input value={editData.hsnCode} onChange={(e) => setEditData({ ...editData, hsnCode: e.target.value })} placeholder=" " />
                                <label className="prod-mgr-label">HSN Code</label>
                            </div>
                        </div>
                        <div className="prod-mgr-modal-btns">
                            <button className="prod-mgr-btn-cancel" onClick={() => setShowEdit(false)}>Cancel</button>
                            <button className="prod-mgr-btn-confirm" onClick={handleUpdate}>Update</button>
                        </div>
                    </div>
                </div>
            )}

            {showDelete && (
                <div className="prod-mgr-modal-overlay">
                    <div className="prod-mgr-modal">
                        <h3>Are you sure?</h3>
                        <div className="prod-mgr-modal-btns">
                            <button className="prod-mgr-btn-cancel" onClick={() => setShowDelete(false)}>Cancel</button>
                            <button className="prod-mgr-btn-confirm prod-mgr-btn-danger" onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
}