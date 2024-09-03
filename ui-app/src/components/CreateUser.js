import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, Modal } from 'react-bootstrap';
import './css/SetNewPasswordForm.css'; // استيراد ملف CSS المخصص

const SetNewPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const {  userType,uid,token } = useParams(); // استخراج token و uid من معلمات URL
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      // التحقق من تطابق كلمتي المرور
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/users/api/createuser/', {
        uid,
        token,
        userType,
        password,
        
      });

      setShowModal(true); // عرض النافذة المنبثقة
    } catch (error) {
      // معالجة الأخطاء
      console.error('Error setting new password:', error);
      // يمكنك عرض رسالة خطأ للمستخدم هنا
    }
  };

  const handleClose = () => {
    setShowModal(false);
    navigate('/login'); // إعادة التوجيه إلى صفحة تسجيل الدخول عند إغلاق النافذة
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col md={{ span: 4, offset: 4 }}>
          <Card className="p-4 shadow-lg rounded-3d">
            <h2 className="text-center mb-4">Create user</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formNewPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formConfirmPassword" className="mt-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100 mt-3">
                Creat Your password User
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>User Has Created </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SetNewPasswordForm;
