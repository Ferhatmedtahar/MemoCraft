import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Star } from "lucide-react";
import Link from "next/link";

function Features() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Places
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover top-rated restaurants and accommodations loved by our
            community
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            ...Array(6).fill({
              id: "1",
              name: "Restaurant Name",
              location: "123 Main St, City",
              priceRange: "$$",
              rating: 4.5,
            }),
          ].map((place) => (
            <Card
              key={place.id * Math.random()}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="aspect-video relative">
                <img
                  src={place.image || "/placeholder.svg"}
                  alt={place.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-white text-gray-900">
                  {place.type}
                </Badge>
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{place.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {place.location}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{place.priceRange}</Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{place.rating}</span>
                    <span className="text-gray-500 text-sm">
                      ({place.reviewCount})
                    </span>
                  </div>

                  <Badge variant="secondary">
                    {"cuisine" in place ? place.cuisine : place.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/places">
            <Button variant="outline" size="lg">
              View All Places
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Features;
