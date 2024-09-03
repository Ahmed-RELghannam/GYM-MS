import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Static data
const user = {
    name: 'John Doe',
    phoneNumber: '+1234567890',
    email: 'john.doe@example.com',
    natId: 'A123456789',
    address: '123 Main Street, Hometown, USA',
    createDate: '2023-01-15',
};

const UserProfile = () => {
    const avatarInitial = user.name.charAt(0).toUpperCase();

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow-sm rounded">
                        <Card.Body className="text-center">
                            <div
                                className="avatar rounded-circle mx-auto mb-3"
                                style={{
                                    width: '120px',
                                    height: '120px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#007bff',
                                    color: '#fff',
                                    fontSize: '2.5rem',
                                    fontWeight: 'bold',
                                }}
                            >
                                {avatarInitial}
                            </div>
                            <Card.Title className="mb-3 text-primary">{user.name}</Card.Title>
                            <Card.Text>
                                <strong>Phone:</strong> {user.phoneNumber}
                            </Card.Text>
                            <Card.Text>
                                <strong>Email Address:</strong> {user.email}
                            </Card.Text>
                            <Card.Text>
                                <strong>National ID:</strong> {user.natId}
                            </Card.Text>
                            <Card.Text>
                                <strong>Address:</strong> {user.address}
                            </Card.Text>
                            <Card.Text>
                                <strong>Create Date:</strong> {new Date(user.createDate).toLocaleDateString('en-US')}
                            </Card.Text>
                            <div className="d-flex justify-content-between mt-4">
                                <Button 
                                    variant="primary" 
                                    onClick={() => alert('Edit profile clicked!')}
                                    className="me-2"
                                >
                                    Edit Profile
                                </Button>
                                <Button 
                                    variant="secondary" 
                                    onClick={() => alert('Change password clicked!')}
                                >
                                    Change Password
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UserProfile;
