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
    const { products, loading, message, error } = useSelector((state) => state.productState);

    const [keyword, setKeyword] = useState('');
    const [newProductName, setNewProductName] = useState('');
    const [newHsnCode, setNewHsnCode] = useState('');
    const [editData, setEditData] = useState({ id: '', name: '', hsnCode: '' });
    const [deleteId, setDeleteId] = useState(null);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    useEffect(() => {
        dispatch(getProducts(keyword));
    }, [dispatch, keyword]);

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
        dispatch(updateProduct(editData.id, { name: editData.name, hsnCode: editData.hsnCode }));
        setShowEdit(false);
    };

    const handleDelete = () => {
        dispatch(deleteProduct(deleteId));
        setShowDelete(false);
        setDeleteId(null);
    };

    return (
        <Fragment>
            <Toaster />
            <MetaData title={`Product Management`} />
            {loading ? <Loader /> : (
                <div className="prod-mgr-wrapper">
                    <div className="prod-mgr-container">
                        
                        {/* Top Header Section matching design style */}
                        <div className="prod-mgr-top-header">
                            <div className="prod-mgr-top-icon">
                                <i className="fa-solid fa-box-open" style={{ color: "#004a99" }}></i>
                            </div>
                            <h2 className="prod-mgr-main-title">Product Management</h2>
                            <p className="prod-mgr-subtitle">Create, organize, and manage your inventory items and HSN codes seamlessly.</p>
                        </div>

                        <div className="prod-mgr-card">
                            <div className="prod-mgr-controls">
                                <Search keyword={keyword} setKeyword={setKeyword} />
                                <div className="prod-mgr-add-container">
                                    <div className="prod-mgr-input-group">
                                        <label className="prod-mgr-label">PRODUCT NAME</label>
                                        <input value={newProductName} onChange={(e) => setNewProductName(e.target.value)} placeholder="New product name..." />
                                    </div>
                                    <div className="prod-mgr-input-group">
                                        <label className="prod-mgr-label">HSN CODE</label>
                                        <input value={newHsnCode} onChange={(e) => setNewHsnCode(e.target.value)} placeholder="HSN Code..." />
                                    </div>
                                    <button className="prod-mgr-btn-add" onClick={handleAdd}>+ Save</button>
                                </div>
                            </div>
                        </div>

                        <div className="prod-mgr-header-row">
                            <div className="prod-mgr-section-header">
                                <i className="fa-solid fa-scroll" style={{ color: "#004a99" }}></i> Stock List
                            </div>
                        </div>

                        <div className="prod-mgr-card prod-mgr-table-view">
                            <div className="prod-mgr-table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>HSN Code</th>
                                            <th>Stock</th>
                                            <th>Conv. Factor</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products && products.map((p) => (
                                            <tr key={p._id}>
                                                <td><div className="prod-mgr-info-card">{p.name}</div></td>
                                                <td>{p.hsnCode || '-'}</td>
                                                <td>{p.stock || 0}</td>
                                                <td>{p.conversionFactor || 0}</td>
                                                <td>
                                                    <div className="prod-mgr-action-btns">
                                                        <button className="prod-mgr-btn-icon prod-mgr-btn-edit" onClick={() => { setEditData({ id: p._id, name: p.name, hsnCode: p.hsnCode || '' }); setShowEdit(true); }}><i className="fa-solid fa-pen"></i></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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
                            <input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                            <input value={editData.hsnCode} onChange={(e) => setEditData({ ...editData, hsnCode: e.target.value })} />
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