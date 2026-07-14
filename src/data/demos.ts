export type DemoType = 'restaurant' | 'plumber';

export interface DemoConfig {
  slug: string;
  type: DemoType;
  name: string;
  city: string;
  phone: string;
  rating: string;
  heroTitle: string;
}

export interface LeadRestaurantDemoConfig extends DemoConfig {
  template: 'lead-restaurant';
  cuisine: string;
  email: string;
  facebook: string;
  tagline: string;
  description: string;
  accent: string;
  darkAccent: string;
  softAccent: string;
  heroImage: string;
  featureImage: string;
  menuImage?: string;
  galleryImages: string[];
  menuHighlights: Array<{
    name: string;
    description: string;
  }>;
  badges: string[];
}

export type AnyDemoConfig = DemoConfig | LeadRestaurantDemoConfig;

export const demos: Record<string, AnyDemoConfig> = {
  'california-street-tacos': {
    slug: 'california-street-tacos',
    type: 'restaurant',
    name: 'California Street Tacos',
    city: 'Tulsa, OK',
    phone: '(918) 605-5484',
    rating: '4.8',
    heroTitle: 'Real Street Tacos, Made Fresh Daily',
  },
  'corey-b-cookin-seafood-more': {
    slug: 'corey-b-cookin-seafood-more',
    type: 'restaurant',
    template: 'lead-restaurant',
    name: "Corey B. Cookin' Seafood & More",
    city: 'Oklahoma City, OK',
    phone: '',
    email: 'coreybcookin@gmail.com',
    facebook: 'https://www.facebook.com/p/Corey-B-Cookin-Seafood-More-61561527772926/',
    rating: 'Local favorite',
    cuisine: 'Seafood plates and fried comfort food',
    heroTitle: 'Seafood plates with serious Oklahoma flavor',
    tagline: 'Crispy fish, loaded rice, wings, sandwiches, and blue-checker basket energy.',
    description: 'A social-first seafood spot deserves a clean preview page that makes the food photos, menu board, and contact path easy to act on.',
    accent: '#0f6b8f',
    darkAccent: '#08384f',
    softAccent: '#dff4fb',
    heroImage: '/images/demos/corey-b-cookin-seafood-more/photo-10.jpg',
    featureImage: '/images/demos/corey-b-cookin-seafood-more/photo-15.jpg',
    menuImage: '/images/demos/corey-b-cookin-seafood-more/photo-14.jpg',
    galleryImages: [
      '/images/demos/corey-b-cookin-seafood-more/photo-04.jpg',
      '/images/demos/corey-b-cookin-seafood-more/photo-05.jpg',
      '/images/demos/corey-b-cookin-seafood-more/photo-07.jpg',
      '/images/demos/corey-b-cookin-seafood-more/photo-09.jpg',
      '/images/demos/corey-b-cookin-seafood-more/photo-16.jpg',
      '/images/demos/corey-b-cookin-seafood-more/photo-23.jpg',
    ],
    menuHighlights: [
      { name: 'Seafood Combos', description: 'Fried fish, shrimp, crab, and hot sides built for big appetites.' },
      { name: 'Loaded Rice Plates', description: 'Garlic fried rice topped with seafood, chicken, sausage, and sauce.' },
      { name: 'Sandwiches and Wings', description: 'Comfort-food staples with the same seafood-shack personality.' },
    ],
    badges: ['Seafood', 'Oklahoma City', 'Menu board ready'],
  },
  'lidias-food-truck': {
    slug: 'lidias-food-truck',
    type: 'restaurant',
    template: 'lead-restaurant',
    name: "Lidia's Food Truck",
    city: 'Tulsa, OK',
    phone: '(918) 402-2364',
    email: 'lidiascomidas@gmail.com',
    facebook: 'https://www.facebook.com/Lidiasalinas28/',
    rating: '4.6 / 47',
    cuisine: 'Tacos, tortas, burritos, and plates',
    heroTitle: 'Fresh tacos from a Tulsa food truck',
    tagline: 'Colorful plates, quick lunch runs, and a menu that already photographs beautifully.',
    description: "This preview turns Lidia's Facebook-first presence into a direct, mobile-friendly ordering and contact page.",
    accent: '#d62828',
    darkAccent: '#6f1d1b',
    softAccent: '#ffe3da',
    heroImage: '/images/demos/lidias-food-truck/photo-10.jpg',
    featureImage: '/images/demos/lidias-food-truck/photo-03.jpg',
    menuImage: '/images/demos/lidias-food-truck/photo-03.jpg',
    galleryImages: [
      '/images/demos/lidias-food-truck/photo-04.jpg',
      '/images/demos/lidias-food-truck/photo-05.jpg',
      '/images/demos/lidias-food-truck/photo-07.jpg',
      '/images/demos/lidias-food-truck/photo-08.jpg',
      '/images/demos/lidias-food-truck/photo-09.jpg',
      '/images/demos/lidias-food-truck/photo-13.jpg',
    ],
    menuHighlights: [
      { name: 'Street Tacos', description: 'Corn tortillas, fresh cilantro, onion, lime, salsa, and grilled meats.' },
      { name: 'Lunch Plates', description: 'Rice, beans, tortillas, and hearty portions for a full meal.' },
      { name: 'Truck Favorites', description: 'Tortas, burritos, fries, and combo boxes ready for pickup.' },
    ],
    badges: ['Food truck', 'Tulsa', 'Call ahead'],
  },
  'taco-fajita': {
    slug: 'taco-fajita',
    type: 'restaurant',
    template: 'lead-restaurant',
    name: 'Taco fajita',
    city: 'Wichita, KS',
    phone: '',
    email: 'tacofajitaks@gmail.com',
    facebook: 'https://www.facebook.com/p/Taco-fajita-100063740882304/',
    rating: 'Social favorite',
    cuisine: 'Mexican tacos, fajitas, burritos, and quesadillas',
    heroTitle: 'Fajita tacos, hot plates, and fast pickup',
    tagline: 'A simple preview page for a social-first Wichita taco spot with plenty of real food photos.',
    description: "The site turns Taco fajita's strongest photos and menu-board shots into a clean page customers can open from Google, Facebook, or a text message.",
    accent: '#2f7d32',
    darkAccent: '#123c1d',
    softAccent: '#e4f6df',
    heroImage: '/images/demos/taco-fajita/photo-02.jpg',
    featureImage: '/images/demos/taco-fajita/photo-04.jpg',
    menuImage: '/images/demos/taco-fajita/photo-04.jpg',
    galleryImages: [
      '/images/demos/taco-fajita/photo-03.jpg',
      '/images/demos/taco-fajita/photo-06.jpg',
      '/images/demos/taco-fajita/photo-07.jpg',
      '/images/demos/taco-fajita/photo-09.jpg',
      '/images/demos/taco-fajita/photo-11.jpg',
      '/images/demos/taco-fajita/photo-15.jpg',
    ],
    menuHighlights: [
      { name: 'Fajita Tacos', description: 'Grilled meat, peppers, onions, and salsa tucked into warm tortillas.' },
      { name: 'Quesadillas and Burritos', description: 'Fast handheld favorites for lunch, dinner, and takeout.' },
      { name: 'Loaded Plates', description: 'Rice, beans, taco plates, and bright toppings for a full meal.' },
    ],
    badges: ['Mexican food', 'Wichita', 'Social-first'],
  },
};

export const getDemoBySlug = (slug: string) => demos[slug];
