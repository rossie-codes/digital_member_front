// src/app/ui/dashboard/header.tsx

"use client";

import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from '../../components/LogoutButton';



const { Header } = Layout;

const DashboardHeader: React.FC = () => {
  const pathname = usePathname();
  const [current, setCurrent] = useState(pathname);

  const onClick = (e: any) => {
    setCurrent(e.key);
  };

  const items = [
    {
      label: <Link href="/dashboard">主頁</Link>,
      key: '/dashboard',
      icon: <MailOutlined />,
    },
    {
      label: <Link href="/dashboard/member_list">會員資料</Link>,
      key: '/dashboard/member_list',
      icon: <MailOutlined />,
    },
    {
      label: <Link href="/dashboard/discount_code_list">禮遇管理</Link>,
      key: '/dashboard/discount_code_list',
      icon: <MailOutlined />,
    },
    {
      label: <Link href="/dashboard/broadcast_setting">廣播設定</Link>,
      key: '/dashboard/broadcast_setting',
      icon: <MailOutlined />,
    },
    {
      label: <Link href="/dashboard/app_setting">設定</Link>,
      key: '/dashboard/app_setting',
      icon: <MailOutlined />,
    },

  ];

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          items={items}
          style={{ flex: 1 }}
        />
        <LogoutButton />
      </Header>
    </Layout>
  );
};

export default DashboardHeader;