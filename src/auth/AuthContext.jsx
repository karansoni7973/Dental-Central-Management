import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const mockUsers = [
  { id: "1", role: "Admin", email: "admin@entnt.in", password: "admin123" },
  { id: "2", role: "Patient", email: "john@entnt.in", password: "patient123", patientId: "p1" }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    // First check localStorage users
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const found = storedUsers.find(u => u.email === email && u.password === password);
    
    // Fallback to mock users (for initial setup)
    if (!found) {
      const mockUser = mockUsers.find(u => u.email === email && u.password === password);
      if (mockUser) {
        setUser(mockUser);
        localStorage.setItem("user", JSON.stringify(mockUser));
        return { success: true };
      }
    }

    if (found) {
      setUser(found);
      localStorage.setItem("user", JSON.stringify(found));
      return { success: true };
    }
    return { success: false, message: "Invalid credentials" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
