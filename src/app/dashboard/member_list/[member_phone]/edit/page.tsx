// src/app/dashboard/member_list/[member_phone]/edit/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Descriptions,
  Spin,
  Alert,
  Form,
  Input,
  Button,
  message,
  Table,
  Tabs,
  Space
} from "antd";
import { useParams, useRouter } from "next/navigation";
import type { ColumnsType } from "antd/es/table";

interface MemberDataType {
  member_phone: string;
  member_name: string;
  birthday: string | null;
  membership_tier?: {
    membership_tier_id: number;
    membership_tier_name: string;
    membership_tier_sequence: number;
    require_point: number;
    extend_membership_point: number;
    point_multiplier: number;
    membership_period: number;
  };
  membership_start_date: string;
  membership_end_date: string;
  membership_creation_date: string;
  total_points_earned: number;
  unused_points: number;
  used_points: number;
  referrer: string | null;
  referees: RefereeDataType[];
  purchase_count: number;
  total_purchase_amount: number;
  current_membership_purchase_amount: number;
  purchases: PurchaseDataType[];
  discount_codes: DiscountCodeType[];
  // Add other fields as needed
}

interface RefereeDataType {
  member_phone: string;
  member_name: string;
  purchase_count: number;
  total_purchase_amount: number;
  // Add other fields as needed
}

interface PurchaseDataType {
  purchase_id: string;
  purchase_date: string;
  amount: number;
  // Add other fields as needed
}

interface DiscountCodeType {
  code_id: string;
  created_at: string;
  code_name: string;
  code: string;
  type: string;
  status: string;
  received_date: string;
  usage_count: number;
  // Add other fields as needed
}

const { TabPane } = Tabs;

const GetMemberDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const memberPhone = params.member_phone;

  const [memberData, setMemberData] = useState<MemberDataType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [form] = Form.useForm();

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        console.log(memberPhone)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/member/get_member_detail/${memberPhone}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data: MemberDataType = await response.json();
        setMemberData(data);
        // Set form values for editing
        form.setFieldsValue({
          member_name: data.member_name,
          birthday: data.birthday,
          // Add other editable fields
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (memberPhone) {
      fetchMemberData();
    }
  }, [form, memberPhone]);

  const onFinish = async (values: any) => {
    // Handle the form submission to update member details
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/member/update_member/${memberPhone}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify(values),
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const result = await response.json();
      message.success("Member details updated successfully");
      // Update the member data
      setMemberData({ ...memberData!, ...values });
    } catch (err: any) {
      message.error(err.message || "Failed to update member details");
    }
  };

  const handleSuspendMembership = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/member/suspend_membership/${memberPhone}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
          // Include any additional data if needed
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      message.success("Membership suspended successfully");
      // Update member data or state if necessary
    } catch (err: any) {
      message.error(err.message || "Failed to suspend membership");
    }
  };

  if (loading) return <Spin tip="Loading..." />;
  if (error)
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
      />
    );

  return (
    <>
      {/* Member Details */}
      <Card title="會員詳細資訊">
        <Descriptions column={1}>
          <Descriptions.Item label="會員姓名">
            {memberData?.member_name || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="會員電話">
            {memberData?.member_phone || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="生日">
            {memberData?.birthday || "N/A"}
          </Descriptions.Item>
          {/* Add more fields as needed */}
        </Descriptions>
      </Card>

      {/* Membership Information */}
      <Card title="會員會籍資訊" style={{ marginTop: 16 }}>
        <Descriptions column={1}>
          <Descriptions.Item label="會員層級">
            {memberData?.membership_tier?.membership_tier_name || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="會員有效期">
            {memberData?.membership_start_date || "N/A"} 至{" "}
            {memberData?.membership_end_date || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="會籍建立日期">
            {memberData?.membership_creation_date || "N/A"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Points Statistics */}
      <Card title="積分統計" style={{ marginTop: 16 }}>
        <Descriptions column={1}>
          <Descriptions.Item label="會員期內獲得的積分">
            {memberData?.total_points_earned || 0}
          </Descriptions.Item>
          <Descriptions.Item label="未使用積分">
            {memberData?.unused_points || 0}
          </Descriptions.Item>
          <Descriptions.Item label="已使用積分">
            {memberData?.used_points || 0}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Edit Member Information */}
      <Card title="編輯會員資訊" style={{ marginTop: 16 }}>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="member_name"
            label="會員姓名"
            rules={[{ required: true, message: "請輸入會員姓名" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="birthday" label="生日">
            <Input />
          </Form.Item>
          {/* Add other editable fields */}
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                更新資訊
              </Button>
              <Button type="primary" htmlType="submit">
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                暫停會藉
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* Referrer Information */}
      <Card style={{ marginTop: 16 }}>
        <Tabs defaultActiveKey="referees">
          

          <TabPane tab="消費記錄" key="purchases">
            {/* Purchase Statistics */}
            <Descriptions column={1}>
              <Descriptions.Item label="累積消費次數">
                {memberData?.purchase_count || 0}
              </Descriptions.Item>
              <Descriptions.Item label="累積總消費額">
                {memberData?.total_purchase_amount || 0}
              </Descriptions.Item>
              <Descriptions.Item label="本次會員期的累積消費額">
                {memberData?.current_membership_purchase_amount || 0}
              </Descriptions.Item>
            </Descriptions>

            {/* Purchase List */}
            <Table<PurchaseDataType>
              dataSource={memberData?.purchases || []}
              columns={[
                {
                  title: '消費日期',
                  dataIndex: 'purchase_date',
                  key: 'purchase_date',
                },
                {
                  title: '單號',
                  dataIndex: 'invoice_number',
                  key: 'invoice_number',
                },
                {
                  title: '消費金額',
                  dataIndex: 'amount',
                  key: 'amount',
                },
                {
                  title: '賺取積分',
                  dataIndex: 'point_earning',
                  key: 'point_earning',
                },
                // Add more columns as needed
              ]}
              rowKey="purchase_id"
              onRow={(record) => ({
                onClick: () => {
                  // Navigate to purchase detail page
                  router.push(`/dashboard/purchase_detail/${record.purchase_id}`);
                },
              })}
            />
          </TabPane>

          <TabPane tab="禮遇接收" key="discount_codes">
            {/* Discount Codes */}
            <Table<DiscountCodeType>
              dataSource={memberData?.discount_codes || []}
              columns={[
                { title: '接收日期', dataIndex: 'received_date', key: 'received_date' },
                { title: '優惠券名稱', dataIndex: 'code_name', key: 'code_name' },
                { title: '優惠碼', dataIndex: 'code', key: 'code' },
                { title: '折扣類型', dataIndex: 'type', key: 'type' },
                { title: '使用次數', dataIndex: 'usage_count', key: 'usage_count' },
                { title: '狀態', dataIndex: 'status', key: 'status' },
                // Add more columns if needed
              ]}
              rowKey="code_id"
            />
          </TabPane>

          <TabPane tab="推薦記錄" key="referees">
            {/* Referees Information */}
            <Descriptions column={1}>
              <Descriptions.Item label="被推薦人數量">
                {memberData?.referees?.length || 0}
              </Descriptions.Item>
              {/* Add other statistics if needed */}
            </Descriptions>

            {/* List of Referees */}
            <Table<RefereeDataType>
              dataSource={memberData?.referees || []}
              columns={[
                {
                  title: '加入日期',
                  dataIndex: 'created_at',
                  key: 'created_at',
                },
                {
                  title: '會員姓名',
                  dataIndex: 'member_name',
                  key: 'member_name',
                },

                {
                  title: '會員電話',
                  dataIndex: 'member_phone',
                  key: 'member_phone',
                },
                {
                  title: '消費次數',
                  dataIndex: 'purchase_count',
                  key: 'purchase_count',
                },
                {
                  title: '總消費額',
                  dataIndex: 'total_purchase_amount',
                  key: 'total_purchase_amount',
                },
                // Add more columns if needed
              ]}
              rowKey="member_phone"
            />
          </TabPane>
        </Tabs>
      </Card>
    </>
  );
};

export default GetMemberDetailPage;