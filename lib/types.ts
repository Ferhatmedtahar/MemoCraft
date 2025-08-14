// Type definitions for the restaurant review platform

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  reviewCount: number;
}

export interface Place {
  id: string;
  name: string;
  type: "restaurant" | "accommodation";
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  images: string[];
  averageRating: number;
  reviewCount: number;
  priceRange: "$" | "$$" | "$$$" | "$$$$";
  createdAt: Date;

  // Restaurant specific
  cuisine?: string;
  openingHours?: OpeningHours[];

  // Accommodation specific
  category?: "hotel" | "motel" | "bnb" | "resort" | "hostel";
  amenities?: string[];
  checkInTime?: string;
  checkOutTime?: string;
}

export interface Review {
  id: string;
  userId: string;
  placeId: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
  helpful: number;

  // User info (populated)
  user?: {
    name: string;
    avatar?: string;
  };
}

export interface OpeningHours {
  day:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  open: string;
  close: string;
  closed: boolean;
}

export interface SearchFilters {
  query?: string;
  type?: "restaurant" | "accommodation" | "all";
  cuisine?: string;
  category?: string;
  priceRange?: ("$" | "$$" | "$$$" | "$$$$")[];
  rating?: number;
  location?: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  sortBy?: "rating" | "reviews" | "distance" | "name";
}
