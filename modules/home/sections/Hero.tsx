import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import Link from "next/link";

function Hero() {
  return (
    <section className="py-16 text-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold  mb-4">
          Discover Amazing Places
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Find the best restaurants and accommodations in your area. Read
          authentic reviews from real people.
        </p>

        {/* Quick Filters */}
        <div className="flex flex-wrap justify-center gap-2 mt-6 ">
          <Link href="/places">
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-yellow-400"
            >
              <Filter className="w-3 h-3 mr-1" />
              Restaurants
            </Badge>
          </Link>
          <Link href="/places">
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-yellow-400"
            >
              Hotels
            </Badge>
          </Link>
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-yellow-400"
          >
            Near Me
          </Badge>
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-yellow-400"
          >
            Top Rated
          </Badge>
        </div>
      </div>
    </section>
  );
}

export default Hero;
