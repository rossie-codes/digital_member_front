// 完成基本 login input field

// 想用 ant design 貼近 UI design

// // src/app/login/page.tsx

// "use client";

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function LoginPage() {
//   const router = useRouter();
//   const [userInfo, setUserInfo] = useState({ member_phone: '', password: '' });
//   const [error, setError] = useState('');

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();

//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
//         method: 'POST',
//         body: JSON.stringify(userInfo),
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.error || 'Login failed');
//         return;
//       }

//       // Store the token in localStorage (or cookies)
//       localStorage.setItem('token', data.token);

//       // Redirect to the dashboard
//       router.push('/dashboard');
//     } catch (err) {
//       console.error('Login error:', err);
//       setError('Login failed');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <form onSubmit={handleSubmit} className="p-6 border rounded">
//         <h1 className="mb-4 text-2xl font-bold">Login</h1>
//         {error && <p className="mb-4 text-red-500">{error}</p>}
//         <div className="mb-4">
//           <label className="block mb-1">Email</label>
//           <input
//             type="email"
//             value={userInfo.member_phone}
//             onChange={(e) => setUserInfo({ ...userInfo, member_phone: e.target.value })}
//             className="w-full p-2 border"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block mb-1">Password</label>
//           <input
//             type="password"
//             value={userInfo.password}
//             onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
//             className="w-full p-2 border"
//             required
//           />
//         </div>
//         <button type="submit" className="px-4 py-2 text-white bg-blue-500">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }