// src/app/ui/dashboard/discount_code_list/header.tsx

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
      <Link href="/dashboard/broadcast_setting/">
        廣播管理
      </Link>
    ),
    key: 'app_setting',
    icon: <MailOutlined />,
  },
  {
    label: (
      <Link href="/dashboard/broadcast_setting/broadcast_template">
        訊息範本
      </Link>
    ),
    key: 'member_tier',
    icon: <MailOutlined />,
  }
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