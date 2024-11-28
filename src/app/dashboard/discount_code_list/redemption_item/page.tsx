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
  DatePicker,
  Dropdown
} from 'antd';
const { Search } = Input;

import type { TableColumnsType, TableProps, MenuProps } from 'antd';
import { PlusOutlined, FormOutlined, DeleteOutlined, UserOutlined, DownOutlined } from '@ant-design/icons';

import Link from 'next/link';

import { useRouter } from 'next/navigation'; // For Next.js 13 with app directory

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

const { Title } = Typography;
const { Option } = Select;

interface RedemptionItem {
  created_at: string;
  redemption_item_id: number;
  redemption_item_name: string;
  redemption_type: 'fixed_amount' | 'percentage';
  discount_amount?: number;
  discount_percentage?: number;
  fixed_discount_cap?: number;
  minimum_spending: number;
  validity_period: number;
  is_active: boolean;
  deleted_status?: boolean;
  redeem_point: number;
  quantity_available: number;
  valid_from: string;
  valid_until: string;
  redemption_content: string;
  redemption_term: string;
  redemption_item_status: string; // Add this line

}

const GetGiftSettingPage: React.FC = () => {
  const [redemptionItems, setRedemptionItems] = useState<RedemptionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [addingItem, setAddingItem] = useState<boolean>(false);
  const [selectedRedemptionType, setSelectedRedemptionType] = useState<'fixed_amount' | 'percentage'>('fixed_amount');

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  const [redemptionTypes, setRedemptionTypes] = useState<string[]>([]);
  const [redemptionItemStatuses, setRedemptionItemStatuses] = useState<string[]>([]);

  const [searchText, setSearchText] = useState<string>(''); // State for search text

  const router = useRouter();


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
        credentials: 'include',
      });

      if (response.status === 404) {
        setRedemptionItems([]);
      } else if (!response.ok) {
        throw new Error(`Failed to fetch redemption items: ${response.status}`);
      } else {
        const responseData = await response.json();
        const data: RedemptionItem[] = responseData.redemption_items;
        setRedemptionItems(data);

        // Set filter data
        setRedemptionTypes(responseData.redemption_types || []);
        setRedemptionItemStatuses(responseData.redemption_item_status || []);
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

  // For Discount Type Filters
  const redemptionTypeFilters = redemptionTypes.map((type) => ({ text: type, value: type }));

  // For Discount Code Status Filters
  const redemptionItemStatusFilters = redemptionItemStatuses.map((status) => ({ text: status, value: status }));


  // Search function
  const onSearch = (
    value: string,
  ) => {
    setSearchText(value.trim().toLowerCase());
  };

  // Filtered data based on searchText
  const filteredRedemptionItem = redemptionItems.filter(item =>
    // item.redemption_item_name.toLowerCase().includes(searchText) ||
    String(item.redemption_item_name).toLowerCase().includes(searchText)
  );



  // Table columns
  const columns: TableColumnsType<RedemptionItem> = [
    {
      title: '',
      dataIndex: 'edit',
      key: 'edit',
      render: (_: any, record: RedemptionItem) => (
        <Link href={`/dashboard/discount_code_list/redemption_item/${record.redemption_item_id}/edit`}>
          <Button
            type="link"
            icon={<FormOutlined style={{ color: '#ff4d4f' }} />}
          />
        </Link>
      ),
      width: 50,
    },
    {
      title: '禮物名稱',
      dataIndex: 'redemption_item_name',
      key: 'redemption_item_name',
    },
    {
      title: '折扣類別',
      dataIndex: 'redemption_type',
      key: 'redemption_type',
      filters: redemptionTypeFilters,
      onFilter: (value, record) => record.redemption_type === value,
      render: (text) => (text === 'fixed_amount' ? 'Fixed Amount' : 'Percentage'),
    },
    {
      title: '所需積分',
      dataIndex: 'redeem_point',
      key: 'redeem_point',
      sorter: (a, b) => a.redeem_point - b.redeem_point,
      sortDirections: ['ascend', 'descend', 'ascend'],
      render: (text) => `${text}`,
    },
    {
      title: '折扣額',
      key: 'discount_amount',
      sorter: (a, b) => {
        // If both are fixed_amount, compare discount_amount
        if (a.redemption_type === 'fixed_amount' && b.redemption_type === 'fixed_amount') {
          return (a.discount_amount ?? 0) - (b.discount_amount ?? 0);
        }
        // If one is fixed_amount and the other is percentage, decide which comes first
        if (a.redemption_type === 'fixed_amount') return -1; // Put fixed_amount first
        if (b.redemption_type === 'fixed_amount') return 1; // Put fixed_amount first
        // If both are percentage, compare discount_percentage
        return (a.discount_percentage ?? 0) - (b.discount_percentage ?? 0);
      },
      sortDirections: ['ascend', 'descend', 'ascend'],
      render: (_: any, record: RedemptionItem) =>
        record.redemption_type === 'fixed_amount'
          ? `$${record.discount_amount}`
          : `${record.discount_percentage}%`,
    },
    {
      title: '最低消費',
      dataIndex: 'minimum_spending',
      key: 'minimum_spending',
      sorter: (a, b) => a.minimum_spending - b.minimum_spending,
      sortDirections: ['ascend', 'descend', 'ascend'],
      render: (text) => `$${text}`,
    },
    {
      title: '有效期 (月)',
      dataIndex: 'validity_period',
      key: 'validity_period',
      sorter: (a, b) => a.validity_period - b.validity_period,
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    // {
    //   title: '可兌換數目',
    //   dataIndex: 'quantity_available',
    //   key: 'quantity_available',
    // },
    {
      title: '換領開始日期',
      dataIndex: 'valid_from',
      key: 'valid_from',
      sorter: (a, b) => new Date(a.valid_from || '').getTime() - new Date(b.valid_from || '').getTime(),
      sortDirections: ['ascend', 'descend', 'ascend'],
      render: (text) => (text ? new Date(text).toLocaleDateString() : '--'),
    },
    {
      title: '換領結束日期',
      dataIndex: 'valid_until',
      key: 'valid_until',
      sorter: (a, b) => new Date(a.valid_until || '').getTime() - new Date(b.valid_until || '').getTime(),
      sortDirections: ['ascend', 'descend', 'ascend'],
      render: (text) => (text ? new Date(text).toLocaleDateString() : '--'),
    },
    {
      title: '狀態',
      dataIndex: 'redemption_item_status',
      key: 'redemption_item_status',
      filters: redemptionItemStatusFilters,
      onFilter: (value, record) => record.redemption_item_status === value,
    },
    // {
    //   title: 'Active',
    //   dataIndex: 'is_active',
    //   key: 'is_active',
    //   render: (is_active, record) => (
    //     <Switch
    //       checked={is_active}
    //       onChange={(checked) => handleToggleActive(record.redemption_item_id, checked)}
    //     />
    //   ),
    // },
    // {
    //   title: 'Actions',
    //   key: 'actions',
    //   render: (_, record) => (
    //     <Space>
    //       <Button type="link" danger onClick={() => handleDeleteItem(record.redemption_item_id)}>
    //         Delete
    //       </Button>
    //     </Space>
    //   ),
    // },
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
        credentials: 'include',
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
    // setselectedRedemptionType('fixed_amount'); // Default type
    // form.resetFields();
    setIsModalVisible(true);
  };

  const handleRedemptionTypeChange = (value: 'fixed_amount' | 'percentage') => {
    setSelectedRedemptionType(value);
    form.resetFields(); // Reset fields when Redemption type changes
    form.setFieldsValue({ redemption_type: value });
  };

  const onFinish = async (values: any) => {
    // Build the item object
    const newItem: Partial<RedemptionItem> = {
      redemption_item_name: values.redemption_item_name,
      redemption_type: selectedRedemptionType,
      minimum_spending: values.minimum_spending,
      validity_period: values.validity_period,
      redeem_point: values.redeem_point,
      fixed_discount_cap: 0,
      quantity_available: 0,
      valid_from: values.valid_from,
      valid_until: values.valid_until,
      redemption_content: values.redemption_content,
      redemption_term: values.redemption_term,
    };

    if (selectedRedemptionType === 'fixed_amount') {
      newItem.discount_amount = values.discount_amount;
      newItem.discount_percentage = undefined;
      // newItem.fixed_discount_cap = undefined;
    } else if (selectedRedemptionType === 'percentage') {
      newItem.discount_percentage = values.discount_percentage;
      newItem.fixed_discount_cap = 0;
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
          credentials: 'include',
          body: JSON.stringify(newItem),
        });
      } else {
        // Add new item
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/redemption_item/post_redemption_item`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ ...newItem, is_active: true }),
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
        credentials: 'include',
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

  const items: MenuProps['items'] = [
    {
      label: 'Delete',
      key: '1',
      icon: <UserOutlined />,
    },
    {
      label: 'Enable',
      key: '2',
      icon: <UserOutlined />,
    },
    {
      label: 'Suspend',
      key: '3',
      icon: <UserOutlined />,
      danger: true,
    }
  ];

  const menuProps = {
    items,
    // onClick: handleMenuClick,
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>換領禮遇列表</Title>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            新增換領禮遇
          </Button>
          <Button icon={<DeleteOutlined />} onClick={() => router.push('/dashboard/discount_code_list/redemption_item/deleted_redemption_item')}>
            檢視垃圾桶
          </Button>
          <Dropdown menu={menuProps} disabled={selectedRowKeys.length === 0}>
            <Button>
              Bulk Actions <DownOutlined />
            </Button>
          </Dropdown>

        </Space>
      </div>


      <Space direction="vertical" style={{ marginBottom: '50px' }}>
        <Search
          placeholder="Search members"
          allowClear
          onSearch={onSearch}
          style={{ width: 300 }}
        />
      </Space>


      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredRedemptionItem}
        rowKey="redemption_item_id"
        style={{ marginTop: 16 }}
        locale={{ emptyText: 'No redemption items found.' }}
        pagination={{ showSizeChanger: true, pageSizeOptions: ['10', '20', '50'] }}
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
            name="redemption_type"
            label="折扣類型"
            initialValue={selectedRedemptionType}
            rules={[{ required: true, message: '選擇折扣類型' }]}
          >
            <Select onChange={handleRedemptionTypeChange}>
              <Option value="fixed_amount">Fixed Amount Discount</Option>
              <Option value="percentage">Percentage Discount</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="redemption_item_name"
            label="禮物名稱"
            rules={[{ required: true, message: '輸入折扣名稱' }]}
          >
            <Input />
          </Form.Item>


          <Form.Item
            name="redeem_point"
            label="所需積分"
            rules={[{ required: true, message: '輸入換領所需要的積分' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>


          {selectedRedemptionType === 'fixed_amount' && (
            <Form.Item
              name="discount_amount"
              label="折扣金額"
              rules={[{ required: true, message: '輸入折扣金額' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          )}

          {selectedRedemptionType === 'percentage' && (
            <>
              <Form.Item
                name="discount_percentage"
                label="折扣額 % "
                rules={[{ required: true, message: '輸入折扣額 % ' }]}
              >
                <InputNumber<number>
                  min={1}
                  max={100}
                  style={{ width: '100%' }}
                  formatter={(value) => `${value}%`}
                  parser={(value) => parseFloat(value!.replace('%', ''))}
                />
              </Form.Item>
              {/* <Form.Item
                name="fixed_discount_cap"
                label="Fixed Discount Cap"
                rules={[{ required: true, message: 'Please enter the fixed discount cap' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item> */}
            </>
          )}

          <Form.Item
            name="minimum_spending"
            label="最低消費金額"
            rules={[{ required: true, message: '最低消費金額' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="validity_period"
            label="有效期(月)"
            rules={[{ required: true, message: '有效期' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          {/* <Form.Item
            name="quantity_available"
            label="可兌換數目"
            rules={[{ required: true, message: '輸入可供換領的數量' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item> */}


          <Form.Item
            name="valid_from"
            label="換領開始日期"
            rules={[{ required: false, message: '選擇日期' }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="valid_until"
            label="換領結束日期"
            rules={[{ required: false, message: '選擇日期' }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }} />
          </Form.Item>


          <Form.Item
            name="redemption_content"
            label="禮物詳情"
            rules={[{ required: true, message: '輸入禮物詳情' }]}
          >
            <Input />
          </Form.Item>


          <Form.Item
            name="redemption_term"
            label="條款及細則"
            rules={[{ required: true, message: '輸入禮物的條款及細則' }]}
          >
            <Input />
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