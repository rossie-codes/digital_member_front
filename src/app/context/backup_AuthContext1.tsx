// 完成 auth, save token in localstorage

// 想變成 save in cookies.

// "use client";

// import React, { createContext, useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// interface AuthContextType {
//   isAuthenticated: boolean;
//   token: string | null;
//   login: (token: string) => void;
//   logout: () => void;
// }

// export const AuthContext = createContext<AuthContextType>({
//   isAuthenticated: false,
//   token: null,
//   login: () => {},
//   logout: () => {},
// });

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const router = useRouter();
//   const [token, setToken] = useState<string | null>(null);

//   useEffect(() => {
//     // Check if token exists in localStorage
//     const token = localStorage.getItem('token');
//     setToken(token);
//   }, []);

//   const login = (token: string) => {
//     localStorage.setItem('token', token);
//     setToken(token);
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setToken(null);
//     router.push('/login');
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated: !!token, token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };