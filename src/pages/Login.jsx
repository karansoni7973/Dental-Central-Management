import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { motion } from "framer-motion";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await login(email, password);
      if (res.success) {
        if (email === "admin@entnt.in") navigate("/admin");
        else navigate("/patient");
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/your-cloud-background.jpg')" // use the cloud image you uploaded
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm px-6 py-10 bg-white/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-xl shadow-md p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 16l4-4m0 0l-4-4m4 4H3" />
            </svg>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-800">Sign in with email</h2>
          <p className="text-sm text-gray-600 mt-1">
            Access your dental dashboard securely.
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 text-red-700 text-sm mt-4 px-3 py-2 rounded"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 rounded-lg bg-white/60 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none text-sm placeholder-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded-lg bg-white/60 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none text-sm placeholder-gray-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

         

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 text-white text-sm font-medium rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 transition duration-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Signing in..." : "Get Started"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
