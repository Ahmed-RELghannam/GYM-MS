import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import loadingAnimation from './animtion/Loding.json'; // المسار إلى ملف Loding.json

const MemberList = () => {
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const userType = localStorage.getItem('userType');
    const token = localStorage.getItem('authToken');
    const [attendLoding, setAttendLoding] = useState('');
    const navigate = useNavigate();
    const membersPerPage = 12;
    const today = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format

    const [showModal, setShowModal] = useState(false);
    

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
        if (!token) return; // Avoid making the request if no token is available

        // Fetch members from API when the component loads
        const fetchMembers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/Billing/api/memberList/', {
                    headers: { Authorization: `Token ${token}` }
                });
                setMembers(response.data);
                setFilteredMembers(response.data); // Initialize filtered members
            } catch (error) {
                console.error('Failed to fetch members:', error);
            }
        };
        fetchMembers();
    }, [token]);

    // Handle search
    useEffect(() => {
        const results = members.filter(member =>
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.phone.toString().includes(searchQuery)
        );
        setFilteredMembers(results);
        setCurrentPage(1); // Reset to first page on new search
    }, [searchQuery, members]);

    // Calculate pagination values
    const indexOfLastMember = currentPage * membersPerPage;
    const indexOfFirstMember = indexOfLastMember - membersPerPage;
    const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
    const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    const handleRenew = (memberId) => {
        navigate(`/newbilling/?member=${memberId}`);
    };

    const handleMemberProfile = (memberId) => {
        navigate(`/memberprofile/?member=${memberId}`);
    };


    
    const makeAttendance = (memberId) => {
        setAttendLoding(true);
        axios.post('http://127.0.0.1:8000/Billing/api/MemberAttandance/', 
            { "member_id": memberId }, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                    'X-CSRFToken': csrfToken,
                }
            }
        )
        .then(response => {
            console.log("Attendance recorded:", response.data);
            setAttendLoding(false);
        })
        .catch(error => {
            console.error("Error recording attendance:", error.response ? error.response.data : error.message);
            setAttendLoding(false);
        });
    };
     

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (userType === 'Coach') {
        return <Navigate to="/" />;
    }




    return (
        <div className="container-fluid">
            <header className="bg-primary text-white p-4 mb-4 d-flex justify-content-between align-items-center">
                <h1 className="h4">Members</h1>
                <div className="position-relative">
                    <input
                        className="form-control form-control-lg"
                        placeholder="Search by Name or Phone"
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>
            <main className="d-flex flex-column">
                {filteredMembers.length === 0 ? (
                    <div className="text-center">
                        <p>No members found.</p>
                        <button className="btn btn-success" onClick={() => setShowModal(true)}>
                            Add New Member
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            {currentMembers.map((member) => (
                                <div key={member.id} className="col">
                                    <div className="card shadow-sm mb-4">
                                        <div className="card-body">
                                            <h5
                                                className="card-title"
                                                style={{ cursor: 'pointer' }}  
                                                onClick={() => handleMemberProfile(member.id)}
                                            >
                                                {member.name}
                                            </h5>
                                            <p className="card-text text-muted">{member.phone}</p>
                                            { member.last_subscription_end_date > today ? (
                                                attendLoding ? (
                                                    <Lottie animationData={loadingAnimation} style={{ height: 50, width: 50 }} />
                                                ) : (
                                                    <button className="btn btn-primary w-100" onClick={() => makeAttendance(member.id)}>
                                                        Mark Attendance 
                                                    </button>
                                                )
                                            ) : (
                                                <button className="btn btn-primary w-100" onClick={()=>handleRenew(member.id)}>
                                                    Renew Subscription
                                                </button>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        <nav aria-label="Page navigation">
                            <ul className="pagination justify-content-center">
                                {[...Array(totalPages).keys()].map(page => (
                                    <li
                                        key={page + 1}
                                        className={`page-item ${currentPage === page + 1 ? 'active' : ''}`}
                                        onClick={() => handlePageChange(page + 1)}
                                    >
                                        <button className="page-link">
                                            {page + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </>
                )}
            </main>
            {showModal && (
                <div className="modal show" style={{ display: 'block' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add a new member</h5>
                        <button type="button" className="close" onClick={() => setShowModal(false)}>
                        <span>&times;</span>
                        </button>
                    </div>
                        <div className="modal-body">
                            <form >
                            
                            
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="Email">Email</label>
                                    <input
                                    type="email"
                                    className="form-control"
                                    id="Email"
                                    name="Email"
                                    
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="name">Phone</label>
                                    <input
                                    type="tel"
                                    className="form-control"
                                    id="Phone"
                                    name="Phone"
                                    required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="name">Age</label>
                                    <input
                                    type="number"
                                    className="form-control"
                                    id="Age"
                                    name="Age"
                                    
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="name">Weight</label>
                                    <input
                                    type="number"
                                    className="form-control"
                                    id="Weight"
                                    name="Weight"
                                    
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="name">Height</label>
                                    <input
                                    type="number"
                                    className="form-control"
                                    id="Height"
                                    name="Height"
                                    
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="name">Address</label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    id="Address"
                                    name="Address"
                                    
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary" >
                                    Save
                                </button>

                            
                            
                            </form>
                        </div>
                    </div>
                </div>
                </div>
            )}



        </div>
    );
};

export default MemberList;
