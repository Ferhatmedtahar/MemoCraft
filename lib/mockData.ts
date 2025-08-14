import type { Place, Review, User } from "./types";

// Mock users
export const mockUsers: User[] = [
  {
    id: "1",
    email: "john@example.com",
    name: "John Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: new Date("2024-01-15"),
    reviewCount: 12,
  },
  {
    id: "2",
    email: "sarah@example.com",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: new Date("2024-02-20"),
    reviewCount: 8,
  },
];

// Mock places
export const mockPlaces: Place[] = [
  {
    id: "1",
    name: "The Garden Bistro",
    type: "restaurant",
    description:
      "A charming Mediterranean restaurant with fresh, locally-sourced ingredients and a beautiful garden patio.",
    address: "123 Main St, Downtown",
    latitude: 40.7128,
    longitude: -74.006,
    phone: "(555) 123-4567",
    website: "https://gardenbistro.com",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    averageRating: 4.8,
    reviewCount: 124,
    priceRange: "$$",
    createdAt: new Date("2024-01-10"),
    cuisine: "Mediterranean",
    openingHours: [
      { day: "monday", open: "11:00", close: "22:00", closed: false },
      { day: "tuesday", open: "11:00", close: "22:00", closed: false },
      { day: "wednesday", open: "11:00", close: "22:00", closed: false },
      { day: "thursday", open: "11:00", close: "22:00", closed: false },
      { day: "friday", open: "11:00", close: "23:00", closed: false },
      { day: "saturday", open: "10:00", close: "23:00", closed: false },
      { day: "sunday", open: "10:00", close: "21:00", closed: false },
    ],
  },
  {
    id: "2",
    name: "Cozy Mountain Lodge",
    type: "accommodation",
    description:
      "A rustic mountain lodge offering comfortable rooms with stunning views and outdoor activities.",
    address: "456 Mountain View Rd, Mountain View",
    latitude: 40.7589,
    longitude: -73.9851,
    phone: "(555) 987-6543",
    website: "https://cozymountainlodge.com",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    averageRating: 4.6,
    reviewCount: 89,
    priceRange: "$$$",
    createdAt: new Date("2024-01-05"),
    category: "hotel",
    amenities: ["WiFi", "Parking", "Restaurant", "Hiking Trails", "Fireplace"],
    checkInTime: "15:00",
    checkOutTime: "11:00",
  },
];

// Mock reviews
export const mockReviews: Review[] = [
  {
    id: "1",
    userId: "1",
    placeId: "1",
    rating: 5,
    title: "Amazing Mediterranean Experience!",
    content:
      "The Garden Bistro exceeded all expectations. The lamb was perfectly cooked, and the garden patio created such a lovely atmosphere. Service was attentive without being intrusive.",
    images: ["/placeholder.svg?height=300&width=400"],
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-03-15"),
    helpful: 8,
    user: {
      name: "John Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "2",
    userId: "2",
    placeId: "2",
    rating: 4,
    title: "Great Mountain Getaway",
    content:
      "Perfect location for a weekend retreat. The rooms were clean and comfortable, and the mountain views were breathtaking. Only minor complaint was the WiFi was a bit slow.",
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-03-10"),
    helpful: 5,
    user: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
];
