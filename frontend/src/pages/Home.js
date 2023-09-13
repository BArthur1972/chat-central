import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Button } from 'react-bootstrap';
import './styles/Home.css';

function Home() {
	return (
		<Row>
			< Col md={6} className="d-flex flex-direction-column align-items-center justify-content-center">
				<div>
					<h1 style={{ padding: 20, fontSize: 32 }}>Stay connected with your Computer Science club members and friends in the Fisk Computer Science community.</h1>
					<p style={{ padding: 20, fontSize: 18 }}>This Chat App lets you connect with CS students all over Fisk University!</p>
					<LinkContainer to="/chat">
						<Button variant='success'>
							Get Started <i className='fas fa-comments home-message-icon'>
							</i>
						</Button>
					</LinkContainer>
				</div>
			</Col>
			<Col md={6} className="home__bg"></Col>
		</Row>
	);
}

export default Home;