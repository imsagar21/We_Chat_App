import React, { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, MessageSquare, Settings, User } from 'lucide-react'
import toast from 'react-hot-toast'

const Navbar = () => {
  const {logout,authUser}= useAuthStore()

  const handleLogout = () => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Are you sure you want to logout?</p>
        <div className="flex justify-end gap-2">
          <button
            className="btn btn-sm btn-outline"
            onClick={() => toast.dismiss(t.id)}
          >
            No
          </button>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              toast.dismiss(t.id);
              logout();
              toast.success("Logged out successfully!");
            }}
          >
            Yes
          </button>
        </div>
      </div>
    ), {
      duration: 5000, // Toast stays for 5s
    });
  };
  
  return (
    <header className='bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg'>
      <div className='container mx-auto px-4 h-16'>
        <div className='flex items-center justify-between h-full'>
          <div className='flex items-center gap-8'>
            <Link to="/" className='flex items-center justify-center gap-2'>
            <div className='size-9 rounded-lg bg-primary/10 flex items-center justify-center'>
            <MessageSquare className='w-5 h-5 text-primary'/>
            </div>
            <h1 className='text-lg font-bold'>We Chat</h1>
            </Link>

          </div>
          <div className='flex items-center gap-2'>
             <Link to="/settings" className='btn btn-sm gap-2 transition-colors '>
             <Settings className='size-5'/>
             <span className='hidden sm:inline'>Settings</span>
             </Link>
             {
              authUser && (
                <>
                <Link to="/profile" className='btn btn-sm gap-2'>
                <User className='size-5'/>
                <span className='hidden sm:inline'>Profile</span>
                </Link>
                <button className='flex gap-2 items-center btn btn-sm' onClick={logout}>
                  <LogOut className='size-5'/>
                  <span className='hidden sm:inline'>Logout</span>
                </button>
                </>
              )
             }
          </div>

        </div>
      </div>

    </header>

  )
}

export default Navbar
