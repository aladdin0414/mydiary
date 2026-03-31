import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<{ id: number; username: string } | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));

  // 初始化态同步
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);
    } catch {}
  }

  const setAuth = (newUser: { id: number; username: string }, newToken: string) => {
    user.value = newUser;
    token.value = newToken;
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return { user, token, setAuth, logout };
});
