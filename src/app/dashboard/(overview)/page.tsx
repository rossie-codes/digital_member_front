// src/app/dashboard/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Spin, Alert, Row, Col, Card, Typography, List } from "antd";
import {
  GiftOutlined,
  CaretUpOutlined,
  TagOutlined,
  NotificationOutlined,
  CaretDownOutlined,
  RightOutlined,
} from "@ant-design/icons";
import "./DashboardPage.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface DashboardInfo {
  userCount: number;
  sales: number;
  // Add other relevant fields as needed
  new_member_count: number; // 新會員數目
  expiring_member_count: number; // 即將到期會員數目
  active_member_count: number; // 總會員數目
  membership_tiers: string[]; // 會員等級名稱
  membership_tier_counts: Record<string, number>; // 各會員等級的人數
  membership_tier_expiring_member_count: Record<string, number>; // 各等級即將到期會員數目
  membership_tier_upgrade_member_counts: Record<string, number>; // 各等級升級會員數目
  membership_tier_change_percentage: Record<string, number>; // 各等級會員變化百分比
  upcoming_broadcasts: {
    broadcast_name: string;
    scheduled_start: string;
  }[]; // 即將傳送廣播列表
  active_discounts: {
    discount_code_name: string;
    valid_from: string;
  }[]; // 活動中的折扣列表
}

const { Title, Text } = Typography;

// Dynamic icons array
const dynamicIcons = [
  "/new.png",
  "/1st.png",
  "/2nd.png",
  "/3rd.png",
  "/Amount.png",
  "/expired.png",
  "/renew.png",
];
const dynamicColors = ["#2989C5", "#F275A9", "#855BBF", "#FFA500"]; // 根據等級設置顏色

const data = [
  { channel: "門市", members: 100 },
  { channel: "WhatsApp", members: 80 },
  { channel: "推薦", members: 20 },
];

const MemberChannelsChart = () => (
  <ResponsiveContainer width="100%" height={320}>
    <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 10 }}>
      <CartesianGrid vertical={false} />
      <XAxis dataKey="channel" axisLine={false} tickLine={false} />
      <YAxis
        type="number"
        domain={[0, 200]} // 設定範圍 0 到 200
        ticks={[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200]} // 自訂刻度
        axisLine={false}
        tickLine={false}
        interval={0}
      />
      <Tooltip />
      <Bar
        dataKey="members"
        fill="#D74D03"
        barSize={30}
        radius={[5, 5, 0, 0]}
      />
    </BarChart>
  </ResponsiveContainer>
);

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  index,
  type,
  value,
  expiringSoon,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20; // 調整標籤距離
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // 計算文字位置
  const offset = 20; // 垂直偏移量
  const isLeftSide = x < cx; // 判斷是否在左側

  return (
    <g>
      {/* 連接線 */}
      <line
        x1={cx + outerRadius * Math.cos(-midAngle * RADIAN)}
        y1={cy + outerRadius * Math.sin(-midAngle * RADIAN)}
        x2={x}
        y2={y}
        stroke="#737277"
        strokeWidth={1}
      />
      {/* 水平線 */}
      <line
        x1={x}
        y1={y}
        x2={x + (isLeftSide ? -110 : 110)} // 左右側決定水平線方向
        y2={y}
        stroke="#737277"
        strokeWidth={1}
      />
      {/* 數量文字 */}
      <text
        x={
          x +
          (isLeftSide
            ? -105 - (value.toString().length - 1) * -5 // 左側：每位數向內偏移
            : 75 + (value.toString().length - 1) * 5) // 右側：每位數向外偏移
        }
        y={y - offset / 2 + 5}
        textAnchor="middle"
        fill="var(--key-colors-secondary, #0B49A0)"
        style={{
          fontFamily: '"Noto Sans HK"',
          fontSize: "16px",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "22px",
          letterSpacing: "-0.32px",
        }}
      >
        {value}
      </text>
      <g
        transform={`translate(${x + (isLeftSide ? -60 : 5)}, ${
          y + offset / 2
        })`}
        textAnchor={isLeftSide ? "end" : "start"}
      >
        <text
          x={0}
          y={5}
          fill="var(--DarkGray, #737277)"
          style={{
            fontFamily: '"Noto Sans HK"',
            fontSize: "12px",
            fontStyle: "normal",
            fontWeight: "350",
            lineHeight: "20px",
          }}
        >
          即將到期
        </text>

        {/* icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          x={isLeftSide ? 6 : 55} // 距離文字的水平位置
          y={-4} // 垂直對齊位置
        >
          <path
            d="M8.20717 2.92969H1.79311C1.60073 2.92969 1.4933 3.13281 1.61244 3.27148L4.81948 6.99023C4.91127 7.09668 5.08803 7.09668 5.1808 6.99023L8.38784 3.27148C8.50698 3.13281 8.39955 2.92969 8.20717 2.92969Z"
            fill="#F5222D"
          />
        </svg>

        {/* 數字 */}
        <text
          x={isLeftSide ? 25 : 70}
          y={5}
          fill="var(--Dust-Red-6, #F5222D)"
          style={{
            fontFamily: '"Noto Sans HK"',
            fontSize: "12px",
            fontStyle: "normal",
            fontWeight: "350",
            lineHeight: "20px",
          }}
        >
          {expiringSoon}
        </text>
      </g>
    </g>
  );
};

const DonutChart = ({
  dashboardData,
}: {
  dashboardData: DashboardInfo | null;
}) => {
  if (!dashboardData) return null;

  const data =
    dashboardData.membership_tiers.map((tier: string, index: number) => ({
      type: tier,
      value: dashboardData.membership_tier_counts[tier],
      expiringSoon: dashboardData.membership_tier_expiring_member_count[tier],
    })) || [];

  return (
    <div style={{ position: "relative", width: "100%", height: "408px" }}>
      {/* 中心文字 */}
      <div
        style={{
          position: "absolute",
          top: "37%",
          left: "43%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          fontSize: "24px",
          fontWeight: "bold",
          color: "#000",
        }}
      >
        {dashboardData?.active_member_count || 0}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="type"
            cx="43%"
            cy="50%"
            innerRadius={80}
            outerRadius={100}
            labelLine={false}
            label={renderCustomizedLabel}
            minAngle={40} // 最小角度限制
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={dynamicColors[index] || "#ccc"}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      {/* 圖例 */}
      <div
        className="legend-container"
        style={{
          marginTop: "25px", // 調整與圖表的距離
          textAlign: "center",
        }}
      >
        {dashboardData?.membership_tiers.map((tier: string, index: number) => (
          <div
            key={tier}
            className="legend-item"
            style={{
              display: "inline-block",
              margin: "0 10px",
              textAlign: "center",
            }}
          >
            <span
              className="legend-color"
              style={{
                display: "inline-block",
                width: "15px",
                height: "15px",
                backgroundColor: dynamicColors[index],
                marginRight: "5px",
              }}
            ></span>
            <span className="legend-text" style={{ fontSize: "14px" }}>
              {tier}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardInfo | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/get_dashboard_info`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies if needed
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data: DashboardInfo = await response.json();
      setDashboardData(data);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardInfo();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin tip="Loading Dashboard..." size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        style={{ margin: "20px" }}
      />
    );
  }

  return (
    <div className="dashboard-container">
      <div className="custom-title-width">
        <Row>
          {/* 各級新會員數目區塊 */}
          <Col span={24}>
            <Card
              bordered={false}
              title={
                <span className="custom-title-center">各級新會員數目</span>
              }
            >
              {dashboardData?.membership_tiers.map(
                (tier: string, index: number) => (
                  <div className="member-level-item" key={tier}>
                    <div className="icon-container">
                      <img src={dynamicIcons[index]} alt={`${tier} 圖標`} />
                    </div>
                    <div className="text-container">
                      <Title className="level-text">{tier}</Title>
                      <Text className="count-text">
                        {dashboardData.membership_tier_counts[tier] || 0}
                      </Text>
                      <Text className="growth-text">
                        <CaretUpOutlined className="growth-icon" />
                        {(
                          (dashboardData.membership_tier_change_percentage[
                            tier
                          ] || 0) * 100
                        ).toFixed(2)}
                        %
                      </Text>
                    </div>
                  </div>
                )
              )}
            </Card>
          </Col>
        </Row>
      </div>
      <div className="middle-section">
        <Row className="custom-row">
          {/* 新會員數目、到期會籍、總會員數量等卡片 */}
          <Col span={8}>
            <Card className="custom-card">
              <div className="special-content-container">
                <div className="icon-container">
                  <img src={dynamicIcons[4]} alt="新會員數目" />
                </div>
                <div className="text-container">
                  <Title className="level-text">新會員數目</Title>
                  <Text className="count-text">
                    {dashboardData?.new_member_count || 0}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card className="custom-card">
              <div className="content-container">
                <div className="icon-container">
                  <img src={dynamicIcons[5]} alt="到期會籍" />
                </div>
                <div className="text-container">
                  <Title className="level-text">到期會籍</Title>
                  <Text className="count-text">
                    {dashboardData?.expiring_member_count || 0}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card className="custom-card">
              <div className="content-container">
                <div className="icon-container">
                  <img src={dynamicIcons[6]} alt="總會員人數" />
                </div>
                <div className="text-container">
                  <Title className="level-text">總會員人數</Title>
                  <Text className="count-text">
                    {dashboardData?.active_member_count || 0}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        {/* 下二區塊 */}
        <Row className="bottom-row">
          {/* 會員總數圖表 */}
          <Col span={12}>
            <Card
              className="chart-card"
              title={<span className="custom-title-center">會員總數</span>}
            >
              <div className="chart-container">
                <DonutChart dashboardData={dashboardData} />
              </div>
            </Card>
          </Col>

          {/* 會員加入渠道圖表 */}
          <Col span={12}>
            <Card
              className="chart-card"
              title={<span className="custom-title-center">會員加入渠道</span>}
            >
              <div className="chart-container">
                <MemberChannelsChart />
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <Row gutter={[16, 16]}>
        {/* 現正進行推廣 */}
        <Col span={24}>
          <Card className="promotion-card" bordered={false}>
            <span
              className="custom-title-left"
              style={{
                textAlign: "left",
                display: "flex",
                gap: "3px",
              }}
            >
              <GiftOutlined style={{ marginRight: 8 }} />
              現正進行推廣
            </span>
            <div className="list-item-container list-container">
              {dashboardData?.active_discounts
                .slice(0, 4)
                .map((item, index) => (
                  <div key={item.discount_code_name}>
                    <div className="right-section">
                      <div className="left-section">
                        <TagOutlined className="list-item-icon" />
                        <span className="list-item-text">
                          {item.discount_code_name}
                        </span>
                      </div>

                      <a
                        href="/dashboard/discount_code_list"
                        style={{ marginLeft: "auto" }}
                      >
                        <RightOutlined />
                      </a>
                    </div>
                    {index !== 3 && <hr />}
                  </div>
                ))}
            </div>
          </Card>
        </Col>

        {/* 即將傳送廣播 */}
        <Col span={24}>
          <Card className="broadcast-card" bordered={false}>
            <span
              className="custom-title-left"
              style={{
                textAlign: "left",
                display: "flex",
                gap: "6px",
              }}
            >
              <img
                src="/Megaphone.png"
                alt="Megaphone Icon"
                className="megaphone-icon"
              />
              即將傳送廣播
            </span>
            <div className="list-item-container list-container">
              {dashboardData?.upcoming_broadcasts.map((item, index) => (
                <div key={item.broadcast_name}>

                  <div className="broadcast-row">
                    <span className="list-item-title">
                      {item.broadcast_name}
                    </span>

                    <a
                      href="/dashboard/broadcast_setting"
                      className="list-item-link"
                      style={{ marginLeft: "auto" }}
                    >
                      <RightOutlined />
                    </a>
                  </div>
                  <div className="broadcast-row-left">
                    <img src="/Alarm.png" alt="Alarm" className="alarm-icon" />
                    <span className="list-item-date">
                      {new Date(item.scheduled_start)
                        .toLocaleString("zh-TW", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })
                        .replace(/\//g, "-")}{" "}
                      {new Date(item.scheduled_start).toLocaleTimeString(
                        "zh-TW",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        }
                      )}
                    </span>
                  </div>
                  {index !== dashboardData?.upcoming_broadcasts.length - 1 && (
                    <hr />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
