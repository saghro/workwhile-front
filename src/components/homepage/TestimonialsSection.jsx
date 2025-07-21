// TestimonialsSection.jsx - Version Française
import { forwardRef } from 'react';

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Ingénieur Logiciel",
    company: "TechCorp",
    text: "Le programme de mentorat de WorkWhile m'a connecté avec un ingénieur senior qui m'a aidé à décrocher mon emploi de rêve dès la sortie de l'université.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    background: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Sarah Chen",
    role: "Associée Marketing",
    company: "Brand Global",
    text: "Les évaluations de compétences et recommandations personnalisées étaient parfaites. J'ai découvert des parcours de carrière auxquels je n'avais même pas pensé avant.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    background: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Marcus Taylor",
    role: "Analyste Financier",
    company: "Investment Partners",
    text: "Du stage à l'offre à temps plein, WorkWhile m'a guidé à chaque étape avec des ressources et un soutien que je n'aurais trouvés nulle part ailleurs.",
    image: "https://randomuser.me/api/portraits/men/57.jpg",
    background: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  }
];

const TestimonialsSection = forwardRef(({ isVisible }, ref) => {
  return (
      <section
          ref={ref}
          className="py-24 px-4 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#EDC418' }}>Histoires de Succès</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2" style={{ color: '#3c78e6' }}>Les Jeunes Professionnels Partagent leur Parcours</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">Écoutez ceux qui ont lancé des carrières réussies avec les conseils de WorkWhile.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
                <div
                    key={index}
                    className={`bg-white rounded-xl shadow-md p-4 border border-gray-100 transform transition-all duration-1000 delay-${index * 200} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                >
                  <img src={testimonial.background} alt="Arrière-plan du témoignage" className="w-full h-32 object-cover mb-4 rounded-lg" />
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role} chez {testimonial.company}</p>
                    </div>
                  </div>
                  <blockquote className="text-gray-700 italic">« {testimonial.text} »</blockquote>
                </div>
            ))}
          </div>
        </div>
      </section>
  );
});

export default TestimonialsSection;
