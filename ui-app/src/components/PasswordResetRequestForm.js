import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Card, Modal } from 'react-bootstrap';
import './css/PasswordResetRequestForm.css'; // استيراد ملف CSS المخصص

const PasswordResetRequestForm = () => {
  const [email, setEmail] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/users/api/PasswordResetRequest/', { email });
      setShowPopup(true); // إظهار النافذة المنبثقة
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => setShowPopup(false); // إغلاق النافذة المنبثقة

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col md={{ span: 4, offset: 4 }}>
          <Card className="p-4 shadow-lg rounded-3d">
            <h2 className="text-center mb-4">Password Reset</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mt-3">
                Request Password Reset
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* النافذة المنبثقة */}
      <Modal show={showPopup} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Check your Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          An email has been sent to your email address. Please check your inbox.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PasswordResetRequestForm;
