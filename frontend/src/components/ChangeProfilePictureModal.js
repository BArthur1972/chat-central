import React from 'react'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, Form } from 'react-bootstrap';
import { useUpdatePictureMutation } from '../services/appApi';

function ChangeProfilePictureModal() {
    const user = useSelector((state) => state.user);
    const [show, setShow] = useState(false);

    const [updatePicture] = useUpdatePictureMutation();
    const [image, setImage] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    function validateImage(e) {
        const file = e.target.files[0];

        // Check if image size is greater than 3mb
        if (file.size > 3145728) {
            return alert("Max file size is 1 MB");
        } else {
            setImage(file);
        }
    }

    async function uploadImage() {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "chat_app_uploaded_image");

        // Upload image to cloudinary
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

    async function changeProfilePicture(e) {
        e.preventDefault();

        const url = await uploadImage();

        // Update the user's profile picture
        updatePicture({ id: user._id, newPicture: url }).then((data) => {
            if (data && !data.error) {
                alert("Profile picture updated successfully.");
            }
            else {
                alert("Update Failed.");
                console.log(data.error);
            }
        });
        handleClose();
    }

    // Modal functions to show and hide the Modal
    const handleClose = () => {
        setImage(null);
        setShow(false);
    };
    const handleShow = () => setShow(true);

    return (
        <>
            <Button className='change_profile_picture_btn' onClick={handleShow} style={{ marginTop: 20 }}> Change Profile Picture </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Update Profile Picture</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={changeProfilePicture}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Upload Image</Form.Label>
                            <Form.Control type="file" onChange={validateImage} />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={uploadingImage}>
                            {uploadingImage ? "Updating..." : "Update"}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ChangeProfilePictureModal;