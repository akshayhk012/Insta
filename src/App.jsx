import { useEffect } from 'react';
import ChatPage from './components/ChatPage';
import EditProfile from './components/EditProfile';
import Home from './components/Home';
import Login from './components/Login';
import MainLayout from './components/MainLayout';
import Profile from './components/Profile';
import Signup from './components/Signup';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { io } from "socket.io-client";
import { useDispatch, useSelector } from 'react-redux';
import { setSocketState } from './redux/socketSlice'; // Update import to setSocketState
import { setOnlineUsers } from './redux/chatSlice';
import { setLikeNotification } from './redux/rtnSlice';
import ProtectedRoutes from './components/ProtectedRoutes';
import Search from './components/Search';

const browserRouter = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
        children: [
            {
                path: '/',
                element: <ProtectedRoutes><Home /></ProtectedRoutes>
            },
            {
                path: '/profile/:id',
                element: <ProtectedRoutes><Profile /></ProtectedRoutes>
            },
            {
                path: '/account/edit',
                element: <ProtectedRoutes><EditProfile /></ProtectedRoutes>
            },
            {
                path: '/chat',
                element: <ProtectedRoutes><ChatPage /></ProtectedRoutes>
            },
            {
                path: '/Search',
                element: <ProtectedRoutes><Search /></ProtectedRoutes>
            },
        ]
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/signup',
        element: <Signup />
    },
]);

function App() {
    const { user } = useSelector(store => store.auth);
    const { so , isConnected } = useSelector(store => store.socketio); // Update to use socketId and isConnected
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            const socketio = io('http://localhost:8000', {
                query: {
                    userId: user?._id
                },
                transports: ['websocket']
            });

            // Dispatch only serializable properties
            dispatch(setSocketState({
                socketId : socketio.id,
                isConnected: socketio.connected,
            }));

            // Listen for events
            socketio.on('getOnlineUsers', (onlineUsers) => {
                dispatch(setOnlineUsers(onlineUsers));
            });

            socketio.on('notification', (notification) => {
                dispatch(setLikeNotification(notification));
            });

            socketio.on('connect', () => {
                dispatch(setSocketState({
                    socketId: socketio.id,
                    isConnected: true,
                }));
            });

            socketio.on('disconnect', () => {
                dispatch(setSocketState({
                    socketId: null,
                    isConnected: false,
                }));
            });

            return () => {
                socketio.close();
                dispatch(setSocketState({
                    socketId: null,
                    isConnected: false,
                }));
            };
        } else if (isConnected) { // Check for isConnected instead of socket
            dispatch(setSocketState({
                socketId: null,
                isConnected: false,
            }));
        }
    }, [user, dispatch]);

    return (
        <>
            <RouterProvider router={browserRouter} />
        </>
    );
}

export default App;
