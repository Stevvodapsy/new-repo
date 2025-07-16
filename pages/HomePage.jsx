import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { MOCK_PROPERTIES } from "../constants.js";
import PropertyCard from "../components/PropertyCard.jsx";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  BuildingOfficeIcon,
} from "../components/icons/HeroIcons.jsx";
import { PropertyType } from "../types.js";
import { useSelector, useDispatch } from "react-redux";
import { setSearchTerm, setPropertyType } from "../store/appSlice.js";

const HeroSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.app.searchTerm);
  const propertyType = useSelector((state) => state.app.propertyType);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams({
      q: searchTerm,
      type: propertyType,
    }).toString();
    navigate(`/listings?${query}`);
  };

  return (
    <div className="relative bg-neutral-800 h-[60vh] min-h-[400px] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: "url('https://picsum.photos/seed/hero/1920/1080')",
        }}
      ></div>
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Find Your Next Home
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-neutral-200">
          The easiest way to find your perfect rental property.
        </p>
        <form
          onSubmit={handleSearch}
          className="mt-8 max-w-3xl mx-auto bg-white/90 backdrop-blur-sm rounded-lg shadow-2xl p-4 flex flex-col md:flex-row items-center gap-2"
        >
          <div className="flex-grow w-full flex items-center bg-white rounded-md pl-4">
            <MapPinIcon className="w-6 h-6 text-neutral-400" />
            <input
              type="text"
              placeholder="Enter location, city, or address"
              className="w-full p-3 bg-transparent focus:outline-none text-neutral-800"
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            />
          </div>
          <div className="w-full md:w-auto flex items-center bg-white rounded-md pl-4 border-t md:border-t-0 md:border-l border-neutral-200">
            <BuildingOfficeIcon className="w-6 h-6 text-neutral-400" />
            <select
              className="w-full p-3 bg-transparent focus:outline-none text-neutral-500 appearance-none"
              value={propertyType}
              onChange={(e) => dispatch(setPropertyType(e.target.value))}
            >
              <option value="">All Types</option>
              {Object.values(PropertyType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-md transition-colors duration-300"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

const HomePage = () => {
  const featuredProperties = MOCK_PROPERTIES.filter((p) => p.isFeatured).slice(
    0,
    3
  );
  const recentProperties = MOCK_PROPERTIES.sort(
    (a, b) =>
      new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
  ).slice(0, 6);

  return (
    <div>
      <HeroSection />

      <section className="py-16 bg-neutral-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary-dark">
              Featured Properties
            </h2>
            <p className="mt-2 text-neutral-600">
              Handpicked selections from the best in the market.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-primary-dark">
                Recently Added
              </h2>
              <p className="mt-2 text-neutral-600">
                Check out the newest listings available for rent.
              </p>
            </div>
            <Link
              to="/listings"
              className="mt-4 md:mt-0 px-6 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {recentProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl font-bold">List Your Property on Dwello</h2>
          <p className="mt-4 max-w-2xl mx-auto">
            Join thousands of landlords and agents to connect with millions of
            tenants. It's simple, fast, and effective.
          </p>
          <Link to="/signup">
            <button className="mt-8 bg-white text-primary font-bold py-3 px-8 rounded-lg hover:bg-accent transition-colors duration-300">
              Get Started Today
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
