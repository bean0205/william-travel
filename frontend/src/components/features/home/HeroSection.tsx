import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 py-20 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Discover Amazing Places Around the World
            </h1>
            <p className="mb-6 text-lg opacity-90">
              Explore interactive maps, find hidden gems, and plan your next adventure
              with our comprehensive travel platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/map"
                className="rounded-md bg-white px-6 py-3 font-medium text-primary-600 transition-colors hover:bg-gray-100"
              >
                Explore Map
              </Link>
              <Link
                to="/locations"
                className="rounded-md border border-white bg-transparent px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
              >
                View Destinations
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="rounded-lg bg-white p-3 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt="Travel Destination"
                className="aspect-video h-full w-full rounded object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
