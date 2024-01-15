import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/appContext';
import ChatLabel from './ChatLabel';
import './styles/MessageForm.css';

function MessageForm() {
	const [message, setMessage] = useState("");
	const [selectedFile, setSelectedFile] = useState(null);
	const [showFileUploadBox, setShowFileUploadBox] = useState(false);
	const [uploadingImage, setUploadingImage] = useState(false);

	const user = useSelector((state) => state.user);
	const { socket, currentChannel, setMessages, messages, privateMemberMessage } = useContext(AppContext);

	async function validateFile(e) {
		const file = e.target.files[0];

		// Check if image size is greater than 3mb
		if (file.size > 3145728) {
			return alert("Max file size is 3 MB");
		} else {
			setSelectedFile(file);
		}
	}

	async function uploadImage() {
		const data = new FormData();
		data.append("file", selectedFile);
		data.append("upload_preset", "chat_app_uploaded_image");

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

	// Listen for messages from the server and update the state with the new messages
	useEffect(() => {
		socket.off('channel-messages').on('channel-messages', (channelMessages) => {
			setMessages(channelMessages);
		});
	}, [socket, setMessages]);

	function getFormattedDate() {
		const date = new Date();
		const year = date.getFullYear();
		let month = (1 + date.getMonth()).toString();

		month = month.length > 1 ? month : "0" + month;
		let day = date.getDate().toString();

		day = day.length > 1 ? day : "0" + day;

		return month + "/" + day + "/" + year;
	}

	const todayDate = getFormattedDate();

	async function handleSubmit(e) {
		e.preventDefault();

		// Check if the message and imagePreview is empty, so we don't send empty messages to the server
		if (!message && !selectedFile) {
			return;
		}

		const today = new Date();
		const minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
		const unit = today.getHours() >= 12 ? "PM" : "AM";
		const time = `${today.getHours()}:${minutes} ${unit}`;

		const roomId = currentChannel;
		
		if (!selectedFile) { // Send message to the server with image
			socket.emit("message-channel", roomId, message, user, time, todayDate);
			

		} else { // Send message to the server without image		
			const imageUrl = await uploadImage();
			console.log("Image url: ", imageUrl);
			socket.emit("message-channel-image", roomId, message, user, time, todayDate, imageUrl);
		}

		// Reset the message input to an empty string
		setMessage("");
		setSelectedFile(null);
		setShowFileUploadBox(false);
	}

	const toggleMediaUploadBox = () => {
		if (showFileUploadBox) {
			setShowFileUploadBox(false);
		} else {
			setShowFileUploadBox(true);
		}
	}

	return (
		<>
			<div className="messages-output">
				{<ChatLabel userObject={user} privateMemberMsg={privateMemberMessage} currChannel={currentChannel} />}

				{!user && <div className='alert alert-danger'>Please Login</div>}

				{user &&
					messages.map(({ _id: date, messagesByDate }, idx) => (
						<div key={idx}>
							<p className="alert alert-info text-center message-date-indicator">{date}</p>
							{messagesByDate?.map(({ content, time, from: sender, fileUrl }, msgIdx) => (
								<div className={sender?.email === user?.email ? "message" : "incoming-message"} key={msgIdx}>
									<div className="message-inner">
										<div className="d-flex align-items-center mb-3">
											{/* TODO: Add user profile picture */}
											<p className="message-sender">{sender._id === user?._id ? "You" : sender.name}</p>
										</div>
										{fileUrl && <img src={fileUrl} alt="message" className="message-image" />}
										<p className="message-content">{content}</p>
										<p className="message-timestamp-left">{time}</p>
									</div>
								</div>
							))}
						</div>
					))}

			</div>
			<div className="input">
				<Form onSubmit={handleSubmit} className='form'>
					<Row className='input-box'>
						<Col md={10}>
							<Form.Group>
								<Form.Control type="text" placeholder="Your message" disabled={!user} value={message} onChange={(e) => setMessage(e.target.value)}></Form.Control>
							</Form.Group>
						</Col>
						<Col md={1}>
							<Button variant="primary" type="submit" style={{ backgroundColor: "orange" }} disabled={!user}>
								<i className="fas fa-paper-plane"></i>
							</Button>
						</Col>
					</Row>
				</Form>
				<Button className="toggleMediaUploadBtn" variant="primary" type="submit" onClick={toggleMediaUploadBox} style={{ backgroundColor: "grey" }} disabled={!user}> <i className="fas fa-photo-film"></i></Button>
				{showFileUploadBox && <Row className='media-upload'>
					<Col>
						<input type="file" disabled={!user} accept='image/png, image/jpeg' onChange={validateFile}></input>
					</Col>
				</Row>}
			</div>
		</>
	);
}

export default MessageForm;