import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Row, Container, Modal  } from 'react-bootstrap';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import './css/genral.css';


const NewBilling = () => {
    const [isDiscountChecked, setIsDiscountChecked] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isPrivateCoachChecked, setIsPrivateCoachChecked] = useState(false);
    const [invoiceData, setInvoiceData] = useState(null);
    const [selectedPlanId, setSelectedPlanId] = useState('');
    const [selectedCoatchId, setSelectedCoatchId] = useState('');
    const [amount, setAmount] = useState('');
    const [days, setDays] = useState('');
    const [endDate, setEndDate] = useState('');
    const [discountData, setDiscountData] = useState(null);
    const [isDiscountExist, setIsDiscountExist] = useState("");
    const [hasDiscountExpired, setHasDiscountExpired] = useState("");
    const [discountValue, setDiscountValue] = useState('');
    const [allowOfUsing, setAllowOfUsing]= useState('');
    const [errorCode, setErrorCode]= useState('');
    

    const [showErrorModal, setShowErrorModal] = useState(false); 
    const [errorMessage, setErrorMessage] = useState(''); 

    const [showSuccessModal, setShowSuccessModal] = useState(false); 
    const [SuccessMessage, setSuccessMessage] = useState(''); 

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const memberId = queryParams.get('member'); 
    const userType = localStorage.getItem('userType');
    const token = localStorage.getItem('authToken');
    const uid = localStorage.getItem('userUID');
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

    const handleDiscountCheckboxChange = (event) => {
        setIsDiscountChecked(event.target.checked);
        setInputValue('');
        setIsDiscountExist('');
        setAllowOfUsing('');
        setErrorCode('')
        setDiscountValue('')
    };

    const handleInputChange = (event) => {
        const newValue = event.target.value;
        setInputValue(newValue);
    
        axios.get(`http://127.0.0.1:8000/Billing/discount/search/${newValue}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
                'X-CSRFToken': csrfToken,
            }
        })
        .then(response => {
            setDiscountData(response.data);
            
            setIsDiscountExist(true);
    
            const expiryDate = new Date(response.data.expierd_date);
            const formattedExpiryDate = format(expiryDate, 'dd MMM yyyy HH:mm:ss'); 
            const today = new Date();
            
            if (response.data && response.data.has_expierd) {
                setHasDiscountExpired(true);
                setErrorCode(true)
            } else if (response.data.expierd_date === null) {
                setHasDiscountExpired(false);
                setErrorCode(false)
            } else if(expiryDate < today){
                setHasDiscountExpired(true);
                setErrorCode(true)
            } else{
                setHasDiscountExpired(false);
                setErrorCode(false)
            }
            
            if (response.data && (response.data.allow_of_using === null || (response.data.allow_of_using - response.data.number_of_using) > 0)) {
                setAllowOfUsing(true);
                setErrorCode(false)
            }else{
                setAllowOfUsing(false);
                setErrorCode(true)
            }
            

            if(response.data && response.data.is_percentage){
                if(errorCode===true){
                    const value = (amount * response.data.value)/100
                    setDiscountValue(value);
                }
            }else{
                if(errorCode===true){
                    setDiscountValue(response.data.value);
                }
            }


            
        })
        .catch(error => {
            console.error('There was an error fetching the discount data!', error);
            setIsDiscountExist(false);
            setHasDiscountExpired(false);
            setErrorCode(true)
            setDiscountValue('')
        });
    };
    

    const handlePaste = (event) => {
        event.preventDefault();
        const pasteData = (event.clipboardData || window.clipboardData).getData('text');
        setInputValue(pasteData);
        handleInputChange({ target: { value: pasteData } });
    };

    const handlePrivateCoachCheckboxChange = (event) => {
        setIsPrivateCoachChecked(event.target.checked);
    };

    useEffect(() => {
        if (userType === 'Coach') {
            navigate('/');
        }
    }, [userType, navigate]);

    useEffect(() => {
        if (memberId && token && csrfToken) {
            const fetchInvoice = async () => {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/Billing/api/MemberBillingData/${memberId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Token ${token}`,
                            'X-CSRFToken': csrfToken
                        }
                    });
                    setInvoiceData(response.data);
                } catch (error) {
                    console.error('There was an error fetching the Invoice!', error);
                }
            };

            fetchInvoice();
        }
    }, [memberId, token, csrfToken]);

    useEffect(() => {
        if (selectedPlanId && invoiceData) {
            const selectedPlan = invoiceData.Plans.find(plan => plan.id === parseInt(selectedPlanId));
            if (selectedPlan) {
                setAmount(selectedPlan.cost);
                setDays(selectedPlan.period);

                const startDate = new Date(invoiceData.start_next_subscription_day);
                const calculatedEndDate = new Date(startDate);
                calculatedEndDate.setDate(startDate.getDate() + selectedPlan.period);
                setEndDate(calculatedEndDate.toISOString().split('T')[0]);
            }
        }
    }, [selectedPlanId, invoiceData]);

    const handleSubmit = (event) => {
        event.preventDefault();

        axios.post('http://127.0.0.1:8000/Billing/api/NewInvoice/', 
            {     
                "uid" : uid,
                "member_id":memberId,
                "selected_plan_id":selectedPlanId,
                "discount_Code":inputValue,
                "Coach_Id":selectedCoatchId,
            },{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
                'X-CSRFToken': csrfToken,
            }
          })
          .then(response => {
            if (response.data.message) {
                setSuccessMessage(response.data.message); 
                setShowSuccessModal(true); 
            }
          })
          .catch(error => {
            console.error('There was an error sending the activation request!', error);
            if (error.response && error.response.data && error.response.data.error) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('Something went wrong! Please try again.');
            }

            
            setShowErrorModal(true); 
        });
        
       
    };

    if (!token) {
        return <Navigate to="/login" />;
    }

    const handleCloseAndNavigate = () => {
        setShowSuccessModal(false); 
        navigate('/memebers');
    };

    return (
        <Container fluid="md">
            <h2 className="my-4">New Billing</h2>
            <Form onSubmit={handleSubmit}>
                <Row className="mb-3 border border-secondary p-3">
                    <Col md={6}>
                        <Form.Group controlId="memberName">
                            <Form.Label>Member Name</Form.Label>
                            <Form.Control 
                                as="select"
                                value={invoiceData ? memberId : ''} 
                                disabled 
                            >
                                <option>
                                    {invoiceData ? invoiceData.member_name : ''} 
                                </option>
                            </Form.Control>
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="startDate">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control 
                                type="date" 
                                value={invoiceData ? invoiceData.start_next_subscription_day : ''} 
                                disabled
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3 border border-secondary p-3">
                    <Col md={4}>
                        <Form.Group controlId="plan">
                            <Form.Label>Plan</Form.Label>
                            <Form.Control 
                                as="select" 
                                required 
                                value={selectedPlanId} 
                                onChange={e => setSelectedPlanId(e.target.value)}
                            >
                                <option value="">Select plan</option>
                                {invoiceData ? invoiceData.Plans.map(plan => (
                                    <option key={plan.id} value={plan.id}>
                                        {plan.name}
                                    </option>
                                )) : <option>Loading plans...</option>}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="amount">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control type="text" value={amount} required disabled />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="days">
                            <Form.Label>Days</Form.Label>
                            <Form.Control type="text" value={days} required disabled />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3 justify-content-around border border-secondary">
                    <Col md={5} className="p-3 m-1">
                        <Form.Check 
                            checked={isDiscountChecked}
                            onChange={handleDiscountCheckboxChange}
                            type="checkbox" 
                            label="Have discount" 
                            id="haveDiscount" 
                            className="mb-2" 
                        />
                        <Form.Control 
                            className={errorCode === true && inputValue !== "" ? "is-invalid" : errorCode === false ? "is-valid" : ""}
                            type="text" 
                            value={inputValue}
                            required={isDiscountChecked} 
                            onChange={handleInputChange}
                            onPaste={handlePaste}
                            disabled={!isDiscountChecked} 
                        />
                        {!isDiscountExist && isDiscountChecked && inputValue !== "" ? (
                            <div className="invalid-feedback">Not valid code</div>
                        ) : (
                            hasDiscountExpired ? (
                                <div className="invalid-feedback" >Expired data</div>
                            ) : (!allowOfUsing && allowOfUsing !== "" ?  (
                                <div className="invalid-feedback">Not allow to use it</div>
                            ) : <div>{discountValue}</div> )
                        )}
                    </Col>
                    <Col md={5} className="p-3 m-1">
                        <Form.Check 
                            type="checkbox" 
                            label="Have Private Coach" 
                            id="havePrivateCoach" 
                            className="mb-2"
                            checked={isPrivateCoachChecked}
                            onChange={handlePrivateCoachCheckboxChange}
                        />
                        <Form.Control 
                            as="select" 
                            disabled={!isPrivateCoachChecked} 
                            required={isPrivateCoachChecked}
                            value={selectedCoatchId}
                            onChange={e => setSelectedCoatchId(e.target.value)}
                            >
                                <option value="">Select Coach</option>
                                {isPrivateCoachChecked && invoiceData ? (
                                    invoiceData.Coachs.map(Coach => (
                                        <option key={Coach.id} value={Coach.id}>
                                            {Coach.name}
                                        </option>
                                    ))
                                ) : (
                                    <option>Loading Coach...</option>
                                )}
                        </Form.Control>
                    </Col>
                </Row>

                <Row className="mb-3 border border-secondary p-3">
                    <Col md={6}>
                        <Form.Group controlId="endDate">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control type="date" value={endDate} disabled />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="totalAmount">
                            <Form.Label>Total Amount</Form.Label>
                            <Form.Control type="text" disabled value={discountValue > 0 ? amount - discountValue : amount} />
                        </Form.Group>
                    </Col>
                </Row>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>


            <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>{errorMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>


            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>{SuccessMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAndNavigate}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>


        </Container>
    );
};

export default NewBilling;
