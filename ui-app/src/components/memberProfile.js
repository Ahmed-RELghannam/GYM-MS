import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProfileInfo = ({ member }) => {
    return (
        <div className="card mb-4">
            <div className="card-body">
                <h4 className="card-title">{member.name}</h4>
                <p className="card-text"><strong>Email:</strong> {member.email}</p>
                <p className="card-text"><strong>Phone:</strong> {member.phone}</p>
                <p className="card-text"><strong>Join Date:</strong> {member.joinDate}</p>
            </div>
        </div>
    );
};

const SubscriptionTable = ({ subscriptions }) => {
    return (
        <div className="card mb-4">
            <div className="card-header">
                <h5>Subscriptions</h5>
            </div>
            <div className="card-body">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Plan Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscriptions.map((subscription, index) => (
                            <tr key={index}>
                                <td>{subscription.planName}</td>
                                <td>{subscription.startDate}</td>
                                <td>{subscription.endDate}</td>
                                <td>{subscription.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AttendanceTable = ({ attendance }) => {
    return (
        <div className="card mb-4">
            <div className="card-header">
                <h5>Attendance</h5>
            </div>
            <div className="card-body">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Check-in Time</th>
                            <th>Check-out Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendance.map((record, index) => (
                            <tr key={index}>
                                <td>{record.date}</td>
                                <td>{record.checkIn}</td>
                                <td>{record.checkOut}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const MemberProfile = () => {
    // بيانات تجريبية
    const member = {
        name: "Ahmed Ragab",
        email: "ahmed@example.com",
        phone: "+201234567890",
        joinDate: "2023-01-01",
    };

    const subscriptions = [
        { planName: "Monthly Plan", startDate: "2024-06-01", endDate: "2024-06-30", status: "Active" },
        { planName: "Weekly Plan", startDate: "2024-07-01", endDate: "2024-07-07", status: "Expired" },
    ];

    const attendance = [
        { date: "2024-06-01", checkIn: "08:00 AM", checkOut: "10:00 AM" },
        { date: "2024-06-02", checkIn: "08:30 AM", checkOut: "10:30 AM" },
    ];

    return (
        <div className="container mt-5">
            <ProfileInfo member={member} />
            <SubscriptionTable subscriptions={subscriptions} />
            <AttendanceTable attendance={attendance} />
        </div>
    );
};

export default MemberProfile;
