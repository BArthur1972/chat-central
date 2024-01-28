import React from 'react';
import { Container, Nav, Navbar, NavDropdown, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import logo from '../assets/logo.png';
import { useSelector } from 'react-redux';
import { useLogoutUserMutation } from '../services/appApi';
import defaultProfilePic from '../assets/profile_placeholder.jpg';

function Navigation() {
	const user = useSelector((state) => state.user);
	const [logoutUser] = useLogoutUserMutation();

	async function handleLogout(e) {
		e.preventDefault();

		await logoutUser(user);

		// Go back to login page
		window.location.replace("/");
	}

	return (
		<Navbar bg="light" expand="lg">
			<Container>
				<LinkContainer to="/">
					<Navbar.Brand>
						<img src={logo} alt="" style={{ width: 50, height: 50 }} />
					</Navbar.Brand>
				</LinkContainer>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ms-auto">
						{!user && (
							<LinkContainer to="/login">
								<Nav.Link>Login</Nav.Link>
							</LinkContainer>
						)}
						<LinkContainer to="/chat">
							<Nav.Link>Chat</Nav.Link>
						</LinkContainer>
						{user && (
							<NavDropdown title={
								<>
									<img
										src={user.picture || defaultProfilePic}
										alt=""
										style={{ width: 30, height: 30, marginRight: 10, borderRadius: "50%", objectFit: "cover" }}
									/>
									<span className="ms-2">{user.name}</span>
								</>
							} id="basic-nav-dropdown">
								<NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
								<NavDropdown.Item href="#action/3.2">
									Another action
								</NavDropdown.Item>
								<NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
								<NavDropdown.Divider />
								<NavDropdown.Item href="#action/3.4">
									<Button variant="danger" onClick={handleLogout}>Logout</Button>
								</NavDropdown.Item>
							</NavDropdown>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default Navigation;