// src/app/dashboard/app_setting/redemption_item/page.tsx

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
} from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { PlusOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation'; // For Next.js 13 with app directory

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

const { Title } = Typography;
const { Option } = Select;

interface RedemptionItem {
  created_at: string;
  redemption_item_id: number;
  redemption_name: string;
  discount_type: 'fixed_amount' | 'percentage';
  discount_amount?: number;
  discount_percentage?: number;
  fixed_discount_cap?: number;
  minimum_spending: number;
  validity_period: number;
  is_active: boolean;
  deleted_status?: boolean;
}

const GetGiftSettingPage: React.FC = () => {
  const [redemptionItems, setRedemptionItems] = useState<RedemptionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [addingItem, setAddingItem] = useState<boolean>(false);
  const [selectedDiscountType, setSelectedDiscountType] = useState<'fixed_amount' | 'percentage'>('fixed_amount');

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);


  const router = useRouter();
  const handleEdit = (record: RedemptionItem) => {
    router.push(`/dashboard/app_setting/redemption_item/${record.redemption_item_id}/edit`);
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const rowSelection: TableRowSelection<RedemptionItem> = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };


  const fetchRedemptionItems = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/redemption_item/get_redemption_list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        // No redemption items found, initialize with empty array
        setRedemptionItems([]);
      } else if (!response.ok) {
        throw new Error(`Failed to fetch redemption items: ${response.status}`);
      } else {
        const data: RedemptionItem[] = await response.json();
        setRedemptionItems(data);
        console.log(data)
      }
    } catch (error: any) {
      console.error('Error fetching redemption items:', error);
      setError(error.message);
      message.error(`Error fetching redemption items: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };


  // Fetch existing redemption items on component mount
  useEffect(() => {
    fetchRedemptionItems();
  }, []);

  // Table columns
  const columns: TableColumnsType<RedemptionItem> = [
    {
      title: '',
      dataIndex: 'edit',
      key: 'edit',
      render: (_: any, record: RedemptionItem) => (
        <Button
          type="link"
          icon={<FormOutlined style={{ color: '#ff4d4f' }} />}
          onClick={() => handleEdit(record)}
        />
      ),
      width: 50,
    },
    {
      title: '建立日期',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: '禮遇名稱',
      dataIndex: 'redemption_name',
      key: 'redemption_name',
    },
    {
      title: '禮遇類別',
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
    {
      title: '最高折扣限額',
      dataIndex: 'fixed_discount_cap',
      key: 'fixed_discount_cap',
      render: (text, record) => (record.discount_type === 'percentage' ? `$${text}` : '--'),
    },
    {
      title: '折扣券有效期 (月)',
      dataIndex: 'validity_period',
      key: 'validity_period',
    },
    {
      title: 'Active',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (is_active, record) => (
        <Switch
          checked={is_active}
          onChange={(checked) => handleToggleActive(record.redemption_item_id, checked)}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" danger onClick={() => handleDeleteItem(record.redemption_item_id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Function to handle activation toggle
  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      // Update the item's active status in the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/redemption_item/put_redemption_item_is_active/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: isActive }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update item: ${response.status}`);
      }

      // Update the state
      setRedemptionItems((prevItems) =>
        prevItems.map((item) => (item.redemption_item_id === id ? { ...item, is_active: isActive } : item))
      );
      message.success('Item updated successfully!');
    } catch (error: any) {
      console.error('Error updating item:', error);
      message.error(`Failed to update item: ${error.message}`);
    }
  };

  const showModal = () => {
    // setSelectedDiscountType('fixed_amount'); // Default type
    // form.resetFields();
    setIsModalVisible(true);
  };

  const handleDiscountTypeChange = (value: 'fixed_amount' | 'percentage') => {
    setSelectedDiscountType(value);
    form.resetFields(); // Reset fields when discount type changes
    form.setFieldsValue({ discount_type: value });
  };

  const onFinish = async (values: any) => {
    // Build the item object
    const newItem: Partial<RedemptionItem> = {
      redemption_name: values.redemption_name,
      discount_type: selectedDiscountType,
      minimum_spending: values.minimum_spending,
      validity_period: values.validity_period,
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
        // Update existing item
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/redemption_item/update_item/${editingItemId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newItem),
        });
      } else {
        // Add new item
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/redemption_item/post_redemption_item`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...newItem, is_active: false }),
        });
      }

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? 'update' : 'add'} item: ${response.status}`);
      }

      const result = await response.json();

      if (isEditing && editingItemId !== null) {
        // Update the item in the state
        setRedemptionItems((prevItems) =>
          prevItems.map((item) => (item.redemption_item_id === editingItemId ? { ...item, ...result } : item))
        );
        message.success('Item updated successfully!');
      } else {
        // Add the new item to the state
        setRedemptionItems((prevItems) => [...prevItems, result]);
        message.success('Item added successfully!');
      }
      
      

      setIsModalVisible(false);
      setIsEditing(false);
      setEditingItemId(null);
    } catch (error: any) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} item:`, error);
      message.error(`Failed to ${isEditing ? 'update' : 'add'} item: ${error.message}`);
    } finally {
      setAddingItem(false);
    }

    fetchRedemptionItems();

  };

  const handleDeleteItem = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/redemption_item/delete_redemption_item/${id}`, {
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
      setRedemptionItems((prevItems) => prevItems.filter((item) => item.redemption_item_id !== id));
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
        <Title level={2}>換領禮遇列表</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          新增換領禮遇
        </Button>
        <Button icon={<DeleteOutlined />} onClick={() => router.push('/dashboard/app_setting/redemption_item/deleted_redemption_item')}>
          檢視垃圾桶
        </Button>
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={redemptionItems}
        rowKey="redemption_item_id"
        style={{ marginTop: 16 }}
        locale={{ emptyText: 'No redemption items found.' }}
      />

      {/* Modal Form */}
      <Modal
        title="Add New Redemption Item"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
        }}
        footer={null}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="discount_type"
            label="Discount Type"
            initialValue={selectedDiscountType}
            rules={[{ required: true, message: 'Please select a discount type' }]}
          >
            <Select onChange={handleDiscountTypeChange}>
              <Option value="fixed_amount">Fixed Amount Discount</Option>
              <Option value="percentage">Percentage Discount</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="redemption_name"
            label="Redemption Name"
            rules={[{ required: true, message: 'Please enter the redemption name' }]}
          >
            <Input />
          </Form.Item>

          {selectedDiscountType === 'fixed_amount' && (
            <Form.Item
              name="discount_amount"
              label="Discount Amount"
              rules={[{ required: true, message: 'Please enter the discount amount' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          )}

          {selectedDiscountType === 'percentage' && (
            <>
              <Form.Item
                name="discount_percentage"
                label="Discount Percentage"
                rules={[{ required: true, message: 'Please enter the discount percentage' }]}
              >
                <InputNumber<number>
                  min={1}
                  max={100}
                  style={{ width: '100%' }}
                  formatter={(value) => `${value}%`}
                  parser={(value) => parseFloat(value!.replace('%', ''))}
                />
              </Form.Item>
              <Form.Item
                name="fixed_discount_cap"
                label="Fixed Discount Cap"
                rules={[{ required: true, message: 'Please enter the fixed discount cap' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </>
          )}

          <Form.Item
            name="minimum_spending"
            label="Minimum Spending"
            rules={[{ required: true, message: 'Please enter the minimum spending' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="validity_period"
            label="Validity Period (Months)"
            rules={[{ required: true, message: 'Please enter the validity period' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={addingItem}>
              Add Item
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GetGiftSettingPage;