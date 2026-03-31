import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const USERS = [
  { id: 1, email: "admin@market.uz", password: "admin123", role: "admin", name: "Администратор" },
  { id: 2, email: "seller@market.uz", password: "seller123", role: "seller", name: "Продавец" },
  { id: 3, email: "user@market.uz", password: "user123", role: "user", name: "Пользователь" },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("market_user")); } catch { return null; }
  });

  const login = (email, password) => {
    const found = USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const safe = { id: found.id, email: found.email, name: found.name, role: found.role };
      setUser(safe);
      localStorage.setItem("market_user", JSON.stringify(safe));
      return { success: true, user: safe };
    }
    return { success: false, error: "Неверный email или пароль" };
  };

  const register = (name, email, password) => {
    if (USERS.find(u => u.email === email)) return { success: false, error: "Email уже используется" };
    const newUser = { id: Date.now(), email, name, role: "user" };
    setUser(newUser);
    localStorage.setItem("market_user", JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const logout = () => { setUser(null); localStorage.removeItem("market_user"); };

  return <AuthContext.Provider value={{ user, login, logout, register }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
