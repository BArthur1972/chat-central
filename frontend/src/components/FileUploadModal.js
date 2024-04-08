import React from 'react'
import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';

function FileUploadModal(props) {
    const user = useSelector((state) => state.user);
    const [show, setShow] = useState(false);
    const [uploadingFile, setUploadingFile] = useState(false);

    async function validateFiles(e) {
        setUploadingFile(true);
        const files = e.target.files;
        const selectedFiles = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.size > 36700160) { // reset the file input if the file size is too large
                e.target.value = null;
                setUploadingFile(false);
                return alert("Max file size is 35 MB");
            } else {
                selectedFiles.push(file);
            }
        }
        props.setSelectedMedia(selectedFiles); // Set the selected files in the parent component (MessageForm)
        setUploadingFile(false);
        console.log(selectedFiles);
    }

    // Modal functions to show and hide the Modal
    const handleClose = () => {
        props.setSelectedMedia([]);
        setShow(false);
    };
    const handleShow = () => setShow(true);

    // Handle the form submission to upload
    const handleSubmit = (e) => {
        e.preventDefault();
        if (props.selectedMedia.length === 0) {
            alert("Please select a file to upload");
        } else {
            setShow(false);
        }
    }

    return (
        <>
            <Button className="toggleMediaUploadBtn" variant="primary" onClick={handleShow} disabled={!user}> <i className={uploadingFile ? "fa-solid fa-cog fa-spin" : "fa-solid fa-photo-film"}></i></Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header>
                    <Modal.Title>Select Media File(s)</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Upload File(s) (Max. 35MB each)</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={validateFiles}
                                accept='image/png, image/jpg, image/jpeg, image/gif, audio/mp3, audio/webm, audio/wav, video/mp4, video/avi, video/mov'
                                multiple
                            />
                        </Form.Group>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Button variant="primary" type="submit" disabled={uploadingFile}>
                                {uploadingFile ? "Uploading..." : "Upload"}
                            </Button>
                            <Button variant="danger" onClick={handleClose} disabled={uploadingFile}>Cancel</Button>
                        </div>

                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default FileUploadModal;