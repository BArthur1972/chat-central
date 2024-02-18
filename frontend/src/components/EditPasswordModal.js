import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';

import React from 'react'

function EditPasswordModal() {
    const [show, setShow] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Modal functions to show and hide the Modal
    const handleClose = () => {
        setPassword('');
        setConfirmPassword('');
        setShow(false);
    }
    const handleShow = () => setShow(true);

    return (
        <>
            <Button className='change_username_btn' onClick={handleShow}><svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: 'baseline' }} xmlns="http://www.w3.org/2000/svg">
                <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg></Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Change Your Password</Modal.Title>
                </Modal.Header>
                <Form>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="exampleFormControlInput1" className="form-label-1">New Password</Form.Label>
                            <Form.Control type="password" className="form-control" id="exampleFormControlInput1" placeholder="Enter New Password" onChange={(e) => { setPassword(e.target.value) }} value={password} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="exampleFormControlInput2" className="form-label-2">Confirm New Password</Form.Label>
                            <Form.Control type="password" className="form-control" id="exampleFormControlInput2" placeholder="Enter New Password Again" onChange={(e) => { setConfirmPassword(e.target.value) }} value={confirmPassword} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="btn btn-secondary" onClick={handleClose}>Close</Button>
                        <Button className="btn btn-primary" type='submit'>Save</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}

export default EditPasswordModal;