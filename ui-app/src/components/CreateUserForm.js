import React, { useState } from 'react';
import axios from 'axios';

const CreateUserForm = () => {
    const [userData, setUserData] = useState({
        uid: '',
        token: '',
        userType: '',
        password: ''
    });

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/users/api/createuser/', userData, {
                headers: { 'Content-Type': 'application/json' }
            });
            alert(response.data.message);
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Error creating user');
        }
    };

    return (
        <div className="container">
            <h2>Create User</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>User ID</label>
                    <input type="text" name="uid" className="form-control" placeholder="User ID" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Token</label>
                    <input type="text" name="token" className="form-control" placeholder="Token" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>User Type</label>
                    <input type="text" name="userType" className="form-control" placeholder="User Type" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" className="form-control" placeholder="Password" onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Create User</button>
            </form>
        </div>
    );
};

export default CreateUserForm;