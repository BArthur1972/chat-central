import React, { useContext, useState, useEffect } from 'react';
import { ListGroup, Form, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppContext } from '../context/appContext';
import { addNotifications, resetNotifications } from '../features/userSlice';
import './styles/Sidebar.css';
import UserInfoModal from './UserInfoModal';
import { useGetChannelsMutation } from '../services/appApi';

function Sidebar() {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const { socket, setMembers, members, setCurrentChannel, setChannels, privateMemberMessage, channels, setPrivateMemberMessage, currentChannel } = useContext(AppContext);
    const [getChannels] = useGetChannelsMutation();
    const [searchChannels, setSearchChannels] = useState('');
    const [searchMembers, setSearchMembers] = useState('');

    // Filter channels based on search input
    const filteredChannels = channels.filter(channel =>
        channel.toLowerCase().includes(searchChannels.toLowerCase())
    );

    // Filter members based on search input
    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchMembers.toLowerCase())
    );

    function joinChannel(channel, isPublic = true) {
        if (!user) {
            return alert("Please login");
        }
        socket.emit("join-channel", channel, currentChannel);
        setCurrentChannel(channel);

        if (isPublic) {
            setPrivateMemberMessage(null);
        }
        dispatch(resetNotifications(channel)); // Reset the notifications for the channel when the user joins it
    }

    socket.off("notifications").on("notifications", (channel) => {
        if (currentChannel !== channel) dispatch(addNotifications(channel)); // Add a notification for the channel if the user is not currently in it
    });

    // get all channels
    useEffect(() => {
        setCurrentChannel(currentChannel);
        getChannels().then((res) => {
            setChannels(res.data);
        });
        socket.emit("join-channel", currentChannel);
        socket.emit("new-user");
    }, [user, socket, currentChannel, setCurrentChannel, setChannels, getChannels]);

    // Keep track of the current channel
    useEffect(() => {
        socket.off("join-channel").on("join-channel", (newChannel) => {
            setCurrentChannel(newChannel);
        });
    }, [socket, setCurrentChannel]);

    socket.off("new-user").on("new-user", (payload) => {
        setMembers(payload);
    });

    function orderIds(id1, id2) {
        // Order the ids so that the channel id is always the same for two users
        if (id1 > id2) {
            return id1 + "-" + id2;
        } else {
            return id2 + "-" + id1;
        }
    }

    function handlePrivateMemberMessage(member) {
        setPrivateMemberMessage(member);
        const channelId = orderIds(user._id, member._id);
        joinChannel(channelId, false);
    }

    function calculateLastSeen(lastSeen) {
        const lastSeenDate = new Date(lastSeen);
        const currentDate = new Date();
        const diff = currentDate - lastSeenDate;
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) {
            return "Just Now";
        } else if (minutes < 60) {
            return minutes + "m";
        } else if (minutes < 1440) {
            return Math.floor(minutes / 60) + "h";
        } else {
            return lastSeenDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric' });
        }
    }

    // If there is no user, do not render the sidebar
    if (!user) return <></>;

    return (
        <>
            <h2 className="sidebar-header">Available Channels</h2>
            <div className='channels-section'>
                <Form.Group controlId="channelSearch">
                    <Form.Control
                        type="text"
                        placeholder="Search Channels"
                        value={searchChannels}
                        onChange={(e) => setSearchChannels(e.target.value)}
                    />
                </Form.Group>
                <ListGroup>
                    {filteredChannels.map((channel, idx) => (
                        <ListGroup.Item key={idx} onClick={() => joinChannel(channel)} active={channel === currentChannel} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
                            {channel} {channel !== currentChannel && user.newMessages && user.newMessages[channel] && (<span className="badge rounded-pill bg-primary">{user.newMessages[channel]}</span>)}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>

            <div className="members-section">
                <h2 className="sidebar-header">Members</h2>
                <Form.Group controlId="memberSearch">
                    <Form.Control
                        type="text"
                        placeholder="Search Members"
                        value={searchMembers}
                        onChange={(e) => setSearchMembers(e.target.value)}
                    />
                </Form.Group>
                <ListGroup>
                    {filteredMembers.map((member, idx) => (
                        <ListGroup.Item key={idx} style={{ cursor: "pointer" }} active={privateMemberMessage?._id === member?._id} onClick={() => handlePrivateMemberMessage(member)} disabled={member._id === user._id}>
                            <Row>
                                <Col xs={2} className="member-status">
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <UserInfoModal userObject={member} from={"Sidebar"} />
                                    </div>
                                    {member.status === "online" ? <i className="fas fa-circle sidebar-online-status"></i> : <i className="fas fa-circle sidebar-offline-status"></i>}
                                </Col>
                                <Col xs={9}>
                                    {member.name}
                                    {member._id === user?._id && " (You)"}
                                    {member.status === "offline" && " (Offline) Last Seen: " + calculateLastSeen(member.lastSeenDatetime)}
                                </Col>
                                <Col xs={1}>
                                    <span className="badge rounded-pill bg-primary">{user.newMessages && user.newMessages[orderIds(member._id, user._id)]}</span>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
        </>
    );
}

export default Sidebar;