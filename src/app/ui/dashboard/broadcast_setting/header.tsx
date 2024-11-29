// src/app/ui/dashboard/discount_code_list/header.tsx

"use client";

import React, { useState, useEffect } from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./broadcast_setting_css.css";

type MenuItem = {
  key: string;
  label: string;
};

const items: MenuItem[] = [
  {
    key: "/dashboard/broadcast_setting/",
    label: "廣播管理",
  },
  {
    key: "/dashboard/broadcast_setting/broadcast_template",
    label: "訊息範本",
  },
];

const App: React.FC = () => {
  const pathname = usePathname();
  const [current, setCurrent] = useState<string>(pathname);

  useEffect(() => {
    setCurrent(pathname);
  }, [pathname]);

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
          const showCaret = isCurrentItemSelected;

          return {
            key: item.key,
            label: (
              <Link href={item.key}>
                <div className="menu-item-container">
                  {item.key !== "/dashboard/broadcast_setting/" && (
                    <div className="icon-box">
                      <span className="diamondIcon"></span>
                    </div>
                  )}
                  <CaretRightOutlined
                    className="caret-icon"
                    style={{
                      visibility: showCaret ? "visible" : "hidden",
                      color: showCaret
                        ? "var(--key-colors-tertiary, #D74D03)"
                        : "transparent",
                    }}
                  />
                  <span
                    className={`menu-item-text ${
                      showCaret ? "menu-item-selected" : ""
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
