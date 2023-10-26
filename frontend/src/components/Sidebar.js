import React, { useContext, useEffect } from 'react';
import { ListGroup, Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { AppContext } from '../context/appContext';

function Sidebar() {
    const user = useSelector((state) => state.user);
    const { socket, setMembers, members, setCurrentChannel, setChannels, privateMemberMessage, channels, setPrivateMemberMessage, currentChannel } = useContext(AppContext);

    function joinChannel(channel, isPublic = true) {
		if (!user) {
			return alert("Please login");
		}
		socket.emit("join-channel", channel);
		setCurrentChannel(channel);

		if (isPublic) {
			setPrivateMemberMessage(null);
		}
		
        // TODO: dispatch for notifications
	}

    // get all channels
    useEffect(() => {
        if (user) {
            setCurrentChannel("General");
            fetch("http://localhost:5001/channels")
                .then((res) => res.json())
                .then((data) => setChannels(data));
            
            socket.emit("join-channel", "General");
            socket.emit("new-user");
        }
    }, [user, socket, setCurrentChannel, setChannels]);

    // useEffect hook to keep track of the current channel
    useEffect(() => {
        socket.off("join-channel").on("join-channel", (newChannel) => {
            setCurrentChannel(newChannel);
        });
    }, [socket, setCurrentChannel]);

    socket.off("new-user").on("new-user", (payload) => {
        setMembers(payload);
        console.log(payload);
    });

    function orderIds(id1, id2) {
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

    // If there is no user, do not render the sidebar
    if (!user) return <></>;

    return (
        <>
            <h2 className="sidebar-header">Available Channels</h2>
            <ListGroup>
                {channels.map((channel, idx) => (
                    <ListGroup.Item key={idx} onClick={() => joinChannel(channel)} active={channel === currentChannel} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
                        {channel} {channel !== currentChannel && (<span className="badge rounded-pill bg-primary"></span>)}
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <h2 className="sidebar-header">Members</h2>
            <ListGroup>
                {members.map((member, idx) => (
                    <ListGroup.Item key={idx} style={{ cursor: "pointer" }} active={privateMemberMessage?._id === member?._id} onClick={() => handlePrivateMemberMessage(member)} disabled={member._id === user._id}>
                        <Row>
						    {/* TODO: ADD PROFILE IMAGE AND DISPLAY ONLINE STATUS BETTER */}
						<Col xs={9}>
							{member.name}
							{member._id === user?._id && " (You)"}
							{member.status === "offline" ? " (Offline)" : " (Online)"}
						</Col>
						<Col xs={1}>
							{/* TODO: Improve the online status. Use a small green cirle for online */}
						</Col>
					</Row>
                    </ListGroup.Item>
                ))}
            </ListGroup>

        </>
    );
}

export default Sidebar;