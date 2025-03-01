export interface CheckInInfo {
  check_in: string;
  check_out: string;
}

export interface Transportation {
  nearest_airports: {
    name: string;
    distance: string;
  }[];
  parking: string;
  metro: string;
  distance_from_center: string;
}

export interface Accessibility {
  elevator: boolean;
  wheelchair_accessible: boolean;
  accessible_rooms: boolean;
}

export interface AdditionalInfo {
  languages_spoken: string[];
  pets_allowed: boolean;
  smoking_policy: string;
}

export interface Schedules {
  breakfast: string;
  dinner: string;
  spa: string;
  fitness_center: string;
  pool: string;
  bar: string;
  restaurant: string;
  breakfast_buffet: string;
  cocktail: string;
  cocktail_alcoholic: string;
  tea_time: string;
  brunch: string;
  events: string;
  [key: string]: string;
}

export interface Experience {
  id: string;
  title: string;
  description: string;
  long_description: string;
  price: number;
  images: string[];
  category: 'spa' | 'rooftop' | 'restaurant' | 'hotel';
  location: {
    city: string;
    latitude: number;
    longitude: number;
  };
  rating: number;
  reviewCount: number;
  check_in_info: CheckInInfo;
  transportation: Transportation;
  accessibility: Accessibility;
  additional_info: AdditionalInfo;
  schedules: Schedules;
}

export interface Filter {
  date?: Date;
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  location?: string;
}