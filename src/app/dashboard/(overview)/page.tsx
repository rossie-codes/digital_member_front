// src/app/dashboard/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { Spin, Alert, Row, Col, Card, Typography, List } from "antd";
import { GiftOutlined,CaretUpOutlined,TagOutlined,NotificationOutlined,CaretDownOutlined} from "@ant-design/icons";
import "./DashboardPage.css"; // 引入 CSS 文件
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";


const { Title, Text } = Typography;

// Dynamic icons array
const dynamicIcons = ['/1st.png', '/2nd.png', '/3rd.png', '/renew.png', '/Amount.png', '/expired.png'];

const memberData = {
  totalMembers: 1270,
  levels: [
    { type: "第一级別會員", value: 487, expiringSoon: 33, color: "#4c8bf5" },
    { type: "第二級別會員", value: 152, expiringSoon: 28, color: "#ec6f8b" },
    { type: "第三级別會員", value: 631, expiringSoon: 53, color: "#9966cc" },
  ],
};

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 30; // 增加距離以保持標籤位置
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const { type, value, expiringSoon } = memberData.levels[index];
  return (
    <g>
      <line x1={cx + (outerRadius - 10) * Math.cos(-midAngle * RADIAN)}
            y1={cy + (outerRadius - 10) * Math.sin(-midAngle * RADIAN)}
            x2={x} y2={y} stroke="#ccc" strokeWidth={1} />
      
      <text x={x} y={y - 10} textAnchor={x > cx ? "start" : "end"} fill="#333" fontSize="14">
        {type} ({value})
      </text>
      <text x={x} y={y + 10} textAnchor={x > cx ? "start" : "end"} fill="red" fontSize="12">
        即將到期 <CaretDownOutlined /> {expiringSoon}
      </text>
    </g>
  );
};

const DonutChart = () => (
  <ResponsiveContainer width="100%" height={400}>
    <PieChart>
      <Pie
        data={memberData.levels}
        dataKey="value"
        nameKey="type"
        cx="50%"
        cy="50%"
        innerRadius={80}
        outerRadius={100}
        labelLine={false}
        label={renderCustomizedLabel} // 使用自定義標籤
      >
        {memberData.levels.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
);


interface DashboardInfo {
  userCount: number;
  sales: number;
  // Add other relevant fields as needed
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/get_dashboard_info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies if needed
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data: DashboardInfo = await response.json();
      setDashboardData(data);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardInfo();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
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
        style={{ margin: '20px' }}
      />
    );
  }

  return (
    <div className="dashboard-container">
      <div className="custom-title-width">
      <Row gutter={[16, 16]}>
        {/* 各級新會員數目區塊 */}
        <Col span={24}>
        <Card title={<span className="custom-title-center">各級新會員數目</span>}>

            <div className="member-level-item">
              <div className="icon-container"><img src={dynamicIcons[0]} alt="第一级別新會員" /></div>
              <div className="text-container">
              <Title className="level-text">第一级別新會員</Title>
              <Text className="count-text">11</Text>
              <Text className="growth-text"><CaretUpOutlined className="growth-icon"/>18.7%</Text>
              </div>
            </div>
            <div className="member-level-item">
              <div className="icon-container"><img src={dynamicIcons[1]} alt="第二級別新會員" /></div>
              <div className="text-container">
              <Title className="level-text">第二级別新會員</Title>
              <Text className="count-text">52</Text>
              <Text className="growth-text"><CaretUpOutlined className="growth-icon"/>22.8%</Text>
              </div>
            </div>
            <div className="member-level-item">
              <div className="icon-container"><img src={dynamicIcons[2]} alt="第三級別新會員" /></div>
              <div className="text-container">
              <Title className="level-text">第三级別新會員</Title>
              <Text className="count-text">34</Text>
              <Text className="growth-text"><CaretUpOutlined className="growth-icon"/>29.4%</Text>
            </div>
            
            </div>
          </Card>
        </Col>
            
      </Row>
      </div>
      <Row gutter={[16, 16]}>
          
        {/* 新會員數目、到期會籍、總會員數量等卡片 */}
        <Col span={8}>
          <Card>
          <div className="content-container">
          <div className="icon-container"><img src={dynamicIcons[4]} alt="新會員數目"className="member-icon"/></div>
            <div className="text-container">
            <Title className="level-text">新會員數目</Title>
            <div className="count-growth-container">
            <Text className="count-text">178</Text>
            <Text className="growth-text"><CaretUpOutlined className="growth-icon"/>22.8%</Text>
            </div>
            </div>
          </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
          <div className="content-container">
          <div className="icon-container"><img src={dynamicIcons[5]} alt="到期會籍"/></div>
          <div className="text-container">
            <Title className="level-text">到期會籍</Title>
            <Text className="count-text">114</Text>
            </div>
          </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
          <div className="content-container">
          <div className="icon-container"><img src={dynamicIcons[3]} alt="總會員人數" /></div>
          <div className="text-container">
            <Title className="level-text">總會員人數</Title>
            <Text className="count-text">88</Text>
            </div>
          </div>
          </Card>
        </Col>
        {/* 會員總數圖表 */}
        <Col span={12}>
          <Card title={<span className="custom-title-center">會員總數</span>}>
          
            <DonutChart />
            <div
              style={{
                textAlign: "center",
                fontSize: "24px",
                fontWeight: "bold",
                marginTop: "-170px",
                color: "#000",
              }}
            >
              {memberData.totalMembers}
            </div>
            <div className="legend-container">
              {memberData.levels.map((level, index) => (
                <div key={index} className="legend-item">
                  <span
                    className="legend-color"
                    style={{ backgroundColor: level.color }}
                  ></span>
                  <span className="legend-text">{level.type}</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
            {/* 放置實際的圖表 */}
          
        

        {/* 會員加入渠道圖表 */}
        <Col span={12}>
          <Card title={<span className="custom-title-center">會員加入渠道</span>}>
            {/* 放置實際的圖表 */}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 現正進行推廣 */}
        <Col span={24}>
        
          <Card title={
            <span className="custom-title-left">
              <GiftOutlined style={{ marginRight: 8 }} />
              現正進行推廣
            </span>
          }>
            <List
              dataSource={["會員感謝祭", "網店免運費", "網店先訂費", "網店免運費"]}
              renderItem={(item) => (
                <List.Item>
                  <TagOutlined />
                  {item}
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 即將送傳廣播 */}
        <Col span={24}>
          <Card title={
              <span  className="custom-title-left">
              <NotificationOutlined style={{ marginRight: 8 }} />即將送傳廣播
              </span>
            }>
            <List
              dataSource={[
                { name: "Broadcast_new_member1", date: "2024-10-30 15:00" },
                { name: "Broadcast_new_member2", date: "2024-10-30 15:00" },
                { name: "Broadcast_new_member3", date: "2024-10-30 15:00" },
              ]}
              renderItem={(item) => (
                <List.Item>
                  {item.name} - <Text>{item.date}</Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

    </div>
  );
}
interface DashboardInfo {
  userCount: number;
  sales: number;
  // Add other relevant fields as needed
}
