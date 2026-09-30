import { useContext, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils';
import { ChatContext } from '../context/ChatConttext';
import { AuthContext } from '../context/AuthContext';

const ChatContainer = () => {
  const scrollEnd = useRef();
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);
  const [input, setInput] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    await sendMessage({ text: input.trim() });
    setInput("");
  }

  const handleSendImage = async (e) => {
    const inputEl = e.target;
    const file = inputEl.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      inputEl.value = "";
    }
    reader.readAsDataURL(file);
  }

  useEffect(() => {
    if (selectedUser) getMessages(selectedUser._id);
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && messages) scrollEnd.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser) {
    return (
      <section className="hidden h-full flex-col items-center justify-center gap-3 px-6 text-center md:flex">
        <img src={assets.logo_icon} alt="" className="w-16 opacity-90" />
        <h2 className="text-xl font-medium">Pick someone to chat with</h2>
        <p className="max-w-xs text-sm text-white/50">Choose a contact from the list to open your conversation.</p>
      </section>
    );
  }

  const online = onlineUsers.includes(selectedUser._id);

  return (
    <section className="flex h-full min-h-0 flex-col">
      {/* header */}
      <header className="flex items-center gap-3 border-b border-white/10 px-3 py-3 sm:px-5">
        <button onClick={() => setSelectedUser(null)} aria-label="Back to contacts"
          className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10 md:hidden">
          <img src={assets.arrow_icon} alt="" className="w-5" />
        </button>
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className="h-10 w-10 rounded-full object-cover" />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate font-medium">{selectedUser.fullName}</p>
          <p className={`text-xs ${online ? 'text-emerald-300' : 'text-white/40'}`}>{online ? 'Online' : 'Offline'}</p>
        </div>
      </header>

      {/* messages */}
      <div className="flex-1 space-y-4 overflow-y-auto px-3 py-5 sm:px-6">
        {messages.length === 0 && (
          <p className="pt-10 text-center text-sm text-white/40">No messages yet. Say hello to {selectedUser.fullName.split(' ')[0]}.</p>
        )}
        {messages.map((msg, index) => {
          const mine = msg.senderId === authUser._id;
          const avatar = mine ? authUser?.profilePic : selectedUser?.profilePic;
          return (
            <div key={msg._id || index} className={`flex items-end gap-2 ${mine ? 'flex-row-reverse' : ''}`}>
              <img src={avatar || assets.avatar_icon} alt="" className="h-7 w-7 shrink-0 rounded-full object-cover" />
              <div className={`flex max-w-[78%] flex-col gap-1 sm:max-w-[65%] ${mine ? 'items-end' : 'items-start'}`}>
                {msg.image ? (
                  <img src={msg.image} alt="Shared" onClick={() => window.open(msg.image)}
                    className="max-h-72 cursor-zoom-in rounded-2xl border border-white/10 object-cover" />
                ) : (
                  <p className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed
                    ${mine
                      ? 'rounded-br-md bg-linear-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-900/30'
                      : 'rounded-bl-md bg-white/10'}`}>
                    {msg.text}
                  </p>
                )}
                <span className="px-1 text-[11px] text-white/40">{formatMessageTime(msg.createdAt)}</span>
              </div>
            </div>
          );
        })}
        <div ref={scrollEnd} />
      </div>

      {/* composer */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2 border-t border-white/10 p-3 sm:p-4">
        <div className="flex flex-1 items-center rounded-full bg-white/[0.07] pl-5 pr-3 ring-1 ring-transparent transition focus-within:ring-violet-400/60">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Write a message" aria-label="Message"
            className="min-w-0 flex-1 bg-transparent py-3 text-[15px] text-white outline-none placeholder:text-white/40" />
          <input type="file" onChange={handleSendImage} id="image" accept="image/png, image/jpeg" hidden />
          <label htmlFor="image" title="Send an image"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full hover:bg-white/10">
            <img src={assets.gallery_icon} alt="Attach image" className="w-5" />
          </label>
        </div>
        <button type="submit" aria-label="Send message" disabled={!input.trim()}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-linear-to-br from-violet-500 to-fuchsia-600
          transition enabled:hover:brightness-110 enabled:active:scale-95 disabled:opacity-40">
          <img src={assets.send_button} alt="" className="w-5" />
        </button>
      </form>
    </section>
  )
}

export default ChatContainer
