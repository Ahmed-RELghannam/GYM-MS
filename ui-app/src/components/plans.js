import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import './css/genral.css';
import { Toast, ToastContainer } from 'react-bootstrap';

const PlansList = () => {
    const userType = localStorage.getItem('userType');
    const token = localStorage.getItem('authToken');
    const [Plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);
    
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newPlan, setNewPlan] = useState({
        name: '',
        period:'',
        cost:'',

      });
    const [editPlan, setEditPlan] = useState(null);



    const getCSRFToken = () => {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.startsWith('csrftoken=')) {
            return cookie.substring('csrftoken='.length, cookie.length);
          }
        }
        return null;
      };
    
    const csrfToken = getCSRFToken();
    
    useEffect(() => {
        fetchPlans();
      }, []); 

    const fetchPlans = () => {
        axios.get('http://127.0.0.1:8000/Billing/api/allPlanList/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
            'X-CSRFToken': csrfToken
          }
        })
        .then(response => {
            setPlans(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the Plans!', error);
        });
    };

    const handleAddNew = () => {
        setNewPlan({
            name: '',
            period:'',
            cost:'',
        });
        
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
        setEditPlan(null);
        setNewPlan({
            name: '',
            period:'',
            cost:'',
        });
    };

    
    const handleArchived = (archivedPlan, value) => {
        setLoading(true); // بدء تحميل البيانات

        axios.post(`http://127.0.0.1:8000/Billing/api/EditNewPlan/${archivedPlan.id}/`, 
            { Archived: value },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                    'X-CSRFToken': csrfToken,
                }
            }
        )
        .then(response => {
            // التعامل مع استجابة ناجحة
            fetchPlans(); // تحديث قائمة الخطط
            setLoading(false); // إيقاف حالة التحميل
        })
        .catch(error => {
            console.error('There was an error updating the plan!', error);
            setErrorMessage('حدث خطأ أثناء تحديث الخطة.'); // رسالة الخطأ
            setLoading(false); // إيقاف حالة التحميل
        });
    };

    const handleEdit = (plan) => {
    setEditPlan(plan);
    setShowModal(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        setLoadingSave(true);
        axios.post(`http://127.0.0.1:8000/Billing/api/EditNewPlan/${editPlan.id}/`, editPlan, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
            'X-CSRFToken': csrfToken,
          }
        })
        .then(response => {
          setPlans(Plans.map(c => (c.id === editPlan.id ? response.data : c)));
          setLoadingSave(false);
          fetchPlans();
          handleCloseModal();
        })
        .catch(error => {
          console.error('There was an error updating the Plan!', error);
          setErrorMessage('حدث خطأ أثناء تحديث ');
          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
          setLoadingSave(false);
        });
      };
    const handleEditChange = (e) => {
    setEditPlan({ ...editPlan, [e.target.name]: e.target.value });
    };

    const handleNewSubmit = (e) => {
        e.preventDefault();
        setLoadingSave(true);
        axios.post('http://127.0.0.1:8000/Billing/api/AddNewPlan/', newPlan, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
            'X-CSRFToken': csrfToken,
          }
        })
        .then(response => {
          setNewPlan([...Plans, response.data]);
          setLoadingSave(false);
          fetchPlans();
          handleCloseModal();
        })
        .catch(error => {
          console.error('Error:', error);
          setErrorMessage('حدث خطأ أثناء إضافة ');
          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
          setLoadingSave(false);
        });
    };


    const handleNewChange = (e) => {
        setNewPlan({ ...newPlan, [e.target.name]: e.target.value });
    };



    if (userType === 'Plan' || userType === 'Cashier') {
        return <Navigate to="/" />;
    }
    
    if (!token) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between mb-4">
                <h2 className="text-center">Plans</h2>
                <button className="btn btn-success" onClick={handleAddNew}>
                    <i className="fas fa-plus"></i> Add New
                </button>
            </div>
            {Plans.length > 0 ? (
                <table className="table table-striped">
                    <thead className="thead-dark">
                    <tr>
                        <th>Name</th>
                        <th>period</th>
                        <th>Cost</th>
                        <th>stutes</th>
                        <th></th>

                    </tr>
                    </thead>
                    <tbody>
                        {Plans.map(plan => (
                            <tr key={plan.id}>
                                <td>{plan.name}</td>
                                <td>{plan.period}</td>
                                <td>{plan.cost}</td>
                                <td>
                                    {plan.Archived ? (
                                        <button className='btn button-as-div text-danger' onClick={() => handleArchived(plan, false)}>
                                            <i className="fa-solid fa-toggle-off"></i> {/* رمز للأرشفة */}
                                            
                                        </button>
                                    ) : (
                                        <button className='btn button-as-div text-success' onClick={() => handleArchived(plan, true)}>
                                            <i className="fa-solid fa-toggle-on"></i> {/* رمز للأرشفة */}
                                            
                                        </button>
                                    )}
                                </td>

                                <td>
                                    {plan.has_used!==true?(
                                        <button className='btn button-as-div text-info' onClick={() => handleEdit(plan)}>
                                            <i className="fas fa-edit"></i>
                                        </button>):null}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                ) : (
                    <p>No Plans available.</p>
            )}


            {/* Modal for Add/Edit */}

            {showModal && (
                <div className="modal show" style={{ display: 'block' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{editPlan ? 'Edit Plan' : 'Add New Plan'}</h5>
                        <button type="button" className="close" onClick={handleCloseModal}>
                        <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={editPlan ? handleEditSubmit : handleNewSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={editPlan ? editPlan.name : newPlan.name}
                            onChange={editPlan ? handleEditChange : handleNewChange}
                            disabled={!!editPlan}
                            required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="Period">Period</label>
                            <input
                            type="number"
                            className="form-control"
                            id="period"
                            name="period"
                            value={editPlan ? editPlan.period : newPlan.period}
                            onChange={editPlan ? handleEditChange : handleNewChange}
                            required
                            
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cost">cost</label>
                            <input
                            type="text"
                            className="form-control"
                            id="cost"
                            name="cost"
                            value={editPlan ? editPlan.cost : newPlan.cost}
                            onChange={editPlan ? handleEditChange : handleNewChange}
                            required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loadingSave ? <i className="fas fa-spinner fa-spin"></i> : 'Save'}
                        </button>
                        </form>
                    </div>
                    </div>

                    
                </div>

                    
                </div>
            )}


            {successMessage && <p className="alert alert-success mt-3">{successMessage}</p>}
            {errorMessage && <p className="alert alert-danger mt-3">{errorMessage}</p>}


        </div>
        
        
    );
};



export default PlansList;