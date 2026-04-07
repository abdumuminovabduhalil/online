import { createContext, useContext, useState } from "react";
import bcryptjs from "bcryptjs"; // не используем, хешируем просто base64 для фронта

const AuthContext = createContext(null);

const DEFAULT_USERS = [
  { id: "admin-001", name: "Администратор", email: "admin@market.uz", phone: "+998901234567", password: "admin123", role: "admin", createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "seller-001", name: "Продавец", email: "seller@market.uz", phone: "+998907654321", password: "seller123", role: "seller", createdAt: "2025-01-01T00:00:00.000Z" },
];

const loadUsers = () => {
  try {
    const saved = localStorage.getItem("market_all_users");
    const registered = saved ? JSON.parse(saved) : [];
    const existingEmails = new Set(registered.map(u => u.email));
    const defaults = DEFAULT_USERS.filter(u => !existingEmails.has(u.email));
    return [...defaults, ...registered];
  } catch { return DEFAULT_USERS; }
};

const saveRegistered = (users) => {
  const toSave = users.filter(u => !DEFAULT_USERS.find(d => d.id === u.id));
  localStorage.setItem("market_all_users", JSON.stringify(toSave));
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("market_user")); } catch { return null; }
  });

  const login = (identifier, password) => {
    const allUsers = loadUsers();
    // identifier может быть email или телефон
    const found = allUsers.find(u =>
      (u.email === identifier || u.phone === identifier) && u.password === password
    );
    if (found) {
      const safe = { id: found.id, email: found.email, phone: found.phone, name: found.name, role: found.role, createdAt: found.createdAt };
      setUser(safe);
      localStorage.setItem("market_user", JSON.stringify(safe));
      return { success: true, user: safe };
    }
    return { success: false };
  };

  const register = (name, email, phone, password) => {
    const allUsers = loadUsers();
    if (allUsers.find(u => u.email === email)) return { success: false, error: "email_taken" };
    if (allUsers.find(u => u.phone === phone)) return { success: false, error: "phone_taken" };
    const newUser = { id: "user-" + Date.now(), name, email, phone, password, role: "user", createdAt: new Date().toISOString() };
    const updated = [...allUsers, newUser];
    saveRegistered(updated);
    const safe = { id: newUser.id, email: newUser.email, phone: newUser.phone, name: newUser.name, role: newUser.role, createdAt: newUser.createdAt };
    setUser(safe);
    localStorage.setItem("market_user", JSON.stringify(safe));
    return { success: true, user: safe };
  };

  const deleteUser = (id) => {
    const allUsers = loadUsers();
    const updated = allUsers.filter(u => u.id !== id && !DEFAULT_USERS.find(d => d.id === u.id && d.id === id));
    saveRegistered(updated.filter(u => !DEFAULT_USERS.find(d => d.id === u.id)));
    // если удаляем текущего пользователя
    if (user?.id === id) logout();
  };

  const getAllUsers = () => loadUsers();

  const logout = () => {
    setUser(null);
    localStorage.removeItem("market_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, deleteUser, getAllUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
