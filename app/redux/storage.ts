// lib/redux/storage.ts
const isServer = typeof window === "undefined";

const storage = {
  getItem: (key: string) => {
    if (isServer) return Promise.resolve(null);
    return Promise.resolve(localStorage.getItem(key));
  },
  setItem: (key: string, value: string) => {
    if (isServer) return Promise.resolve();
    return Promise.resolve(localStorage.setItem(key, value));
  },
  removeItem: (key: string) => {
    if (isServer) return Promise.resolve();
    return Promise.resolve(localStorage.removeItem(key));
  },
};

export default storage;
