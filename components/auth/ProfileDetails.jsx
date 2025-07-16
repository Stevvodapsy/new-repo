import React from "react";
import { useSelector } from "react-redux";

const ProfileDetails = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl mt-10 animate-fade-in">
      <h2 className="text-3xl font-extrabold text-primary-dark mb-6">
        Profile Details
      </h2>
      <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
        <img
          src={user.photo || "https://i.pravatar.cc/150"}
          alt="Profile"
          className="w-36 h-36 rounded-full object-cover border-4 border-primary shadow-lg"
        />
        <div className="flex-1">
          <div className="mb-2">
            <strong>Name:</strong> {user.name}
          </div>
          <div className="mb-2">
            <strong>Surname:</strong> {user.surname}
          </div>
          <div className="mb-2">
            <strong>Email:</strong> {user.email}
          </div>
          <div className="mb-2">
            <strong>Phone:</strong> {user.phone}
          </div>
          <div className="mb-2">
            <strong>Bio:</strong> {user.bio}
          </div>
          <div className="mb-2">
            <strong>Profile Type:</strong> {user.profileType}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
