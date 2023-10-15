import React from 'react';
import { io } from "socket.io-client";

const SOCKET_URL = 'http://localhost:5001';

export const socket = io(SOCKET_URL);

// Create a context object that will be used to provide data to its child components
export const AppContext = React.createContext();