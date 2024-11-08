"use client";

import React from "react";
import { Row, Col, Card, Typography, List } from "antd";
import { GiftOutlined,CaretUpOutlined,TagOutlined,NotificationOutlined} from "@ant-design/icons";
import "./DashboardPage.css"; // 引入 CSS 文件

const { Title, Text } = Typography;

// Dynamic icons array
const dynamicIcons = ['/1st.png', '/2nd.png', '/3rd.png', '/renew.png', '/Amount.png', '/expired.png'];

export default function DashboardPage() {
  return (
    <div className="dashboard-container">

      <Row gutter={[16, 16]}>
        {/* 各級新會員數目區塊 */}
        <Col span={24}>
          <Card title="各級新會員數目">
            <List
              dataSource={[
                { level: "第一级別新會員", count: 11, growth: "18.7%", icon: dynamicIcons[0] },
                { level: "第二級別新會員", count: 52, growth: "22.8%", icon: dynamicIcons[1] },
                { level: "第三級別新會員", count: 34, growth: "29.4%", icon: dynamicIcons[2] },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <img src={item.icon} alt={item.level}/>
                  <Text>{item.level}</Text>
                  <Text>{item.count}人</Text>
                  <Text><span><CaretUpOutlined />{item.growth}</span></Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
            
      </Row>

      <Row gutter={[16, 16]}>
          
        {/* 新會員數目、到期會籍、總會員數量等卡片 */}
        <Col span={8}>
          <Card>
            <Title level={4}>新會員數目</Title>
            <img src={dynamicIcons[4]} alt="新會員數目"/>
            <Text>178</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="custom-card summary-card">
            <Title level={4}>到期會籍</Title>
            <img src={dynamicIcons[5]} alt="到期會籍"/>
            <Text>114</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Title level={4}>總會員人數</Title>
            <img src={dynamicIcons[3]} alt="總會員人數" />
            <Text>88</Text>
          </Card>
        </Col>
        {/* 會員總數圖表 */}
        <Col span={12}>
          <Card title="會員總數">
            {/* 放置實際的圖表 */}
          </Card>
        </Col>

        {/* 會員加入渠道圖表 */}
        <Col span={12}>
          <Card title="會員加入渠道">
            {/* 放置實際的圖表 */}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 現正進行推廣 */}
        <Col span={24}>
        
          <Card title={
            <span>
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
              <span style={{ marginRight: 8 }} >
              <NotificationOutlined />即將送傳廣播
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
