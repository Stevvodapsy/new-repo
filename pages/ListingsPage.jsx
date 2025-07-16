import React, { useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { MOCK_PROPERTIES, ALL_AMENITIES } from "../constants.js";
import PropertyCard from "../components/PropertyCard.jsx";
import { PropertyType } from "../types.js";
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
} from "../components/icons/HeroIcons.jsx";
import { useSelector, useDispatch } from "react-redux";
import { setFilters, setSortBy, resetFilters } from "../store/appSlice";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const SmartSearchBar = ({
  value,
  onChange,
  suggestions,
  onSuggestionClick,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef();
  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        placeholder="Search for location, type, etc."
        className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:ring-primary focus:border-primary"
      />
      <MagnifyingGlassIcon className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-neutral-200 w-full mt-1 rounded shadow max-h-48 overflow-y-auto">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer"
              onMouseDown={() => onSuggestionClick(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const FilterSidebar = ({ filters, onFilterChange, onReset, allProperties }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    const currentValues = filters[name] || [];
    if (checked) {
      onFilterChange({ ...filters, [name]: [...currentValues, value] });
    } else {
      onFilterChange({
        ...filters,
        [name]: currentValues.filter((v) => v !== value),
      });
    }
  };

  // Smart search suggestions
  const [searchInput, setSearchInput] = useState(filters.q || "");
  const suggestions = useMemo(() => {
    if (!searchInput) return [];
    const lower = searchInput.toLowerCase();
    const locs = allProperties
      .map((p) => p.address)
      .filter((addr) => addr.toLowerCase().includes(lower));
    const titles = allProperties
      .map((p) => p.title)
      .filter((t) => t.toLowerCase().includes(lower));
    const types = allProperties
      .map((p) => p.type)
      .filter((t) => t.toLowerCase().includes(lower));
    return Array.from(new Set([...locs, ...titles, ...types])).slice(0, 8);
  }, [searchInput, allProperties]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6 h-fit sticky top-24">
      {/* Smart Search Bar */}
      <label className="text-sm font-semibold text-neutral-700">
        Smart Search
      </label>
      <SmartSearchBar
        value={searchInput}
        onChange={(e) => {
          setSearchInput(e.target.value);
          onFilterChange({ ...filters, q: e.target.value });
        }}
        suggestions={suggestions}
        onSuggestionClick={(s) => {
          setSearchInput(s);
          onFilterChange({ ...filters, q: s });
        }}
      />

      <div className="flex justify-between items-center border-b pb-4">
        <h3 className="text-xl font-bold text-primary-dark flex items-center gap-2">
          <FunnelIcon className="w-5 h-5" />
          Filters
        </h3>
        <button
          onClick={onReset}
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          <ArrowPathIcon className="w-4 h-4" />
          Reset
        </button>
      </div>

      <div>
        <label className="text-sm font-semibold text-neutral-700">
          Keyword Search
        </label>
        <div className="relative mt-1">
          <input
            type="text"
            name="q"
            value={filters.q || ""}
            onChange={handleInputChange}
            placeholder="e.g. Lekki, cozy"
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:ring-primary focus:border-primary"
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-neutral-700">
          Property Type
        </label>
        <div className="mt-2 space-y-2">
          {Object.values(PropertyType).map((type) => (
            <div key={type} className="flex items-center">
              <input
                id={`type-${type}`}
                name="type"
                type="checkbox"
                value={type}
                checked={filters.type?.includes(type) || false}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor={`type-${type}`}
                className="ml-3 text-sm text-neutral-600"
              >
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-neutral-700">
          Price Range (/year)
        </label>
        <div className="flex items-center gap-2 mt-1">
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice || ""}
            onChange={handleInputChange}
            placeholder="Min"
            className="w-full p-2 border border-neutral-300 rounded-md"
          />
          <span className="text-neutral-500">-</span>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice || ""}
            onChange={handleInputChange}
            placeholder="Max"
            className="w-full p-2 border border-neutral-300 rounded-md"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-neutral-700">
          Bedrooms
        </label>
        <select
          name="bedrooms"
          value={filters.bedrooms || ""}
          onChange={handleInputChange}
          className="w-full mt-1 p-2 border border-neutral-300 rounded-md"
        >
          <option value="">Any</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}+ Beds
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold text-neutral-700">
          Amenities
        </label>
        <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
          {ALL_AMENITIES.map((amenity) => (
            <div key={amenity.id} className="flex items-center">
              <input
                id={`amenity-${amenity.id}`}
                name="amenities"
                type="checkbox"
                value={amenity.name}
                checked={filters.amenities?.includes(amenity.name) || false}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor={`amenity-${amenity.id}`}
                className="ml-3 text-sm text-neutral-600"
              >
                {amenity.name}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ListingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.app.filters);
  const sortBy = useSelector((state) => state.app.sortBy);
  const [user] = useAuthState(auth);
  const [favorites, setFavorites] = React.useState([]);
  const [compareList, setCompareList] = React.useState([]);
  const [recentlyViewed, setRecentlyViewed] = React.useState([]);
  const [savedSearches, setSavedSearches] = React.useState([]);

  useEffect(() => {
    const initialFilters = {
      q: searchParams.get("q") || "",
      type: searchParams.getAll("type") || [],
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      bedrooms: searchParams.get("bedrooms") || "",
      amenities: searchParams.getAll("amenities") || [],
    };
    dispatch(setFilters(initialFilters));
  }, [searchParams, dispatch]);

  // Load favorites from Firestore
  React.useEffect(() => {
    if (user) {
      getDoc(doc(db, "users", user.uid)).then((docSnap) => {
        if (docSnap.exists()) {
          setFavorites(docSnap.data().favorites || []);
          setSavedSearches(docSnap.data().savedSearches || []);
          setRecentlyViewed(docSnap.data().recentlyViewed || []);
        }
      });
    } else {
      setFavorites(JSON.parse(localStorage.getItem("favorites") || "[]"));
      setRecentlyViewed(
        JSON.parse(localStorage.getItem("recentlyViewed") || "[]")
      );
    }
  }, [user]);

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
    const params = new URLSearchParams();
    for (const key in newFilters) {
      const value = newFilters[key];
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else if (value) {
        params.set(key, value);
      }
    }
    setSearchParams(params, { replace: true });
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    setSearchParams({}, { replace: true });
  };

  // For demo, use MOCK_PROPERTIES. Replace with Firestore data for production.
  const allProperties = useMemo(() => [...MOCK_PROPERTIES], []);

  const filteredProperties = useMemo(() => {
    let properties = [...MOCK_PROPERTIES];
    const { q, type, minPrice, maxPrice, bedrooms, amenities } = filters;

    if (q) {
      properties = properties.filter(
        (p) =>
          p.title.toLowerCase().includes(q.toLowerCase()) ||
          p.address.toLowerCase().includes(q.toLowerCase()) ||
          p.description.toLowerCase().includes(q.toLowerCase())
      );
    }
    if (type && type.length > 0) {
      properties = properties.filter((p) => type.includes(p.type));
    }
    if (minPrice) {
      properties = properties.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      properties = properties.filter((p) => p.price <= Number(maxPrice));
    }
    if (bedrooms) {
      properties = properties.filter((p) => p.bedrooms >= Number(bedrooms));
    }
    if (amenities && amenities.length > 0) {
      properties = properties.filter((p) =>
        amenities.every((amenity) => p.amenities.includes(amenity))
      );
    }

    properties.sort((a, b) => {
      if (sortBy === "newest")
        return (
          new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
        );
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      return 0;
    });

    return properties;
  }, [filters, sortBy]);

  // Save favorites to Firestore/localStorage
  const handleFavorite = async (id) => {
    let newFavs;
    if (favorites.includes(id)) {
      newFavs = favorites.filter((f) => f !== id);
    } else {
      newFavs = [...favorites, id];
    }
    setFavorites(newFavs);
    if (user) {
      await setDoc(
        doc(db, "users", user.uid),
        { favorites: newFavs },
        { merge: true }
      );
    } else {
      localStorage.setItem("favorites", JSON.stringify(newFavs));
    }
  };

  // Save compare list in state
  const handleCompare = (id) => {
    setCompareList((list) =>
      list.includes(id) ? list.filter((i) => i !== id) : [...list, id]
    );
  };

  // Track recently viewed
  const handleView = (id) => {
    let newViewed = [id, ...recentlyViewed.filter((i) => i !== id)].slice(
      0,
      10
    );
    setRecentlyViewed(newViewed);
    if (user) {
      setDoc(
        doc(db, "users", user.uid),
        { recentlyViewed: newViewed },
        { merge: true }
      );
    } else {
      localStorage.setItem("recentlyViewed", JSON.stringify(newViewed));
    }
  };

  // Save search
  const handleSaveSearch = async () => {
    if (!user) return alert("Login to save searches");
    const newSearches = [...savedSearches, filters];
    setSavedSearches(newSearches);
    await setDoc(
      doc(db, "users", user.uid),
      { savedSearches: newSearches },
      { merge: true }
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleSaveSearch}
          className="bg-primary text-white px-4 py-2 rounded shadow"
        >
          Save This Search
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            allProperties={allProperties}
          />
          {/* Saved Searches */}
          {user && savedSearches.length > 0 && (
            <div className="mt-8">
              <h4 className="font-bold mb-2">Saved Searches</h4>
              <ul className="space-y-2">
                {savedSearches.map((s, idx) => (
                  <li
                    key={idx}
                    className="text-xs bg-neutral-100 p-2 rounded cursor-pointer"
                    onClick={() => handleFilterChange(s)}
                  >
                    {JSON.stringify(s)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Recently Viewed */}
          {recentlyViewed.length > 0 && (
            <div className="mt-8">
              <h4 className="font-bold mb-2">Recently Viewed</h4>
              <ul className="space-y-2">
                {recentlyViewed.map((id, idx) => {
                  const prop = allProperties.find((p) => p.id === id);
                  return prop ? (
                    <li
                      key={idx}
                      className="text-xs bg-neutral-100 p-2 rounded"
                    >
                      {prop.title}
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
          )}
          {/* Favorites */}
          {favorites.length > 0 && (
            <div className="mt-8">
              <h4 className="font-bold mb-2">Favorites</h4>
              <ul className="space-y-2">
                {favorites.map((id, idx) => {
                  const prop = allProperties.find((p) => p.id === id);
                  return prop ? (
                    <li
                      key={idx}
                      className="text-xs bg-neutral-100 p-2 rounded"
                    >
                      {prop.title}
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
          )}
        </div>
        <div className="lg:col-span-3">
          {/* Compare Bar */}
          {compareList.length > 1 && (
            <div className="bg-primary text-white p-4 rounded mb-4 flex gap-4 items-center">
              <span className="font-bold">Comparing:</span>
              {compareList.map((id) => {
                const prop = allProperties.find((p) => p.id === id);
                return prop ? (
                  <span
                    key={id}
                    className="bg-white text-primary px-2 py-1 rounded mx-1"
                  >
                    {prop.title}
                  </span>
                ) : null;
              })}
              <button
                className="ml-auto bg-white text-primary px-3 py-1 rounded"
                onClick={() => setCompareList([])}
              >
                Clear
              </button>
            </div>
          )}
          {/* Comparison Table */}
          {compareList.length > 1 && (
            <div className="bg-white rounded shadow p-4 mb-6 overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr>
                    <th className="p-2">Title</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Bedrooms</th>
                    <th className="p-2">Bathrooms</th>
                    <th className="p-2">Area</th>
                  </tr>
                </thead>
                <tbody>
                  {compareList.map((id) => {
                    const prop = allProperties.find((p) => p.id === id);
                    return prop ? (
                      <tr key={id} className="border-t">
                        <td className="p-2">{prop.title}</td>
                        <td className="p-2">{prop.type}</td>
                        <td className="p-2">{prop.price}</td>
                        <td className="p-2">{prop.bedrooms}</td>
                        <td className="p-2">{prop.bathrooms}</td>
                        <td className="p-2">{prop.area}</td>
                      </tr>
                    ) : null;
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onFavorite={handleFavorite}
                isFavorite={favorites.includes(property.id)}
                onCompare={handleCompare}
                isCompared={compareList.includes(property.id)}
                onView={handleView}
              />
            ))}
          </div>
        </div>
      </div>
      {/* TODO: Notifications for saved searches (stub for FCM/email) */}
    </div>
  );
};

export default ListingsPage;
