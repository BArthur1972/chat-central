import React, { useContext, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { AppContext } from '../context/appContext';

function Sidebar() {
    const user = useSelector((state) => state.user);
    const { socket, setMembers, members, setCurrentChannel, setChannels, privateMemberMessage, channels, setPrivateMemberMessage, currentChannel } = useContext(AppContext);

    socket.off("new-user").on("new-user", (payload) => {
        setMembers(payload);
        console.log(payload);
    });

    // get all channels
    useEffect(() => {
        if (user) {
            setCurrentChannel("general");

            fetch("http://localhost:5001/channels")
                .then((res) => res.json())
                .then((data) => setChannels(data));

            socket.emit("join-channel", "general");
            socket.emit("new-user");
        }

    }, [socket, user, setChannels, setCurrentChannel]);


    // If there is no user, do not render the sidebar
    if (!user) return <></>;

    return (
        <>
            <h2 className="sidebar-header">Available Channels</h2>
            <ListGroup>
                {channels.map((channel, idx) => (
                    <ListGroup.Item key={idx}>
                        {channel}
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <h2 className="sidebar-header">Members</h2>
            <ListGroup>
                {members.map((member, idx) => (
                    <ListGroup.Item key={idx} style={{ cursor: "pointer" }} >
                        {/* TODO: ADD PROFILE IMAGE AND DISPLAY ONLINE STATUS BETTER */}
                        {member.name}
                    </ListGroup.Item>
                ))}
            </ListGroup>

        </>
    );
}

export default Sidebar;