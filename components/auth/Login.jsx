import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle, signInWithFacebook } from "../../socialAuth";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rolePrompt, setRolePrompt] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  const handleEmailLogin = (e) => {
    e.preventDefault();
    dispatch(loginStart());
    // Fake login logic for demo
    setTimeout(() => {
      if (email && password) {
        dispatch(
          loginSuccess({ email, name: "Demo User", profileType: "tenant" })
        );
        navigate("/profile");
      } else {
        dispatch(loginFailure("Invalid credentials"));
      }
    }, 1000);
  };

  const handleGoogleLogin = async () => {
    dispatch(loginStart());
    try {
      const user = await signInWithGoogle();
      setPendingUser(user);
      setRolePrompt(true);
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };

  const handleFacebookLogin = async () => {
    dispatch(loginStart());
    try {
      const user = await signInWithFacebook();
      setPendingUser(user);
      setRolePrompt(true);
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };

  const handleRoleSelect = (role) => {
    dispatch(
      loginSuccess({
        email: pendingUser.email,
        name: pendingUser.displayName,
        profileType: role,
      })
    );
    setRolePrompt(false);
    setPendingUser(null);
    navigate("/profile");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {/* Role selection modal */}
      {rolePrompt && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-xs w-full text-center">
            <h3 className="font-bold mb-4">
              Are you a Landlord/Agent or Tenant?
            </h3>
            <button
              className="w-full bg-primary text-white p-2 rounded mb-2"
              onClick={() => handleRoleSelect("landlord/agent")}
            >
              Landlord / Agent
            </button>
            <button
              className="w-full bg-blue-600 text-white p-2 rounded"
              onClick={() => handleRoleSelect("tenant")}
            >
              Tenant
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleEmailLogin} className="space-y-4">
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
        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded"
          disabled={loading}
        >
          Login
        </button>
        {error && <div className="text-red-500">{error}</div>}
      </form>
      <div className="my-4 text-center text-neutral-500">or</div>
      <button
        onClick={handleGoogleLogin}
        className="w-full bg-red-500 text-white p-2 rounded mb-2"
      >
        Login with Google
      </button>
      <button
        onClick={handleFacebookLogin}
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        Login with Facebook
      </button>
    </div>
  );
};

export default Login;
