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
  Space,
  DatePicker
} from "antd";
import dayjs, { Dayjs } from "dayjs"; // Import Dayjs and its type
import { useParams, useRouter } from "next/navigation";
import type { ColumnsType } from "antd/es/table";
import styles from './MemberDetail.module.css';

const icons = ['/blue.png', '/pink.png', '/purple.png', '/green.png']; 
const dynamicIcons = ['/1st.png', '/2nd.png', '/3rd.png', '/Amount.png'];
// 根據 membership_tier_sequence 或 membership_tier_id 選擇圖示
const getIconByTierSequence = (sequence: number | undefined): string => {
  if (typeof sequence !== 'number') {
    return dynamicIcons[0]; // 預設圖示
  }
  return dynamicIcons[(sequence - 1) % dynamicIcons.length];
};




interface MemberDataType {
  member_phone: string;
  member_name: string;
  birthday: string | null;
  is_active: number;
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

interface UpdateMemberValues {
  member_name: string;
  birthday: Dayjs | null; // Use Dayjs type
  // Add other editable fields here with appropriate types
}


const { TabPane } = Tabs;

const GetMemberDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const memberPhone = params.member_phone;

  const [memberData, setMemberData] = useState<MemberDataType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<boolean>(false); // Loading state for updating
  const [activeTab, setActiveTab] = useState("purchases");

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

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
        const formattedBirthday = data.birthday
          ? dayjs(data.birthday, "YYYY-MM-DD")
          : null;


        // Set form values for editing
        form.setFieldsValue({
          member_name: data.member_name,
          birthday: formattedBirthday,
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

    // Convert 'birthday' from dayjs to string
    const formattedValues = {
      ...values,
      birthday: values.birthday
        ? values.birthday.format("YYYY-MM-DD")
        : null,
    };


    // Handle the form submission to update member details
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/member/put_change_member_detail/${memberPhone}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify(formattedValues),
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const result = await response.json();
      message.success("Member details updated successfully");
      // Update the member data
      setMemberData({ ...memberData!, ...formattedValues });
    } catch (err: any) {
      message.error(err.message || "Failed to update member details");
    } finally {
      setUpdating(false);
    }
  };

  const handleSuspendMembership = async () => {
    if (memberData?.is_active === 2) {
      // Reactivate Membership
      try {
        console.log("put_reactivate_membership start")
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/member/put_reactivate_membership/${memberPhone}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include', // Ensure cookies are included
            body: JSON.stringify({ is_active: 1 }), // Payload to set as active
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error: ${response.statusText}`);
        }

        message.success("Membership reactivated successfully");
        // Update local state to reflect the change
        setMemberData({ ...memberData!, is_active: 1 });
      } catch (err: any) {
        message.error(err.message || "Failed to reactivate membership");
      }
    } else {
      // Suspend Membership
      try {
        console.log("put_suspend_membership start")
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/member/put_suspend_membership/${memberPhone}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({ is_active: 2 }), // Payload to suspend
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error: ${response.statusText}`);
        }

        message.success("Membership suspended successfully");
        // Update local state to reflect the change
        setMemberData({ ...memberData!, is_active: 2 });
      } catch (err: any) {
        message.error(err.message || "Failed to suspend membership");
      }
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
  <div className={styles.container}>
    {/* left block */}
    <div className={styles.leftSection}>
    {/* Edit Member Information */}
    <Card title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={getIconByTierSequence(memberData?.membership_tier?.membership_tier_sequence)}
            alt="會員層級圖示"
            style={{ width: 50, height: 50, display: 'block', margin: '0 auto' }}
          />
        </div>
      }
      className={`${styles.card} ${styles.noBackgroundCard}`}
    >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="member_name"
            label="會員姓名"
            rules={[{ required: true, message: "請輸入會員姓名" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="birthday"
            label="生日"
            rules={[{ required: true, message: "請選擇生日" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              placeholder="選擇生日"
            />
          </Form.Item>
          {/* Add other editable fields */}
        </Form>
      </Card>
    </div>
    {/* 右側區塊 */}
    <div className={styles.rightSection}>
    {/* save button */}
          <Form form={form} onFinish={onFinish} style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Space>
          <Button type="default" onClick={() => router.back()}>
            取消
          </Button>
          <Button type="primary" htmlType="submit">
            儲存
          </Button>
        </Space>
      </Form>

    {/* Points Statistics */}
      <div className={styles.pointsContainer}>
            <div className={`${styles.pointCard} ${styles.pointAvailable}`}>可使用積分
            <span className={styles.pointValue}>{memberData?.unused_points}</span></div>
            <div className={`${styles.pointCard} ${styles.pointUsed}`}>已使用積分
            <span className={styles.pointValue}>{memberData?.used_points}</span></div>
            <div className={`${styles.pointCard} ${styles.pointEarned}`}>獲得積分
            <span className={styles.pointValue}>{memberData?.total_points_earned}</span></div>
      </div>
        {/* 消費資訊 */}
        <div className={styles.customDescriptions}>
          <div className={styles.customItem}>累積消費次數
          <span className={styles.pointValue}>{memberData?.purchase_count}</span></div>
          <div className={styles.customItem}>累積總消費額
          <span className={styles.pointValue}>{memberData?.total_purchase_amount}</span></div>
          <div className={styles.customItem}>本次會員期的累積消費額
          <span className={styles.pointValue}>{memberData?.current_membership_purchase_amount}</span></div>
        </div>
        
      
      {/* Membership Information */}
      <div className={styles.membershipInfoContainer}>
        <div className={styles.infoItem}>
          <span className={styles.label}>會籍建立日期</span>
          <span className={styles.value}>
            {memberData?.membership_creation_date ? dayjs(memberData.membership_creation_date).format("YYYY-MM-DD") : "N/A"}
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>會籍到期日期</span>
          <span className={styles.value}>
            {memberData?.membership_end_date ? dayjs(memberData.membership_end_date).format("YYYY-MM-DD") : "N/A"}
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>登記推薦人</span>
          <span className={styles.value}>
            {memberData?.referrer || "N/A"}
          </span>
        </div>
      </div>
      
      {/* 暫停會藉 */}
      <div style={{ marginTop: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" onClick={handleSuspendMembership}>
          {memberData?.is_active === 2 ? "重啟會藉" : "終止會藉"}
        </Button>
      </div>
    </div>
</div>

      {/* Referrer Information */}
      <Card style={{ marginTop: 16 }}>
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane
          tab={
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              <img src={activeTab === 'purchases' ? "/coin.png" : "/coin_BW.png"} alt="消費記錄圖示" style={{ width: 20, height: 20, marginRight: 8 }} />
              消費記錄
            </span>
          }
          key="purchases"
        >
            
            {/* Purchase List */}
            <Table<PurchaseDataType>
              className="custom-table-header"
              dataSource={memberData?.purchases || []}
              columns={[
                {
                  title: '日期',
                  dataIndex: 'purchase_date',
                  key: 'purchase_date',
                },
                {
                  title: '單號',
                  dataIndex: 'invoice_number',
                  key: 'invoice_number',
                },
                {
                  title: '消費總額',
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

          <TabPane
            tab={
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <img src={activeTab === 'discount_codes' ? "/gift.png" : "/gift_BW.png"} alt="禮遇接收圖示" style={{ width: 20, height: 20, marginRight: 8 }} />
                禮遇接收
              </span>
            }
            key="discount_codes"
          >
            {/* Discount Codes */}
            <Table<DiscountCodeType>
              className="custom-table-header"
              dataSource={memberData?.discount_codes || []}
              columns={[
                { title: '接收日期', dataIndex: 'received_date', key: 'received_date'},
                { title: '優惠券名稱', dataIndex: 'code_name', key: 'code_name'},
                { title: '優惠碼', dataIndex: 'code', key: 'code'},
                { title: '折扣類型', dataIndex: 'type', key: 'type'},
                { title: '使用次數', dataIndex: 'usage_count', key: 'usage_count' },
                { title: '狀態', dataIndex: 'status', key: 'status'},
                // Add more columns if needed
              ]}
              rowKey="code_id"
            />
          </TabPane>

          <TabPane
            tab={
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <img src={activeTab === 'referees' ? "/recommand.png" : "/recommand_BW.png"} alt="推薦記錄圖示" style={{ width: 20, height: 20, marginRight: 8 }} />
                推薦記錄
              </span>
            }
            key="referees"
          >
            {/* Referees Information */}
            <Descriptions column={1}>
              <Descriptions.Item label="被推薦人數量">
                {memberData?.referees?.length || 0}
              </Descriptions.Item>
              {/* Add other statistics if needed */}
            </Descriptions>

            {/* List of Referees */}
            <Table<RefereeDataType>
              className="custom-table-header"
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
                  title: '消費總額',
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