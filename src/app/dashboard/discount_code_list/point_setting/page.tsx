'use client';

import React, { useEffect, useState } from 'react';
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
} from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { purple } from '@ant-design/colors';

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
  const [form2] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);

  const initialCheckedOptions = {
    '購買次數': false,
    '購買金額': false,
    '會員推薦': false,
  };

  const [checkedOptions, setCheckedOptions] = useState<Record<string, boolean>>(initialCheckedOptions);
  const plainOptions = ['購買次數', '購買金額', '會員推薦'];

  useEffect(() => {
    const fetchPointSettings = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/point_setting/get_member_point_rule`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch point settings: ${response.statusText}`);
        }

        const data: PointSettings = await response.json();

        const formValues: Record<string, any> = {};
        const newCheckedOptions: Record<string, boolean> = {};

        if (data.purchase_count) {
          formValues.purchase_count = data.purchase_count.purchase_count;
          formValues.purchase_count_point_awarded = data.purchase_count.point_awarded;
          newCheckedOptions['購買次數'] = true;
        } else {
          newCheckedOptions['購買次數'] = false;
        }

        if (data.purchase_amount) {
          formValues.purchase_amount = data.purchase_amount.purchase_amount;
          formValues.purchase_amount_point_awarded = data.purchase_amount.point_awarded;
          newCheckedOptions['購買金額'] = true;
        } else {
          newCheckedOptions['購買金額'] = false;
        }

        if (data.referral) {
          formValues.points_per_referral = data.referral.points_per_referral;
          newCheckedOptions['會員推薦'] = true;
        } else {
          newCheckedOptions['會員推薦'] = false;
        }

        form2.setFieldsValue(formValues);
        setCheckedOptions(newCheckedOptions);
      } catch (error) {
        console.error('Error fetching point settings:', error);
        message.error('Failed to fetch point settings');
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
      is_active: checkedOptions['購買次數'],
    };

    dataToSend.purchase_amount = {
      purchase_amount: values.purchase_amount,
      point_awarded: values.purchase_amount_point_awarded,
      is_active: checkedOptions['購買金額'],
    };

    dataToSend.referral = {
      points_per_referral: values.points_per_referral,
      is_active: checkedOptions['會員推薦'],
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/point_setting/post_member_point_rule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error(`Server error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Server Response:', responseData);
      message.success('Settings updated successfully!');
    } catch (error: any) {
      console.error('Error submitting form:', error);
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
  const isIndeterminate = Object.values(checkedOptions).some((value) => value) && !allChecked;

  const handleCheckAllChange = (e: CheckboxChangeEvent) => {
    const checked = e.target.checked;
    const newCheckedOptions = plainOptions.reduce((options, option) => {
      options[option] = checked;
      return options;
    }, {} as Record<string, boolean>);
    setCheckedOptions(newCheckedOptions);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin tip="Loading..." size="large" />
      </div>
    );
  }

  return (
    <>
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

        {plainOptions.map((option) => (
          <div key={option} style={{ backgroundColor: checkedOptions[option] ? 'white' : '#f5f5f5' }}>
            <Form.Item
              label={option}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 14 }}
            >
              <Checkbox
                checked={checkedOptions[option]}
                onChange={(e) => handleOptionChange(option, e.target.checked)}
              />
            </Form.Item>

            {optionInputFields[option]?.map((field) => (
              <Form.Item
                key={field.name}
                label={field.label}
                name={field.name}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
                rules={[{ required: checkedOptions[option], message: field.message }]}
              >
                {field.type === 'number' ? (
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder={field.placeholder || ''}
                  />
                ) : (
                  <Input 
                    placeholder={field.placeholder || ''} />
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