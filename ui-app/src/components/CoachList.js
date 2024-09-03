import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const CoachList = () => {
  
  const userType = localStorage.getItem('userType');
  const token = localStorage.getItem('authToken');
  const [Coachs, setCoachs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editCoach, setEditCoach] = useState(null);
  const [newCoach, setNewCoach] = useState({
    name: '',
    email: '',
    phone: '',
    nat_id: '',
    address: ''
  });


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
    fetchCoachs();
  }, []);

  if (userType === 'Coach' || userType === 'Cashier') {
    return <Navigate to="/" />;
  }

  const fetchCoachs = () => {
    axios.get('http://127.0.0.1:8000/users/api/CochList/', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
        'X-CSRFToken': csrfToken
      }
    })
    .then(response => {
      setCoachs(response.data);
    })
    .catch(error => {
      console.error('There was an error fetching the Coach!', error);
    });
  };
  
  const handleEdit = (Coach) => {
    setEditCoach(Coach);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setNewCoach({
      name: '',
      email: '',
      phone: '',
      nat_id: '',
      address: ''
    });
    setEditCoach(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditCoach(null);
    setNewCoach({
      name: '',
      email: '',
      phone: '',
      nat_id: '',
      address: ''
    });
  };

  const handleEditChange = (e) => {
    setEditCoach({ ...editCoach, [e.target.name]: e.target.value });
  };

  const handleNewChange = (e) => {
    setNewCoach({ ...newCoach, [e.target.name]: e.target.value });
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
        setErrorMessage('');
      }, 3000);
      setLoading(false);
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.post(`http://127.0.0.1:8000/users/api/EditCoachUser/${editCoach.id}/`, editCoach, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
        'X-CSRFToken': csrfToken,
      }
    })
    .then(response => {
      setCoachs(Coachs.map(c => (c.id === editCoach.id ? response.data : c)));
      setLoading(false);
      handleCloseModal();
    })
    .catch(error => {
      console.error('There was an error updating the coach!', error);
      setErrorMessage('حدث خطأ أثناء تحديث الكاشير');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      setLoading(false);
    });
  };

  const handleNewSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.post('http://127.0.0.1:8000/users/api/CreateCoach/', newCoach, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
        'X-CSRFToken': csrfToken,
      }
    })
    .then(response => {
      setNewCoach([...Coachs, response.data]);
      setLoading(false);
      handleCloseModal();
    })
    .catch(error => {
      console.error('There was an error adding the coatch!', error);
      setErrorMessage('حدث خطأ أثناء إضافة الكاشير');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      setLoading(false);
    });
  };


  const handleDelete = (coachId) => {
    setLoading(true);
    axios.post('http://127.0.0.1:8000/users/api/DeleteCoachUser/', { Coach_id: coachId }, {
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
        fetchCoachs();
      }, 30); 
      setLoading(false);
    })
    .catch(error => {
      console.error('There was an error deleting the cashier!', error);
      setErrorMessage('حدث خطأ أثناء حذف الكاشير');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
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
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      setLoading(false);
    });
  };


  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-4">
        <h2 className="text-center">Coach List</h2>
        <button className="btn btn-success" onClick={handleAddNew}>
          <i className="fas fa-plus"></i> Add New
        </button>
      </div>
      {Coachs.length > 0 ? (
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
              {Coachs.map(coach => (
                <tr key={coach.id}>
                  <td>{coach.name}</td>
                  <td>{coach.email}</td>
                  <td>{coach.phone}</td>
                  <td>{coach.nat_id}</td>
                  <td>{coach.address}</td>


                  <td>
                  <button className="btn btn-warning btn-sm mx-1" onClick={() => handleEdit(coach)}>
                    <i className="fas fa-edit"></i>
                  </button>
                  {coach.user === null ? (
                    <>
                      <button className="btn btn-primary btn-sm mx-1" onClick={() => handleActivate(coach.email)} disabled={loading}>

                        {loading ? (
                          <i className="fas fa-spinner fa-spin"></i>
                        ):(
                          <i className="fas fa-envelope"></i>
                         )}

                      </button>
                    </>
                  ) : (
                    <span>
                      <button className="btn btn-danger btn-sm mx-1" onClick={() => handleDelete(coach.id)} disabled={loading}>
                        {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-trash"></i>}
                      </button>
                      <button className="btn btn-danger btn-sm mx-1" onClick={() => handleResetPassword(coach.email)}>
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
        <p>No coach available.</p>
      )}

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editCoach ? 'Edit Coach' : 'Add New Coach'}</h5>
                <button type="button" className="close" onClick={handleCloseModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={editCoach ? handleEditSubmit : handleNewSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={editCoach ? editCoach.name : newCoach.name}
                      onChange={editCoach ? handleEditChange : handleNewChange}
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
                      value={editCoach ? editCoach.email : newCoach.email}
                      onChange={editCoach ? handleEditChange : handleNewChange}
                      required
                      disabled={!!editCoach}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={editCoach ? editCoach.phone : newCoach.phone}
                      onChange={editCoach ? handleEditChange : handleNewChange}
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
                      value={editCoach ? editCoach.nat_id : newCoach.nat_id}
                      onChange={editCoach ? handleEditChange : handleNewChange}
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
                      value={editCoach ? editCoach.address : newCoach.address}
                      onChange={editCoach ? handleEditChange : handleNewChange}
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

export default CoachList;
