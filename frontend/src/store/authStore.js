import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      // BYPASS LOGIN - Mock Admin User
      user: {
        id: 1,
        email: 'admin@dmhca.com',
        first_name: 'Admin',
        last_name: 'User',
        name: 'Admin User',
        role_id: 1,
        role_name: 'Admin',
        department_id: null,
        department_name: null
      },
      accessToken: 'mock-token',
      refreshToken: 'mock-refresh-token',
      isAuthenticated: true,

      setAuth: (user, accessToken, refreshToken) =>
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),

      updateUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
    }
  )
)
