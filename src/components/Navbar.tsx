import { Gamepad, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Gamepad className="h-8 w-8 text-white" />
              <span className="ml-2 text-white text-xl font-bold">GameRent</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md">
                Home
              </Link>
              <Link to="/games" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md">
                Games
              </Link>
              <Link to="/contact" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md">
                Contact
              </Link>
              {isAdmin && (
                <>
                  <Link to="/admin" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md">
                    Admin
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md flex items-center"
                  >
                    <LogOut className="h-5 w-5 mr-1" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-indigo-500"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="text-white hover:bg-indigo-500 block px-3 py-2 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/games"
              className="text-white hover:bg-indigo-500 block px-3 py-2 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Games
            </Link>
            <Link
              to="/contact"
              className="text-white hover:bg-indigo-500 block px-3 py-2 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            {isAdmin && (
              <>
                <Link
                  to="/admin"
                  className="text-white hover:bg-indigo-500 block px-3 py-2 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Admin
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="text-white hover:bg-indigo-500 w-full text-left px-3 py-2 rounded-md flex items-center"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}