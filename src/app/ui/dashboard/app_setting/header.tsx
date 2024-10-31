// src/app/ui/dashboard/app_setting/header.tsx

"use client"

import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import Link from 'next/link';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    label: (
      <Link href="/dashboard/app_setting">
         admin 設定 {/* The <a> tag is still needed for styling and accessibility */}
      </Link>
    ),
    key: 'app_setting',
    icon: <MailOutlined />,
  },
  {
    label: (
      <Link href="/dashboard/app_setting/customer_side">
        會員頁面設定 {/* The <a> tag is still needed for styling and accessibility */}
      </Link>
    ),
    key: 'gift_setting',
    icon: <MailOutlined />,
  },
  {
    label: (
      <Link href="/dashboard/app_setting/wati">
        WATI 設定 {/* The <a> tag is still needed for styling and accessibility */}
      </Link>
    ),
    key: 'membership_tier',
    icon: <MailOutlined />,
  },
  {
    label: (
      <Link href="/dashboard/app_setting/webstore">
        網店設定 {/* The <a> tag is still needed for styling and accessibility */}
      </Link>
    ),
    key: 'member_setting',
    icon: <MailOutlined />,
  },
];

const App: React.FC = () => {
  const [current, setCurrent] = useState('mail');

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
};

export default App;