'use client'

import React, { useEffect, useState } from "react";
import { Divider, Form, Input, Button, Typography, message } from "antd";

const AppSettingPage: React.FC = () => {
  const [form] = Form.useForm();
  const [adminName, setAdminName] = useState<string>("");

  useEffect(() => {
    // Fetch admin_name from the database
    const fetchAdminName = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/member/get_member_list`, {
          credentials: 'include',
        });

        const data = await response.json();
        setAdminName(data.admin_name);
      } catch (error) {
        console.error("Failed to fetch admin name:", error);
      }
    };
    fetchAdminName();
  }, []);

  const onFinish = (values: any) => {
    console.log("Form values:", values);
    // Handle form submission
    message.success("Account settings updated successfully.");
  };

  const onCancel = () => {
    form.resetFields();
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
      <Typography.Title level={3}>Account Setting</Typography.Title>
      <Divider />
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item label="Admin Name">
          <Input value={adminName} readOnly />
        </Form.Item>
        <Form.Item
          label="Current Password"
          name="admin_password"
          rules={[{ required: true, message: "Please enter your current password" }]}
        >
          <Input.Password placeholder="Enter current password" />
        </Form.Item>
        <Form.Item
          label="New Password"
          name="new_admin_password"
          rules={[{ required: true, message: "Please enter a new password" }]}
        >
          <Input.Password placeholder="Enter new password" />
        </Form.Item>
        <Form.Item
          label="Confirm New Password"
          name="confirm_admin_password"
          dependencies={["new_admin_password"]}
          rules={[
            { required: true, message: "Please confirm your new password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("new_admin_password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match."));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm new password" />
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

export default AppSettingPage;