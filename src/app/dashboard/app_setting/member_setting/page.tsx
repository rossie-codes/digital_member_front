// src/app/dashboard/app_setting/member_setting/page.tsx

'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  Typography,
  InputNumber,
  Checkbox,
  Divider,
  message
} from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { purple } from '@ant-design/colors';

const { Title } = Typography;


interface Form1Values {
  admin_setting_id: number;
  membership_period: string; // Assuming the value is a string as per Select options
  membership_extend_method: string;
  membership_end_result: string;
}

interface Form2Values {
  purchase_count: number; 
  purchase_count_point_awarded: number;
  purchase_amount: number;
  purchase_amount_point_awarded: number;
  points_per_referral: number

}


const membership_period = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
];

const membership_extend_method = [
  { value: '1', label: '購物滿一定金額，開啟續會按鈕。' },
  { value: '2', label: '只需詢問顧客意願，無條件續會。' },
];

const membership_end_result = [
  { value: '1', label: '會員期結束，會員擁有的積分及禮遇會失效' },
  { value: '2', label: '會員期結束，會員擁有的積分及禮遇不會失效，續會後可繼續使用。' },
];

// Define the input fields for each option
const optionInputFields: Record<
  string,
  Array<{
    label: string;
    name: string;
    type: 'number' | 'text';
    required: boolean;
    message: string;
    placeholder?: string;
  }>
> = {
  '購買次數': [
    {
      label: '購買次數',
      name: 'purchase_count',
      type: 'number',
      required: true,
      message: '請輸入購買次數',
      placeholder: '請輸入購買次數 (整數)',
    },
    {
      label: '獲得的積分',
      name: 'purchase_count_point_awarded',
      type: 'number',
      required: true,
      message: '請輸入獲得的積分',
      placeholder: '請輸入獲得的積分 (整數)',
    },
  ],
  '購買金額': [
    {
      label: '購買金額',
      name: 'purchase_amount',
      type: 'number',
      required: true,
      message: '請輸入購買金額',
      placeholder: '請輸入購買金額 (整數)',
    },
    {
      label: '獲得的積分',
      name: 'purchase_amount_point_awarded',
      type: 'number',
      required: true,
      message: '請輸入獲得的積分',
      placeholder: '請輸入獲得的積分 (整數)',
    },
  ],
  '會員推薦': [
    {
      label: '每次推薦的積分',
      name: 'points_per_referral',
      type: 'number',
      required: true,
      message: '請輸入每次推薦的積分',
      placeholder: '請輸入每次推薦的積分 (整數)',
    },
  ],
};

const GetMemberSettingPage: React.FC = () => {
  
  
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();

  
  const onFinishForm1 = async (values: Form1Values) => {
    // Include admin_setting_id in the data
    const dataToSend = {
      admin_setting_id: 1,
      membership_period: values.membership_period,
      membership_extend_method: values.membership_extend_method,
      membership_end_result: values.membership_end_result,
    };
  
    try {
      const response = await fetch('http://localhost:3000/admin_setting/post_admin_setting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (!response.ok) {
        throw new Error(`Server error! status: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log('Server Response:', responseData);
      // Optionally, display a success message or perform other actions
      message.success('Settings updated successfully!');
    } catch (error: any) {
      console.error('Error submitting form:', error);
      // Optionally, display an error message
      message.error(`Failed to update settings: ${error.message}`);
    }
  };

  const onFinishForm2 = async (values: Form2Values) => {
    // Include admin_setting_id in the data
    const dataToSend = {
      purchase_count: values.purchase_count,
      purchase_count_point_awarded: values.purchase_count_point_awarded,
      purchase_amount: values.purchase_amount,
      purchase_amount_point_awarded: values.purchase_amount_point_awarded,
      points_per_referral: values.points_per_referral,
    };
  
    try {
      const response = await fetch('http://localhost:3000/admin_setting/post_member_point_rule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (!response.ok) {
        throw new Error(`Server error! status: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log('Server Response:', responseData);
      // Optionally, display a success message or perform other actions
      message.success('Settings updated successfully!');
    } catch (error: any) {
      console.error('Error submitting form:', error);
      // Optionally, display an error message
      message.error(`Failed to update settings: ${error.message}`);
    }
  };

  // Checkbox States
  const [checkedOptions, setCheckedOptions] = useState<Record<string, boolean>>({
    '購買次數': false,
    '購買金額': false,
    '會員推薦': false,
  });

  const plainOptions = Object.keys(checkedOptions);

  // Handle individual checkbox change
  const handleOptionChange = (option: string, checked: boolean) => {
    setCheckedOptions((prevState) => ({
      ...prevState,
      [option]: checked,
    }));
  };

  // Check if all checkboxes are checked
  const allChecked = Object.values(checkedOptions).every((value) => value);

  // Check if some (but not all) checkboxes are checked
  const isIndeterminate =
    Object.values(checkedOptions).some((value) => value) && !allChecked;

  // Handle "Check All" change
  const handleCheckAllChange = (e: CheckboxChangeEvent) => {
    const checked = e.target.checked;
    const newCheckedOptions = plainOptions.reduce((options, option) => {
      options[option] = checked;
      return options;
    }, {} as Record<string, boolean>);
    setCheckedOptions(newCheckedOptions);
  };

  return (
    <>
      <Form
        form={form1}
        onFinish={onFinishForm1}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Title level={2} style={{ backgroundColor: purple[1], padding: '1rem' }}>
            會員基本設定
          </Title>
        </div>

        <Form.Item
          label="會員有效年期"
          name="membership_period"
          rules={[{ required: true, message: '請選擇會員有效年期' }]}
        >
          <Select
            // defaultValue="1"
            style={{ width: 600 }}
            // allowClear
            options={membership_period}
            placeholder="選擇年數"
          />
        </Form.Item>

        <Form.Item
          label="續會方式"
          name="membership_extend_method"
          rules={[{ required: true, message: '請選擇續會方式' }]}
        >
          <Select
            // defaultValue="2"
            style={{ width: 600 }}
            // allowClear
            options={membership_extend_method}
            placeholder="選擇續會方式"
          />
        </Form.Item>

        <Form.Item
          label="會員期結束的處理"
          name="membership_end_result"
          rules={[{ required: true, message: '請選擇會員期結束的處理' }]}
        >
          <Select
            // defaultValue="1"
            style={{ width: 600 }}
            // allowClear
            options={membership_end_result}
            placeholder="選擇續會方式"
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>

      <Divider />

      {/* Second Form for 獲取積分規則 */}
      <Form
        form={form2}
        onFinish={onFinishForm2}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        style={{ marginTop: '2rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Title level={2} style={{ backgroundColor: purple[1], padding: '1rem' }}>
            獲取積分規則
          </Title>
        </div>

        {/* "Check All" Checkbox */}
        <Form.Item label="全部選擇" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          <Checkbox
            indeterminate={isIndeterminate}
            onChange={handleCheckAllChange}
            checked={allChecked}
          >
            全部選擇
          </Checkbox>
        </Form.Item>

        <Divider />

        {/* Render Individual Checkboxes with Conditional Inputs */}
        {plainOptions.map((option) => (
          <div key={option}>
            <Form.Item
              label={option}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 14 }}
            >
              <Checkbox
                checked={checkedOptions[option]}
                onChange={(e) => handleOptionChange(option, e.target.checked)}
              >
                {/* {option} */}
              </Checkbox>
            </Form.Item>

            {/* Conditionally Render Input Fields */}
            {checkedOptions[option] &&
              optionInputFields[option]?.map((field) => (
                <Form.Item
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  rules={[{ required: field.required, message: field.message }]}
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 14 }}
                >
                  {field.type === 'number' ? (
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder={field.placeholder || ''}
                    />
                  ) : (
                    <Input placeholder={field.placeholder || ''} />
                  )}
                </Form.Item>
              ))}
          </div>
        ))}

        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default GetMemberSettingPage;