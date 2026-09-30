import { useContext, useMemo, useState } from 'react'
import { useNavigate } from "react-router-dom"
import assets from "../assets/assets"
import { AuthContext } from '../context/AuthContext'

const readAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const ProfilePage = () => {
  const { authUser, updateProfile, loading } = useContext(AuthContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState(authUser.fullName || "");
  const [bio, setBio] = useState(authUser.bio || "");
  const navigate = useNavigate();

  const previewUrl = useMemo(
    () => (selectedImage ? URL.createObjectURL(selectedImage) : null),
    [selectedImage]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { fullName: name, bio };
    if (selectedImage) {
      // send as base64 inside JSON (same format the chat uses for images)
      body.profilePic = await readAsDataURL(selectedImage);
    }
    const ok = await updateProfile(body);
    if (ok) navigate("/");
  }

  return (
    <div className='min-h-dvh flex items-center justify-center px-4 py-8'>
      <div className='w-full max-w-2xl backdrop-blur-2xl text-white border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/40 flex items-center justify-between max-sm:flex-col-reverse rounded-3xl'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-xl font-medium'>Profile details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input type="file" onChange={(e) => setSelectedImage(e.target.files[0] || null)} id='avatar' accept='.png, .jpg, .jpeg' hidden />
            <img src={previewUrl || assets.avatar_icon} alt="avatar"
              className={`h-12 w-12 object-cover ${selectedImage ? "rounded-full" : ""}`} />
            Upload profile image
          </label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder='Your name'
            className='rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-white/40 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/40' />
          <textarea value={bio} onChange={(e) => setBio(e.target.value)}
            className='rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-white/40 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/40' rows={4} placeholder='Write profile bio...'></textarea>
          <button type='submit' disabled={loading} className='rounded-full bg-linear-to-r from-violet-500 to-fuchsia-600 py-2.5 font-medium transition hover:brightness-110 disabled:opacity-60'>{loading ? <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></span> : "Save"}</button>
        </form>
        <img src={previewUrl || authUser?.profilePic || assets.logo_icon} alt="logo" className='mx-10 aspect-square w-36 rounded-full object-cover ring-4 ring-white/10 max-sm:mt-10 sm:w-44' />
      </div>
    </div>
  )
}

export default ProfilePage
