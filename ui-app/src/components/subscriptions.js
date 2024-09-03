import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import axios from 'axios';


const token = localStorage.getItem('authToken');

const userType = localStorage.getItem('userType');


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

const SubscriptionTable = ({ subscriptions }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const rowsPerPage = 10;

    const filteredSubscriptions = subscriptions.filter(subscription =>
        (subscription.plan_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (subscription.status?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const offset = currentPage * rowsPerPage;
    const currentSubscriptions = filteredSubscriptions.slice(offset, offset + rowsPerPage);
    const pageCount = Math.ceil(filteredSubscriptions.length / rowsPerPage);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (
        <div className="container mt-5">
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search subscriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Member Name</th>
                        <th>Plan Name</th>
                        <th>Discount</th>
                        <th>Amount</th>
                        <th>Creation Date</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Coach</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentSubscriptions.map((subscription) => (
                        <tr key={subscription.id}>
                            <td>{subscription.member_name || 'N/A'}</td>
                            <td>{subscription.plan_name || 'N/A'}</td>
                            <td>{subscription.discount || 'N/A'}</td>
                            <td>{subscription.amount || 'N/A'}</td>
                            <td>{subscription.creation_date || 'N/A'}</td>
                            <td>{subscription.start_date || 'N/A'}</td>
                            <td>{subscription.end_date || 'N/A'}</td>
                            <td>{subscription.coach || 'N/A'}</td>
                            <td>{subscription.status || 'N/A'}</td>
                            <td><button className="btn btn-primary" onClick={ ()=> handleRefund(subscription.invoice_id,subscription.id)}>Refund</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
            />
        </div>
    );
};

const handleRefund = ({invoicId,subscriptionId}) =>{
    
    axios.post('http://127.0.0.1:8000/Billing/api/refundSubscriptions/', 
        { 
            "subscription_id": subscriptionId,
            "invoice_id" : invoicId,
            "user_type" : userType


        }, 
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
                'X-CSRFToken': csrfToken,
            }
        }
    )
    .then(response => {
        
    })
    .catch(error => {
        
    });
           
   
    
}

const SubscriptionsList = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
               
                const response = await axios.get('http://127.0.0.1:8000/Billing/api/SubscriptionsList/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`,
                    }
                });
                setSubscriptions(response.data);
            } catch (error) {
                console.error('Failed to fetch subscriptions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubscriptions();
    }, []);

    return (
        <div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <SubscriptionTable subscriptions={subscriptions} />
            )}
        </div>
    );
};

export default SubscriptionsList;
