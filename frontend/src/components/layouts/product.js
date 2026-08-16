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
    const [editData, setEditData] = useState({ id: '', name: '' });
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
        dispatch(createProduct({ name: newProductName }));
        setNewProductName('');
    };

    const handleUpdate = () => {
        dispatch(updateProduct(editData.id, { name: editData.name }));
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
            <div className="prod-mgr-wrapper">
                <div className="prod-mgr-container">
                    <div className="prod-mgr-header-row">
                        <div className="prod-mgr-header">
                            <i className="fa-solid fa-box-open" style={{ color: "#0056B3" }}></i> Manage Products
                        </div>
                        {/* <Link to="/" className="prod-mgr-home-link"><i className="fa-solid fa-house"></i></Link> */}
                    </div>

                    <div className="prod-mgr-card">
                        <div className="prod-mgr-controls">
                            <Search keyword={keyword} setKeyword={setKeyword} />
                            <div className="prod-mgr-add-container">
                                <input value={newProductName} onChange={(e) => setNewProductName(e.target.value)} placeholder="New product name..." />
                                <button className="prod-mgr-btn-add" onClick={handleAdd}>Save</button>
                            </div>
                        </div>
                    </div>

                    {loading ? <Loader /> : (
                        <div className="prod-mgr-card prod-mgr-table-view">
                            <div className="prod-mgr-table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            {/* <th>Date</th> */}
                                            <th>Product</th>
                                            <th>Stock</th>
                                            <th>Conv. Factor</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products && products.map((p) => (
                                            <tr key={p._id}>
                                                {/* <td>
                                                    {p.createdAt ? p.createdAt.split('T')[0] : "N/A"}
                                                </td> */}
                                                <td><div className="prod-mgr-info-card">{p.name}</div></td>
                                                <td>{p.stock || 0}</td>
                                                <td>{p.conversionFactor || 0}</td>

                                                <td>
                                                    <div className="prod-mgr-action-btns">
                                                        <button className="prod-mgr-btn-icon prod-mgr-btn-edit" onClick={() => { setEditData({ id: p._id, name: p.name }); setShowEdit(true); }}><i className="fa-solid fa-pen"></i></button>
                                                        <button className="prod-mgr-btn-icon prod-mgr-btn-delete" onClick={() => { setDeleteId(p._id); setShowDelete(true); }}><i className="fa-solid fa-trash"></i></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {showEdit && (
                    <div className="prod-mgr-modal-overlay">
                        <div className="prod-mgr-modal">
                            <h3>Update Product</h3>
                            <input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
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
            </div>
        </Fragment>
    );
}
