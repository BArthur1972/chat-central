import './App.css';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import Account from './pages/Account';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { AppContext, socket } from './context/appContext';

function App() {
	const [channels, setChannels] = useState([]);
	const [currentChannel, setCurrentChannel] = useState([]);
	const [members, setMembers] = useState([]);
	const [messages, setMessages] = useState([]);
	const [privateMemberMessage, setPrivateMemberMessage] = useState([]);
	const [newMessages, setNewMessages] = useState({});

	const { user } = useSelector((state) => state.user);

	return (
		<AppContext.Provider value={{ socket, channels, setChannels, currentChannel, setCurrentChannel, members, setMembers, messages, setMessages, privateMemberMessage, setPrivateMemberMessage, newMessages, setNewMessages }}>
			<BrowserRouter>
				<Navigation />
				<Routes>
					<Route path="/" element={<Home />} />
					{!user && (
						<>
							<Route path="/login" element={<Login />} />
							<Route path="/signup" element={<Signup />} />
						</>
					)}
					<Route path="/chat" element={<Chat />} />
					<Route path="/account" element={<Account/>} />
				</Routes>
			</BrowserRouter>
		</AppContext.Provider>
	);
}

export default App;
