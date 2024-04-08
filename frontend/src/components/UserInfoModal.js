import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useState } from 'react';
import defaultProfilePic from '../assets/profile_placeholder.jpg';
import './styles/UserInfoModal.css';

function UserInfoModal({ userObject, from }) {
    const [show, setShow] = useState(false);

    function calculateLastSeen(lastSeen) {
        const lastSeenDate = new Date(lastSeen);
        const currentDate = new Date();
        const diff = currentDate - lastSeenDate;
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) {
            return "Just Now";
        } else if (minutes < 60) {
            return minutes + "m";
        } else if (minutes < 1440) {
            return Math.floor(minutes / 60) + "h";
        } else {
            return lastSeenDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric' });
        }
    }

    function getFormattedDateJoined(date) {
        const lastSeenDate = new Date(date);
        return lastSeenDate.toLocaleString('default', { month: 'long' }) + " " + lastSeenDate.getFullYear();
    }

    // Modal functions to show and hide the Modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            { // Display the user profile picture based on the component it is called from
                (from === "Sidebar") ? <img src={userObject.picture || defaultProfilePic} alt="" className="member-status-img" onClick={handleShow} />
                    : (from === "MessageForm") ? <img src={userObject.picture || defaultProfilePic} alt="" className="message-profile-image" onClick={handleShow} />
                        : (from === "ChatLabel") ? <img src={userObject.picture || defaultProfilePic} alt="" className="conversation-profile-pic" onClick={handleShow} />
                            : null
            }

            <Modal
                show={show}
                onHide={handleClose}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>User Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="user-info-modal">
                        <img src={userObject.picture || defaultProfilePic} alt="" className="user-info-modal-img"></img>
                        <h3>{userObject.name}</h3>
                        <p>{userObject.email}</p>
                        <p>{userObject.bio}</p>
                        <p>{userObject.status === "offline" ? "Last Seen: " + calculateLastSeen(userObject.lastSeenDatetime) : "Online"}</p>
                        <p>{"Member since " + getFormattedDateJoined(userObject.dateJoined)}</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn btn-primary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default UserInfoModal;