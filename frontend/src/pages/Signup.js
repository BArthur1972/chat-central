import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './styles/Signup.css';
import { useSignupUserMutation } from "../services/appApi";
import { useNavigate } from 'react-router-dom';

function Signup() {
    // States for storing user data
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signupUser, { isLoading, error }] = useSignupUserMutation();
    const navigate = useNavigate();

    async function handleSignup(e) {
        e.preventDefault();

        // TODO: Sign up the user
        if (password.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        } else {
            signupUser({ name, email, password }).then((data) => {
                if (data) {
                    console.log("User Signed Up successfully.");
                    navigate('/chat');
                }
            }).catch((err) => {
                console.log(err);
            });
        }}

        return (
            <Container>
                <Row>
                    <Col md={7} className="d-flex align-items-center justify-content-center flex-direction-column">
                        <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleSignup}>
                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Your Name"
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter Your Email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                />
                                <Form.Text className="text-muted">
                                    We'll never share your email with anyone else.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Sign Up
                            </Button>
                            <div className="py-4">
                                <p className="text-center">
                                    Already have an account? <Link to="/login">Login</Link>
                                </p>
                            </div>
                        </Form>
                    </Col>
                    <Col md={5} className="signup__bg"></Col>
                </Row>
            </Container>
        );
    }

    export default Signup;