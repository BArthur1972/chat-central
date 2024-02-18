import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';

import React from 'react'

function DeleteAccountModal() {
    const [show, setShow] = useState(false);

    // Modal functions to show and hide the Modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
                    <Button className="btn btn-primary">Yes, Delete</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default DeleteAccountModal;