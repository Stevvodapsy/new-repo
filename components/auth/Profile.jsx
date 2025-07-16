import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateProfile,
  setVerification,
  addRating,
  addReview,
} from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [bio, setBio] = useState(user.bio || "");
  const [photo, setPhoto] = useState(user.photo || "");
  const [name, setName] = useState(user.name || "");
  const [surname, setSurname] = useState(user.surname || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [uploading, setUploading] = useState(false);

  // Handle local image upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `profile_photos/${user.id}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setPhoto(url);
    } catch (err) {
      alert("Failed to upload photo. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    dispatch(updateProfile({ name, surname, phone, bio, photo }));
    navigate("/profile-details");
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-xl mt-10 animate-fade-in">
      <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
        <div className="relative">
          <img
            src={photo || user.photo || "https://i.pravatar.cc/150"}
            alt="Profile"
            className="w-36 h-36 rounded-full object-cover border-4 border-primary shadow-lg"
          />
          {user.verified && (
            <span className="absolute bottom-2 right-2 bg-green-500 text-white rounded-full px-2 py-1 text-xs font-bold shadow">
              Verified
            </span>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="mt-2 block w-full"
            disabled={uploading}
          />
          {uploading && (
            <div className="text-xs text-primary mt-1">Uploading...</div>
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-extrabold text-primary-dark mb-2 flex items-center gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="font-bold text-2xl border-b border-primary px-2 py-1 mb-2 w-full"
              placeholder="First Name"
            />
            <input
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              className="font-bold text-2xl border-b border-primary px-2 py-1 mb-2 w-full"
              placeholder="Surname"
            />
          </h2>
          <div className="text-neutral-600 mb-2">{user.email}</div>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            placeholder="Phone Number"
          />
          <div className="mb-2">
            <span className="inline-block bg-primary text-white text-xs px-3 py-1 rounded-full mr-2">
              {user.profileType?.toUpperCase() || "USER"}
            </span>
          </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            placeholder="Add a short bio..."
          />
          <button
            onClick={handleSave}
            className="bg-primary text-white px-6 py-2 rounded-lg shadow hover:bg-primary-dark transition-colors font-bold"
            disabled={uploading}
          >
            Save Profile
          </button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-neutral-50 rounded-xl p-6 shadow">
          <h3 className="text-xl font-bold mb-4 text-primary-dark flex items-center gap-2">
            ⭐ Ratings & Reviews
          </h3>
          {user.ratings.length === 0 && (
            <div className="text-neutral-400">No ratings yet.</div>
          )}
          {user.ratings.map((r, i) => (
            <div
              key={i}
              className="mb-3 p-3 border-l-4 border-primary bg-white rounded shadow-sm"
            >
              <div className="font-bold text-lg">
                {r.value} <span className="text-yellow-400">★</span>
              </div>
              <div className="text-sm text-neutral-600">By: {r.reviewer}</div>
              <div className="text-neutral-700 mt-1">{r.comment}</div>
            </div>
          ))}
          <hr className="my-4" />
          {user.reviews.length === 0 && (
            <div className="text-neutral-400">No reviews yet.</div>
          )}
          {user.reviews.map((r, i) => (
            <div
              key={i}
              className="mb-3 p-3 border-l-4 border-accent bg-white rounded shadow-sm"
            >
              <div className="text-sm text-neutral-600">By: {r.reviewer}</div>
              <div className="text-neutral-700 mt-1">{r.comment}</div>
              <div className="text-xs text-neutral-400">Date: {r.date}</div>
            </div>
          ))}
        </div>
        <div className="bg-neutral-50 rounded-xl p-6 shadow">
          <h3 className="text-xl font-bold mb-4 text-primary-dark flex items-center gap-2">
            🧾 Transaction History
          </h3>
          {user.transactions.length === 0 && (
            <div className="text-neutral-400">No transactions yet.</div>
          )}
          {user.transactions.map((t, i) => (
            <div
              key={i}
              className="mb-3 p-3 border-l-4 border-secondary bg-white rounded shadow-sm"
            >
              <div className="font-bold">ID: {t.id}</div>
              <div>
                Type: <span className="font-semibold">{t.type}</span>
              </div>
              <div>Date: {t.date}</div>
              <div className="text-neutral-700">Details: {t.details}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
