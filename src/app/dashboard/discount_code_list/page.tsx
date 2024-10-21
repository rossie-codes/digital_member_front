// src/app/dashboard/discount_code_list/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  Switch,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Typography,
  message,
  Spin,
  Alert,
  DatePicker
} from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { PlusOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';


type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface DiscountCode {
  key: number;
  discount_code_id: number;
  discount_code_name: string;
  discount_code: string;
  discount_type: 'fixed_amount' | 'percentage';
  discount_amount?: number;
  discount_percentage?: number;
  minimum_spending: number;
  fixed_discount_cap?: number;
  use_limit_type: 'single_use' | 'once_per_customer' | 'unlimited';
  valid_from?: string;
  valid_until?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

const DiscountCodeListPage: React.FC = () => {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [addingItem, setAddingItem] = useState<boolean>(false);
  const [selectedDiscountType, setSelectedDiscountType] = useState<'fixed_amount' | 'percentage'>('fixed_amount');

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  const router = useRouter();
  const handleEdit = (record: DiscountCode) => {
    console.log(record.discount_code_id)
    router.push(`/dashboard/discount_code_list/${record.discount_code_id}/edit`);
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // Row selection configuration
  const rowSelection: TableRowSelection<DiscountCode> = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  const fetchDiscountCodes = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/discount_code/get_discount_code_list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        // No discount codes found, initialize with empty array
        setDiscountCodes([]);
      } else if (!response.ok) {
        throw new Error(`Failed to fetch discount codes: ${response.status}`);
      } else {
        const data: DiscountCode[] = await response.json();
        // Map data to include 'key' property required by Ant Design Table
        const formattedData = data.map((item) => ({ ...item, key: item.discount_code_id }));
        setDiscountCodes(formattedData);
      }
    } catch (error: any) {
      console.error('Error fetching discount codes:', error);
      setError(error.message);
      message.error(`Error fetching discount codes: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch existing discount codes on component mount
  useEffect(() => {
    fetchDiscountCodes();
  }, []);



  // // Handle edit icon click
  // const handleEditIconClick = (record: DiscountCode) => {
  //   // Pre-fill the form with the selected discount code's data
  //   setSelectedDiscountType(record.discount_type);
  //   form.setFieldsValue({
  //     discount_code_name: record.discount_code_name,
  //     discount_code: record.discount_code,
  //     discount_type: record.discount_type,
  //     discount_amount: record.discount_amount,
  //     discount_percentage: record.discount_percentage,
  //     minimum_spending: record.minimum_spending,
  //     fixed_discount_cap: record.fixed_discount_cap,
  //     use_limit_type: record.use_limit_type,
  //     valid_from: record.valid_from ? new Date(record.valid_from) : null,
  //     valid_until: record.valid_until ? new Date(record.valid_until) : null,
  //   });
  //   setIsEditing(true);
  //   setEditingItemId(record.discount_code_id);
  //   setIsModalVisible(true);
  // };

  // Table columns
  const columns: TableColumnsType<DiscountCode> = [
    {
      title: '',
      dataIndex: 'edit',
      key: 'edit',
      render: (_, record) => (
        <Button
          type="link"
          icon={<FormOutlined style={{ color: '#ff4d4f' }} />}
          onClick={() => handleEdit(record)}
        />
      ),
      width: 50,
    },
    {
      title: '折扣名稱',
      dataIndex: 'discount_code_name',
      key: 'discount_code_name',
    },
    {
      title: '折扣碼',
      dataIndex: 'discount_code',
      key: 'discount_code',
    },
    {
      title: '折扣類別',
      dataIndex: 'discount_type',
      key: 'discount_type',
      render: (text) => (text === 'fixed_amount' ? 'Fixed Amount' : 'Percentage'),
    },
    {
      title: '折扣額',
      key: 'discount_amount',
      render: (_, record) =>
        record.discount_type === 'fixed_amount'
          ? `$${record.discount_amount}`
          : `${record.discount_percentage}%`,
    },
    {
      title: '最低消費',
      dataIndex: 'minimum_spending',
      key: 'minimum_spending',
      render: (text) => `$${text}`,
    },
    // {
    //   title: '最高折扣限額',
    //   dataIndex: 'fixed_discount_cap',
    //   key: 'fixed_discount_cap',
    //   render: (text, record) => (record.discount_type === 'percentage' ? `$${text}` : '--'),
    // },
    {
      title: '有效期（開始）',
      dataIndex: 'valid_from',
      key: 'valid_from',
      render: (text) => (text ? new Date(text).toLocaleDateString() : '--'),
    },
    {
      title: '有效期（結束）',
      dataIndex: 'valid_until',
      key: 'valid_until',
      render: (text) => (text ? new Date(text).toLocaleDateString() : '--'),
    },
    {
      title: '使用限制',
      dataIndex: 'use_limit_type',
      key: 'use_limit_type',
    },
    {
      title: '啟用',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (is_active, record) => (
        <Switch
          checked={is_active}
          onChange={(checked) => handleToggleActive(record.discount_code_id, checked)}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" danger onClick={() => handleDeleteItem(record.discount_code_id)}>
            Delete
          </Button>
        </Space>
      ),
    },
    // Optionally, you can add more columns like 'Created At', 'Updated At', etc.
  ];

  // Function to handle activation toggle
  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      // Update the discount code's active status in the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/discount_code/put_discount_code_is_active/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: isActive }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update discount code: ${response.status}`);
      }

      // Update the state
      setDiscountCodes((prevItems) =>
        prevItems.map((item) => (item.discount_code_id === id ? { ...item, is_active: isActive } : item))
      );
      message.success('Discount code updated successfully!');
    } catch (error: any) {
      console.error('Error updating discount code:', error);
      message.error(`Failed to update discount code: ${error.message}`);
    }
  };

  const showModal = () => {
    setSelectedDiscountType('fixed_amount'); // Default type
    // form.resetFields();
    setIsEditing(false);
    setEditingItemId(null);
    setIsModalVisible(true);
  };

  const handleDiscountTypeChange = (value: 'fixed_amount' | 'percentage') => {
    setSelectedDiscountType(value);
    form.resetFields(); // Reset fields when discount type changes
    form.setFieldsValue({ discount_type: value });
  };

  const onFinish = async (values: any) => {
    // Build the discount code object
    const newItem: Partial<DiscountCode> = {
      discount_code_name: values.discount_code_name,
      discount_code: values.discount_code,
      discount_type: selectedDiscountType,
      minimum_spending: values.minimum_spending,
      use_limit_type: values.use_limit_type,
      valid_from: values.valid_from ? values.valid_from.toISOString() : null,
      valid_until: values.valid_until ? values.valid_until.toISOString() : null,
    };

    if (selectedDiscountType === 'fixed_amount') {
      newItem.discount_amount = values.discount_amount;
      newItem.discount_percentage = undefined;
      newItem.fixed_discount_cap = undefined;
    } else if (selectedDiscountType === 'percentage') {
      newItem.discount_percentage = values.discount_percentage;
      newItem.fixed_discount_cap = values.fixed_discount_cap;
      newItem.discount_amount = undefined;
    }

    try {
      setAddingItem(true);

      let response;

      if (isEditing && editingItemId !== null) {
        // Update existing discount code
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/discount_code/update_discount_code/${editingItemId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newItem),
        });
      } else {
        // Add new discount code
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/discount_code/post_new_discount_code`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...newItem, is_active: true }),
        });
      }

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? 'update' : 'add'} discount code: ${response.status}`);
      }

      const result = await response.json();

      if (isEditing && editingItemId !== null) {
        // Update the item in the state
        setDiscountCodes((prevItems) =>
          prevItems.map((item) =>
            item.discount_code_id === editingItemId ? { ...item, ...result } : item
          )
        );
        message.success('Discount code updated successfully!');
      } else {
        // Add the new item to the state
        setDiscountCodes((prevItems) => [...prevItems, { ...result, key: result.discount_code_id }]);
        message.success('Discount code added successfully!');
      }

      setIsModalVisible(false);
      setIsEditing(false);
      setEditingItemId(null);
    } catch (error: any) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} discount code:`, error);
      message.error(`Failed to ${isEditing ? 'update' : 'add'} discount code: ${error.message}`);
    } finally {
      setAddingItem(false);
    }
    fetchDiscountCodes();
  };

  const handleDeleteItem = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/discount_code/delete_discount_code/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deleted_status: true }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to delete item: ${response.status}`);
      }
  
      // Remove the item from the state
      setDiscountCodes((prevItems) => prevItems.filter((item) => item.discount_code_id !== id));
      message.success('Item deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting item:', error);
      message.error(`Failed to delete item: ${error.message}`);
    }
  };


  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin tip="Loading..." size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>折扣券列表</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          新增折扣方式
        </Button>
        <Button icon={<DeleteOutlined />} onClick={() => router.push('/dashboard/discount_code_list/deleted_discount_code')}>
          檢視垃圾桶
        </Button>
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={discountCodes}
        rowKey="discount_code_id"
        style={{ marginTop: 16 }}
        locale={{ emptyText: 'No discount codes found.' }}
      />

      {/* Modal Form */}
      <Modal
        title={`${isEditing ? 'Edit' : 'Add New'} Discount Code`}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setIsEditing(false);
          setEditingItemId(null);
        }}
        footer={null}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="discount_type"
            label="折扣類型"
            initialValue={selectedDiscountType}
            rules={[{ required: true, message: 'Please select a discount type' }]}
          >
            <Select onChange={handleDiscountTypeChange}>
              <Option value="fixed_amount">固定金額優惠券</Option>
              <Option value="percentage">折扣比率優惠券</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="discount_code_name"
            label="折扣名稱"
            rules={[{ required: true, message: 'Please enter the discount code name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="discount_code"
            label="折扣碼"
            rules={[{ required: true, message: 'Please enter the discount code' }]}
          >
            <Input />
          </Form.Item>

          {selectedDiscountType === 'fixed_amount' && (
            <Form.Item
              name="discount_amount"
              label="折扣金額"
              rules={[{ required: true, message: 'Please enter the discount amount' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          )}

          {selectedDiscountType === 'percentage' && (
            <>
              <Form.Item
                name="discount_percentage"
                label="折扣額 % "
                rules={[{ required: true, message: 'Please enter the discount percentage' }]}
              >
                <InputNumber<number>
                  min={1}
                  max={100}
                  style={{ width: '100%' }}
                  formatter={(value) => `${value}%`}
                  parser={(value) => parseFloat(value!.replace('%', '') || '0')}
                />
              </Form.Item>
              {/* <Form.Item
                name="fixed_discount_cap"
                label="最高折扣額"
                rules={[{ required: true, message: 'Please enter the fixed discount cap' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item> */}
            </>
          )}

          <Form.Item
            name="minimum_spending"
            label="最低消費金額"
            rules={[{ required: true, message: 'Please enter the minimum spending' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="use_limit_type"
            label="使用限制"
            rules={[{ required: true, message: 'Please select the use limit type' }]}
          >
            <Select>
              <Option value="single_use">此編號使用一次後失效</Option>
              <Option value="once_per_customer">每位客戶可使用一次</Option>
              <Option value="unlimited">沒有限制</Option>
              {/* <Option value="single_use">Single Use</Option>
              <Option value="once_per_customer">Once Per Customer</Option>
              <Option value="unlimited">Unlimited</Option> */}
            </Select>
          </Form.Item>

          <Form.Item
            name="valid_from"
            label="折扣有效期（開始）"
            rules={[{ required: false, message: 'Please select the valid from date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="valid_until"
            label="折扣有效期（結束）"
            rules={[{ required: false, message: 'Please select the valid until date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={addingItem}>
              {isEditing ? 'Update Discount Code' : 'Add Discount Code'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DiscountCodeListPage;