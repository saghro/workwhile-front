/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from 'react';
import { User, Bell, Heart, Menu, X } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/authActions';
import logo from '../../assets/imgs/workwhile.png';

export default function Navbar() {
  const { user, isAuthenticated, loading } = useSelector(state => state.auth);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = (e) => {
    if (e) e.stopPropagation();
    dispatch(logoutUser());
    setIsProfileOpen(false);
    navigate('/');
  };

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCreateJobClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/create-job' } });
    } else if (user?.role === 'candidate') {
      navigate('/register', {
        state: {
          switchToEmployer: true,
          message: 'To create job offers, please register as an employer or switch your account type.'
        }
      });
    } else {
      navigate('/create-job');
    }
  };

  return (
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200">
        {/* White background with very subtle shadow */}
        <div className="absolute inset-0 bg-white shadow-sm"></div>

        {/* Navbar content */}
        <nav className="relative">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center">
                <Link to="/">
                  <img src={logo} alt="Workwhile Logo" className="h-8 w-auto" />
                </Link>
              </div>

              {/* Main navigation - hidden on mobile */}
              <div className="hidden md:flex flex-1 mx-8 space-x-6">
                <Link to="/jobs" className="text-gray-700 font-medium hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 py-5">
                  Find jobs
                </Link>
                <Link to="/companies" className="text-gray-700 font-medium hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 py-5">
                  Company reviews
                </Link>
                <Link to="/salaries" className="text-gray-700 font-medium hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 py-5">
                  Salary guide
                </Link>
              </div>

              {/* Right side links and icons */}
              <div className="flex items-center space-x-5">
                {/* Saved jobs - only for authenticated candidates */}
                {isAuthenticated && user?.role === 'candidate' && (
                    <Link
                        to="/saved-jobs"
                        className="hidden sm:flex items-center text-gray-700 hover:text-blue-600"
                    >
                      <Heart size={18} className="mr-1" />
                      <span className="hidden sm:inline">Saved jobs</span>
                    </Link>
                )}

                {/* Conditional notifications icon - only when logged in */}
                {isAuthenticated && (
                    <Link
                        to="/notifications"
                        className="hidden sm:block text-gray-700 hover:text-blue-600"
                        aria-label="Notifications"
                    >
                      <Bell size={18} />
                    </Link>
                )}

                {/* User Profile/Login */}
                <div className="relative" ref={dropdownRef}>
                  {isAuthenticated ? (
                      <>
                        <button
                            onClick={toggleProfileDropdown}
                            className="flex items-center justify-center"
                            aria-label="User profile"
                            aria-expanded={isProfileOpen}
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            {user?.firstName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        </button>
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                              <div className="px-4 py-2 text-sm text-gray-700">
                                Signed in as <span className="font-medium">
                            {user?.firstName && user?.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : user?.email
                            }
                          </span>
                                <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
                              </div>
                              <hr className="border-gray-200" />

                              {/* Role-specific menu items */}
                              {user?.role === 'employer' && (
                                  <>
                                    <Link
                                        to="/create-job"
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                      Create Job Offer
                                    </Link>
                                    <Link
                                        to="/dashboard"
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                      My Job Offers
                                    </Link>
                                  </>
                              )}

                              {user?.role === 'candidate' && (
                                  <>
                                    <Link
                                        to="/my-applications"
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                      My Applications
                                    </Link>
                                    <Link
                                        to="/saved-jobs"
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                      Saved Jobs
                                    </Link>
                                  </>
                              )}

                              <Link
                                  to="/profile"
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={() => setIsProfileOpen(false)}
                              >
                                Profile Settings
                              </Link>
                              <Link
                                  to="/dashboard"
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={() => setIsProfileOpen(false)}
                              >
                                Dashboard
                              </Link>
                              <button
                                  onClick={handleLogout}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Sign out
                              </button>
                            </div>
                        )}
                      </>
                  ) : (
                      <Link
                          to="/login"
                          className="flex items-center justify-center"
                          aria-label="Login"
                      >
                        <div className="w-8 h-8 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center">
                          <User size={18} className="text-gray-600" />
                        </div>
                      </Link>
                  )}
                </div>

                {/* Create Job Offer Button */}
                <button
                    onClick={handleCreateJobClick}
                    className="hidden sm:block text-sm text-blue-600 font-medium hover:text-blue-800"
                >
                  Create a job offer
                </button>

                {/* Mobile menu button */}
                <button
                    className="md:hidden flex items-center justify-center"
                    onClick={toggleMobileMenu}
                    aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  {isMobileMenuOpen ? (
                      <X size={24} className="text-gray-600" />
                  ) : (
                      <Menu size={24} className="text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
              <div className="md:hidden bg-white shadow-lg absolute top-16 left-0 right-0 z-30">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <Link
                      to="/jobs"
                      className="block px-3 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Find jobs
                  </Link>
                  <Link
                      to="/companies"
                      className="block px-3 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Company reviews
                  </Link>
                  <Link
                      to="/salaries"
                      className="block px-3 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Salary guide
                  </Link>

                  {/* Mobile-only links for authenticated users */}
                  {isAuthenticated && (
                      <>
                        {user?.role === 'candidate' && (
                            <>
                              <Link
                                  to="/saved-jobs"
                                  className="block px-3 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-100"
                                  onClick={() => setIsMobileMenuOpen(false)}
                              >
                                Saved jobs
                              </Link>
                              <Link
                                  to="/my-applications"
                                  className="block px-3 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-100"
                                  onClick={() => setIsMobileMenuOpen(false)}
                              >
                                My Applications
                              </Link>
                            </>
                        )}

                        {user?.role === 'employer' && (
                            <>
                              <Link
                                  to="/create-job"
                                  className="block px-3 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-100"
                                  onClick={() => setIsMobileMenuOpen(false)}
                              >
                                Create Job Offer
                              </Link>
                              <Link
                                  to="/dashboard"
                                  className="block px-3 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-100"
                                  onClick={() => setIsMobileMenuOpen(false)}
                              >
                                My Job Offers
                              </Link>
                            </>
                        )}

                        <Link
                            to="/notifications"
                            className="block px-3 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-100"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Notifications
                        </Link>
                        <Link
                            to="/profile"
                            className="block px-3 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-100"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Profile Settings
                        </Link>
                        <Link
                            to="/dashboard"
                            className="block px-3 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-100"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <button
                            onClick={(e) => {
                              handleLogout(e);
                              setIsMobileMenuOpen(false);
                            }}
                            className="block w-full text-left px-3 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-100"
                        >
                          Sign out
                        </button>
                      </>
                  )}

                  {/* Create job offer button for mobile */}
                  <button
                      onClick={() => {
                        handleCreateJobClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-blue-600 font-medium hover:bg-blue-50"
                  >
                    Create a job offer
                  </button>
                </div>
              </div>
          )}
        </nav>
      </div>
  );
}