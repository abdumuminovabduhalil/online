import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// Системные аккаунты — всегда есть, нельзя удалить
const SYSTEM_USERS = [
  { id: "admin-001", name: "Администратор", email: "admin@market.uz", phone: "+998901234567", password: "admin123", role: "admin", createdAt: "2025-01-01T00:00:00.000Z", isSystem: true },
  { id: "seller-001", name: "Продавец", email: "seller@market.uz", phone: "+998907654321", password: "seller123", role: "seller", createdAt: "2025-01-01T00:00:00.000Z", isSystem: true },
];

// Загружаем ВСЕХ пользователей: системных + зарегистрированных
const loadAllUsers = () => {
  try {
    const saved = localStorage.getItem("market_registered_users");
    const registered = saved ? JSON.parse(saved) : [];
    // Системные всегда идут первыми, зарегистрированные после
    return [...SYSTEM_USERS, ...registered];
  } catch {
    return [...SYSTEM_USERS];
  }
};

// Сохраняем ТОЛЬКО зарегистрированных (не системных)
const persistRegistered = (allUsers) => {
  const registered = allUsers.filter(u => !u.isSystem);
  localStorage.setItem("market_registered_users", JSON.stringify(registered));
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("market_user")); } catch { return null; }
  });

  // Триггер для перерисовки списка пользователей
  const [tick, setTick] = useState(0);
  const refresh = () => setTick(t => t + 1);

  // ── Войти (по email или телефону) ──
  const login = (identifier, password) => {
    const all = loadAllUsers();
    const found = all.find(u =>
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

  // ── Зарегистрироваться ──
  const register = (name, email, phone, password) => {
    const all = loadAllUsers();
    if (all.find(u => u.email === email)) return { success: false, error: "email_taken" };
    if (all.find(u => u.phone === phone)) return { success: false, error: "phone_taken" };

    const newUser = {
      id: "user-" + Date.now(),
      name, email, phone, password,
      role: "user",
      createdAt: new Date().toISOString(),
      isSystem: false,
    };
    const updated = [...all, newUser];
    persistRegistered(updated);
    refresh();

    const safe = { id: newUser.id, email: newUser.email, phone: newUser.phone, name: newUser.name, role: newUser.role, createdAt: newUser.createdAt };
    setUser(safe);
    localStorage.setItem("market_user", JSON.stringify(safe));
    return { success: true, user: safe };
  };

  // ── Удалить пользователя (только не системного) ──
  const deleteUser = (id) => {
    const all = loadAllUsers();
    const target = all.find(u => u.id === id);
    if (!target || target.isSystem) return; // системных не удаляем

    const updated = all.filter(u => u.id !== id);
    persistRegistered(updated);
    refresh();

    // Если удаляем себя — выйти
    if (user?.id === id) logout();
  };

  // ── Изменить роль пользователя ──
  const changeRole = (id, newRole) => {
    const all = loadAllUsers();
    const target = all.find(u => u.id === id);
    if (!target || target.isSystem) return;

    const updated = all.map(u => u.id === id ? { ...u, role: newRole } : u);
    persistRegistered(updated);
    refresh();

    // Если меняем роль текущего пользователя — обновить сессию
    if (user?.id === id) {
      const newSafe = { ...user, role: newRole };
      setUser(newSafe);
      localStorage.setItem("market_user", JSON.stringify(newSafe));
    }
  };

  // ── Получить всех пользователей ──
  const getAllUsers = () => loadAllUsers();

  // ── Выйти ──
  const logout = () => {
    setUser(null);
    localStorage.removeItem("market_user");
  };

  return (
    <AuthContext.Provider value={{ user, tick, login, logout, register, deleteUser, changeRole, getAllUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
