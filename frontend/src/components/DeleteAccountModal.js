import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDeleteAccountMutation } from '../services/appApi';

import React from 'react'

function DeleteAccountModal() {
    const { user } = useSelector((state) => state.user);
    const [show, setShow] = useState(false);
    const [deleteAccount] = useDeleteAccountMutation();
    const navigate = useNavigate();

    // Modal functions to show and hide the Modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Delete account
    function handleDelete(e) {
        e.preventDefault();

        deleteAccount(user._id).then((data) => {
            if (data && !data.error) {
                console.log("Account deleted successfully.");
                // Redirect to login page
                navigate('/login', { replace: true });
            }
            else {
                alert("Account Deletion Failed.");
                console.log(data.error);
            }

            setShow(false);
        });
    }

    return (
        <>
            <Button variant='danger' onClick={handleShow} style={{ marginTop: 20, width: '40%', justifyContent: 'center' }}>Delete Account</Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Remove Your Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete your account?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn btn-secondary" onClick={handleClose}>No</Button>
                    <Button className="btn btn-primary" onClick={handleDelete}>Yes, Delete</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default DeleteAccountModal;