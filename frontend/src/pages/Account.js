import { Container, Row, Col, Button } from 'react-bootstrap';
import './styles/Account.css';
import { useSelector } from 'react-redux';
import defaultProfilePic from '../assets/profile_placeholder.jpg';
import EditUsernameModal from '../components/EditUsernameModal';
import EditPasswordModal from '../components/EditPasswordModal';
import EditBioModal from '../components/EditBioModal';
import DeleteAccountModal from '../components/DeleteAccountModal';

function Account() {
    const user = useSelector((state) => state.user);

    function getFormattedDateJoined(date) {
        const lastSeenDate = new Date(date);
        return lastSeenDate.toLocaleString('default', { month: 'long' }) + " " + lastSeenDate.getFullYear();
    }

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
                        src={user?.picture || defaultProfilePic}
                        style={{ width: 240, height: 250, borderRadius: "50%", objectFit: "cover", marginTop: 30 }}
                    />
                    <Button className='change_profile_picture_btn'>Change Profile Picture</Button>
                </Col>
                <Col md={8}>
                    <div className='user_info_box'>
                        <div className='user_name_box'>
                            <p className='user_name'>Username: {(user) !== null ? user.name : "N/A"}</p>
                            <EditUsernameModal />
                        </div>
                        <div className='user_email_box'>
                            <p className='user_email'>Email: {(user) !== null ? user.email : "N/A"}</p>
                        </div>
                        <div className='user_bio_box'>
                            <p className='user_bio'>Bio: {(user) !== null ? user.bio : "N/A"}</p>
                            <EditBioModal />
                        </div>
                        <div className='user_password_box'>
                            <p className='user_password'>Password: **********</p>
                            <EditPasswordModal />
                        </div>
                        <div className='user_date_joined_box'>
                            <p className='user_date_joined'>Member since {(user) !== null ? getFormattedDateJoined(user.dateJoined) : "N/A"}</p>
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