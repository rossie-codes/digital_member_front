// src/app/ui/dashboard/header.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Layout, Menu, Dropdown, Drawer, Button } from "antd";
import { MailOutlined, MenuOutlined,SettingOutlined } from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "../../components/LogoutButton";
import styled from "styled-components";
import Image from "next/image";
import { GlobalOutlined, UserOutlined } from "@ant-design/icons";

const { Header } = Layout;
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: auto;
`;

const CustomHeader = styled(Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-bottom: 2px solid #000;
  flex-direction: column;
  padding-top: 20px;
  padding-bottom: 5px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  margin: 0;
  padding: 0 20px;
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0px;
  margin: 0;
`;

const MenuContainer = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none; /* 在小螢幕上隱藏 */
  }
`;

const MenuStyle = styled(Menu)`
  color: var(--key-colors-neutral-variant, #0e0e0f);
  font-family: "Noto Sans HK";
  font-size: 24px;
  font-weight: 500;
  line-height: 30px;

  .ant-menu-item {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: relative;
    text-align: center;
    width: 120px;
  }

  /* 移除 Ant Design 預設的 ::after 樣式 */
  .ant-menu-horizontal > .ant-menu-item::after {
    content: none !important;
  }

  .ant-menu-item-selected {
    color: var(--key-colors-secondary, #0b49a0);
    font-weight: 700;
    font-family: "Noto Sans HK";
    font-size: 24px;
    position: relative;
    z-index: 0;

    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(38%, -50%);
      width: 50px;
      height: 50px;
      background-color: #e5efef;
      border-radius: 50%;
      z-index: -1;
    }
  }
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
    window.addEventListener("resize", checkScreenSize);

    // 清理事件監聽器
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const items = [
    {
      label: <Link href="/dashboard">主頁</Link>,
      key: "/dashboard",
    },
    {
      label: <Link href="/dashboard/member_list">會員資料</Link>,
      key: "/dashboard/member_list",
    },
    {
      label: <Link href="/dashboard/discount_code_list">禮遇管理</Link>,
      key: "/dashboard/discount_code_list",
    },
    {
      label: <Link href="/dashboard/broadcast_setting">廣播設定</Link>,
      key: "/dashboard/broadcast_setting",
    },
  ];

  // 會員圖標選單項目
  const userMenuItems = [
    {
      key: "1",
      label: <Link href="/dashboard/app_setting"><SettingOutlined   style={{ marginRight: '8px' }}/>設定</Link>,
    },
    {
      key: "2",
      label: <LogoutButton />,
    },
  ];

  const userMenu = <Menu items={userMenuItems} />;

  return (
    <CustomHeader>
      {/* 第一行 - 右側 Icons */}
      <TopRow>
        <IconWrapper>
          <GlobalOutlined style={{ fontSize: "25px", cursor: "pointer" }} />
          <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="31"
              height="31"
              viewBox="0 0 31 31"
              fill="none"
            >
              <path
                d="M15.5 2.90625C13.0092 2.90625 10.5743 3.64486 8.50329 5.02868C6.43226 6.4125 4.81809 8.37937 3.8649 10.6806C2.91171 12.9818 2.66231 15.514 3.14824 17.9569C3.63417 20.3999 4.83361 22.6439 6.59488 24.4051C8.35615 26.1664 10.6001 27.3658 13.0431 27.8518C15.486 28.3377 18.0182 28.0883 20.3194 27.1351C22.6206 26.1819 24.5875 24.5677 25.9713 22.4967C27.3551 20.4257 28.0938 17.9908 28.0938 15.5C28.0902 12.161 26.7623 8.95979 24.4012 6.59877C22.0402 4.23775 18.839 2.90978 15.5 2.90625ZM8.97063 23.916C9.67144 22.82 10.6369 21.918 11.778 21.2932C12.9191 20.6684 14.1991 20.3409 15.5 20.3409C16.8009 20.3409 18.081 20.6684 19.222 21.2932C20.3631 21.918 21.3286 22.82 22.0294 23.916C20.1625 25.3679 17.865 26.1562 15.5 26.1562C13.135 26.1562 10.8375 25.3679 8.97063 23.916ZM11.625 14.5312C11.625 13.7648 11.8523 13.0157 12.2781 12.3784C12.7039 11.7412 13.309 11.2445 14.0171 10.9512C14.7252 10.6579 15.5043 10.5812 16.256 10.7307C17.0077 10.8802 17.6981 11.2493 18.24 11.7912C18.782 12.3331 19.151 13.0236 19.3005 13.7753C19.4501 14.527 19.3733 15.3061 19.08 16.0141C18.7867 16.7222 18.2901 17.3274 17.6528 17.7532C17.0156 18.179 16.2664 18.4062 15.5 18.4062C14.4723 18.4062 13.4867 17.998 12.76 17.2713C12.0333 16.5446 11.625 15.559 11.625 14.5312ZM23.4631 22.5731C22.3827 21.0074 20.8635 19.7962 19.0965 19.0916C20.0456 18.3441 20.7382 17.3193 21.078 16.1598C21.4177 15.0004 21.3877 13.7639 20.9921 12.6223C20.5965 11.4807 19.855 10.4907 18.8707 9.79005C17.8864 9.08941 16.7082 8.71291 15.5 8.71291C14.2918 8.71291 13.1136 9.08941 12.1293 9.79005C11.145 10.4907 10.4035 11.4807 10.0079 12.6223C9.61231 13.7639 9.58229 15.0004 9.92203 16.1598C10.2618 17.3193 10.9544 18.3441 11.9035 19.0916C10.1365 19.7962 8.61732 21.0074 7.53688 22.5731C6.17163 21.0378 5.2793 19.1406 4.96733 17.1099C4.65536 15.0793 4.93705 13.0017 5.7785 11.1274C6.61994 9.25314 7.98526 7.66206 9.71003 6.54577C11.4348 5.42948 13.4455 4.83557 15.5 4.83557C17.5545 4.83557 19.5652 5.42948 21.29 6.54577C23.0148 7.66206 24.3801 9.25314 25.2215 11.1274C26.063 13.0017 26.3447 15.0793 26.0327 17.1099C25.7207 19.1406 24.8284 21.0378 23.4631 22.5731Z"
                fill="#131313"
              />
            </svg>
          </Dropdown>
        </IconWrapper>
      </TopRow>

      {/* 第二行 - Logo 和選單 */}
      <BottomRow>
        <LogoContainer>
          {isClient && (
            <Image
              src="/logo.png"
              alt="logo"
              width={280}
              height={80}
              style={{ objectFit: "contain" }}
            />
          )}
        </LogoContainer>
        {isLargeScreen && isClient && (
          <MenuContainer>
            <MenuStyle
              onClick={onClick}
              selectedKeys={[current]}
              mode="horizontal"
              items={items}
            />
          </MenuContainer>
        )}
      </BottomRow>
    </CustomHeader>
  );
};

export default DashboardHeader;
