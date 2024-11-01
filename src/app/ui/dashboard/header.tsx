// src/app/ui/dashboard/header.tsx

"use client";

import React, { useState } from 'react';
import { Layout, Menu, Dropdown } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from '../../components/LogoutButton';
import styled from 'styled-components';
import Image from 'next/image';
import { GlobalOutlined, UserOutlined } from '@ant-design/icons';



const { Header } = Layout;
// 新增自訂的 Logo 樣式，並引用圖片
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: auto; /* 確保 logo 靠左排列 */
`;

const CustomHeader = styled(Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-bottom: 2px solid #000; /* 加入底線 */
  padding: 0 20px;
`;

const MenuContainer = styled.div`
  display: flex;
  align-items: center;
`;

const MenuStyle = styled(Menu)`
  flex-grow: 1;
  justify-content: flex-end; /* 讓選單靠右對齊 */
  background-color: #fff; /* 確保背景為白色 */
`;

const IconWrapper = styled.div`
  display: flex;
  gap: 16px; /* 設置圖標之間的距離 */
  margin-left: 20px; /* 與選單之間的間距 */
`;
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
    },
    {
      label: <Link href="/dashboard/member_list">會員資料</Link>,
      key: '/dashboard/member_list',
    },
    {
      label: <Link href="/dashboard/discount_code_list">禮遇管理</Link>,
      key: '/dashboard/discount_code_list',
    },
    {
      label: <Link href="/dashboard/broadcast_setting">廣播設定</Link>,
      key: '/dashboard/broadcast_setting',
    },
  ];

  // 會員圖標選單項目
  const userMenuItems = [
    {
      key: '1',
      label: <Link href="/dashboard/app_setting">設定</Link>,
    },
    {
      key: '2',
      label: <LogoutButton />,
    },
  ];

  const userMenu = (
    <Menu items={userMenuItems} />
  );

  return (
    <CustomHeader>
      {/* Logo 區塊 */}
      <LogoContainer>
      <Image
          src="/WATI_logo_full.png"
          alt="logo"
          width={100}
          height={50}
          style={{ objectFit: 'contain' }} 
        />

      </LogoContainer>

      {/* 主選單 */}
      <MenuContainer>
        <MenuStyle
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          items={items}
        />

        {/* Icon 區塊 */}
        <IconWrapper>

          {/* 切換語言圖標 */}
          <GlobalOutlined style={{ fontSize: '24px', cursor: 'pointer' }} />

          {/* 會員圖標，點擊後顯示設定和登出 */}
          <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
            <UserOutlined style={{ fontSize: '24px', cursor: 'pointer' }} />
          </Dropdown>
          
        </IconWrapper>
      </MenuContainer>
    </CustomHeader>
  );
};

export default DashboardHeader;