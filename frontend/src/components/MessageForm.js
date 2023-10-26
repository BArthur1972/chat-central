import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/appContext';
import './styles/MessageForm.css';

function MessageForm() {
	const [message, setMessage] = useState("");
	const user = useSelector((state) => state.user);
	const { socket, currentChannel, setMessages, messages, privateMemberMessage } = useContext(AppContext);

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

	// Listen for messages from the server and update the state with the new messages
	useEffect(() => {
		socket.off('channel-messages').on('channel-messages', (channelMessages) => {
			setMessages(channelMessages);
		});
	}, [socket, setMessages]);

	function handleSubmit(e) {
		e.preventDefault();

		// Check if the message is empty, so we don't send empty messages to the server
		if (!message) return;

		const today = new Date();
		const minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
		const unit = today.getHours() >= 12 ? "PM" : "AM";
		const time = `${today.getHours()}:${minutes} ${unit}`;

		const roomId = currentChannel;

		// Send message to the server
		socket.emit("message-channel", roomId, message, user, time, todayDate);

		// Reset the message input to an empty string
		setMessage("");
	}

	return (
		<>
			<div className="messages-output">
				{!user && <div className='alert alert-danger'>Please Login</div>}

				{user &&
					messages.map(({ _id: date, messagesByDate }, idx) => (
						<div key={idx}>
							<p className="alert alert-info text-center message-date-indicator">{date}</p>
							{messagesByDate?.map(({ content, time, from: sender }, msgIdx) => (
								<div className={sender?.email === user?.email ? "message" : "incoming-message"} key={msgIdx}>
									<div className="message-inner">
										<div className="d-flex align-items-center mb-3">
											{/* TODO: Add user profile picture */}
											<p className="message-sender">{sender._id === user?._id ? "You" : sender.name}</p>
										</div>
										<p className="message-content">{content}</p>
										{/* TODO: Add time for each message */}
									</div>
								</div>
							))}
						</div>
					))}

			</div>
			<Form onSubmit={handleSubmit}>
				<Row className='input-box'>
					<Col md={11}>
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
		</>
	);
}

export default MessageForm;