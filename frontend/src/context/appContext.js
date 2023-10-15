import { io } from "socket.io-client";
import React from "react";
const SOCKET_URL = "https://chatapp-23n1.onrender.com";
export const socket = io(SOCKET_URL);
// app context
export const AppContext = React.createContext();
