import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-secondary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold">
            📝 Blog
          </Link>
          
          <div className="flex gap-6 items-center">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            
            {user ? (
              <>
                <Link to="/posts" className="hover:text-primary">
                  Posts
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin/create" className="hover:text-primary">
                    Create Post
                  </Link>
                )}
                <span>{user.name}</span>
                <button
                  onClick={onLogout}
                  className="bg-primary hover:bg-blue-600 px-4 py-2 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-primary">
                  Login
                </Link>
                <Link to="/register" className="bg-primary hover:bg-blue-600 px-4 py-2 rounded">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
