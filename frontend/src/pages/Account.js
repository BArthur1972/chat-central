import { Container, Row, Col } from 'react-bootstrap';
import './styles/Account.css';
import { useSelector } from 'react-redux';
import EditUsernameModal from '../components/EditUsernameModal';
import EditPasswordModal from '../components/EditPasswordModal';
import DeleteAccountModal from '../components/DeleteAccountModal';
import ChangeProfilePictureModal from '../components/ChangeProfilePictureModal';

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
						src={(user) !== null ? user.picture : "N/A"}
						style={{ width: 240, height: 250, borderRadius: "50%", objectFit: "cover", marginTop: 30 }}
					/>
					<div className='change_profile_picture'>
						<ChangeProfilePictureModal />
					</div>
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