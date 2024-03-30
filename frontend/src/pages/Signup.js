import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './styles/Signup.css';
import { useSignupUserMutation } from "../services/appApi";
import { useNavigate } from 'react-router-dom';
import defaultProfilePic from "../assets/profile_placeholder.jpg";
import { AppContext } from '../context/appContext';

function Signup() {
    // States for storing user data
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [bio, setBio] = useState("");
    const [signupUser, { isLoading, error }] = useSignupUserMutation();
    const navigate = useNavigate();
    const { socket } = useContext(AppContext);

    // States for uploading and setting profile images
    const [image, setImage] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    function validateImage(e) {
        const file = e.target.files[0];

        // Check if image size is greater than 1mb
        if (file.size > 1048576) {
            return alert("Max file size is 1 MB");
        } else {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }

    async function uploadImage() {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "chat_app_uploaded_file");

        // Upload image to cloudinary api
        try {
            setUploadingImage(true);
            const cloudinary_cloud_name = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
            let res = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudinary_cloud_name}/upload`,
                {
                    method: "post",
                    body: data,
                }
            );

            const urlData = await res.json();
            setUploadingImage(false);
            return urlData.url;
        } catch (e) {
            setUploadingImage(false);
            console.log(e);
        }
    }

    async function handleSignup(e) {
        e.preventDefault();

        const url = await uploadImage(image);

        let newUser = {};

        if (bio === "") {
            newUser = { name, email, password, picture: url, bio: "Hey there! I am using ChatCentral" };
        } else {
            newUser = { name, email, password, picture: url, bio };
        }

        signupUser(newUser).then((data) => {
            if (data) {
                console.log(data);
                // save token to local storage
                localStorage.setItem('token', data.token);

                // Notify other users that there is a new user
                socket.emit('new-user');

                navigate('/chat');
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    return (
        <Container>
            <Row>
                <Col md={7} className="d-flex align-items-center justify-content-center flex-direction-column">
                    <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleSignup}>
                        <h1 className="text-center">Create An Account</h1>
                        <div className="signup-profile-pic__container">
                            <img
                                src={imagePreview || defaultProfilePic}
                                className="signup-profile-pic"
                                alt=""
                            />
                            <label htmlFor="image-upload" className="image-upload-label">
                                <i className="fas fa-plus-circle add-picture-icon"></i>
                            </label>
                            <input
                                type="file"
                                id="image-upload"
                                hidden
                                accept="image/png, image/jpeg"
                                onChange={validateImage}
                            />
                        </div>
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

                        <Form.Group className="mb-3" controlId="formBasicBio">
                            <Form.Label>Bio</Form.Label>
                            <Form.Control
                                as={"textarea"}
                                rows={3}
                                placeholder="Optional: Enter Your Bio"
                                onChange={(e) => setBio(e.target.value)}
                                value={bio}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            {isLoading ? <Spinner animation="grow" /> : "Sign Up"}
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