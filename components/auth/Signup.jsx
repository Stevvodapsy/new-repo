import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  setProfileType,
} from "../../store/authSlice";

const Signup = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [profileType, setProfileTypeLocal] = useState("tenant");

  const handleSignup = (e) => {
    e.preventDefault();
    dispatch(loginStart());
    setTimeout(() => {
      if (email && password && name) {
        dispatch(setProfileType(profileType));
        dispatch(loginSuccess({ email, name, profileType }));
      } else {
        dispatch(loginFailure("All fields required"));
      }
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSignup} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <div>
          <label className="block mb-1 font-medium">Profile Type</label>
          <select
            value={profileType}
            onChange={(e) => setProfileTypeLocal(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="tenant">Tenant</option>
            <option value="landlord">Landlord/Agent</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded"
          disabled={loading}
        >
          Sign Up
        </button>
        {error && <div className="text-red-500">{error}</div>}
      </form>
    </div>
  );
};

export default Signup;
