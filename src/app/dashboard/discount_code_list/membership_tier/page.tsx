// src/app/dashboard/discount_code_list/membership_tier/page.tsx

"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Typography,
  message,
  Select,
  FormInstance,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { purple } from "@ant-design/colors";

const { Title } = Typography;

const icons = ["/gray.png", "/blue.png", "/pink.png", "/purple.png"];

interface MembershipTier {
  membership_tier_name: string;
  require_point: number;
  extend_membership_point: number;
  point_multiplier: number;
  membership_period: number;
  original_point: number;
  multiplied_point: number;
}

interface MembershipTierFormValues {
  membershipTiers: MembershipTier[];
}

interface Form1Values {
  admin_setting_id: number;
  membership_period: string; // Assuming the value is a string as per Select options
  membership_extend_method: string;
  membership_end_result: string;
}

const membership_period = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
];

const membership_extend_method = [
  { value: "1", label: "購物滿一定金額，開啟續會按鈕。" },
  { value: "2", label: "只需詢問顧客意願，無條件續會。" },
];

const membership_end_result = [
  { value: "1", label: "會員期結束，會員擁有的積分及禮遇會失效" },
  {
    value: "2",
    label: "會員期結束，會員擁有的積分及禮遇不會失效，續會後可繼續使用。",
  },
];

const MAX_TIERS = 4;
const MIN_TIERS = 4;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const GetMembershipTierPage: React.FC = () => {
  const [form] = Form.useForm<MembershipTierFormValues>();
  const [form1] = Form.useForm();
  const [, forceUpdate] = useState({});

  // State variables
  const [initialTiers, setInitialTiers] = useState<MembershipTier[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // To handle loading state
  const hasFetched = useRef(false);

  const onFinishForm1 = async (values: Form1Values) => {
    // Include admin_setting_id in the data
    const dataToSend = {
      admin_setting_id: 1,
      membership_period: values.membership_period,
      membership_extend_method: values.membership_extend_method,
      membership_end_result: values.membership_end_result,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin_setting/post_admin_setting`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) {
        throw new Error(`Server error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Server Response:", responseData);
      // Optionally, display a success message or perform other actions
      message.success("Settings updated successfully!");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      // Optionally, display an error message
      message.error(`Failed to update settings: ${error.message}`);
    }
  };

  // Fetch current membership tiers when component mounts
  useEffect(() => {
    if (hasFetched.current) {
      // If fetch has already been called, do not proceed
      return;
    }

    hasFetched.current = true; // Mark that fetch has been called

    const fetchTiers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/membership_tier/get_membership_tier_setting`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch membership tiers: ${response.status}`
          );
        }

        let data: MembershipTier[] = await response.json();

        // Ensure data has exactly MIN_TIERS entries
        while (data.length < MIN_TIERS) {
          data.push({
            membership_tier_name: `Level ${data.length + 1}`,
            require_point: 0,
            extend_membership_point: 0,
            point_multiplier: 1.0,
            membership_period: 12,
            original_point: 0,
            multiplied_point: 0,
          });
        }

        if (data.length > MIN_TIERS) {
          data = data.slice(0, MIN_TIERS); // Limit to MAX_TIERS
        }

        // Set default values for the lowest tier
        data[0].require_point = 0;
        data[0].extend_membership_point = 0;

        setInitialTiers(data);
      } catch (error) {
        console.error("Error fetching membership tiers:", error);
        message.error("Failed to fetch membership tiers");

        // Initialize with default tiers if fetching fails
        const tiers: MembershipTier[] = [];
        for (let i = 0; i < MIN_TIERS; i++) {
          tiers.push({
            membership_tier_name: `Level ${i + 1}`,
            require_point: i === 0 ? 0 : 1000 * i, // Example values
            extend_membership_point: i === 0 ? 0 : 500 * i,
            point_multiplier: 1.0 + i * 0.1,
            membership_period: 12,
            original_point: 0,
            multiplied_point: 0,
          });
        }
        setInitialTiers(tiers);
      } finally {
        setLoading(false);
      }
    };

    fetchTiers();
  }, []);

  // Update form fields when initial tiers are set
  useEffect(() => {
    if (!loading) {
      form.setFieldsValue({ membershipTiers: initialTiers });
    }
  }, [loading, initialTiers, form]);

  const onFinish = async (values: MembershipTierFormValues) => {
    if (values.membershipTiers.length < MIN_TIERS) {
      message.error(`最少需要 ${MIN_TIERS} 個會員層級。`);
      return;
    }

    if (values.membershipTiers.length > MAX_TIERS) {
      message.error(`最多只能 ${MAX_TIERS} 個會員層級。`);
      return;
    }

    const updatedMembershipTiers = values.membershipTiers.map(
      (tier, index) => ({
        ...tier,
        membership_tier_sequence: index + 1, // Assign sequence number
        point_multiplier: tier.point_multiplier * 1000,
      })
    );

    console.log("Form Submitted Successfully:", updatedMembershipTiers);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/membership_tier/post_membership_tier_setting`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'auth': '12345'
          },
          body: JSON.stringify(updatedMembershipTiers),
        }
      );

      if (!response.ok) {
        throw new Error(`Server error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Server Response:", responseData);
      message.success("Membership tiers updated successfully!");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      message.error(`Failed to update membership tiers: ${error.message}`);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Form Submission Failed:", errorInfo);
    message.error("Please check the form for errors and try again.");
  };

  // Handle loading state
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Title level={3}>Loading membership tiers...</Title>
      </div>
    );
  }

  const calculatePointMultiplier = (
    form: FormInstance,
    index: number,
    originalField: string,
    multipliedField: string
  ): number => {
    const originalPoint =
      form.getFieldValue(["membershipTiers", index, originalField]) || 0;
    const multipliedPoint =
      form.getFieldValue(["membershipTiers", index, multipliedField]) || 0;
    const pointMultiplier =
      originalPoint !== 0 ? multipliedPoint / originalPoint : 0;

    // Update the point_multiplier in the form
    form.setFields([
      {
        name: ["membershipTiers", index, "point_multiplier"],
        value: pointMultiplier,
      },
    ]);

    return pointMultiplier;
  };

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        name="member-tier-form"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item style={{ marginBottom: "0px" }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={() => {}}
              className="CancelButton"
              style={{ marginRight: "10px" }}
            >
              取消
            </Button>
            <Button type="primary" htmlType="submit" className="addButton">
              儲存
            </Button>
          </div>
        </Form.Item>

        <Title className="membership-card-title">會員基本設定</Title>

        <div className="three-column-form">
          <div className="form-row">
            <div className="form-column membership-select">
              <Form.Item label="有效期" name="membership_period">
                <Select options={membership_period} placeholder="選擇年期" />
              </Form.Item>
            </div>
            <div className="form-column membership-select">
              <Form.Item label="續會方式" name="membership_extend_method">
                <Select
                  options={membership_extend_method}
                  placeholder="選擇續會方式"
                />
              </Form.Item>
            </div>
            <div className="form-column membership-select">
              <Form.Item label="逾期積分" name="membership_end_result">
                <Select
                  options={membership_end_result}
                  placeholder="選擇無效會籍的積分處理方式"
                />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="horizontal-line"></div>
        <div>
          <Title className="membership-card-title">會員層級設定</Title>
        </div>

        {/* <Form.List name="membershipTiers">
          {(fields, { add, remove }) => ( */}
        <Form.List name="membershipTiers">
          {(fields) => (
            <div className="membership-card-container">
              {fields.map((field, index) => {
                const currentTier = initialTiers[index] || {};

                return (
                  <div
                    key={`membershipTier_${field.key}`}
                    className={`membership-card membership-card-${index}`}
                  >
                    <div className="membership-card-subtitle">
                      <img
                        src={icons[index]}
                        alt={`會員層級 ${index} 的圖標`}
                        className="membership-card-icon"
                      />
                      會員層級 {index + 1}
                    </div>
                    <div className="membership-card-body">
                      {/* Membership Tier Name */}
                      <Form.Item
                        label={
                          <span className="membership-label">會員名稱</span>
                        }
                        name={[field.name, "membership_tier_name"]}
                        rules={[{ required: true, message: "請輸入會員名稱" }]}
                        extra={
                          <span className="membership-extra-text">
                            現時設定：
                            {currentTier.membership_tier_name || "未設定"}
                          </span>
                        }
                      >
                        <Input
                          className="membership-input"
                          placeholder="例如：Level 1"
                          readOnly={index === 0}
                        />
                      </Form.Item>

                      {/* Require Point */}
                      <Form.Item
                        label={
                          <span className="membership-label">積分下限</span>
                        }
                        name={[field.name, "require_point"]}
                        rules={[{ required: true, message: "請輸入積分下限" }]}
                        extra={
                          <span className="membership-extra-text">
                            現時設定：{currentTier.require_point || 0}
                          </span>
                        }
                      >
                        <InputNumber
                          className="membership-input"
                          min={0}
                          style={{ width: "100%" }}
                          disabled={index === 0}
                        />
                      </Form.Item>

                      {/* Extend Membership Point */}
                      <Form.Item
                        label={
                          <span className="membership-label">續會積分下限</span>
                        }
                        name={[field.name, "extend_membership_point"]}
                        rules={[
                          { required: true, message: "請輸入續會積分下限" },
                        ]}
                        extra={
                          <span className="membership-extra-text">
                            現時設定：{currentTier.extend_membership_point || 0}
                          </span>
                        }
                      >
                        <InputNumber
                          className="membership-input"
                          min={0}
                          style={{ width: "100%" }}
                          disabled={index === 0}
                        />
                      </Form.Item>

                      {/* Display Calculated Point Multiplier */}
                      <Form.Item
                        label={
                          <span className="membership-label">積分倍數</span>
                        } // 標籤樣式
                      >
                        <Typography.Title
                          level={5}
                          className="multiplier-value"
                        >
                          {calculatePointMultiplier(
                            form,
                            index,
                            "original_point",
                            "multiplied_point"
                          )}
                        </Typography.Title>
                      </Form.Item>

                      <div className="input-group">
                        {/* Original Point */}

                        <span className="multiplier-value">$</span>
                        <Form.Item
                          name={[field.name, "original_point"]}
                          rules={[
                            {
                              required: true,
                              message: "請輸入基礎積分",
                              type: "number",
                              min: 1,
                            },
                          ]}
                          style={{ marginBottom: "0" }}
                        >
                          <InputNumber
                            min={1}
                            max={10000}
                            style={{ width: "100%" }}
                            onChange={() => forceUpdate({})}
                            className="membership-input"
                          />
                        </Form.Item>

                        <span className="multiplier-value">=</span>

                        {/* Multiplied Point */}
                        <Form.Item
                          name={[field.name, "multiplied_point"]}
                          rules={[
                            {
                              required: true,
                              message: "請輸入獲得積分",
                              type: "number",
                              min: 0,
                            },
                          ]}
                          style={{ marginBottom: "0" }}
                        >
                          <InputNumber
                            min={0}
                            max={10000}
                            style={{ width: "100%" }}
                            onChange={() => forceUpdate({})}
                            className="membership-input"
                          />
                        </Form.Item>
                        <span className="multiplier-value">分</span>
                      </div>
                      {/* Hidden Point Multiplier Field */}
                      <Form.Item name={[field.name, "point_multiplier"]} hidden>
                        <InputNumber className="membership-input" />
                      </Form.Item>

                      {/* Membership Period */}
                      <Form.Item
                        label={
                          <span className="membership-label">
                            會員期限（年）
                          </span>
                        }
                        name={[field.name, "membership_period"]}
                        rules={[
                          { required: true, message: "請輸入會員期限（年）" },
                        ]}
                        extra={
                          <span className="membership-extra-text">
                            現時設定：{currentTier.membership_period || 0}
                          </span>
                        }
                      >
                        <InputNumber
                          min={1}
                          style={{ width: "100%" }}
                          className="membership-input"
                        />
                      </Form.Item>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Form.List>
      </Form>
    </>
  );
};

export default GetMembershipTierPage;
