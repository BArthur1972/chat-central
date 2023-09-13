import React from 'react';
import { ListGroup } from 'react-bootstrap';


function Sidebar() {
    const channels = ['General', 'Announcements', 'Career Opportunities', 'DSA for Technical Interviews', 'Interview Resources'];

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
        </>
    );
}

export default Sidebar;