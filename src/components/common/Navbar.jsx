/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from 'react';
import { User, Bell, Heart, Menu, X } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/authActions';
import logo from '../../../public/logo_job.png';

export default function Navbar() {
  const { user, isAuthenticated, loading } = useSelector(state => state.auth);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  // Fermer le dropdown en cliquant à l'extérieur
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
          message: 'Pour créer des offres d\'emploi, veuillez vous inscrire en tant qu\'employeur ou changer le type de votre compte.'
        }
      });
    } else {
      navigate('/create-job');
    }
  };

  return (
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200">
        {/* Arrière-plan blanc avec ombre très subtile */}
        <div className="absolute inset-0 bg-white shadow-sm"></div>

        {/* Contenu de la navbar */}
        <nav className="relative">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center">
                <Link to="/">
                  <img src={logo} alt="Workwhile Logo" className="h-50 w-auto" />
                </Link>
              </div>

              {/* Navigation principale - masquée sur mobile */}
              <div className="hidden md:flex flex-1 mx-8 space-x-6">
                <Link to="/jobs" className="text-gray-700 font-medium hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 py-5">
                  Rechercher un emploi
                </Link>
                <Link to="/companies" className="text-gray-700 font-medium hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 py-5">
                  Avis d'entreprises
                </Link>
                <Link to="/salaries" className="text-gray-700 font-medium hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 py-5">
                  Guide des salaires
                </Link>
              </div>

              {/* Liens et icônes du côté droit */}
              <div className="flex items-center space-x-5">
                {/* Emplois sauvegardés - seulement pour les candidats authentifiés */}
                {isAuthenticated && user?.role === 'candidate' && (
                    <Link
                        to="/saved-jobs"
                        className="hidden sm:flex items-center text-gray-700 hover:text-blue-600"
                    >
                      <Heart size={18} className="mr-1" />
                      <span className="hidden sm:inline">Emplois sauvés</span>
                    </Link>
                )}

                {/* Icône de notifications conditionnelle - seulement quand connecté */}
                {isAuthenticated && (
                    <Link
                        to="/notifications"
                        className="hidden sm:block text-gray-700 hover:text-blue-600"
                        aria-label="Notifications"
                    >
                      <Bell size={18} />
                    </Link>
                )}

                {/* Profil utilisateur/Connexion */}
                <div className="relative" ref={dropdownRef}>
                  {isAuthenticated ? (
                      <>
                        <button
                            onClick={toggleProfileDropdown}
                            className="flex items-center justify-center"
                            aria-label="Profil utilisateur"
                            aria-expanded={isProfileOpen}
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            {user?.firstName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        </button>
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                              <div className="px-4 py-2 text-sm text-gray-700">
                                Connecté en tant que <span className="font-medium">
                            {user?.firstName && user?.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : user?.email
                            }
                          </span>
                                <div className="text-xs text-gray-500 capitalize">{user?.role === 'candidate' ? 'Candidat' : user?.role === 'employer' ? 'Employeur' : user?.role}</div>
                              </div>
                              <hr className="border-gray-200" />

                              {/* Éléments de menu spécifiques au rôle */}
                              {user?.role === 'employer' && (
                                  <>
                                    <Link
                                        to="/create-job"
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                      Créer une offre d'emploi
                                    </Link>
                                    <Link
                                        to="/dashboard"
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                      Mes offres d'emploi
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
                                      Mes candidatures
                                    </Link>
                                    <Link
                                        to="/saved-jobs"
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                      Emplois sauvés
                                    </Link>
                                  </>
                              )}

                              <Link
                                  to="/profile"
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={() => setIsProfileOpen(false)}
                              >
                                Paramètres du profil
                              </Link>
                              <Link
                                  to="/dashboard"
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={() => setIsProfileOpen(false)}
                              >
                                Tableau de bord
                              </Link>
                              <button
                                  onClick={handleLogout}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Se déconnecter
                              </button>
                            </div>
                        )}
                      </>
                  ) : (
                      <Link
                          to="/login"
                          className="flex items-center justify-center"
                          aria-label="Connexion"
                      >
                        <div className="w-8 h-8 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center">
                          <User size={18} className="text-gray-600" />
                        </div>
                      </Link>
                  )}
                </div>

                {/* Bouton Créer une offre d'emploi */}
                <button
                    onClick={handleCreateJobClick}
                    className="hidden sm:block text-sm text-blue-600 font-medium hover:text-blue-800"
                >
                  Créer une offre d'emploi
                </button>

                {/* Bouton menu mobile */}
                <button
                    className="md:hidden flex items-center justify-center"
                    onClick={toggleMobileMenu}
                    aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
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

          {/* Menu mobile */}
          {isMobileMenuOpen && (
              <div className="md:hidden bg-white shadow-lg absolute top-16 left-0 right-0 z-30">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <Link
                      to="/jobs"
                      className="block px-3 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Rechercher un emploi
                  </Link>
                  <Link
                      to="/companies"
                      className="block px-3 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Avis d'entreprises
                  </Link>
                  <Link
                      to="/salaries"
                      className="block px-3 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Guide des salaires
                  </Link>

                  {/* Liens mobile uniquement pour les utilisateurs authentifiés */}
                  {isAuthenticated && (
                      <>
                        {user?.role === 'candidate' && (
                            <>
                              <Link
                                  to="/saved-jobs"
                                  className="block px-3 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-100"
                                  onClick={() => setIsMobileMenuOpen(false)}
                              >
                                Emplois sauvés
                              </Link>
                              <Link
                                  to="/my-applications"
                                  className="block px-3 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-100"
                                  onClick={() => setIsMobileMenuOpen(false)}
                              >
                                Mes candidatures
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
                                Créer une offre d'emploi
                              </Link>
                              <Link
                                  to="/dashboard"
                                  className="block px-3 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-100"
                                  onClick={() => setIsMobileMenuOpen(false)}
                              >
                                Mes offres d'emploi
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
                          Paramètres du profil
                        </Link>
                        <Link
                            to="/dashboard"
                            className="block px-3 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-100"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Tableau de bord
                        </Link>
                        <button
                            onClick={(e) => {
                              handleLogout(e);
                              setIsMobileMenuOpen(false);
                            }}
                            className="block w-full text-left px-3 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-100"
                        >
                          Se déconnecter
                        </button>
                      </>
                  )}

                  {/* Bouton créer une offre d'emploi pour mobile */}
                  <button
                      onClick={() => {
                        handleCreateJobClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-blue-600 font-medium hover:bg-blue-50"
                  >
                    Créer une offre d'emploi
                  </button>
                </div>
              </div>
          )}
        </nav>
      </div>
  );
}