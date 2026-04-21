import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext(null);
const BASE_URL = 'http://localhost:3001';

export const LANGS = {
  ru: {
    free: 'Свободен', busy: 'Занят',
    all: 'Все', workers: 'Мастера', admin: 'Управление',
    search: 'Поиск по имени или специализации...',
    totalWorkers: 'Всего мастеров', freeWorkers: 'Свободны', busyWorkers: 'Заняты',
    login: 'Войти', register: 'Регистрация', logout: 'Выйти',
    loginTitle: 'Вход в систему', registerTitle: 'Регистрация',
    loginSub: 'Введите ваши данные', registerSub: 'Создайте новый аккаунт',
    username: 'Логин', password: 'Пароль', displayName: 'Отображаемое имя',
    newPassword: 'Новый пароль', confirmPassword: 'Подтвердите пароль',
    currentPassword: 'Текущий пароль', savePassword: 'Сохранить пароль',
    noAccount: 'Нет аккаунта?', hasAccount: 'Уже есть аккаунт?',
    wrongCreds: 'Неверный логин или пароль', loginTaken: 'Логин уже занят',
    minPassword: 'Пароль минимум 6 символов', passwordsMismatch: 'Пароли не совпадают',
    passwordChanged: 'Пароль успешно изменён',
    adminPanel: 'Панель управления', adminSub: 'Управление мастерами и пользователями системы',
    addWorker: 'Добавить мастера', workerList: 'Список мастеров', userList: 'Пользователи системы',
    name: 'Имя *', spec: 'Специализация *', phone: 'Телефон *', telegram: 'Telegram',
    add: 'Добавить', added: 'Добавлено!',
    editWorker: 'Редактировать сотрудника', save: 'Сохранить', saving: 'Сохраняем...', cancel: 'Отмена',
    noWorkers: 'Нет мастеров', notFound: 'Мастера не найдены', changeFilters: 'Попробуйте изменить фильтры',
    call: 'Позвонить', telegram_tooltip: 'Написать в Telegram',
    myProfile: 'Мой профиль', myProfileSub: 'Управление учётной записью',
    administrator: 'Администратор', user: 'Пользователь', master: 'Мастер',
    myStatus: 'Мой статус', statusUpdated: 'Статус обновлён',
    makeMaster: 'Сделать мастером', you: 'Вы',
    deleteConfirm: 'Удалить', deleteWorkerConfirm: 'Удалить мастера?', deleteUserConfirm: 'Удалить пользователя?',
    deleteWorkerSub: 'Это действие нельзя отменить.',
    yes: 'Да, удалить', no: 'Отмена',
    masterLogin: 'Логин мастера', masterPassword: 'Пароль мастера',
    createAccount: 'Создать аккаунт (необязательно)',
    wait: 'Подождите...', loading: 'Загрузка...',
    serverError: 'Не удалось загрузить данные. Убедитесь что json-server запущен.',
  },
  uz: {
    free: "Bo'sh", busy: 'Band',
    all: 'Barchasi', workers: 'Ustalar', admin: 'Boshqaruv',
    search: "Ism yoki mutaxassislik bo'yicha qidirish...",
    totalWorkers: 'Jami ustalar', freeWorkers: "Bo'sh", busyWorkers: 'Band',
    login: 'Kirish', register: "Ro'yxatdan o'tish", logout: 'Chiqish',
    loginTitle: 'Tizimga kirish', registerTitle: "Ro'yxatdan o'tish",
    loginSub: "Ma'lumotlaringizni kiriting", registerSub: 'Yangi hisob yarating',
    username: 'Login', password: 'Parol', displayName: "Ko'rsatiladigan ism",
    newPassword: 'Yangi parol', confirmPassword: 'Parolni tasdiqlang',
    currentPassword: 'Joriy parol', savePassword: 'Parolni saqlash',
    noAccount: "Hisobingiz yo'qmi?", hasAccount: 'Hisobingiz bormi?',
    wrongCreds: "Login yoki parol noto'g'ri", loginTaken: 'Login band',
    minPassword: 'Parol kamida 6 ta belgi', passwordsMismatch: "Parollar mos kelmaydi",
    passwordChanged: "Parol muvaffaqiyatli o'zgartirildi",
    adminPanel: 'Boshqaruv paneli', adminSub: 'Ustalar va foydalanuvchilarni boshqarish',
    addWorker: "Usta qo'shish", workerList: "Ustalar ro'yxati", userList: 'Tizim foydalanuvchilari',
    name: 'Ism *', spec: 'Mutaxassislik *', phone: 'Telefon *', telegram: 'Telegram',
    add: "Qo'shish", added: "Qo'shildi!",
    editWorker: 'Xodimni tahrirlash', save: 'Saqlash', saving: 'Saqlanmoqda...', cancel: 'Bekor qilish',
    noWorkers: "Ustalar yo'q", notFound: 'Ustalar topilmadi', changeFilters: "Filtrlarni o'zgartirib ko'ring",
    call: "Qo'ng'iroq", telegram_tooltip: 'Telegramda yozish',
    myProfile: 'Mening profilim', myProfileSub: 'Hisob boshqaruvi',
    administrator: 'Administrator', user: 'Foydalanuvchi', master: 'Usta',
    myStatus: 'Mening statusim', statusUpdated: 'Status yangilandi',
    makeMaster: 'Usta qilish', you: 'Siz',
    deleteConfirm: "O'chirish", deleteWorkerConfirm: "Ustani o'chirish?", deleteUserConfirm: "Foydalanuvchini o'chirish?",
    deleteWorkerSub: "Bu amalni qaytarib bo'lmaydi.",
    yes: "Ha, o'chirish", no: 'Bekor qilish',
    masterLogin: 'Usta logini', masterPassword: 'Usta paroli',
    createAccount: 'Hisob yaratish (ixtiyoriy)',
    wait: 'Kuting...', loading: 'Yuklanmoqda...',
    serverError: "Ma'lumotlarni yuklashda xato. json-server ishga tushirilganligini tekshiring.",
  }
};

const api = {
  get:    (path)       => fetch(`${BASE_URL}${path}`).then(r => r.json()),
  post:   (path, body) => fetch(`${BASE_URL}${path}`, { method:'POST',  headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) }).then(r => r.json()),
  patch:  (path, body) => fetch(`${BASE_URL}${path}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) }).then(r => r.json()),
  delete: (path)       => fetch(`${BASE_URL}${path}`, { method:'DELETE' }),
};

const loadLS = (key, fallback) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } };
const saveLS = (key, val) => localStorage.setItem(key, JSON.stringify(val));

export function AppProvider({ children }) {
  const [theme,   setThemeState] = useState(() => loadLS('as_theme', 'dark'));
  const [lang,    setLangState]  = useState(() => loadLS('as_lang',  'ru'));
  const [workers, setWorkers]    = useState([]);
  const [users,   setUsers]      = useState([]);
  const [session, setSession]    = useState(() => loadLS('as_session', null));
  const [loading, setLoading]    = useState(true);

  const t = LANGS[lang] || LANGS.ru;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    saveLS('as_theme', theme);
  }, [theme]);
  useEffect(() => { saveLS('as_lang', lang); }, [lang]);
  useEffect(() => { saveLS('as_session', session); }, [session]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [ws, us] = await Promise.all([api.get('/workers'), api.get('/users')]);
      setWorkers(ws);
      setUsers(us);
    } catch (e) { console.error('Load error:', e); }
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const toggleTheme = () => setThemeState(p => p === 'dark' ? 'light' : 'dark');
  const setLang = (l) => setLangState(l);

  // ── AUTH ──────────────────────────────────────────────────
  const login = async (username, password) => {
    const us = await api.get('/users');
    const u = us.find(x => x.username === username && x.password === password);
    if (!u) return { ok: false, error: t.wrongCreds };
    // workerId хранится прямо в user-записи
    const s = { id: u.id, username: u.username, role: u.role, displayName: u.displayName, workerId: u.workerId || null };
    setSession(s);
    return { ok: true, user: s };
  };

  const register = async (username, password, displayName) => {
    const us = await api.get('/users');
    if (us.find(x => x.username === username)) return { ok: false, error: t.loginTaken };
    if (password.length < 6) return { ok: false, error: t.minPassword };
    const newUser = { id: 'u' + Date.now(), username, password, role: 'user', displayName: displayName || username };
    await api.post('/users', newUser);
    setUsers(prev => [...prev, newUser]);
    const s = { id: newUser.id, username: newUser.username, role: newUser.role, displayName: newUser.displayName, workerId: null };
    setSession(s);
    return { ok: true, user: s };
  };

  const logout = () => setSession(null);

  const changeOwnPassword = async (oldPass, newPass) => {
    const us = await api.get('/users');
    const u = us.find(x => x.id === session?.id);
    if (!u || u.password !== oldPass) return { ok: false, error: t.wrongCreds };
    if (newPass.length < 6) return { ok: false, error: t.minPassword };
    await api.patch(`/users/${u.id}`, { password: newPass });
    setUsers(prev => prev.map(x => x.id === u.id ? { ...x, password: newPass } : x));
    return { ok: true };
  };

  // ── WORKERS ───────────────────────────────────────────────
  const addWorker = async (data) => {
    const w = await api.post('/workers', { id: 'w' + Date.now(), ...data, status: 'free' });
    setWorkers(prev => [...prev, w]);
    return w;
  };

  const updateWorker = async (id, data) => {
    const w = await api.patch(`/workers/${id}`, data);
    setWorkers(prev => prev.map(x => x.id === id ? w : x));
    return w;
  };

  const toggleWorkerStatus = async (id) => {
    const w = workers.find(x => x.id === id);
    if (!w) return;
    return updateWorker(id, { status: w.status === 'free' ? 'busy' : 'free' });
  };

  const deleteWorker = async (id) => {
    await api.delete(`/workers/${id}`);
    setWorkers(prev => prev.filter(w => w.id !== id));
  };

  // ── ADMIN ─────────────────────────────────────────────────
  const adminUpdateUser = async (id, data) => {
    await api.patch(`/users/${id}`, data);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
    if (session?.id === id) setSession(prev => ({ ...prev, ...data }));
  };

  const adminDeleteUser = async (id) => {
    await api.delete(`/users/${id}`);
    setUsers(prev => prev.filter(u => u.id !== id));
    if (session?.id === id) setSession(null);
  };

  // Промоут: создаёт worker-запись и прописывает workerId в user
  const promoteUserToWorker = async (userId, workerData) => {
    const w = await addWorker(workerData);
    // Сохраняем связь workerId → worker.id прямо в user-записи
    await adminUpdateUser(userId, { role: 'worker', workerId: w.id });
    return w;
  };

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      lang, setLang, t,
      workers, addWorker, updateWorker, toggleWorkerStatus, deleteWorker,
      users, adminUpdateUser, adminDeleteUser, promoteUserToWorker,
      session, login, register, logout, changeOwnPassword,
      loading, loadAll,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
