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

export const demos: Record<string, DemoConfig> = {
  'california-street-tacos': {
    slug: 'california-street-tacos',
    type: 'restaurant',
    name: 'California Street Tacos',
    city: 'Tulsa, OK',
    phone: '(918) 605-5484',
    rating: '4.8',
    heroTitle: 'Real Street Tacos, Made Fresh Daily',
  },
};

export const getDemoBySlug = (slug: string) => demos[slug];
