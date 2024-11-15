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
      <Link href="/dashboard/discount_code_list/">
        優惠管理
      </Link>
    ),
    key: 'app_setting',
    icon: <MailOutlined />,
  },
  {
    label: (
      <Link href="/dashboard/discount_code_list/redemption_item">
        禮物換領
      </Link>
    ),
    key: 'membership_tier',
    icon: <MailOutlined />,
  },
  {
    label: (
      <Link href="/dashboard/discount_code_list/point_setting">
        積分換領
      </Link>
    ),
    key: 'point_setting',
    icon: <MailOutlined />,
  },
  {
    label: (
      <Link href="/dashboard/discount_code_list/membership_tier">
        會員制度
      </Link>
    ),
    key: 'gift_setting',
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