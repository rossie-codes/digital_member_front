"use client";

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function LogoutButton() {
  const { logout } = useContext(AuthContext);

  return (
    <button onClick={logout} className="px-4 py-2 text-white bg-red-500">
      Logout
    </button>
  );
}