// 基本的 header nav menu

// 想轉成 一個 file 及用 ant design



// // src/app/ui/dashboard/nav-links.tsx

// 'use client';

// import {
//   UserGroupIcon,
//   HomeIcon,
//   DocumentDuplicateIcon,
// } from '@heroicons/react/24/outline';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import clsx from 'clsx';

// // Map of links to display in the side navigation.
// // Depending on the size of the application, this would be stored in a database.
// const links = [
//   {
//     name: '主頁',
//     href: '/dashboard',
//     icon: HomeIcon
//   },
//   {
//     name: '會員資料',
//     href: '/dashboard/member_list',
//     icon: DocumentDuplicateIcon,
//   },
//   {
//     name: '禮遇管理',
//     href: '/dashboard/discount_code_list',
//     icon: UserGroupIcon
//   },
//   {
//     name: '廣播設定',
//     href: '/dashboard/broadcast_setting',
//     icon: UserGroupIcon
//   },
//   {
//     name: '設定',
//     href: '/dashboard/app_setting',
//     icon: UserGroupIcon
//   },
// ];

// export default function NavLinks() {
//   const pathname = usePathname();

//   return (
//     <>
//       <div className="grid grid-cols-6 gap-4">
//         {links.map((link) => {
//           const LinkIcon = link.icon;
//           return (

//             <Link
//               key={link.name}
//               href={link.href}
//               className={clsx(
//                 'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-center md:p-2 md:px-3',
//                 {
//                   'bg-sky-100 text-blue-600': pathname === link.href,
//                 },
//               )}
//             >
//               <LinkIcon className="w-6" />
//               <p className="hidden md:block">
//                 {link.name}
//               </p>
//             </Link>

//           );
//         })}
//       </div>
//     </>
//   );
// }