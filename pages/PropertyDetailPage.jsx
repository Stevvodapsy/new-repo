import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MOCK_PROPERTIES } from "../constants.js";
import {
  MapPinIcon,
  BedIcon,
  BathIcon,
  ArrowsPointingOutIcon,
  CheckBadgeIcon,
  PhoneIcon,
  ChatBubbleLeftEllipsisIcon,
  StarIcon,
} from "../components/icons/HeroIcons.jsx";

const ImageGallery = ({ images, title }) => {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div>
      <img
        src={mainImage}
        alt={title}
        className="w-full h-96 object-cover rounded-lg shadow-lg"
      />
      <div className="grid grid-cols-4 gap-2 mt-2">
        {images.slice(0, 4).map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`${title} thumbnail ${index + 1}`}
            className={`w-full h-24 object-cover rounded-md cursor-pointer transition-all duration-200 ${
              mainImage === img ? "ring-4 ring-primary" : "hover:opacity-80"
            }`}
            onClick={() => setMainImage(img)}
          />
        ))}
      </div>
    </div>
  );
};

const AgentCard = ({ agent }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg sticky top-24">
      <h3 className="text-xl font-bold mb-4 text-primary-dark">
        Contact Agent
      </h3>
      <div className="flex items-center gap-4">
        <img
          src={agent.avatar}
          alt={agent.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <p className="font-bold text-lg">{agent.name}</p>
          <p className="text-sm text-neutral-500">Verified Agent</p>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-md transition-colors">
          <PhoneIcon className="w-5 h-5" />
          <span>Call Agent</span>
        </button>
        <button
          className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-md transition-colors"
          onClick={() =>
            navigate("/chat", {
              state: {
                chatPartner: {
                  id: agent.id, // always present now
                  name: agent.name,
                  photo: agent.avatar,
                },
              },
            })
          }
        >
          <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
          <span>Chat with Agent</span>
        </button>
      </div>
    </div>
  );
};

const PropertyDetailPage = () => {
  const { id } = useParams();
  const property = MOCK_PROPERTIES.find((p) => p.id === id);

  if (!property) {
    return <div className="text-center py-20">Property not found.</div>;
  }

  const formatPrice = (value) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-sm font-semibold text-primary uppercase">
                    {property.type}
                  </span>
                  <h1 className="text-3xl font-bold text-neutral-800 mt-1">
                    {property.title}
                  </h1>
                  <p className="text-md text-neutral-500 flex items-center gap-2 mt-2">
                    <MapPinIcon className="w-5 h-5 flex-shrink-0" />
                    <span>{property.address}</span>
                  </p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-3xl font-bold text-primary">
                    {formatPrice(property.price)}
                    <span className="text-lg font-normal text-neutral-500">
                      /{property.period}
                    </span>
                  </p>
                  {property.isVerified && (
                    <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                      <CheckBadgeIcon className="w-4 h-4" /> Verified Listing
                    </span>
                  )}
                </div>
              </div>
            </div>

            <ImageGallery images={property.images} title={property.title} />

            {/* Details Overview */}
            <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-2">
                <BedIcon className="w-8 h-8 mx-auto text-primary" />
                <p className="mt-1 font-semibold">
                  {property.bedrooms} Bedrooms
                </p>
              </div>
              <div className="p-2">
                <BathIcon className="w-8 h-8 mx-auto text-primary" />
                <p className="mt-1 font-semibold">
                  {property.bathrooms} Bathrooms
                </p>
              </div>
              <div className="p-2">
                <ArrowsPointingOutIcon className="w-8 h-8 mx-auto text-primary" />
                <p className="mt-1 font-semibold">{property.area} sqft</p>
              </div>
              <div className="p-2">
                <StarIcon className="w-8 h-8 mx-auto text-yellow-500" />
                <p className="mt-1 font-semibold">
                  {property.reviews.length > 0
                    ? `${(
                        property.reviews.reduce((acc, r) => acc + r.rating, 0) /
                        property.reviews.length
                      ).toFixed(1)}/5 stars`
                    : "No Reviews"}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-primary-dark mb-4">
                Description
              </h2>
              <p className="text-neutral-600 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-primary-dark mb-4">
                Amenities
              </h2>
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="flex items-center gap-2 text-neutral-700"
                  >
                    <CheckBadgeIcon className="w-5 h-5 text-green-500" />
                    <span>{amenity}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Reviews */}
            {property.reviews.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-primary-dark mb-4">
                  Reviews ({property.reviews.length})
                </h2>
                <div className="space-y-6">
                  {property.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="flex gap-4 border-b border-neutral-200 pb-4 last:border-b-0"
                    >
                      <img
                        src={review.avatar}
                        alt={review.author}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold">{review.author}</p>
                            <p className="text-xs text-neutral-500">
                              {review.date}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`w-5 h-5 ${
                                  i < review.rating
                                    ? "text-yellow-400"
                                    : "text-neutral-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-2 text-neutral-600">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AgentCard agent={property.agent} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
