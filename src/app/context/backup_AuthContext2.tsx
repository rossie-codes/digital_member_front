// "use client";

// import React, { createContext, useState, useEffect } from 'react';

// interface AuthContextType {
//   isAuthenticated: boolean;
//   logout: () => void;
// }

// export const AuthContext = createContext<AuthContextType>({
//   isAuthenticated: false,
//   logout: () => {},
// });

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

//   useEffect(() => {
//     // Check authentication status
//     const checkAuth = async () => {
//       try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check`, {
//           credentials: 'include',
//         });
//         const data = await res.json();
//         setIsAuthenticated(data.isAuthenticated);
//       } catch (error) {
//         console.error('Auth check error:', error);
//         setIsAuthenticated(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   const logout = async () => {
//     await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
//       method: 'POST',
//       credentials: 'include',
//     });
//     setIsAuthenticated(false);
//     // Redirect to login page if necessary
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };