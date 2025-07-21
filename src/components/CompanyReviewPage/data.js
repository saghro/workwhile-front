export const companies = [
  { id: 1, name: "Google", logo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png", rating: 4.5, reviewCount: 245 },
  { id: 2, name: "Microsoft", logo: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31", rating: 3.8, reviewCount: 128 },
  { id: 3, name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png", rating: 4.1, reviewCount: 156 },
  { id: 4, name: "Apple", logo: "https://www.apple.com/ac/globalnav/7/en_US/images/be15095f-5a20-57d0-ad14-cf4c638e223a/globalnav_apple_image__b5er5ngrzxqq_large.svg", rating: 4.7, reviewCount: 312, darkBackground: true },
  { id: 5, name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/800px-Meta_Platforms_Inc._logo.svg.png", rating: 4.2, reviewCount: 189 },
  { id: 6, name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png", rating: 3.9, reviewCount: 97 },
  { id: 7, name: "Uber", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png", rating: 4.0, reviewCount: 143 },
  { id: 8, name: "LinkedIn", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/LinkedIn_Logo.svg/2560px-LinkedIn_Logo.svg.png", rating: 4.3, reviewCount: 205 },
  { id: 9, name: "Spotify", logo: "https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png", rating: 4.6, reviewCount: 271 },
  { id: 10, name: "Tesla", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Tesla_logo.png/800px-Tesla_logo.png", rating: 3.7, reviewCount: 118 }
];

export const reviewsData = [
  {
    id: 1,
    company: "Google",
    rating: 4,
    position: "Ingénieur Logiciel",
    comment: "Excellent équilibre vie professionnelle-privée et environnement collaboratif. Le management est bienveillant et il y a beaucoup d'opportunités d'évolution.",
    date: "il y a 2 jours",
    pros: "Excellents avantages, bons collègues, opportunités d'apprentissage",
    cons: "Peut être bureaucratique parfois, environnement compétitif"
  },
  {
    id: 2,
    company: "Microsoft",
    rating: 3,
    position: "Chef de Produit",
    comment: "Avantages corrects mais la charge de travail peut être écrasante par moments. L'équipe est sympa mais le management pourrait améliorer la communication.",
    date: "il y a 1 semaine",
    pros: "Bon salaire, problèmes intéressants à résoudre",
    cons: "L'équilibre vie pro-privée pourrait être meilleur, cycle de promotion lent"
  },
  {
    id: 3,
    company: "Amazon",
    rating: 2,
    position: "Analyste de Données",
    comment: "Environnement haute pression avec des délais agressifs. On apprend beaucoup mais le burn-out est fréquent. Non recommandé pour une évolution de carrière à long terme.",
    date: "il y a 3 jours",
    pros: "Excellent sur le CV, projets stimulants",
    cons: "Mauvais équilibre vie pro-privée, fort taux de rotation"
  },
  {
    id: 4,
    company: "Apple",
    rating: 5,
    position: "Designer UX",
    comment: "J'adore absolument travailler ici ! Culture innovante, excellents avantages, et le management se soucie vraiment du bien-être des employés.",
    date: "il y a 2 semaines",
    pros: "Liberté créative, excellente rémunération, prestigieux",
    cons: "La culture du secret peut être frustrante"
  },
  {
    id: 5,
    company: "Meta",
    rating: 4,
    position: "Ingénieur Frontend",
    comment: "Travail stimulant avec des technologies de pointe. Excellents avantages et rémunération, mais parfois la direction change trop rapidement.",
    date: "il y a 5 jours",
    pros: "Technologies de pointe, rémunération généreuse",
    cons: "Les pivots stratégiques peuvent être perturbants"
  },
  {
    id: 6,
    company: "Netflix",
    rating: 4,
    position: "Stratège de Contenu",
    comment: "Culture de responsabilisation avec une rémunération de premier plan. Pas pour tout le monde, mais gratifiant si vous excellez dans des environnements autonomes.",
    date: "il y a 1 mois",
    pros: "Liberté et responsabilité, excellent salaire",
    cons: "Les attentes de performance sont très élevées"
  },
  {
    id: 7,
    company: "Uber",
    rating: 3,
    position: "Responsable des Opérations",
    comment: "Rythme rapide avec des opportunités d'avoir un impact. La culture d'entreprise s'est améliorée, mais travaille encore sur les difficultés de croissance.",
    date: "il y a 3 semaines",
    pros: "Environnement dynamique, bon pour l'évolution de carrière",
    cons: "Parfois chaotique, les priorités changent fréquemment"
  },
  {
    id: 8,
    company: "LinkedIn",
    rating: 5,
    position: "Représentant Commercial",
    comment: "Culture d'entreprise fantastique qui vit vraiment ses valeurs. Excellent équilibre vie pro-privée et management bienveillant.",
    date: "il y a 2 jours",
    pros: "Culture bienveillante, travail porteur de sens",
    cons: "Peut être lent à innover dans certains domaines"
  }
];