// src/components/common/Footer.jsx
import { Link } from 'react-router-dom';

export default function Footer() {
  // Couleur qui complemente l'arrière-plan jaune (#EDC418) de la section CTA
  const footerBgColor = "#2A2D3E"; // Un bleu-gris profond qui complemente le jaune

  return (
      <footer
          className="text-gray-300 py-12 px-4"
          style={{ backgroundColor: footerBgColor }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-white mb-3">WorkWhile</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-yellow-200 transition">À propos</Link></li>
              <li><Link to="/mission" className="hover:text-yellow-200 transition">Notre mission</Link></li>
              <li><Link to="/careers" className="hover:text-yellow-200 transition">Carrières</Link></li>
              <li><Link to="/contact" className="hover:text-yellow-200 transition">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-3">Pour les candidats</h3>
            <ul className="space-y-2">
              <li><Link to="/jobs" className="hover:text-yellow-200 transition">Parcourir les emplois</Link></li>
              <li><Link to="/assessment" className="hover:text-yellow-200 transition">Évaluation de carrière</Link></li>
              <li><Link to="/mentors" className="hover:text-yellow-200 transition">Trouver des mentors</Link></li>
              <li><Link to="/resources" className="hover:text-yellow-200 transition">Ressources d'apprentissage</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-3">Pour les employeurs</h3>
            <ul className="space-y-2">
              <li><Link to="/post-job" className="hover:text-yellow-200 transition">Publier une offre</Link></li>
              <li><Link to="/talent-solutions" className="hover:text-yellow-200 transition">Solutions talents</Link></li>
              <li><Link to="/become-mentor" className="hover:text-yellow-200 transition">Devenir mentor</Link></li>
              <li><Link to="/partnerships" className="hover:text-yellow-200 transition">Partenariats</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-3">Légal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="hover:text-yellow-200 transition">Politique de confidentialité</Link></li>
              <li><Link to="/terms" className="hover:text-yellow-200 transition">Conditions d'utilisation</Link></li>
              <li><Link to="/cookies" className="hover:text-yellow-200 transition">Politique des cookies</Link></li>
              <li><Link to="/accessibility" className="hover:text-yellow-200 transition">Accessibilité</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400">© 2025 WorkWhile. Tous droits réservés.</p>
        </div>
      </footer>
  );
}