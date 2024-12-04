// "use client";

// import { useContext, useEffect } from 'react';
// import { AuthContext } from '../context/backup_AuthContext2';
// import { useRouter } from 'next/navigation';

// export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const { isAuthenticated } = useContext(AuthContext);
//   const router = useRouter();

//   useEffect(() => {
//     if (!isAuthenticated) {
//       router.push('/login');
//     }
//   }, [isAuthenticated, router]);

//   if (!isAuthenticated) {
//     return null; // Or a loading indicator
//   }

//   return <>{children}</>;
// }