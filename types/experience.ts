export interface Experience {
  id: string;
  title: string;
  description: string;
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