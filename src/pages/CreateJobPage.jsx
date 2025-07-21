// ✅ TRADUIT EN FRANÇAIS: CreateJobPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jobService from '../services/jobService';
import companyService from '../services/companyService';

const CreateJobPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [company, setCompany] = useState(null);
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector(state => state.auth);

    // ✅ TRADUIT: Données du formulaire avec de meilleurs défauts
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        type: 'temps-plein',
        category: '',
        experienceLevel: 'intermediaire',
        salaryMin: '',
        salaryMax: '',
        salaryCurrency: 'MAD',
        salaryPeriod: 'mensuel',
        isRemote: false,
        skills: '',
        benefits: '',
        requirements: '',
        deadlineDate: '',
        urgency: 'moyenne',
        tags: ''
    });

    // État de création d'entreprise
    const [showCompanyForm, setShowCompanyForm] = useState(false);
    const [companyData, setCompanyData] = useState({
        name: '',
        description: '',
        industry: '',
        size: '',
        location: '',
        website: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        // Rediriger si non authentifié ou non employeur
        if (!isAuthenticated) {
            navigate('/login', { state: { from: '/create-job' } });
            return;
        }

        if (user?.role !== 'employer' && user?.role !== 'admin') {
            navigate('/jobs', {
                state: {
                    message: 'Seuls les employeurs peuvent créer des offres d\'emploi. Veuillez vous inscrire en tant qu\'employeur.',
                    type: 'error'
                }
            });
            return;
        }

        // Vérifier si l'utilisateur a une entreprise
        const fetchCompany = async () => {
            try {
                const userCompany = await companyService.getMyCompany();
                setCompany(userCompany);
                // eslint-disable-next-line no-unused-vars
            } catch (err) {
                console.log('Aucune entreprise trouvée pour l\'utilisateur');
                setShowCompanyForm(true);
            }
        };

        fetchCompany();
    }, [isAuthenticated, user, navigate]);

    // ✅ AMÉLIORÉ: Meilleur gestionnaire d'entrée avec validation différée
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        // Effacer les erreurs quand l'utilisateur commence à taper
        if (error && newValue !== '') {
            setError(null);
        }
    };

    const handleCompanyInputChange = (e) => {
        const { name, value } = e.target;
        setCompanyData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // ✅ AMÉLIORÉ: Validation d'entreprise améliorée
    const validateCompanyForm = () => {
        const requiredFields = {
            name: 'Nom de l\'entreprise',
            industry: 'Secteur d\'activité',
            size: 'Taille de l\'entreprise',
            location: 'Localisation',
            phone: 'Numéro de téléphone'
        };

        const missingFields = [];
        const errors = [];

        Object.entries(requiredFields).forEach(([field, label]) => {
            if (!companyData[field]?.trim()) {
                missingFields.push(label);
            }
        });

        if (missingFields.length > 0) {
            errors.push(`Veuillez remplir tous les champs obligatoires : ${missingFields.join(', ')}`);
        }

        // Validation du téléphone
        const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
        if (companyData.phone && !phoneRegex.test(companyData.phone.trim())) {
            errors.push('Veuillez saisir un numéro de téléphone valide (au moins 10 chiffres)');
        }

        // Validation de l'email (optionnel)
        if (companyData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(companyData.email.trim())) {
                errors.push('Veuillez saisir une adresse email valide');
            }
        }

        // Validation du site web (optionnel)
        if (companyData.website) {
            try {
                new URL(companyData.website);
            } catch {
                errors.push('Veuillez saisir une URL de site web valide');
            }
        }

        if (errors.length > 0) {
            setError(errors.join('. '));
            return false;
        }

        return true;
    };

    const handleCompanySubmit = async (e) => {
        e.preventDefault();

        if (!validateCompanyForm()) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const newCompany = await companyService.createCompany(companyData);
            setCompany(newCompany);
            setShowCompanyForm(false);

        } catch (err) {
            setError(err.message || 'Échec de la création du profil d\'entreprise');
        } finally {
            setLoading(false);
        }
    };

    // ✅ AMÉLIORÉ: Validation de formulaire complète avec messages d'erreur détaillés
    const validateForm = () => {
        const errors = [];

        // Validation des champs obligatoires
        if (!formData.title?.trim()) {
            errors.push('Le titre du poste est obligatoire');
        } else if (formData.title.trim().length < 3) {
            errors.push('Le titre du poste doit contenir au moins 3 caractères');
        }

        if (!formData.description?.trim()) {
            errors.push('La description du poste est obligatoire');
        } else if (formData.description.trim().length < 50) {
            errors.push('La description du poste doit contenir au moins 50 caractères');
        }

        if (!formData.location?.trim()) {
            errors.push('La localisation est obligatoire');
        } else if (formData.location.trim().length < 2) {
            errors.push('La localisation doit contenir au moins 2 caractères');
        }

        if (!formData.category?.trim()) {
            errors.push('La catégorie est obligatoire');
        } else if (formData.category.trim().length < 2) {
            errors.push('La catégorie doit contenir au moins 2 caractères');
        }

        // Validation du salaire
        if (formData.salaryMin || formData.salaryMax) {
            const minSalary = parseFloat(formData.salaryMin);
            const maxSalary = parseFloat(formData.salaryMax);

            if (formData.salaryMin && (isNaN(minSalary) || minSalary < 0)) {
                errors.push('Le salaire minimum doit être un nombre positif valide');
            }

            if (formData.salaryMax && (isNaN(maxSalary) || maxSalary < 0)) {
                errors.push('Le salaire maximum doit être un nombre positif valide');
            }

            if (formData.salaryMin && formData.salaryMax && minSalary >= maxSalary) {
                errors.push('Le salaire maximum doit être supérieur au salaire minimum');
            }
        }

        // Validation de la date
        if (formData.deadlineDate) {
            const deadline = new Date(formData.deadlineDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (deadline <= today) {
                errors.push('La date limite doit être dans le futur');
            }
        }

        if (errors.length > 0) {
            setError(errors.join('. '));
            return false;
        }

        setError(null);
        return true;
    };

    // ✅ CORRIGÉ: Création d'emploi améliorée avec transformation appropriée des données
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // ✅ CORRIGÉ: Structurer correctement les données d'emploi pour l'API
            const jobData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                location: formData.location.trim(),
                type: formData.type,
                category: formData.category.trim(),
                experienceLevel: formData.experienceLevel,
                isRemote: formData.isRemote,
                urgency: formData.urgency
            };

            // ✅ CORRIGÉ: Gestion appropriée du salaire
            if (formData.salaryMin || formData.salaryMax) {
                jobData.salary = {
                    currency: formData.salaryCurrency,
                    period: formData.salaryPeriod
                };

                if (formData.salaryMin && !isNaN(parseFloat(formData.salaryMin))) {
                    jobData.salary.min = parseFloat(formData.salaryMin);
                }

                if (formData.salaryMax && !isNaN(parseFloat(formData.salaryMax))) {
                    jobData.salary.max = parseFloat(formData.salaryMax);
                }
            }

            // ✅ CORRIGÉ: Gestion appropriée des tableaux
            if (formData.skills?.trim()) {
                jobData.skills = formData.skills
                    .split(',')
                    .map(s => s.trim())
                    .filter(s => s.length > 0);
            }

            if (formData.benefits?.trim()) {
                jobData.benefits = formData.benefits
                    .split('\n')
                    .map(b => b.trim())
                    .filter(b => b.length > 0);
            }

            if (formData.requirements?.trim()) {
                jobData.requirements = formData.requirements
                    .split('\n')
                    .map(r => r.trim())
                    .filter(r => r.length > 0);
            }

            if (formData.tags?.trim()) {
                jobData.tags = formData.tags
                    .split(',')
                    .map(t => t.trim().toLowerCase())
                    .filter(t => t.length > 0);
            }

            // ✅ CORRIGÉ: Gestion appropriée de la date
            if (formData.deadlineDate) {
                jobData.deadlineDate = formData.deadlineDate;
            }

            // ✅ CORRIGÉ: Ajouter l'entreprise si disponible
            if (company?._id) {
                jobData.company = company._id;
            }

            console.log('📤 Soumission des données d\'emploi:', jobData);

            const createdJob = await jobService.createJob(jobData);

            console.log('✅ Emploi créé avec succès:', createdJob);

            setSuccess(true);

            // Rediriger vers les détails de l'emploi après 2 secondes
            setTimeout(() => {
                navigate(`/jobs/${createdJob._id}`, {
                    state: {
                        message: 'Offre d\'emploi créée avec succès !',
                        type: 'success'
                    }
                });
            }, 2000);

        } catch (err) {
            console.error('❌ Échec de la création d\'emploi:', err);
            setError(err.message || 'Échec de la création de l\'offre d\'emploi. Veuillez vérifier vos données et réessayer.');
        } finally {
            setLoading(false);
        }
    };

    // Afficher le formulaire de création d'entreprise si nécessaire
    if (showCompanyForm) {
        return (
            <div className="max-w-2xl mx-auto px-4 mt-24 mb-16">
                <div className="bg-white border rounded-lg shadow-sm p-6 md:p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Créer un Profil d'Entreprise</h1>
                    <p className="text-gray-600 mb-6">
                        Avant de créer une offre d'emploi, vous devez configurer votre profil d'entreprise.
                    </p>

                    <form onSubmit={handleCompanySubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom de l'entreprise <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="companyName"
                                    name="name"
                                    required
                                    value={companyData.name}
                                    onChange={handleCompanyInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Saisissez le nom de l'entreprise"
                                />
                            </div>

                            <div>
                                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                                    Secteur d'activité <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="industry"
                                    name="industry"
                                    required
                                    value={companyData.industry}
                                    onChange={handleCompanyInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Sélectionner un secteur</option>
                                    <option value="technology">Technologie</option>
                                    <option value="finance">Finance</option>
                                    <option value="healthcare">Santé</option>
                                    <option value="education">Éducation</option>
                                    <option value="retail">Commerce de détail</option>
                                    <option value="manufacturing">Industrie</option>
                                    <option value="consulting">Conseil</option>
                                    <option value="other">Autre</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
                                    Taille de l'entreprise <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="size"
                                    name="size"
                                    required
                                    value={companyData.size}
                                    onChange={handleCompanyInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Sélectionner la taille</option>
                                    <option value="1-10">1-10 employés</option>
                                    <option value="11-50">11-50 employés</option>
                                    <option value="51-200">51-200 employés</option>
                                    <option value="201-500">201-500 employés</option>
                                    <option value="501-1000">501-1000 employés</option>
                                    <option value="1000+">1000+ employés</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="companyLocation" className="block text-sm font-medium text-gray-700 mb-2">
                                    Localisation <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="companyLocation"
                                    name="location"
                                    required
                                    value={companyData.location}
                                    onChange={handleCompanyInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="ex. Casablanca, Maroc"
                                />
                            </div>

                            <div>
                                <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700 mb-2">
                                    Numéro de téléphone <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="companyPhone"
                                    name="phone"
                                    required
                                    value={companyData.phone}
                                    onChange={handleCompanyInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="+212 XX XX XX XX"
                                />
                            </div>

                            <div>
                                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                                    Site web
                                </label>
                                <input
                                    type="url"
                                    id="website"
                                    name="website"
                                    value={companyData.website}
                                    onChange={handleCompanyInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="https://votreentreprise.com"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email de l'entreprise
                                </label>
                                <input
                                    type="email"
                                    id="companyEmail"
                                    name="email"
                                    value={companyData.email}
                                    onChange={handleCompanyInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="contact@votreentreprise.com"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700 mb-2">
                                    Description de l'entreprise
                                </label>
                                <textarea
                                    id="companyDescription"
                                    name="description"
                                    rows="3"
                                    value={companyData.description}
                                    onChange={handleCompanyInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Brève description de votre entreprise..."
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                                <p className="text-red-600">{error}</p>
                            </div>
                        )}

                        <div className="mt-6 flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/jobs')}
                                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-6 py-3 ${
                                    loading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                } text-white font-medium rounded-md`}
                            >
                                {loading ? 'Création...' : 'Créer l\'entreprise'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 mt-24 mb-16">
            <div className="mb-6">
                <button
                    onClick={() => navigate('/jobs')}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Retour aux emplois
                </button>
            </div>

            <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 border-b">
                    <h1 className="text-3xl font-bold text-gray-900">Créer une Offre d'Emploi</h1>
                    <p className="mt-2 text-gray-600">
                        Publiez une nouvelle offre d'emploi et trouvez le candidat parfait pour votre équipe
                    </p>
                    {company && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-sm text-blue-800">
                                <span className="font-medium">Publication au nom de :</span> {company.name}
                            </p>
                        </div>
                    )}
                </div>

                {success ? (
                    <div className="p-6 md:p-8 text-center">
                        <div className="mb-4">
                            <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-green-600 mb-2">Emploi Créé avec Succès !</h2>
                        <p className="text-gray-600">
                            Votre offre d'emploi a été publiée et est maintenant en ligne. Vous serez redirigé sous peu...
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 md:p-8">
                        <div className="space-y-8">
                            {/* Section Informations de Base */}
                            <div className="border-b border-gray-200 pb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de Base</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                            Titre du poste <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            required
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="ex. Développeur Full Stack Senior"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                            Localisation <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            required
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="ex. Casablanca, Maroc"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                                            Type d'emploi
                                        </label>
                                        <select
                                            id="type"
                                            name="type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="temps-plein">Temps plein</option>
                                            <option value="temps-partiel">Temps partiel</option>
                                            <option value="contrat">Contrat</option>
                                            <option value="freelance">Freelance</option>
                                            <option value="stage">Stage</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                            Catégorie <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="category"
                                            name="category"
                                            required
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="ex. Développement logiciel"
                                            list="category-suggestions"
                                        />
                                        <datalist id="category-suggestions">
                                            <option value="Développement logiciel" />
                                            <option value="Marketing" />
                                            <option value="Ventes" />
                                            <option value="Service client" />
                                            <option value="Finance" />
                                            <option value="Ressources humaines" />
                                            <option value="Design" />
                                            <option value="Science des données" />
                                            <option value="Gestion de projet" />
                                        </datalist>
                                    </div>

                                    <div>
                                        <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-2">
                                            Niveau d'expérience
                                        </label>
                                        <select
                                            id="experienceLevel"
                                            name="experienceLevel"
                                            value={formData.experienceLevel}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="debutant">Débutant</option>
                                            <option value="intermediaire">Intermédiaire</option>
                                            <option value="senior">Senior</option>
                                            <option value="directeur">Directeur</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <div className="flex items-center">
                                            <input
                                                id="isRemote"
                                                name="isRemote"
                                                type="checkbox"
                                                checked={formData.isRemote}
                                                onChange={handleInputChange}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="isRemote" className="ml-2 block text-sm text-gray-900">
                                                Travail à distance disponible
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section Description du Poste */}
                            <div className="border-b border-gray-200 pb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Description du Poste</h3>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows="8"
                                        required
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Fournissez une description détaillée du poste, des responsabilités et de ce que vous recherchez chez un candidat..."
                                    />
                                    <p className="mt-1 text-sm text-gray-600">
                                        {formData.description.length}/50 caractères minimum
                                    </p>
                                </div>
                            </div>

                            {/* Informations Salariales */}
                            <div className="border-b border-gray-200 pb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations Salariales</h3>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div>
                                        <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700 mb-2">
                                            Salaire minimum
                                        </label>
                                        <input
                                            type="number"
                                            id="salaryMin"
                                            name="salaryMin"
                                            min="0"
                                            step="1000"
                                            value={formData.salaryMin}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="ex. 8000"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700 mb-2">
                                            Salaire maximum
                                        </label>
                                        <input
                                            type="number"
                                            id="salaryMax"
                                            name="salaryMax"
                                            min="0"
                                            step="1000"
                                            value={formData.salaryMax}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="ex. 15000"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="salaryCurrency" className="block text-sm font-medium text-gray-700 mb-2">
                                            Devise
                                        </label>
                                        <select
                                            id="salaryCurrency"
                                            name="salaryCurrency"
                                            value={formData.salaryCurrency}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="MAD">MAD</option>
                                            <option value="USD">USD</option>
                                            <option value="EUR">EUR</option>
                                            <option value="GBP">GBP</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="salaryPeriod" className="block text-sm font-medium text-gray-700 mb-2">
                                            Période
                                        </label>
                                        <select
                                            id="salaryPeriod"
                                            name="salaryPeriod"
                                            value={formData.salaryPeriod}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="horaire">Horaire</option>
                                            <option value="quotidien">Quotidien</option>
                                            <option value="hebdomadaire">Hebdomadaire</option>
                                            <option value="mensuel">Mensuel</option>
                                            <option value="annuel">Annuel</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Exigences et Compétences */}
                            <div className="border-b border-gray-200 pb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Exigences et Compétences</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                                            Compétences requises (séparées par des virgules)
                                        </label>
                                        <textarea
                                            id="skills"
                                            name="skills"
                                            rows="4"
                                            value={formData.skills}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="JavaScript, React, Node.js, MongoDB, etc."
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                                            Exigences (une par ligne)
                                        </label>
                                        <textarea
                                            id="requirements"
                                            name="requirements"
                                            rows="4"
                                            value={formData.requirements}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Licence en informatique&#10;3+ années d'expérience&#10;Excellentes compétences en communication"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-2">
                                        Avantages (un par ligne)
                                    </label>
                                    <textarea
                                        id="benefits"
                                        name="benefits"
                                        rows="4"
                                        value={formData.benefits}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Assurance santé&#10;Options de travail à distance&#10;Budget de développement professionnel&#10;Horaires flexibles"
                                    />
                                </div>
                            </div>

                            {/* Paramètres Supplémentaires */}
                            <div className="border-b border-gray-200 pb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres Supplémentaires</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="deadlineDate" className="block text-sm font-medium text-gray-700 mb-2">
                                            Date limite de candidature
                                        </label>
                                        <input
                                            type="date"
                                            id="deadlineDate"
                                            name="deadlineDate"
                                            min={new Date().toISOString().split('T')[0]}
                                            value={formData.deadlineDate}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
                                            Urgence
                                        </label>
                                        <select
                                            id="urgency"
                                            name="urgency"
                                            value={formData.urgency}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="faible">Faible</option>
                                            <option value="moyenne">Moyenne</option>
                                            <option value="élevée">Élevée</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                                            Mots-clés (séparés par des virgules)
                                        </label>
                                        <input
                                            type="text"
                                            id="tags"
                                            name="tags"
                                            value={formData.tags}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="senior, javascript, télétravail, fintech, etc."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Message d'Erreur */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">Erreur lors de la création de l'emploi</h3>
                                            <p className="text-sm text-red-600 mt-1">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Section de Soumission */}
                            <div className="flex justify-between items-center pt-8">
                                <button
                                    type="button"
                                    onClick={() => navigate('/jobs')}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50"
                                >
                                    Annuler
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`px-8 py-3 ${
                                        loading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                    } text-white font-medium rounded-md flex items-center`}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Création de l'emploi...
                                        </>
                                    ) : (
                                        'Publier l\'emploi'
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CreateJobPage;