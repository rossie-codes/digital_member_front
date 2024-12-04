'use client'

import React, { useEffect, useState } from "react";
import { Divider, Form, Input, Button, Typography, message } from "antd";
import { ContactsOutlined } from "@ant-design/icons";

const WatiPage: React.FC = () => {
  const [form] = Form.useForm();
  const [adminName, setAdminName] = useState<string>("");


  const fetchAdminName = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin_setting/get_admin_profile`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json()
        ;
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
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      console.log(response);

      if (response.ok) {
        // Handle successful response
        message.success('Account settings updated successfully.');
        form.resetFields();
      } else {
        // Handle errors
        const errorData = await response.json();
        message.error(errorData.message || 'Failed to update account settings.');
      }
    } catch (error) {
      console.error('Failed to update account settings:', error);
      message.error('Failed to update account settings.');
    }
  };

  const onCancel = () => {
    form.resetFields();
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
      <Typography.Title level={3}>WATI Setting</Typography.Title>
      <Divider />
      <Form form={form} onFinish={onFinish} layout="vertical">

        <Form.Item label="API 端點"
          name="wati_api_endpoint">
          <Input />
        </Form.Item>

        <Form.Item label="訪問權杖"
          name="wati_access_token">
          <Input />
        </Form.Item>

        <Form.Item>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
        
      </Form>
    </div>
  );
};

export default WatiPage;