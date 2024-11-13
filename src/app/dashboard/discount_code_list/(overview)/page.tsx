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
  DatePicker,
  Menu,
  Dropdown
} from 'antd';

const { Search } = Input;
import Link from 'next/link';

import type { TableColumnsType, TableProps, MenuProps } from 'antd';
import { PlusOutlined, FormOutlined, DeleteOutlined, DownOutlined, UserOutlined } from '@ant-design/icons';
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
  discount_code_status: 'expired' | 'active' | 'suspended' | 'scheduled';
  discount_code_content: string;
  discount_code_term: string;
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

  const [discountTypes, setDiscountTypes] = useState<string[]>([]);
  const [useLimitTypes, setUseLimitTypes] = useState<string[]>([]);
  const [discountCodeStatuses, setDiscountCodeStatuses] = useState<string[]>([]);

  const [searchText, setSearchText] = useState<string>(''); // State for search text

  const router = useRouter();
  // const handleEdit = (record: DiscountCode) => {
  //   console.log(record.discount_code_id)
  //   router.push(`/dashboard/discount_code_list/${record.discount_code_id}/edit`);
  // };


  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // Row selection configuration
  const rowSelection: TableRowSelection<DiscountCode> = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };



  const handleBulkMenuClick = async (e: { key: string }) => {
    const action = e.key; // 'enable', 'suspend', or 'delete'
    const selectedDiscountCodes = discountCodes.filter((item) => selectedRowKeys.includes(item.key));

    if (selectedDiscountCodes.length === 0) {
      message.warning('Please select at least one discount code.');
      return;
    }

    Modal.confirm({
      title: `Are you sure you want to ${action} the selected discount codes?`,
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          if (action === 'delete') {
            // Perform delete action
            await Promise.all(
              selectedDiscountCodes.map(async (discountCode) => {
                const response = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/discount_code/delete_discount_code/${discountCode.discount_code_id}`,
                  {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ deleted_status: true }),
                  }
                );
                if (!response.ok) {
                  throw new Error(`Failed to delete discount code: ${response.status}`);
                }
              })
            );
            // Remove deleted items from the state
            setDiscountCodes((prevDiscountCodes) =>
              prevDiscountCodes.filter((item) => !selectedRowKeys.includes(item.key))
            );
            message.success('Selected discount codes deleted successfully.');
          } else {
            // For 'enable' and 'suspend' actions
            const actionVerb = action === 'enable' ? 'enable' : 'suspend';
            await Promise.all(
              selectedDiscountCodes.map(async (discountCode) => {
                const response = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/discount_code/put_discount_code_is_active/${discountCode.discount_code_id}`,
                  {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ action: actionVerb }),
                  }
                );
                if (!response.ok) {
                  throw new Error(`Failed to ${actionVerb} discount code: ${response.status}`);
                }
              })
            );
            // Update the status in the state
            setDiscountCodes((prevDiscountCodes) =>
              prevDiscountCodes.map((item) => {
                if (selectedRowKeys.includes(item.key)) {
                  // Update discount_code_status
                  let newStatus = item.discount_code_status;
                  if (action === 'suspend') {
                    newStatus = 'suspended';
                  } else if (action === 'enable') {
                    newStatus = 'active';
                  }
                  return {
                    ...item,
                    discount_code_status: newStatus,
                  };
                }
                return item;
              })
            );
            message.success(`Selected discount codes ${actionVerb}d successfully.`);
          }
          // Clear selection
          setSelectedRowKeys([]);
        } catch (error: any) {
          console.error(`Error performing bulk ${action}:`, error);
          message.error(`Failed to perform bulk ${action}: ${error.message}`);
        }
      },
    });
  };


  const fetchDiscountCodes = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/discount_code/get_discount_code_list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.status === 404) {
        // No discount codes found, initialize with empty array
        setDiscountCodes([]);
      } else if (!response.ok) {
        throw new Error(`Failed to fetch discount codes: ${response.status}`);
      } else {
        const responseData = await response.json();
        const discountCodesArray: DiscountCode[] = responseData.discount_codes;

        // Map data to include 'key' property required by Ant Design Table
        const formattedData = discountCodesArray.map((item) => ({ ...item, key: item.discount_code_id }));
        setDiscountCodes(formattedData);

        // Set filter data
        setDiscountTypes(responseData.discount_types || []);
        setUseLimitTypes(responseData.use_limit_types || []);
        setDiscountCodeStatuses(responseData.discount_code_status || []);
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

  // For Discount Type Filters
  const discountTypeFilters = discountTypes.map((type) => ({ text: type, value: type }));

  // For Use Limit Type Filters
  const useLimitTypeFilters = useLimitTypes.map((type) => ({ text: type, value: type }));

  // For Discount Code Status Filters
  const discountCodeStatusFilters = discountCodeStatuses.map((status) => ({ text: status, value: status }));

  // Search function
  const onSearch = (
    value: string,
  ) => {
    setSearchText(value.trim().toLowerCase());
  };

  // Filtered data based on searchText
  const filteredDiscountCodes = discountCodes.filter(item =>
    item.discount_code_name.toLowerCase().includes(searchText) ||
    String(item.discount_code).toLowerCase().includes(searchText)
  );


  // Table columns
  const columns: TableColumnsType<DiscountCode> = [
    {
      title: '',
      dataIndex: 'edit',
      key: 'edit',
      render: (_: any, record: DiscountCode) => (
        <Link href={`/dashboard/discount_code_list/${record.discount_code_id}/edit`}>
          <Button type="link" icon={<FormOutlined style={{ color: '#ff4d4f' }} />} />
        </Link>
      ),
      width: 50,
    },
    {
      title: '優惠名稱',
      dataIndex: 'discount_code_name',
      key: 'discount_code_name',
    },
    {
      title: '優惠碼',
      dataIndex: 'discount_code',
      key: 'discount_code',
      sorter: true, // Enable server-side sorting
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: '類別',
      dataIndex: 'discount_type',
      key: 'discount_type',
      sorter: true,
      filters: discountTypeFilters,
      onFilter: (value, record) => record.discount_type === value,
      render: (text) => (text === 'fixed_amount' ? 'Fixed Amount' : 'Percentage'),
    },
    {
      title: '折扣額',
      key: 'discount_amount',
      sorter: true, // Enable server-side sorting
      sortDirections: ['ascend', 'descend', 'ascend'],
      render: (_, record) =>
        record.discount_type === 'fixed_amount'
          ? `$${record.discount_amount}`
          : `${record.discount_percentage}%`,
    },
    {
      title: '最低消費',
      dataIndex: 'minimum_spending',
      key: 'minimum_spending',
      sorter: true, // Enable server-side sorting
      sortDirections: ['ascend', 'descend', 'ascend'],
      render: (text) => `$${text}`,
    },
    {
      title: '開始日期',
      dataIndex: 'valid_from',
      key: 'valid_from',
      sorter: true, // Enable server-side sorting
      sortDirections: ['ascend', 'descend', 'ascend'],
      render: (text) => (text ? new Date(text).toLocaleDateString() : '--'),
    },
    {
      title: '到期日',
      dataIndex: 'valid_until',
      key: 'valid_until',
      sorter: true, // Enable server-side sorting
      sortDirections: ['ascend', 'descend', 'ascend'],
      render: (text) => (text ? new Date(text).toLocaleDateString() : '--'),
    },
    {
      title: '使用限制',
      dataIndex: 'use_limit_type',
      key: 'use_limit_type',
      sorter: true,
      filters: useLimitTypeFilters,
      onFilter: (value, record) => record.use_limit_type === value,
    },
    {
      title: '狀態',
      dataIndex: 'discount_code_status',
      key: 'discount_code_status',
      sorter: true,
      filters: discountCodeStatusFilters,
      onFilter: (value, record) => record.discount_code_status === value,
    },

  ];

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
      discount_code_content: values.discount_code_content,
      discount_code_term: values.discount_code_term,
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
          credentials: 'include',
          body: JSON.stringify(newItem),
        });
      } else {
        // Add new discount code
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/discount_code/post_new_discount_code`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
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
        credentials: 'include',
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
        <Title level={2}>折扣券列表</Title>
        <div>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
              新增優惠
            </Button>
            <Button
              icon={<DeleteOutlined />}
              onClick={() => router.push('/dashboard/discount_code_list/deleted_discount_code')}
            >
              檢視垃圾桶
            </Button>
            <Dropdown menu={menuProps} disabled={selectedRowKeys.length === 0}>
              <Button>
                Bulk Actions <DownOutlined />
              </Button>
            </Dropdown>
          </Space>
        </div>
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
        dataSource={filteredDiscountCodes}
        rowKey="discount_code_id"
        style={{ marginTop: 16 }}
        locale={{ emptyText: 'No discount codes found.' }}
      />

      {/* Modal Form */}
      <Modal
        // title={`${isEditing ? 'Edit' : 'Add New'} Discount Code`}
        title='新增優惠'
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
            label="優惠碼"
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
            </Select>
          </Form.Item>

          <Form.Item
            name="valid_from"
            label="折扣有效期（開始）"
            rules={[{ required: false, message: 'Please select the valid from date' }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="valid_until"
            label="折扣有效期（結束）"
            rules={[{ required: false, message: 'Please select the valid until date' }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="discount_code_content"
            label="優惠詳情"
            rules={[{ required: true, message: '輸入禮物詳情' }]}
          >
            <TextArea
              placeholder="輸入禮物詳情"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>


          <Form.Item
            name="discount_code_term"
            label="條款及細則"
            rules={[{ required: true, message: '輸入禮物的條款及細則' }]}
          >
            <TextArea
              placeholder="輸入禮物的條款及細則"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
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