import { useContext, useMemo } from 'react'
import assets from "../assets/assets"
import { ChatContext } from '../context/ChatConttext'
import { AuthContext } from '../context/AuthContext';

const RightSide = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const msgImages = useMemo(() => messages.filter((m) => m.image).map((m) => m.image), [messages]);

  if (!selectedUser) return null;
  const online = onlineUsers.includes(selectedUser._id);

  return (
    <aside className="hidden h-full min-h-0 flex-col border-l border-white/10 bg-white/[0.03] lg:flex">
      <div className="flex flex-col items-center gap-2 px-6 pt-10 text-center">
        <img src={selectedUser.profilePic || assets.avatar_icon} alt=""
          className="h-24 w-24 rounded-full object-cover ring-4 ring-white/10" />
        <h2 className="mt-2 text-xl font-medium">{selectedUser.fullName}</h2>
        <p className={`flex items-center gap-1.5 text-xs ${online ? 'text-emerald-300' : 'text-white/40'}`}>
          <span className={`h-2 w-2 rounded-full ${online ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
          {online ? 'Online' : 'Offline'}
        </p>
        {selectedUser.bio && <p className="mt-2 text-sm font-light leading-relaxed text-white/70">{selectedUser.bio}</p>}
      </div>

      <div className="mt-6 flex min-h-0 flex-1 flex-col border-t border-white/10 px-5 pt-4">
        <h3 className="text-sm font-medium">Shared media <span className="text-white/40">({msgImages.length})</span></h3>
        {msgImages.length === 0 ? (
          <p className="mt-3 text-sm text-white/40">Images you send or receive show up here.</p>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-2 overflow-y-auto pb-4">
            {msgImages.map((url, i) => (
              <button key={i} onClick={() => window.open(url)} className="aspect-square overflow-hidden rounded-xl">
                <img src={url} alt="" className="h-full w-full object-cover transition hover:scale-105" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-5">
        <button onClick={logout} className="w-full rounded-full bg-linear-to-r from-violet-500 to-fuchsia-600 py-2.5
          text-sm font-medium transition hover:brightness-110 active:scale-[.98]">
          Log out
        </button>
      </div>
    </aside>
  )
}

export default RightSide
