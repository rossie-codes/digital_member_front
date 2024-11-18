"use client";

import React, { useState, useEffect } from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import './discount_code_list_css.css';

type MenuItem = {
  key: string;
  label: string;
};

const items: MenuItem[] = [
  { key: "/dashboard/discount_code_list/", label: "優惠管理" },
  { key: "/dashboard/discount_code_list/redemption_item", label: "禮物換領" },
  { key: "/dashboard/discount_code_list/point_setting", label: "積分換領" },
  { key: "/dashboard/discount_code_list/membership_tier", label: "會員制度" },
];

const App: React.FC = () => {
  const pathname = usePathname();
  const [current, setCurrent] = useState<string>(pathname);

  useEffect(() => {
    setCurrent(pathname);
  }, [pathname]);

  const onClick: MenuProps["onClick"] = (e) => {
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
          const isExactDiscountPage =
            pathname === "/dashboard/discount_code_list/" &&
            item.key === "/dashboard/discount_code_list/";
          const isDiscountPage =
            pathname.startsWith("/dashboard/discount_code_list") &&
            item.key === "/dashboard/discount_code_list/";
          const showCaret =
            (item.key === "/dashboard/discount_code_list/" && isExactDiscountPage) ||
            isCurrentItemSelected;

          return {
            key: item.key,
            icon: null,
            label: (
              <Link href={item.key}>
                <div className="menu-item-container">
                  {item.key !== "/dashboard/discount_code_list/" && (
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
