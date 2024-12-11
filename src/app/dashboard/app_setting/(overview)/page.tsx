"use client";

import React, { useEffect, useState } from "react";
import { Divider, Form, Input, Button, Typography, message } from "antd";
import { UserOutlined } from "@ant-design/icons";

const AppSettingPage: React.FC = () => {
  const [form] = Form.useForm();
  const [adminName, setAdminName] = useState<string>("");

  useEffect(() => {
    // Fetch admin_name from the database
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
        setAdminName(data.admin_name);
      } catch (error) {
        console.error("Failed to fetch admin name:", error);
      }
    };
    fetchAdminName();
  }, []);

  const onFinish = async (values: any) => {
    try {
      // Prepare the payload
      const payload = {
        admin_name: adminName, // Include admin_name from state
        current_password: values.admin_password,
        new_password: values.new_admin_password,
      };

      // Send the request to your backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin_setting/put_admin_update_profile_detail`,
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
      <div className="custom-title-container">
        <Typography.Title level={3} className="custom-title-text">
          <UserOutlined className="custom-title-icon" />
          帳戶設定
        </Typography.Title>
      </div>

      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item label="帳戶名稱">
          <Input value={adminName} disabled />
        </Form.Item>
        <Form.Item
          label="舊密碼"
          name="admin_password"
          rules={[
            { required: true, message: "Please enter your current password" },
          ]}
        >
          <Input.Password
            placeholder="Enter current password"
            className="form-input"
          />
        </Form.Item>
        <Form.Item
          label="新密碼"
          name="new_admin_password"
          rules={[{ required: true, message: "Please enter a new password" }]}
        >
          <Input.Password
            placeholder="Enter new password"
            className="form-input"
          />
        </Form.Item>
        <Form.Item
          label="確定新密碼"
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
          <Input.Password
            placeholder="Confirm new password"
            className="form-input"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: "0px" }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={onCancel}
              style={{ marginRight: 8 }}
              className="CancelButton"
            >
              取消
            </Button>
            <Button type="primary" htmlType="submit" className="addButton">
              儲存
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AppSettingPage;
