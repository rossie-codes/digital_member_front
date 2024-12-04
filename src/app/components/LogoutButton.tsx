// src/components/LogoutButton.tsx
'use client';

import React, { useContext } from 'react';

import { useRouter } from 'next/navigation';
import { cookies } from 'next/headers';

const LogoutButton: React.FC = () => {

  const router = useRouter();

  const handleLogout = async () => {

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin_auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    router.push('/login');
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;