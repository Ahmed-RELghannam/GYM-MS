import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const Withdraw = () => {
    const userType = localStorage.getItem('userType');
    const token = localStorage.getItem('authToken');

    if (userType === 'Coach' || userType === 'Cashier') {
        return <Navigate to="/" />;
    }
    
    if (!token) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between mb-4">
                <h2 className="text-center">Withdrawal list</h2>
                <button className="btn btn-success" >
                    <i className="fas fa-plus"></i> Add New
                </button>
            </div>
        </div>
    );
};



export default Withdraw;