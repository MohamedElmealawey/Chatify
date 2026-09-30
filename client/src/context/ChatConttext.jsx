import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext=createContext();

export const ChatContextProvider=({children})=>{
    const [messages,setMessages]=useState([]);
    const [users,setUsers]=useState([]);
    const [selectedUser,setSelectedUser]=useState(null);
    const [unseenMessages,setUnseenMessages]=useState({});
    const {socket,axios}=useContext(AuthContext);

    const getUsers=async()=>{
        try{
            const {data}=await axios.get("/api/messages/users");
            if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        }catch(error){
            toast.error(error.message);
        }
    }

    const getMessages=async(id)=>{
        try{
            const {data}=await axios.get(`/api/messages/${id}`);
            if(data.success){
                setMessages(data.messages);
            }
        }catch(error){
            toast.error(error.message);
        }
    }

    const sendMessage=async(messageData)=>{
        try{
            const {data}=await axios.post(`/api/messages/send/${selectedUser._id}`,messageData);
            if(data.success){
                setMessages((prevMessage)=>[...prevMessage,data.newMessage])
            }else{
                toast.error(data.message);
            }
        }catch(error){
            toast.error(error.message);
        }
    }

    const subscribeToMessages=async()=>{
        if(!socket) return;

        socket.on("newMessage",(newMessage)=>{
            if(selectedUser && newMessage.senderId===selectedUser._id){
                newMessage.seen=true;
                setMessages((prevMessage)=>[...prevMessage,newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`)
            }else{
                setUnseenMessages((prevUnseenMessages)=>({
                    ...prevUnseenMessages,
                    [newMessage.senderId]: (prevUnseenMessages[newMessage.senderId] || 0) + 1
                }))
            }
        })
    }

    const unsubscribeToMessages=()=>{
        if(socket) socket.off("newMessage");
    }

    useEffect(()=>{
        subscribeToMessages();
        return ()=> unsubscribeToMessages();
    },[socket,selectedUser])
    return(
        <ChatContext.Provider value={{messages,users,selectedUser,getUsers,setMessages,
            sendMessage,setSelectedUser,unseenMessages,setUnseenMessages,getMessages
        }}>
            {children}
        </ChatContext.Provider>
    )
}