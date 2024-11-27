"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Typography,
  InputNumber,
  Checkbox,
  Divider,
  message,
  Spin,
} from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { PlusSquareOutlined, CloseOutlined } from "@ant-design/icons";
import { purple } from "@ant-design/colors";
import { useRouter } from "next/navigation";
const { Title } = Typography;

interface PurchaseCountRule {
  member_point_rule_id: number;
  rule_name: string;
  rule_type: string; // 'purchase_count'
  purchase_count: number;
  point_awarded: number;
}

interface PurchaseAmountRule {
  member_point_rule_id: number;
  rule_name: string;
  rule_type: string; // 'purchase_amount'
  purchase_amount: number;
  point_awarded: number;
}

interface ReferralRule {
  member_point_rule_id: number;
  rule_name: string;
  rule_type: string; // 'referral'
  points_per_referral: number;
}

interface PointSettings {
  purchase_count?: PurchaseCountRule;
  purchase_amount?: PurchaseAmountRule;
  referral?: ReferralRule;
}

interface Form2Values {
  purchase_count: number;
  purchase_count_point_awarded: number;
  purchase_amount: number;
  purchase_amount_point_awarded: number;
  points_per_referral: number;
}

const optionInputFields: Record<
  string,
  Array<{
    label: string;
    name: string;
    type: "number" | "text";
    required: boolean;
    message: string;
    placeholder?: string;
  }>
> = {
  購買次數: [
    {
      label: "購買次數",
      name: "purchase_count",
      type: "number",
      required: true,
      message: "請輸入購買次數",
      placeholder: "請輸入購買次數 (整數)",
    },
    {
      label: "獲得的積分",
      name: "purchase_count_point_awarded",
      type: "number",
      required: true,
      message: "請輸入獲得的積分",
      placeholder: "請輸入獲得的積分 (整數)",
    },
  ],
  購買金額: [
    {
      label: "購買金額",
      name: "purchase_amount",
      type: "number",
      required: true,
      message: "請輸入購買金額",
      placeholder: "請輸入購買金額 (整數)",
    },
    {
      label: "獲得的積分",
      name: "purchase_amount_point_awarded",
      type: "number",
      required: true,
      message: "請輸入獲得的積分",
      placeholder: "請輸入獲得的積分 (整數)",
    },
  ],
  會員推薦: [
    {
      label: "每次推薦的積分",
      name: "points_per_referral",
      type: "number",
      required: true,
      message: "請輸入每次推薦的積分",
      placeholder: "請輸入每次推薦的積分 (整數)",
    },
  ],
};

const GetMemberSettingPage: React.FC = () => {
  const [form2] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const initialCheckedOptions = {
    購買次數: false,
    購買金額: false,
    會員推薦: false,
  };

  const [checkedOptions, setCheckedOptions] = useState<Record<string, boolean>>(
    initialCheckedOptions
  );
  const plainOptions = ["購買次數", "購買金額", "會員推薦"];

  useEffect(() => {
    const fetchPointSettings = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/point_setting/get_member_point_rule`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch point settings: ${response.statusText}`
          );
        }

        const data: PointSettings = await response.json();

        const formValues: Record<string, any> = {};
        const newCheckedOptions: Record<string, boolean> = {};

        if (data.purchase_count) {
          formValues.purchase_count = data.purchase_count.purchase_count;
          formValues.purchase_count_point_awarded =
            data.purchase_count.point_awarded;
          newCheckedOptions["購買次數"] = true;
        } else {
          newCheckedOptions["購買次數"] = false;
        }

        if (data.purchase_amount) {
          formValues.purchase_amount = data.purchase_amount.purchase_amount;
          formValues.purchase_amount_point_awarded =
            data.purchase_amount.point_awarded;
          newCheckedOptions["購買金額"] = true;
        } else {
          newCheckedOptions["購買金額"] = false;
        }

        if (data.referral) {
          formValues.points_per_referral = data.referral.points_per_referral;
          newCheckedOptions["會員推薦"] = true;
        } else {
          newCheckedOptions["會員推薦"] = false;
        }

        form2.setFieldsValue(formValues);
        setCheckedOptions(newCheckedOptions);
      } catch (error) {
        console.error("Error fetching point settings:", error);
        message.error("Failed to fetch point settings");
      } finally {
        setLoading(false);
      }
    };

    fetchPointSettings();
  }, [form2]);

  const onFinishForm2 = async (values: Form2Values) => {
    const dataToSend: any = {};

    dataToSend.purchase_count = {
      purchase_count: values.purchase_count,
      point_awarded: values.purchase_count_point_awarded,
      is_active: checkedOptions["購買次數"],
    };

    dataToSend.purchase_amount = {
      purchase_amount: values.purchase_amount,
      point_awarded: values.purchase_amount_point_awarded,
      is_active: checkedOptions["購買金額"],
    };

    dataToSend.referral = {
      points_per_referral: values.points_per_referral,
      is_active: checkedOptions["會員推薦"],
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/point_setting/post_member_point_rule`,
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
      message.success("Settings updated successfully!");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      message.error(`Failed to update settings: ${error.message}`);
    }
  };

  const handleOptionChange = (option: string, checked: boolean) => {
    setCheckedOptions((prevState) => ({
      ...prevState,
      [option]: checked,
    }));
  };

  const allChecked = Object.values(checkedOptions).every((value) => value);
  const isIndeterminate =
    Object.values(checkedOptions).some((value) => value) && !allChecked;

  const handleCheckAllChange = (checked: boolean) => {
    const newCheckedOptions = plainOptions.reduce((options, option) => {
      options[option] = checked;
      return options;
    }, {} as Record<string, boolean>);
    setCheckedOptions(newCheckedOptions);
  };

  const icons = {
    購買次數: {
      checked: "/coin.png",
      unchecked: "/coin_BW.png",
    },
    購買金額: {
      checked: "/coin.png",
      unchecked: "/coin_BW.png",
    },
    會員推薦: {
      checked: "/like.png",
      unchecked: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="37"
          height="34"
          viewBox="0 0 37 34"
          fill="none"
        >
          <path
            d="M25.0985 2C22.6186 2.01773 20.2465 2.99242 18.4993 4.71157C16.7518 2.9921 14.3791 2.01738 11.8988 2C6.43261 2 2 6.74018 2 12.5885C2 18.4368 13.5499 28.4705 18.4993 32C23.4487 28.4705 35 18.4354 35 12.5939C35 6.75233 30.566 2 25.0985 2Z"
            fill="#d9d9d9"
            stroke="#737277"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
    },
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin tip="Loading..." size="large" />
      </div>
    );
  }

  return (
    <>
      {/* Submit Button */}
      <Form.Item style={{ marginBottom: "0px" }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {/* 取消按鈕 */}
          <Button
            onClick={() => {
              form2.resetFields();
              router.back();
            }}
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

      <Form
        form={form2}
        onFinish={onFinishForm2}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        style={{ marginTop: "2rem" }}
      >
        <Form.Item label="" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          <div
            className={`custom-checkbox ${allChecked ? "checked" : ""}`}
            onClick={() => handleCheckAllChange(!allChecked)}
          >
            {allChecked ? (
              <>
                <span className="checkbox-label">全選</span>
                <CloseOutlined className="icon" />
              </>
            ) : (
              <>
                <span className="checkbox-label">全選</span>
                <PlusSquareOutlined className="icon" />
              </>
            )}
          </div>
        </Form.Item>

        {/* 三欄佈局 */}
        <div className="three-column-layout">
          {/* 購買次數 */}
          <div className={`card ${checkedOptions["購買次數"] ? "active" : ""}`}>
            <div className="card-header">
              <div className="card-title">
                <img
                  src={
                    checkedOptions["購買次數"]
                      ? icons["購買次數"].checked
                      : icons["購買次數"].unchecked
                  }
                  alt="icon"
                  style={{
                    width: "22px",
                    height: "22px",
                  }}
                />
                <span>購買次數</span>
              </div>
              <div
                className="card-icon"
                onClick={() =>
                  handleOptionChange("購買次數", !checkedOptions["購買次數"])
                }
                style={{ cursor: "pointer" }}
              >
                {checkedOptions["購買次數"] ? (
                  <CloseOutlined style={{ color: "#fff", fontSize: "20px" }} />
                ) : (
                  <PlusSquareOutlined
                    style={{ color: "#fff", fontSize: "20px" }}
                  />
                )}
              </div>
            </div>

            <div className="card-body">
              <Form.Item
                label="購買次數"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                className="custom-form-item"
              >
                <InputNumber
                  placeholder="請輸入購買次數 (整數)"
                  className="custom-input-number"
                />
              </Form.Item>
              <Form.Item
                label="獲得積分"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                className="custom-form-item"
              >
                <InputNumber
                  placeholder="請輸入獲得積分 (整數)"
                  className="custom-input-number"
                />
              </Form.Item>
            </div>
          </div>

          {/* 購買金額 */}
          <div className={`card ${checkedOptions["購買金額"] ? "active" : ""}`}>
            <div className="card-header">
              <div className="card-title">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={
                      checkedOptions["購買金額"]
                        ? icons["購買金額"].checked
                        : icons["購買金額"].unchecked
                    }
                    alt="icon"
                    style={{
                      width: "22px",
                      height: "22px",
                      marginRight: "4px",
                    }}
                  />

                  <span>購買金額</span>
                </div>
              </div>
              <div
                className="card-icon"
                onClick={() =>
                  handleOptionChange("購買金額", !checkedOptions["購買金額"])
                }
                style={{ cursor: "pointer" }}
              >
                {checkedOptions["購買金額"] ? (
                  <CloseOutlined style={{ color: "#fff", fontSize: "20px" }} />
                ) : (
                  <PlusSquareOutlined
                    style={{ color: "#fff", fontSize: "20px" }}
                  />
                )}
              </div>
            </div>
            <div className="card-body">
              <Form.Item
                label="購買金額"
                className="custom-form-item"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <InputNumber
                  placeholder="請輸入購買金額 (整數)"
                  style={{ width: "100%" }}
                  className="custom-input-number"
                />
              </Form.Item>
              <Form.Item
                label="獲得積分"
                className="custom-form-item"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <InputNumber
                  placeholder="請輸入獲得積分 (整數)"
                  style={{ width: "100%" }}
                  className="custom-input-number"
                />
              </Form.Item>
            </div>
          </div>

          {/* 會員推薦 */}
          <div className={`card ${checkedOptions["會員推薦"] ? "active" : ""}`}>
            <div className="card-header">
              <div className="card-title">
                <div style={{ display: "flex", alignItems: "center" }}>
                  {checkedOptions["會員推薦"] ? (
                    <img
                      src={icons["會員推薦"].checked}
                      alt="icon"
                      style={{
                        width: "33px",
                        height: "30px",
                        marginRight: "5px",
                      }}
                    />
                  ) : (
                    <div className="svg-container">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="33"
                        height="30"
                        viewBox="0 0 37 34"
                        fill="none"
                        style={{
                          display: "block",
                        }}
                        preserveAspectRatio="xMidYMid slice"
                      >
                        <path
                          d="M25.0985 2C22.6186 2.01773 20.2465 2.99242 18.4993 4.71157C16.7518 2.9921 14.3791 2.01738 11.8988 2C6.43261 2 2 6.74018 2 12.5885C2 18.4368 13.5499 28.4705 18.4993 32C23.4487 28.4705 35 18.4354 35 12.5939C35 6.75233 30.566 2 25.0985 2Z"
                          fill="#d9d9d9"
                          stroke="#737277"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                  <span>會員推薦</span>
                </div>
              </div>
              <div
                className="card-icon"
                onClick={() =>
                  handleOptionChange("會員推薦", !checkedOptions["會員推薦"])
                }
                style={{ cursor: "pointer" }}
              >
                {checkedOptions["會員推薦"] ? (
                  <CloseOutlined style={{ color: "#fff", fontSize: "20px" }} />
                ) : (
                  <PlusSquareOutlined
                    style={{ color: "#fff", fontSize: "20px" }}
                  />
                )}
              </div>
            </div>
            <div className="card-body">
              <Form.Item
                label="獲得積分"
                className="custom-form-item"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <InputNumber
                  placeholder="請輸入獲得積分 (整數)"
                  style={{ width: "100%" }}
                  className="custom-input-number"
                />
              </Form.Item>
            </div>
          </div>
        </div>
      </Form>
    </>
  );
};

export default GetMemberSettingPage;
