import { useContext, useEffect, useState } from 'react'
import assets from "../assets/assets"
import { useNavigate } from "react-router-dom"
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatConttext';

const SideBar = () => {
  const navigate = useNavigate();
  const { logout, onlineUsers } = useContext(AuthContext);
  const [input, setInput] = useState("");
  const { getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext);

  const filteredUsers = input
    ? users.filter((u) => u.fullName.toLowerCase().includes(input.toLowerCase()))
    : users;

  useEffect(() => { getUsers(); }, [onlineUsers]);

  return (
    <aside className={`flex h-full min-h-0 flex-col border-white/10 bg-white/[0.03] md:border-r
      ${selectedUser ? 'max-md:hidden' : ''}`}>
      {/* header */}
      <div className="flex items-center justify-between px-5 pt-5">
        <img src={assets.logo} alt="QuickChat" className="h-8 w-auto" />
        <div className="group relative">
          <button aria-label="Menu" className="grid h-9 w-9 place-items-center rounded-full
            transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-violet-400">
            <img src={assets.menu_icon} alt="" className="h-4" />
          </button>
          <div className="invisible absolute right-0 top-full z-20 w-40 overflow-hidden rounded-xl border
            border-white/10 bg-[#1b1736] py-1 text-sm opacity-0 shadow-xl transition
            group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
            <button onClick={() => navigate("/profile")} className="block w-full px-4 py-2.5 text-left hover:bg-white/10">Edit profile</button>
            <button onClick={logout} className="block w-full px-4 py-2.5 text-left text-rose-300 hover:bg-white/10">Log out</button>
          </div>
        </div>
      </div>

      {/* search */}
      <div className="px-5 py-4">
        <label className="flex items-center gap-2 rounded-full bg-white/[0.07] px-4 py-2.5
          ring-1 ring-transparent transition focus-within:ring-violet-400/60">
          <img src={assets.search_icon} alt="" className="w-3.5 opacity-70" />
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Search people"
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40" />
        </label>
      </div>

      {/* people */}
      <ul className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {filteredUsers.length === 0 && (
          <li className="px-3 py-8 text-center text-sm text-white/40">
            {input ? "No one matches that name." : "No contacts yet."}
          </li>
        )}
        {filteredUsers.map((user) => {
          const online = onlineUsers.includes(user._id);
          const unseen = unseenMessages[user._id] || 0;
          const active = selectedUser?._id === user._id;
          return (
            <li key={user._id}>
              <button
                onClick={() => { setSelectedUser(user); setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 })); }}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition
                  hover:bg-white/[0.07] focus-visible:outline-2 focus-visible:outline-violet-400
                  ${active ? 'bg-violet-500/20 ring-1 ring-violet-400/30' : ''}`}>
                <span className="relative shrink-0">
                  <img src={user.profilePic || assets.avatar_icon} alt="" className="h-11 w-11 rounded-full object-cover" />
                  <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#15122b]
                    ${online ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-medium">{user.fullName}</span>
                  <span className={`block text-xs ${online ? 'text-emerald-300' : 'text-white/40'}`}>
                    {online ? 'Online' : 'Offline'}
                  </span>
                </span>
                {unseen > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-violet-500 px-1.5 text-xs font-medium">
                    {unseen}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  )
}

export default SideBar
