"use client";

import React, { useEffect, useState } from "react";
import { Divider, Form, Input, Button, Typography, message } from "antd";
import { ContactsOutlined, ApiOutlined } from "@ant-design/icons";
import Image from "next/image";

const WatiPage: React.FC = () => {
  const [form] = Form.useForm();
  const [adminName, setAdminName] = useState<string>("");

  const fetchAdminName = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin_setting/get_admin_profile`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log(data.admin_name);
      
      setAdminName(data.admin_name);
    } catch (error) {
      console.error("Failed to fetch admin name:", error);
    }
  };

  useEffect(() => {
    fetchAdminName();
  }, []);

  const onFinish = async (values: any) => {
    try {
      // Prepare the payload
      const payload = {
        wati_api_endpoint: values.wati_api_endpoint, // Include admin_name from state
        wati_access_token: values.wati_access_token,
      };

      console.log(payload);

      // Send the request to your backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin_setting/put_admin_update_wati_detail`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      console.log(response);

      if (response.ok) {
        // Handle successful response
        message.success("Account settings updated successfully.");
        form.resetFields();
      } else {
        // Handle errors
        const errorData = await response.json();
        message.error(
          errorData.message || "Failed to update account settings."
        );
      }
    } catch (error) {
      console.error("Failed to update account settings:", error);
      message.error("Failed to update account settings.");
    }
  };

  const onCancel = () => {
    form.resetFields();
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
      <Typography.Title level={3} className="custom-title-text">
        連接WATI和網店，立即啟用Membership系統！
      </Typography.Title>
      <div className="form-container">
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <Image
            src="/wati-logo.png"
            alt="WATI Logo"
            width={291}
            height={98}
          />
        </div>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item label="訪問權杖" name="wati_access_token">
            <Input className="form-input" />
          </Form.Item>

          <Form.Item label="API 端點" name="wati_api_endpoint">
            <Input className="form-input" />
          </Form.Item>

          <Form.Item>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="primary" htmlType="submit" className="addButton">
                連接
                <ApiOutlined style={{ fontSize: "24px" }} />
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default WatiPage;
