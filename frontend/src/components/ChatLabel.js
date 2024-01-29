import { React, useEffect, useState } from 'react';
import './styles/ChatLabel.css';
import defaultProfilePic from '../assets/profile_placeholder.jpg';

function ChatLabel(props) {
    const user = props.userObject;
    const privateMemberMessage = props.privateMemberMsg;
    const currentChannel = props.currChannel;
    const [showSelectChat, setShowSelectChat] = useState(true);

    useEffect(() => {
        if (currentChannel.length === 0 && !privateMemberMessage?._id) {
            setShowSelectChat(true);
        }
        else {
            setShowSelectChat(false);
        }
    }, [currentChannel, privateMemberMessage]);

    return (
        <div>
            {user && showSelectChat && <div className="alert alert-info">Please open a chat to continue</div>}
            {user && currentChannel.length !== 0 && !privateMemberMessage?._id && <div className="alert alert-info">You are in the {currentChannel} channel</div>}
            {user && privateMemberMessage?._id && (
                <>
                    <div className="alert alert-info conversation-info">
                        <div className='conversation-info-items'>
                            <img src={privateMemberMessage.picture || defaultProfilePic} alt="" className="conversation-profile-pic" />
                            Your conversation with {privateMemberMessage.name}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default ChatLabel;