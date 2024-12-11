// src/app/ui/dashboard/app_setting/header.tsx

"use client";

import React, { useState } from "react";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import Link from "next/link";

type MenuItem = {
  key: string;
  label: string;
};
const items: MenuItem[] = [
  {
    label: "帳戶設定",
    key: "/dashboard/app_setting",
  },
  {
    label: "API整合",
    key: "/dashboard/app_setting/wati",
  },
  // 其他項目可以解開註解或新增
  // {
  //   label: "會員頁面設定",
  //   key: "/dashboard/app_setting/customer_side",
  // },
  // {
  //   label: "網店設定",
  //   key: "/dashboard/app_setting/webstore",
  // },
];

const App: React.FC = () => {
  const [current, setCurrent] = useState("mail");
  const pathname = current;
  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  return (
    <div className="custom-page-menu">
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={items.map((item) => {
          const isCurrentItemSelected = item.key === current;

          return {
            key: item.key,
            icon: null,
            label: (
              <Link href={item.key}>
                <div className="menu-item-container">
                  <div className="icon-box">
                    <span className="diamondIcon"></span>
                  </div>
                  <CaretRightOutlined
                    className="caret-icon"
                    style={{
                      visibility: isCurrentItemSelected ? "visible" : "hidden",
                      color: isCurrentItemSelected
                        ? "var(--key-colors-tertiary, #D74D03)"
                        : "transparent",
                    }}
                  />
                  <span
                    className={`menu-item-text ${
                      isCurrentItemSelected ? "menu-item-selected" : ""
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            ),
          };
        })}
      />
    </div>
  );
};

export default App;
