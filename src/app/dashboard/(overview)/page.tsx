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
import "./DashboardPage.css"; // 引入 CSS 文件
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
  membership_tiers: string[]; // 會員等級名稱 (新會員、銅會員等)
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
  <ResponsiveContainer width="100%" height={500}>
    <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
      <CartesianGrid vertical={false} />
      <XAxis dataKey="channel" axisLine={false} tickLine={false} />
      <YAxis
        type="number"
        domain={[0, 200]} // 設定範圍 0 到 200
        ticks={[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200]} // 自訂刻度
        axisLine={false}
        tickLine={false}
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
        x1={cx + (outerRadius - 10) * Math.cos(-midAngle * RADIAN)}
        y1={cy + (outerRadius - 10) * Math.sin(-midAngle * RADIAN)}
        x2={x}
        y2={y}
        stroke="#ccc"
        strokeWidth={1}
      />
      {/* 水平線 */}
      <line
        x1={x}
        y1={y}
        x2={x + (isLeftSide ? -100 : 100)} // 左右側決定水平線方向
        y2={y}
        stroke="#ccc"
        strokeWidth={1}
      />
      {/* 數量文字 */}
      <text
        x={x + (isLeftSide ? -40 : 40)} // 左右側控制文字的水平位置
        y={y - offset / 2}
        textAnchor={isLeftSide ? "end" : "start"}
        fill="#333"
        fontSize="14"
        fontWeight="bold"
      >
        {value}
      </text>
      {/* 即將到期文字 */}
      <text
        x={x + (isLeftSide ? -40 : 40)} // 左右側控制文字的水平位置
        y={y + offset / 2}
        textAnchor={isLeftSide ? "end" : "start"}
        fill="red"
        fontSize="12"
      >
        即將到期 {expiringSoon}
      </text>
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
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="type"
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={100}
          labelLine={false}
          label={renderCustomizedLabel}
          minAngle={35} // 最小角度限制
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={dynamicColors[index] || "#ccc"} // 使用預設顏色避免超出範圍錯誤
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
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
        {/* 會員總數圖表 */}
        <Col span={12}>
          <Card
            className="custom-card"
            title={<span className="custom-title-center">會員總數</span>}
          >
            <DonutChart dashboardData={dashboardData} />
            <div
              style={{
                textAlign: "center",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#000",
              }}
            >
              {dashboardData?.active_member_count || 0}
            </div>
            <div className="legend-container">
              {dashboardData?.membership_tiers.map(
                (tier: string, index: number) => (
                  <div key={tier} className="legend-item">
                    <span
                      className="legend-color"
                      style={{ backgroundColor: dynamicColors[index] }}
                    ></span>
                    <span className="legend-text">{tier}</span>
                  </div>
                )
              )}
            </div>
          </Card>
        </Col>
        {/* 放置實際的圖表 */}

        {/* 會員加入渠道圖表 */}
        <Col span={12}>
          <Card
            className="custom-card"
            title={<span className="custom-title-center">會員加入渠道</span>}
          >
            <MemberChannelsChart />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 現正進行推廣 */}
        <Col span={24}>
          <Card className="promotion-card" bordered={false}>
            <span
              className="custom-title-left"
              style={{
                textAlign: "left",
                display: "block",
                marginBottom: "12px",
              }}
            >
              <GiftOutlined style={{ marginRight: 8 }} />
              現正進行推廣
            </span>
            <div className="list-item-container list-container">
              {dashboardData?.active_discounts.map((item, index) => (
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
                  {index !== dashboardData?.active_discounts.length - 1 && (
                    <hr />
                  )}
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
                display: "block",
                marginBottom: "12px",
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
                  {/* 右侧区域 */}
                  <div className="right-section">
                    {/* 左侧区域 */}
                    <div className="left-section">
                      <span className="list-item-title">
                        {item.broadcast_name}
                      </span>
                    </div>

                    <a
                      href="/dashboard/broadcast_setting"
                      className="list-item-link"
                    >
                      <RightOutlined />
                    </a>
                  </div>

                  <div className="list-item-date">
                    <img src="/Alarm.png" alt="Alarm" className="alarm-icon" />
                    {new Date(item.scheduled_start).toLocaleString("zh-TW", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </div>
                  {/* 添加分隔线 */}
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
