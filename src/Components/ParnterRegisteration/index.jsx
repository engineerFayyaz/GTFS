import React, { useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import {addDoc, getFirestore, collection, setDoc, doc} from "firebase/firestore"
import { toast, ToastContainer } from "react-toastify";
import "./partnerregistrationform.css"
import { Toast } from "bootstrap";
export const PartnerRegister = () => {
    const db = getFirestore();
  const [partnerInfo, setPartnerInfo] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    website: "",
    gtfsFiles: null,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPartnerInfo({
      ...partnerInfo,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPartnerInfo({
      ...partnerInfo,
      gtfsFiles: file,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await setDoc(doc(db, "Par"), {
           partnerInfo
          });
      toast.success('Partner registration successful!');
    } catch (error) {
      console.error('Error registering partner:', error);
      alert('An error occurred. Please try again.');
    }
  };
  return (
    <>
    <ToastContainer />
     <div className="row mb-5 justify-content-center">
            <div className="col-lg-6 text-center">
              <h2 className="section-title text-center mb-3">Become a Partner</h2>
            </div>
          </div>
      <Container className="partner_registration_form">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="companyName">
                <Form.Label>Company Name</Form.Label>
                <Form.Control
                  type="text"
                  name="companyName"
                  value={partnerInfo.companyName}
                  onChange={handleChange}
                  placeholder="company name"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="contactPerson">
                <Form.Label>Contact Person</Form.Label>
                <Form.Control
                  type="text"
                  name="contactPerson"
                  value={partnerInfo.contactPerson}
                  onChange={handleChange}
                  placeholder=" contact person "
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={partnerInfo.email}
                  onChange={handleChange}
                  required
                  placeholder=" Email address"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="text"
                //   value={partnerInfo.email}
                //   onChange={handleChange}
                  required
                  placeholder="address"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="phone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={partnerInfo.phone}
                  onChange={handleChange}
                  required
                  placeholder=" phone"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="website">
                <Form.Label>Website</Form.Label>
                <Form.Control
                  type="url"
                  name="website"
                  value={partnerInfo.website}
                  onChange={handleChange}
                  required
                  placeholder=" website"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="website">
                <Form.Label>Registration Number</Form.Label>
                <Form.Control
                  type="text"
                  name="registrationNumber"
                //   value={partnerInfo.website}
                //   onChange={handleChange}
                  required
                  placeholder=" registration Number"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="gtfsFiles">
                <Form.Label>Upload GTFS Files</Form.Label>
                <Form.Control
                  type="file"
                  name="gtfsFiles"
                  onChange={handleFileChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
            <Col variant= "12" className="text-right p-0" >
            <Button variant="primary" type="submit" >
            Apply Now
          </Button>
            </Col>
          
        </Form>
      </Container>
    </>
  );
};
