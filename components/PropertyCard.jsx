import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MapPinIcon,
  BedIcon,
  BathIcon,
  ArrowsPointingOutIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  StarIcon,
  HeartIcon,
  Squares2X2Icon,
} from "./icons/HeroIcons.jsx";

const PropertyCard = ({
  property,
  onFavorite,
  isFavorite,
  onCompare,
  isCompared,
  onView,
}) => {
  const {
    id,
    title,
    type,
    price,
    period,
    address,
    bedrooms,
    bathrooms,
    area,
    images,
    isFeatured,
    isUrgent,
    isVerified,
  } = property;

  const formatPrice = (value) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const Badge = ({ icon, text, colorClass }) => (
    <div
      className={`absolute top-3 left-3 flex items-center gap-1.5 text-xs font-bold text-white px-2 py-1 rounded-full ${colorClass}`}
    >
      {icon}
      <span>{text}</span>
    </div>
  );

  useEffect(() => {
    if (onView) onView(property.id);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group relative">
      {/* Favorite (Wishlist) Button */}
      <button
        className={`absolute top-3 right-12 z-10 p-2 rounded-full ${
          isFavorite ? "bg-red-500 text-white" : "bg-white text-red-500"
        } shadow hover:scale-110 transition`}
        title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        onClick={(e) => {
          e.preventDefault();
          onFavorite && onFavorite(property.id);
        }}
      >
        <HeartIcon className="w-5 h-5" />
      </button>
      {/* Compare Button */}
      <button
        className={`absolute top-3 right-3 z-10 p-2 rounded-full ${
          isCompared ? "bg-primary text-white" : "bg-white text-primary"
        } shadow hover:scale-110 transition`}
        title={isCompared ? "Remove from Compare" : "Compare this property"}
        onClick={(e) => {
          e.preventDefault();
          onCompare && onCompare(property.id);
        }}
      >
        <Squares2X2Icon className="w-5 h-5" />
      </button>
      <Link to={`/property/${id}`} className="block">
        <div className="relative">
          <img
            src={images[0]}
            alt={title}
            className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {isFeatured && (
            <Badge
              icon={<StarIcon className="w-4 h-4" />}
              text="Featured"
              colorClass="bg-yellow-500/90"
            />
          )}
          {isUrgent && !isFeatured && (
            <Badge
              icon={<ExclamationTriangleIcon className="w-4 h-4" />}
              text="Urgent"
              colorClass="bg-red-500/90"
            />
          )}

          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {isVerified && (
              <div
                className="bg-green-500/90 text-white p-1.5 rounded-full"
                title="Verified Listing"
              >
                <CheckBadgeIcon className="w-4 h-4" />
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <p className="text-white text-2xl font-bold">
              {formatPrice(price)}
              <span className="text-sm font-normal text-neutral-300">
                /{period}
              </span>
            </p>
          </div>
        </div>
        <div className="p-4">
          <span className="text-xs font-semibold text-primary uppercase">
            {type}
          </span>
          <h3 className="font-bold text-lg text-neutral-800 mt-1 truncate group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-neutral-500 flex items-center gap-1 mt-1 truncate">
            <MapPinIcon className="w-4 h-4 flex-shrink-0" />
            <span>{address}</span>
          </p>

          <div className="mt-4 pt-4 border-t border-neutral-200 flex items-center justify-between text-sm text-neutral-600">
            <div className="flex items-center gap-1">
              <BedIcon className="w-5 h-5 text-primary" />
              <span>
                {bedrooms} bed{bedrooms !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <BathIcon className="w-5 h-5 text-primary" />
              <span>
                {bathrooms} bath{bathrooms !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <ArrowsPointingOutIcon className="w-5 h-5 text-primary" />
              <span>{area} sqft</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
