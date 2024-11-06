// src/app/ui/dashboard/header.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Dropdown, Drawer, Button } from 'antd';
import {  MailOutlined, MenuOutlined  } from '@ant-design/icons';
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

  @media (max-width: 768px) {
    display: none; /* 在小螢幕上隱藏 */
  }
`;

const MenuStyle = styled(Menu)`
  flex-grow: 1;
  justify-content: flex-end; /* 讓選單靠右對齊 */
  background-color: #fff; /* 確保背景為白色 */
`;

const IconWrapper = styled.div`
  display: flex;
  gap: 16px;
  margin-left: 20px;

  @media (max-width: 768px) {
    display: none; /* 在小螢幕上隱藏 */
  }
`;

const MobileMenuButton = styled(Button)`
  display: none;

  @media (max-width: 768px) {
    display: block; /* 只在小螢幕上顯示 */
    font-size: 18px;
  }
`;

const DashboardHeader: React.FC = () => {
  const pathname = usePathname();
  const [current, setCurrent] = useState(pathname);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // 確保這些組件僅在客戶端渲染
  }, []);

  const onClick = (e: any) => {
    setCurrent(e.key);
    setDrawerVisible(false);
  };

  // Handle window resize to close drawer on larger screens
  useEffect(() => {
    // 檢查瀏覽器窗口大小
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    checkScreenSize(); // 初始化時執行一次

    // 設置事件監聽器來監控窗口大小變化
    window.addEventListener('resize', checkScreenSize);

    // 清理事件監聽器
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
      <LogoContainer>
        {isClient && (
          <Image src="/WATI_logo_full.png" alt="logo" width={100} height={41} style={{ objectFit: 'contain' }} />
        )}
        </LogoContainer>
    
    {isLargeScreen && isClient && (
      <MenuContainer>
        <MenuStyle onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
        <IconWrapper>
          <GlobalOutlined style={{ fontSize: '24px', cursor: 'pointer' }} />
          <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
            <UserOutlined style={{ fontSize: '24px', cursor: 'pointer' }} />
          </Dropdown>
        </IconWrapper>
      </MenuContainer>
    )}
    {isClient && (
      <>
      <MobileMenuButton icon={<MenuOutlined />} onClick={() => setDrawerVisible(true)} type="text" />

      <Drawer title="Menu" placement="right" onClose={() => setDrawerVisible(false)} open={drawerVisible} forceRender>
        <Menu onClick={onClick} selectedKeys={[current]} mode="vertical" items={items} />
        <Menu items={userMenuItems} mode="vertical" selectable={false} style={{ marginTop: '20px' }} />
      </Drawer>
      </>
      )}
    </CustomHeader>
  );
};

export default DashboardHeader;