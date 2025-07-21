import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { registerUser } from '../redux/slices/authActions';
import { clearError } from '../redux/slices/authSlice';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    username: '',
    role: 'candidate' // Rôle par défaut
  });
  const [formError, setFormError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user, isAuthenticated, loading, error } = useSelector(state => state.auth);

  // Obtenir le chemin de redirection depuis l'état de location ou par défaut vers la page emplois
  const from = location.state?.from || '/jobs';

  useEffect(() => {
    // Effacer toutes les erreurs existantes quand le composant se monte
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    // Si l'utilisateur est authentifié, rediriger en conséquence
    if (isAuthenticated && user) {
      if (user.needsProfileSetup) {
        navigate('/profile-setup', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, from]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setFormError('Les mots de passe ne correspondent pas');
      return false;
    }

    if (formData.password.length < 6) {
      setFormError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }

    if (!formData.name.trim()) {
      setFormError('Le nom complet est requis');
      return false;
    }

    if (!formData.email.trim()) {
      setFormError('L\'adresse e-mail est requise');
      return false;
    }

    if (!formData.role) {
      setFormError('Veuillez sélectionner un rôle');
      return false;
    }

    // Effacer les erreurs précédentes du formulaire
    setFormError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Créer l'objet de données d'inscription pour l'API
    const userData = {
      email: formData.email,
      password: formData.password,
      firstName: formData.name.split(' ')[0],
      lastName: formData.name.split(' ').slice(1).join(' ') || formData.name.split(' ')[0],
      username: formData.username || formData.email.split('@')[0],
      role: formData.role // Utiliser le rôle sélectionné
    };

    try {
      const response = await dispatch(registerUser(userData)).unwrap();
      console.log('Inscription réussie:', response);
      // Rediriger en fonction du rôle
      if (userData.role === 'candidate') {
        navigate('/profile-setup', { replace: true });
      } else {
        navigate('/jobs', { replace: true });
      }
    } catch (err) {
      console.error('Échec de l\'inscription:', err);
      setFormError(err.message || 'Échec de l\'inscription');
    }
  };

  const roleOptions = [
    { value: 'candidate', label: 'Chercheur d\'emploi', description: 'À la recherche d\'opportunités d\'emploi' },
    { value: 'employer', label: 'Employeur', description: 'Recruter des talents pour votre entreprise' },
  ];

  return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer un nouveau compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Vous avez déjà un compte ?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Se connecter
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {(error || formError) && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {formError || error}
                </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Sélection du rôle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Je souhaite m'inscrire en tant que :
                </label>
                <div className="space-y-3">
                  {roleOptions.map((option) => (
                      <div key={option.value} className="relative">
                        <label className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                              type="radio"
                              name="role"
                              value={option.value}
                              checked={formData.role === option.value}
                              onChange={handleChange}
                              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <div className="ml-3">
                            <div className="font-medium text-gray-900">{option.label}</div>
                            <div className="text-sm text-gray-500">{option.description}</div>
                          </div>
                        </label>
                      </div>
                  ))}
                </div>
              </div>

              {/* Nom complet */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom complet
                </label>
                <div className="mt-1">
                  <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Entrez votre nom complet"
                  />
                </div>
              </div>

              {/* Nom d'utilisateur */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Nom d'utilisateur (optionnel)
                </label>
                <div className="mt-1">
                  <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Choisissez un nom d'utilisateur"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Si laissé vide, le nom d'utilisateur sera créé à partir de votre e-mail.
                </p>
              </div>

              {/* E-mail */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Adresse e-mail
                </label>
                <div className="mt-1">
                  <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Entrez votre adresse e-mail"
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <div className="mt-1">
                  <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Créez un mot de passe"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Le mot de passe doit contenir au moins 6 caractères.
                </p>
              </div>

              {/* Confirmer le mot de passe */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmer le mot de passe
                </label>
                <div className="mt-1">
                  <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Confirmez votre mot de passe"
                  />
                </div>
              </div>

              {/* Bouton de soumission */}
              <div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                        loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                >
                  {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Création du compte...
                      </>
                  ) : (
                      `Créer un compte ${formData.role === 'employer' ? 'Employeur' : 'Chercheur d\'emploi'}`
                  )}
                </button>
              </div>
            </form>

            {/* Conditions d'utilisation et confidentialité */}
            <div className="mt-6">
              <p className="text-xs text-gray-500 text-center">
                En créant un compte, vous acceptez nos{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">Conditions d'utilisation</a>
                {' '}et notre{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">Politique de confidentialité</a>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default RegisterPage;