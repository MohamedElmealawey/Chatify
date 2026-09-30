import { useContext, useState } from 'react'
import assets from "../assets/assets"
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const {login,loading}=useContext(AuthContext);
  const [currState,setCurrState]=useState("Sign up");
  const [fullName,setFullName]=useState("");
  const [email,setEmail]=useState("");
  const [bio,setBio]=useState("");
  const [password,setPassword]=useState("");
  const [isDateSubmitted,setIsDateSubmitted]=useState(false);

  const onSubmitHandler=(e)=>{
    e.preventDefault();

    if(currState === "Sign up" && !isDateSubmitted){
      setIsDateSubmitted(true);
      return;
    }
    login(currState==="Sign up" ? "signup" : "login",{fullName,email,password,bio});
  }
  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center 
    gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/* left */}
      <img src={assets.logo_big} className='w-40 sm:w-[min(30vw,250px)]' alt="" />

      {/* right */}
      <form onSubmit={onSubmitHandler} className='flex w-full max-w-[400px] flex-col gap-5 rounded-3xl border border-white/10 bg-white/[0.06] p-7 text-white shadow-2xl shadow-black/40 backdrop-blur-xl'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState}
          {isDateSubmitted && <img onClick={()=>setIsDateSubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer'/>}
          </h2>
          {currState === "Sign up"&& !isDateSubmitted &&(
            <input type="text" value={fullName} onChange={(e)=>setFullName(e.target.value)} name='fullName' placeholder='Full Name' required className='rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-white/40 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/40' />
          )}
          {!isDateSubmitted && (
            <>
              <input type="email" name='email' value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Email' required className='rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-white/40 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/40' />
            <input type="password" name='password' value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Password' required className='rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-white/40 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/40' />
            </>
          )}

          {currState === "Sign up" && isDateSubmitted &&(
            <textarea rows={4} placeholder='provide a short bio...' value={bio} onChange={(e)=>setBio(e.target.value)} className='rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-white/40 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/40'></textarea>
          )}

          <button type='submit' disabled={loading} className='rounded-xl bg-linear-to-r from-violet-500 to-fuchsia-600 py-3 font-medium transition hover:brightness-110 active:scale-[.99] disabled:opacity-60'>
            {loading
              ? <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></span>
              : currState === "Sign up"
                ? "Create Account"
                : "Login Now"}         
          </button>
          
          <div className='flex items-center gap-2 text-sm text-white/50'>
            <input type="checkbox" className='accent-violet-500'/>
            <p>Agree to the terms of use & privacy policy.</p>
          </div>

          <div className='flex flex-col gap-2'>
            {currState === "Sign up" ? (
              <p className='text-white/50 text-sm'>Already have an account? <span
              onClick={()=>{setCurrState("Login");setIsDateSubmitted(false)}}
              className='font-medium text-violet-500 cursor-pointer'>Log in</span></p>
            ):(
              <p className='text-white/50 text-sm'>New here? Create an account. <span
              onClick={()=>setCurrState("Sign up")}
              className='font-medium text-violet-500 cursor-pointer'>Click here</span></p>
            )}
          </div>
          
      </form>
    </div>
  )
}

export default LoginPage