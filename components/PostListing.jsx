import React, { useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Add Google Maps script loader
// const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your API key

// const loadGoogleMapsScript = (callback) => {
//   if (window.google && window.google.maps) {
//     callback();
//     return;
//   }
//   const script = document.createElement("script");
//   script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
//   script.async = true;
//   script.onload = callback;
//   document.body.appendChild(script);
// };

const PostListing = () => {
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [size, setSize] = useState("");
  const [amenities, setAmenities] = useState("");
  const [availabilityDate, setAvailabilityDate] = useState("");
  const [leaseTerms, setLeaseTerms] = useState("");
  const [houseRules, setHouseRules] = useState("");
  const [featured, setFeatured] = useState(false);
  const [urgent, setUrgent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
//   const [mapLoaded, setMapLoaded] = useState(false);
//   const [latLng, setLatLng] = useState(null);

  // Handlers for file input
  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };
  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      // Upload images
      const imageUrls = await Promise.all(
        images.map(async (img) => {
          const imgRef = ref(
            storage,
            `listings/images/${Date.now()}_${img.name}`
          );
          await uploadBytes(imgRef, img);
          return await getDownloadURL(imgRef);
        })
      );
      // Upload video
      let videoUrl = "";
      if (video) {
        const videoRef = ref(
          storage,
          `listings/videos/${Date.now()}_${video.name}`
        );
        await uploadBytes(videoRef, video);
        videoUrl = await getDownloadURL(videoRef);
      }
      // Save listing to Firestore
      await addDoc(collection(db, "listings"), {
        images: imageUrls,
        video: videoUrl,
        location,
        price,
        paymentTerms,
        propertyType,
        size,
        amenities,
        availabilityDate,
        leaseTerms,
        houseRules,
        featured,
        urgent,
        verified,
        createdAt: Timestamp.now(),
      });
      setSuccess("Listing posted successfully!");
      // Reset form
      setImages([]);
      setVideo(null);
      setLocation("");
      setPrice("");
      setPaymentTerms("");
      setPropertyType("");
      setSize("");
      setAmenities("");
      setAvailabilityDate("");
      setLeaseTerms("");
      setHouseRules("");
      setFeatured(false);
      setUrgent(false);
      setVerified(false);
    } catch (err) {
      setError("Failed to post listing: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

//   React.useEffect(() => {
//     loadGoogleMapsScript(() => setMapLoaded(true));
//   }, []);

//   React.useEffect(() => {
//     if (mapLoaded) {
//       const map = new window.google.maps.Map(
//         document.getElementById("listing-map"),
//         {
//           center: { lat: 6.5244, lng: 3.3792 }, // Default to Lagos
//           zoom: 12,
//         }
//       );
//       let marker;
//       map.addListener("click", (e) => {
//         if (marker) marker.setMap(null);
//         marker = new window.google.maps.Marker({
//           position: e.latLng,
//           map,
//         });
//         setLatLng({ lat: e.latLng.lat(), lng: e.latLng.lng() });
//         setLocation(`${e.latLng.lat()},${e.latLng.lng()}`);
//       });
//     }
//   }, [mapLoaded]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Post a Listing</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Media Upload */}
        <label className="block font-semibold">Photos (multiple):</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {images &&
            Array.from(images).map((img, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(img)}
                alt="preview"
                className="w-20 h-20 object-cover rounded"
              />
            ))}
        </div>
        <label className="block font-semibold mt-4">Video Tour:</label>
        <input type="file" accept="video/*" onChange={handleVideoChange} />
        {video && (
          <video
            src={URL.createObjectURL(video)}
            controls
            className="w-40 mt-2"
          />
        )}
        <div className="text-xs text-gray-500 mt-1">
          360° virtual tours: Coming soon
        </div>

        {/* Property Details */}
        <label className="block font-semibold mt-4">Location:</label>
        {/* <div
          className="w-full h-64 mb-2"
          id="listing-map"
          style={{ border: "1px solid #ccc", borderRadius: 8 }}
        ></div> */}
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter address or drop pin on map"
        />
        {/* {latLng && (
          <div className="text-xs text-green-600">
            Selected: {latLng.lat}, {latLng.lng}
          </div>
        )} */}
        <div className="text-xs text-gray-500">Map integration coming soon</div>
        <label className="block font-semibold mt-4">Price:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="e.g. 50000"
        />
        <label className="block font-semibold mt-4">Payment Terms:</label>
        <input
          type="text"
          value={paymentTerms}
          onChange={(e) => setPaymentTerms(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="e.g. yearly, monthly"
        />
        <label className="block font-semibold mt-4">Property Type:</label>
        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select type</option>
          <option value="roomself">Roomself</option>
          <option value="mini-flat">Mini-flat</option>
          <option value="2-bedroom">2 Bedroom</option>
          <option value="3-bedroom">3 Bedroom</option>
          <option value="duplex">Duplex</option>
          <option value="full-house">Full House</option>
          <option value="shop">Shop</option>
        </select>
        <label className="block font-semibold mt-4">Size (sq ft):</label>
        <input
          type="text"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <label className="block font-semibold mt-4">Amenities:</label>
        <input
          type="text"
          value={amenities}
          onChange={(e) => setAmenities(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="e.g. water, parking, security"
        />
        <label className="block font-semibold mt-4">Availability Date:</label>
        <input
          type="date"
          value={availabilityDate}
          onChange={(e) => setAvailabilityDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <label className="block font-semibold mt-4">Lease Terms:</label>
        <input
          type="text"
          value={leaseTerms}
          onChange={(e) => setLeaseTerms(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="e.g. 1 year minimum"
        />
        <label className="block font-semibold mt-4">
          House Rules & Restrictions:
        </label>
        <input
          type="text"
          value={houseRules}
          onChange={(e) => setHouseRules(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="e.g. no pets, no smoking"
        />

        {/* Advanced Listing Options */}
        <div className="flex gap-4 mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            <span className="ml-2">Featured</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={urgent}
              onChange={(e) => setUrgent(e.target.checked)}
            />
            <span className="ml-2">Urgent</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={verified}
              onChange={(e) => setVerified(e.target.checked)}
            />
            <span className="ml-2">Verified</span>
          </label>
        </div>

        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded mt-6"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Listing"}
        </button>
      </form>
    </div>
  );
};

export default PostListing;
