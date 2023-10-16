import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import './styles/MessageForm.css';

function MessageForm() {

	function handleSubmit(e) {
		e.preventDefault();
	}

	const user = useSelector((state) => state.user);

	return (
		<>
			<div className="messages-output">
				{!user && <div className='alert alert-danger'>Please Login</div>}
			</div>
			<Form onSubmit={handleSubmit}>
				<Row className='input-box d-flex justify-content-between'>
					<Col md={11}>
						<Form.Group>
							<Form.Control type="text" placeholder="Your message" disabled={!user}></Form.Control>
						</Form.Group>
					</Col>
					<Col md={1} className="ml-1 send-btn">
						<Button className='send-btn' variant="primary" type="submit" style={{ backgroundColor: "orange" }} disabled={!user}>
							<i className="fas fa-paper-plane"></i>
						</Button>
					</Col>
				</Row>
			</Form>
		</>
	);
}

export default MessageForm;