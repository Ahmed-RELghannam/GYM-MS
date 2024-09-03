import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import './css/genral.css';

const CashierList = () => {
  const [cashiers, setCashiers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editCashier, setEditCashier] = useState(null);
  const [newCashier, setNewCashier] = useState({
    name: '',
    email: '',
    phone: '',
    nat_id: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeCashierId, setActiveCashierId] = useState(null);
  const userType = localStorage.getItem('userType');
  const token = localStorage.getItem('authToken');

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

  const fetchCashiers = () => {
    axios.get('http://127.0.0.1:8000/users/api/CashierList/', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
        'X-CSRFToken': csrfToken
      }
    })
    .then(response => {
      setCashiers(response.data);
    })
    .catch(error => {
      console.error('There was an error fetching the cashiers!', error);
    });
  };

  useEffect(() => {
    fetchCashiers();

  }, []);

  if (userType === 'Coach' || userType === 'Cashier') {
    return <Navigate to="/" />;
  }

  const handleEdit = (cashier) => {
    setEditCashier(cashier);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setNewCashier({
      name: '',
      email: '',
      phone: '',
      nat_id: '',
      address: ''
    });
    setEditCashier(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditCashier(null);
    setNewCashier({
      name: '',
      email: '',
      phone: '',
      nat_id: '',
      address: ''
    });
  };

  const handleEditChange = (e) => {
    setEditCashier({ ...editCashier, [e.target.name]: e.target.value });
  };

  const handleNewChange = (e) => {
    setNewCashier({ ...newCashier, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.post(`http://127.0.0.1:8000/users/api/EditCashierUser/${editCashier.id}/`, editCashier, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
        'X-CSRFToken': csrfToken,
      }
    })
    .then(response => {
      setCashiers(cashiers.map(c => (c.id === editCashier.id ? response.data : c)));
      setLoading(false);
      handleCloseModal();
    })
    .catch(error => {
      console.error('There was an error updating the cashier!', error);
      setErrorMessage('حدث خطأ أثناء تحديث الكاشير');
      setLoading(false);
    });
  };

  const handleNewSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.post('http://127.0.0.1:8000/users/api/CreateCashier/', newCashier, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
        'X-CSRFToken': csrfToken,
      }
    })
    .then(response => {
      setCashiers([...cashiers, response.data]);
      setLoading(false);
      handleCloseModal();
    })
    .catch(error => {
      console.error('There was an error adding the cashier!', error);
      setErrorMessage('حدث خطأ أثناء إضافة الكاشير');
      setLoading(false);
    });
  };

  const handleActivate = (email) => {
    setLoading(true);
    axios.post('http://127.0.0.1:8000/users/api/ReRequestCreationsMessage/', { email }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
        'X-CSRFToken': csrfToken,
      }
    })
    .then(response => {
      setSuccessMessage('تم الإرسال بنجاح');
      setTimeout(() => {
        setSuccessMessage('');
      }, 1000);
      setLoading(false);
    })
    .catch(error => {
      console.error('There was an error sending the activation request!', error);
      setErrorMessage('حدث خطأ أثناء إرسال الطلب');
      setTimeout(() => {
        setSuccessMessage('');
      }, 1000);
      setLoading(false);
    });
  };

  const handleResetPassword = (email) => {
    setLoading(true);
    axios.post('http://127.0.0.1:8000/users/api/PasswordResetRequest/', { email }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
        'X-CSRFToken': csrfToken,
      }
    })
    .then(response => {
      setSuccessMessage('تم إرسال طلب إعادة تعيين كلمة المرور');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      setLoading(false);
    })
    .catch(error => {
      console.error('There was an error sending the password reset request!', error);
      setErrorMessage('حدث خطأ أثناء إرسال طلب إعادة تعيين كلمة المرور');
      setLoading(false);
    });
  };

  const handleDelete = (cashierId) => {
    setLoading(true);
    axios.post('http://127.0.0.1:8000/users/api/DeleteCashierUser/', { cashier_id: cashierId }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
        'X-CSRFToken': csrfToken,
      }
    })
    .then(response => {
      setSuccessMessage('تم حذف الكاشير بنجاح');
      setTimeout(() => {
        setSuccessMessage('');
        fetchCashiers();
      }, 30); 
      setLoading(false);
    })
    .catch(error => {
      console.error('There was an error deleting the cashier!', error);
      setErrorMessage('حدث خطأ أثناء حذف الكاشير');
      setLoading(false);
    });
  };
  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-4">
        <h2 className="text-center">Cashier List</h2>
        <button className="btn btn-success" onClick={handleAddNew}>
          <i className="fas fa-plus"></i> Add New
        </button>
      </div>
      {cashiers.length > 0 ? (
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Nat ID</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cashiers.map(cashier => (
              <tr key={cashier.id}>
                <td>{cashier.name}</td>
                <td>{cashier.email}</td>
                <td>{cashier.phone}</td>
                <td>{cashier.nat_id}</td>
                <td>{cashier.address}</td>
                <td>
                  <button className="btn button-as-div text-info btn-sm mx-1" onClick={() => handleEdit(cashier)}>
                    <i className="fas fa-edit"></i>
                  </button>
                  {cashier.user === null ? (
                    <>
                      <button className="btn button-as-div text-secondary btn-sm mx-1" onClick={() => handleActivate(cashier.email)} disabled={loading}>
                        {loading && activeCashierId === cashier.id ? (
                          <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                          <i className="fas fa-envelope"></i>
                        )}
                      </button>
                    </>
                  ) : (
                    <span>
                      <button className="btn btn-sm mx-1" onClick={() => handleDelete(cashier.id)} disabled={loading}>
                        {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-trash"></i>}
                      </button>
                      <button className="btn btn-sm mx-1" onClick={() => handleResetPassword(cashier.email)}>
                        <i className="fas fa-lock"></i>
                      </button>
                    </span>
                  )}
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No cashiers available.</p>
      )}

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editCashier ? 'Edit Cashier' : 'Add New Cashier'}</h5>
                <button type="button" className="close" onClick={handleCloseModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={editCashier ? handleEditSubmit : handleNewSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={editCashier ? editCashier.name : newCashier.name}
                      onChange={editCashier ? handleEditChange : handleNewChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={editCashier ? editCashier.email : newCashier.email}
                      onChange={editCashier ? handleEditChange : handleNewChange}
                      required
                      disabled={!!editCashier}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={editCashier ? editCashier.phone : newCashier.phone}
                      onChange={editCashier ? handleEditChange : handleNewChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="nat_id">Nat ID</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nat_id"
                      name="nat_id"
                      value={editCashier ? editCashier.nat_id : newCashier.nat_id}
                      onChange={editCashier ? handleEditChange : handleNewChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      name="address"
                      value={editCashier ? editCashier.address : newCashier.address}
                      onChange={editCashier ? handleEditChange : handleNewChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Save'}
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

export default CashierList;
