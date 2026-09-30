import { useContext } from 'react'
import SideBar from '../components/SideBar'
import ChatContainer from '../components/ChatContainer'
import RightSide from '../components/RightSide'
import { ChatContext } from '../context/ChatConttext'

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    <div className='h-dvh w-full md:p-4 lg:px-[6%] lg:py-6'>
      <div className={`grid h-full grid-cols-1 overflow-hidden bg-white/[0.04] backdrop-blur-2xl
        md:rounded-3xl md:border md:border-white/10 md:shadow-2xl md:shadow-black/40
        ${selectedUser
          ? 'md:grid-cols-[300px_1fr] lg:grid-cols-[320px_1fr_300px]'
          : 'md:grid-cols-[340px_1fr]'}`}>
        <SideBar />
        <ChatContainer />
        <RightSide />
      </div>
    </div>
  )
}

export default HomePage
