import React from 'react';
import { Container, Nav, Navbar, NavDropdown, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import logo from '../assets/logo.png';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutUserMutation } from '../services/appApi';
import defaultProfilePic from '../assets/profile_placeholder.jpg';
import './styles/Navigation.css';

function Navigation() {
	const navigate = useNavigate();
	const { user } = useSelector((state) => state.user);
	const [logoutUser] = useLogoutUserMutation();

	async function handleLogout(e) {
		e.preventDefault();

		await logoutUser(user);
		
		// Remove token from local storage
		localStorage.removeItem('token');

		// Go back to login page
		navigate("/login", { replace: true });
	}

	function goToAccountSettings(e) {
		e.preventDefault();

		// Go to account settings page
		navigate('/account');
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
									{user.status === "online" ? <i className="fas fa-circle navigation-online-status"></i> : <i className="fas fa-circle navigation-offline-status"></i>}
									<img
										src={user.picture || defaultProfilePic}
										alt=""
										className='user-profile-image'
									/>
									<span className="ms-2">{user.name}</span>
								</>
							} id="basic-nav-dropdown">
								<NavDropdown.Item href="#action/3.1" onClick={goToAccountSettings}>My Account</NavDropdown.Item>
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