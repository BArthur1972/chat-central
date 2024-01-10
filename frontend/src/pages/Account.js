import { Container, Row, Col, Button } from 'react-bootstrap';
import './styles/Account.css';
import { useSelector } from 'react-redux';
import EditUsernameModal from '../components/EditUsernameModal';
import EditPasswordModal from '../components/EditPasswordModal';
import DeleteAccountModal from '../components/DeleteAccountModal';

function Account() {
	const user = useSelector((state) => state.user);

	return (
		<Container className='account_container'>
			<Row>
				<div className='account_header'>
					<h3 className='header'>Manage Your Account</h3>
				</div>
				<div className='divider_1'></div>
			</Row >
			<Row className='user_info'>
				<Col md={4} className='user_image_box'>
					<img
						alt=""
						src={"https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?q=80&w=3485&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
						style={{ width: 240, height: 250, borderRadius: "50%", objectFit: "cover", marginTop: 30 }}
					/>
					<Button className='change_profile_picture_btn'>Change Profile Picture</Button>
				</Col>
				<Col md={8}>
					<div className='user_info_box'>
						<div className='user_name_box'>
							<p className='user_name'>Your Username: {(user) !== null ? user.name : "N/A"}</p> <EditUsernameModal />
						</div>
						<div className='user_email_box'>
							<p className='user_email'>Your Email: {(user) !== null ? user.email : "N/A"}</p>
						</div>
						<div className='user_password_box'>
							<p className='user_password'>Your Password: **********</p> <EditPasswordModal />
						</div>
						<div className='delete_account'>
							<DeleteAccountModal />
						</div>
					</div>
				</Col>
			</Row>
		</Container>
	)
}

export default Account;