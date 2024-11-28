// src/app/dashboard/member_list/page.tsx

'use client';
import { useEffect, useState, useRef } from 'react';
import { Table, Input, Space, Button, Modal, Form, message } from 'antd';
import type { TableColumnsType, PaginationProps } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { FormOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation'; // For Next.js 13 with app directory

import Link from 'next/link';

const { Search } = Input;

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface DataType {
  key: string;
  member_name: string;
  member_phone: string | number;
  points_balance: string | number;
  membership_tier: string;
  membership_expiry_date: string;
  membership_status: 'expired' | 'active' | 'suspended'; // Updated field
}

interface NewMember {
  member_name: string;
  member_phone: number;
  birthday: string | null;
  referrer_phone: number | null;
  points_balance: number;
}

interface FetchParams {
  page: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: string;
  filters?: any;
  searchText?: string;
}

const GetMemberListPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const hasFetched = useRef(false);

  const router = useRouter();

  const [data, setData] = useState<DataType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [tierFilterOptions, setTierFilterOptions] = useState<{ text: string; value: string }[]>([]);
  const [tableFilters, setTableFilters] = useState<any>({});
  const [searchText, setSearchText] = useState<string>('');
  const showTotal: PaginationProps['showTotal'] = (total) => `Total ${total} items`;

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [addingMember, setAddingMember] = useState<boolean>(false);

  // Updated status options to match the new membership_status
  const statusOptions = [
    { text: 'expired', value: 'expired' },
    { text: 'active', value: 'active' },
    { text: 'suspended', value: 'suspended' },
  ];

  // Separate pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
    },
  };
  const hasSelected = selectedRowKeys.length > 0;

  const fetchData = async (params: FetchParams = { page: 1, pageSize: 10 }) => {
    setLoading(true);
    try {
      const { page, pageSize, sortField, sortOrder, filters, searchText } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (sortField) queryParams.append('sortField', sortField);
      if (sortOrder) queryParams.append('sortOrder', sortOrder);

      // Include filters dynamically
      if (filters) {
        Object.keys(filters).forEach((key) => {
          const filterValues = filters[key];
          if (filterValues && filterValues.length > 0) {
            filterValues.forEach((value: string) => {
              queryParams.append(key, value);
            });
          }
        });
      }

      // Include search text in the queryParams
      if (searchText) {
        queryParams.append('searchText', searchText);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/member/get_member_list?${queryParams.toString()}`,
        {
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();
      console.log('Parsed JSON Data:', jsonData);

      const members: any[] = jsonData.data;
      const total: number = jsonData.total;
      const membershipTiers: string[] = jsonData.membership_tiers || [];

      if (!Array.isArray(members)) {
        throw new Error("Invalid data format: 'members' should be an array.");
      }

      const formatDate = (isoString: string): string => {
        if (!isoString) return 'N/A';
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const formattedData: DataType[] = members.map((member: any) => ({
        key: member.member_id ? member.member_id.toString() : Math.random().toString(),
        member_name: member.member_name || 'N/A',
        member_phone: member.member_phone || 'N/A',
        points_balance: member.points_balance || 'N/A',
        total_order_amount: member.total_order_amount || 'N/A',
        birthday: formatDate(member.birthday),
        membership_tier: member.membership_tier
          ? member.membership_tier.membership_tier_name
          : 'N/A',
        membership_expiry_date: formatDate(member.membership_expiry_date),
        membership_status: member.membership_status || 'Unknown', // Use membership_status directly
      }));

      setData(formattedData);

      const tierFilters = membershipTiers.map((tier) => ({
        text: tier,
        value: tier,
      }));
      setTierFilterOptions(tierFilters);

      // Update total items
      setTotalItems(total);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Adjusted useEffect
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchData({
        page: currentPage,
        pageSize: pageSize,
        filters: tableFilters,
        searchText: searchText,
      });
    }
  }, [currentPage, pageSize, tableFilters, searchText]);

  const onSearch = (value: string) => {
    const trimmedValue = value.trim().toLowerCase();
    setSearchText(trimmedValue);

    // Reset pagination to the first page when a new search is performed
    setCurrentPage(1);

    fetchData({
      page: 1,
      pageSize: pageSize,
      filters: tableFilters,
      searchText: trimmedValue,
    });
  };

  const onFinish = async (values: NewMember) => {
    try {
      setAddingMember(true);
      // Send the data to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/member/post_new_member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(values),
      });

      let errorMessage = 'Failed to add member';

      if (!response.ok) {
        // Try to parse the error message from the response body
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          } else {
            errorMessage = response.statusText || 'Failed to add member';
          }
        } catch {
          // If parsing fails, fallback to statusText or generic message
          errorMessage = response.statusText || 'Failed to add member';
        }
        // Throw an error with the specific message
        throw new Error(errorMessage);
      }

      const result = await response.json();
      message.success('Member added successfully');

      // Close the modal
      setIsModalVisible(false);
      // Reset the form fields
      form.resetFields();

      // Refresh the member list
      fetchData({
        page: currentPage,
        pageSize: pageSize,
        filters: tableFilters,
        searchText: searchText,
      });
    } catch (error: any) {
      console.error('Error adding member:', error.message);
      message.error(error.message);
    } finally {
      setAddingMember(false);
    }
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: '',
      dataIndex: 'edit',
      key: 'edit',
      render: (_: any, record: DataType) => (
        <Link href={`/dashboard/member_list/${record.member_phone}/edit`}>
          <Button
            type="link"
            icon={<FormOutlined style={{ color: '#ff4d4f' }} />}
          />
        </Link>
      ),
      width: 50,
    },
    {
      title: '姓名',
      dataIndex: 'member_name',
      key: 'member_name',
    },
    {
      title: '電話號碼',
      dataIndex: 'member_phone',
      key: 'member_phone',
    },
    {
      title: '積分',
      dataIndex: 'points_balance',
      key: 'points_balance',
      sorter: true, // Enable server-side sorting
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: '累計消費金額',
      dataIndex: 'total_order_amount',
      key: 'total_order_amount', // Adjusted key if needed
      sorter: true, // Enable server-side sorting
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: '生日',
      dataIndex: 'birthday', // Adjusted dataIndex if birthday is available
      key: 'birthday',
      sorter: true, // Enable server-side sorting
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: '到期日',
      dataIndex: 'membership_expiry_date',
      key: 'membership_expiry_date',
      sorter: true, // Enable server-side sorting
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: '級別',
      dataIndex: 'membership_tier',
      key: 'membership_tier',
      sorter: true, // Enable server-side sorting
      sortDirections: ['ascend', 'descend', 'ascend'],
      filters: tierFilterOptions,
      filteredValue: tableFilters.membership_tier || null,
    },
    {
      title: '狀態',
      dataIndex: 'membership_status',
      key: 'membership_status', // Updated key
      sorter: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
      filters: statusOptions,
      filteredValue: tableFilters.membership_status || null, // Updated filter
    },
  ];

  const handleTableChange = (
    pagination: any,
    filters: any,
    sorter: any
  ) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
    setTableFilters(filters);

    // Prepare sort parameters
    let sortField = sorter.field;
    let sortOrder = sorter.order;
    if (sortOrder) {
      // Convert sortOrder to 'ascend' or 'descend'
      sortOrder = sorter.order === 'ascend' ? 'ascend' : 'descend';
    }

    // Fetch data based on the new pagination, filters, and sorting
    fetchData({
      page: pagination.current,
      pageSize: pagination.pageSize,
      sortField: sortField,
      sortOrder: sortOrder,
      filters: filters,
      searchText: searchText, // Include search text if any
    });
  };

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <Space direction="horizontal" style={{ marginBottom: '20px' }}>
        <Search
          placeholder="Search members"
          allowClear
          onSearch={onSearch}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Add New Member
        </Button>
        {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
      </Space>

      <Table
        rowSelection={rowSelection}
        dataSource={data}
        columns={columns}
        locale={{ emptyText: 'No members found.' }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
          showTotal: showTotal,
          showSizeChanger: true,
          showQuickJumper: true,
          position: ['bottomRight'],
        }}
        loading={loading}
        onChange={handleTableChange}
      />

      <Modal
        title="Add New Member"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="member_name"
            label="會員姓名"
            rules={[{ required: true, message: 'Please enter the member name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="member_phone"
            label="會員電話"
            rules={[{ required: true, message: 'Please enter the phone number' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="birthday"
            label="會員生日 (選填)"
            rules={[{ required: false }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="referrer_phone"
            label="推薦人電話號碼 (選填)"
            rules={[{ required: false }]}
          >
            <Input />
          </Form.Item>

          {/* Uncomment if you want to include initial points */}
          {/* <Form.Item
            name="point"
            label="會員積分"
            rules={[{ required: true, message: 'Please enter the initial point' }]}
          >
            <Input />
          </Form.Item> */}

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={addingMember}>
              Add Member
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GetMemberListPage;