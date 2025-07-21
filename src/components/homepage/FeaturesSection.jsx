// FeaturesSection.jsx - Version Française
import { forwardRef } from 'react';
import { Award, Calendar, Users } from 'lucide-react';

const FeaturesSection = forwardRef(({ isVisible }, ref) => {
  return (
      <section
          ref={ref}
          className="py-24 px-4 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#EDC418' }}>Notre Approche</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2" style={{ color: '#3c78e6' }}>Guider les Jeunes vers le Succès Professionnel</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">Nous combinons une technologie de pointe avec des conseils personnalisés pour aider les jeunes professionnels à découvrir et atteindre leurs aspirations de carrière.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className={`bg-white rounded-xl shadow-lg p-4 transform transition-all duration-1000 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(60, 120, 230, 0.1)' }}>
                <Award size={24} style={{ color: '#3c78e6' }} />
              </div>
              <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Évaluation des Compétences" className="w-full h-40 object-cover mb-4 rounded-lg" />
              <h3 className="text-xl font-semibold mb-2">Évaluation des Compétences</h3>
              <p className="text-gray-600">Découvrez vos forces et talents uniques grâce à nos outils d'évaluation des compétences et insights de personnalité complets.</p>
            </div>

            <div className={`bg-white rounded-xl shadow-lg p-4 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(237, 196, 24, 0.1)' }}>
                <Calendar size={24} style={{ color: '#EDC418' }} />
              </div>
              <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Feuille de Route Personnalisée" className="w-full h-40 object-cover mb-4 rounded-lg" />
              <h3 className="text-xl font-semibold mb-2">Feuille de Route Personnalisée</h3>
              <p className="text-gray-600">Obtenez un plan de développement de carrière sur mesure avec des délais, jalons et étapes concrètes pour atteindre vos objectifs professionnels.</p>
            </div>

            <div className={`bg-white rounded-xl shadow-lg p-4 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(60, 120, 230, 0.1)' }}>
                <Users size={24} style={{ color: '#3c78e6' }} />
              </div>
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Réseau de Mentorat" className="w-full h-40 object-cover mb-4 rounded-lg" />
              <h3 className="text-xl font-semibold mb-2">Réseau de Mentorat</h3>
              <p className="text-gray-600">Connectez-vous avec des professionnels de l'industrie qui fournissent des conseils, retours et insights du monde réel pour accélérer votre croissance de carrière.</p>
            </div>
          </div>
        </div>
      </section>
  );
});

export default FeaturesSection;