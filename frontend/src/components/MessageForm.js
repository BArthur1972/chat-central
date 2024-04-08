import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '../context/appContext';
import ChatLabel from './ChatLabel';
import './styles/MessageForm.css';
import UserInfoModal from './UserInfoModal';
import FileUploadModal from './FileUploadModal';

// MediaRecorder API for recording audio
let mediaRecorder;

function MessageForm() {
	const [message, setMessage] = useState("");
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [uploadingFile, setUploadingFile] = useState(false);
	const [recordingAudio, setRecordingAudio] = useState(false);
	const [audioBlob, setAudioBlob] = useState(null);

	const user = useSelector((state) => state.user);
  
	const { socket, currentChannel, setMessages, messages, privateMemberMessage } = useContext(AppContext);
	const messageEndRef = useRef(null);

	const [message, setMessage] = useState("");
	const [showFileUploadBox, setShowFileUploadBox] = useState(false);
	const [uploadingImage, setUploadingImage] = useState(false);

	const startRecording = () => {
		setRecordingAudio(true);
		navigator.mediaDevices.getUserMedia({ audio: true })
			.then(stream => {
				mediaRecorder = new MediaRecorder(stream);
				mediaRecorder.start();

				mediaRecorder.addEventListener("start", () => {
					console.log("Recording started, mediaRecorder state: ", mediaRecorder.state);
				});

				const audioChunks = [];
				mediaRecorder.addEventListener("dataavailable", event => {
					audioChunks.push(event.data);
				});

				mediaRecorder.addEventListener("stop", () => {
					console.log("Recording stopped, mediaRecorder state: ", mediaRecorder.state);
					const audioBlob = new Blob(audioChunks, { type: "audio/wav" }); // Convert the audio chunks to a blob
					setAudioBlob(audioBlob);
					setSelectedFiles(prevSelectedFiles => [...prevSelectedFiles, audioBlob]); // Add the audio blob to the selected files array
					stream.getTracks().forEach(track => track.stop()); // Stop the audio stream after recording
				});
			});
	}

	const stopRecording = () => {
		mediaRecorder.stop();
		setRecordingAudio(false);
		setAudioBlob(null);
	}

	async function uploadFiles() {
		const uploadPromises = selectedFiles.map(file => {
			const data = new FormData();
			data.append("file", file);
			data.append("upload_preset", "chat_app_uploaded_file");

			// Upload file to cloudinary using the cloudinary API
			const cloudinary_cloud_name = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
			return fetch(
				`https://api.cloudinary.com/v1_1/${cloudinary_cloud_name}/upload`,
				{
					method: "post",
					body: data,
				}).then(res => res.json());
		});

		try {
			setUploadingFile(true);
			const results = await Promise.all(uploadPromises);
			setUploadingFile(false);
			return results.map(result => result.url);
		} catch (e) {
			setUploadingFile(false);
			console.log(e);
		}
	}
	// Listen for messages from the server and update the state with the new messages
	useEffect(() => {
		socket.off('channel-messages').on('channel-messages', (channelMessages) => {
			setMessages(channelMessages);
		});
	}, [socket, setMessages]);

	// Scroll to the bottom of the messages container when a new message is sent or received
	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	function scrollToBottom() {
		messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}

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

	function getTime() {
		const today = new Date();
		const minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
		const unit = today.getHours() >= 12 ? "PM" : "AM";
		const time = `${today.getHours()}:${minutes} ${unit}`;
		return time;
	}

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

		// Check if the message and selectedFile is empty, so we don't send empty messages to the server
		if (!message && selectedFiles.length === 0) {
			return;
		}

		const time = getTime();
		const date = getFormattedDate();

		const roomId = currentChannel;

		if (selectedFiles.length === 0) { // Send message to the server without any files
			socket.emit("message-channel", roomId, message, user, time, todayDate);

		} else if (message && selectedFiles.length > 1) { // Send message to the server with multiple files first then send the message
			// Send the message to the server first
			socket.emit("message-channel", roomId, message, user, time, todayDate);
			const fileUrls = await uploadFiles();
			// Then send the files
			fileUrls.forEach(fileUrl => {
				socket.emit("message-channel-file", roomId, "", user, time, todayDate, fileUrl);
				console.log("File url: ", fileUrl);
			});
		} else { // If its a single file, send the message to the server with the file
			const fileUrls = await uploadFiles();
			fileUrls.forEach(fileUrl => {
				socket.emit("message-channel-file", roomId, message, user, time, todayDate, fileUrl);
				console.log("File url: ", fileUrl);
			});
		}

		setMessage("");
		setSelectedFiles([]);
	}

	// Check if the file url is an image file
	function isImage(url) {
		return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
	}

	// Check if the file url is an audio file
	function isAudio(url) {
		return url.match(/\.(mp3|wav|webm)$/) != null;
	}

	// Check if the file url is a video file
	function isVideo(url) {
		return url.match(/\.(mp4|avi|mov)$/) != null;
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
											<UserInfoModal userObject={sender} from={"MessageForm"} />
											<p className="message-sender">{sender._id === user?._id ? "You" : sender.name}</p>
										</div>
										{fileUrl &&
											<>
												{isImage(fileUrl) && <img src={fileUrl} style={{ maxHeight: "300px", maxWidth: "400px" }} alt="message" className="message-image" />}
												{isAudio(fileUrl) && <audio className='message-audio' controls><source src={fileUrl} /></audio>}
												{isVideo(fileUrl) && <video className='message-video' style={{ maxHeight: "300px", maxWidth: "400px" }} controls><source src={fileUrl} /></video>}
											</>
										}
										<p className="message-content">{content}</p>
										<p className="message-timestamp-left">{time}</p>
									</div>
								</div>
							))}
						</div>
					))}
				<div ref={messageEndRef} />
			</div>
			{selectedFiles.length > 0 &&
				(<div className='selected-file-label'>
					<p className='selected-files-text'>Selected file(s): {selectedFiles.map(file => file.name).join(', ') || "Recorded " + selectedFiles[0].type + " file"}</p>
					<Button variant='danger' className='clear-selected-files-btn' onClick={() => setSelectedFiles([])} disabled={selectedFiles.length === 0}>Clear</Button>
				</div>)}
			<div className="input">
				<Form onSubmit={handleSubmit} className='form'>
					<Row className='input-box'>
						<Col md={10}>
							<Form.Group>
								<Form.Control id='text-box' type="text" placeholder="Your message" disabled={!user} value={message} onChange={(e) => setMessage(e.target.value)}></Form.Control>
							</Form.Group>
						</Col>
						<Col md={1}>
							<Button variant="primary" type="submit" style={{ backgroundColor: "orange" }} disabled={!user}>
								<i className="fas fa-paper-plane"></i>
							</Button>
						</Col>
					</Row>
				</Form>
				<Button disabled={!user}><i onClick={startRecording} className={recordingAudio ? "fa-solid fa-microphone-lines fa-fade" : "fa-solid fa-microphone-lines"}></i></Button>
				{recordingAudio &&
					<Button onClick={stopRecording} style={{ backgroundColor: "red" }} disabled={!user}><i className="fa-solid fa-close"></i></Button>}
				<FileUploadModal selectedMedia={selectedFiles} setSelectedMedia={setSelectedFiles} />
			</div>
		</>
	);
}

export default MessageForm;