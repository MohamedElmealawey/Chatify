import { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

const errMsg = (error) => error.response?.data?.message || error.message;

export const AuthContextProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);
    const [loading, setIsLoading] = useState(false);
    // true while we are validating a saved token on page load (prevents redirect flicker)
    const [checkingAuth, setCheckingAuth] = useState(!!localStorage.getItem("token"));
    const socketRef = useRef(null);

    const clearSession = () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        delete axios.defaults.headers.common["token"];
    };

    const connectSocket = (userData) => {
        if (!userData || socketRef.current?.connected) return;
        const newSocket = io(backendUrl, { query: { userId: userData._id } });
        socketRef.current = newSocket;
        setSocket(newSocket);
        newSocket.on("getOnlineUsers", (userIds) => setOnlineUsers(userIds));
    };

    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/auth/check");
            if (data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
            } else {
                clearSession(); // token is invalid / expired
            }
        } catch (error) {
            if (error.response?.status === 401) clearSession();
            else toast.error(errMsg(error));
        } finally {
            setCheckingAuth(false);
        }
    };

    const login = async (state, credentials) => {
        setIsLoading(true);
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);
            if (data.success) {
                axios.defaults.headers.common["token"] = data.token;
                localStorage.setItem("token", data.token);
                setToken(data.token);
                setAuthUser(data.userData);
                connectSocket(data.userData);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(errMsg(error));
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        socketRef.current?.disconnect();
        socketRef.current = null;
        setSocket(null);
        clearSession();
        toast.success("Logged out successfully");
    };

    // returns true on success so the caller can decide whether to navigate away
    const updateProfile = async (body) => {
        setIsLoading(true);
        try {
            const { data } = await axios.put("/api/auth/update-profile", body);
            if (data.success) {
                setAuthUser(data.user);
                toast.success("Profile updated successfully");
                return true;
            }
            toast.error(data.message || "Could not update profile");
            return false;
        } catch (error) {
            toast.error(errMsg(error));
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["token"] = token;
            checkAuth();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AuthContext.Provider value={{ loading, checkingAuth, axios, authUser, onlineUsers, socket, login, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
