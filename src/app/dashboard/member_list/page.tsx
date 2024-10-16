// src/app/dashboard/member_list/page.tsx

'use client';
import { useEffect, useState, useRef } from 'react';
import { Table, Input, Space, Button, Modal, Form, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import type { TableColumnsType, TableProps } from 'antd';
import { red } from '@ant-design/colors';
import { FormOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation'; // For Next.js 13 with app directory


const { Search } = Input;

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];


interface DataType {
  key: string;
  member_name: string;
  member_phone: string | number;
  point: string | number;
  membership_tier: string;
  membership_expiry_date: string;
}

interface NewMember {
  member_name: string
  member_phone: number
  birthday: string | null
  referrer_phone: number | null
  point: number
}


const GetMemberListPage: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const hasFetched = useRef(false);
  const [searchText, setSearchText] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [addingMember, setAddingMember] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const router = useRouter();
  const handleEdit = (record: DataType) => {
    router.push(`/dashboard/member_list/${record.member_phone}/edit`);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      console.log(selectedKeys)
      setSelectedRowKeys(selectedKeys);
    },
  };
  const hasSelected = selectedRowKeys.length > 0;

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/member/get_member_list`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();
      console.log('Parsed JSON Data:', jsonData);

      const members: any[] = jsonData;

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
        key: member.id ? member.id.toString() : Math.random().toString(),
        member_name: member.member_name || 'N/A',
        member_phone: member.member_phone || 'N/A',
        point: member.point || 'N/A',
        membership_tier: member.membership_tier.member_tier_name || 'N/A',
        membership_expiry_date: formatDate(member.membership_expiry_date),
      }));

      setData(formattedData);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchData();
    }
  }, []);

  const onSearch = (value: string) => {
    setSearchText(value.trim().toLowerCase());
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
      fetchData();

    } catch (error: any) {
      console.error('Error adding member:', error.message);
      message.error(error.message);
    } finally {
      setAddingMember(false);
    }
  };

  const filteredData = data.filter(item =>
    item.member_name.toLowerCase().includes(searchText) ||
    String(item.member_phone).toLowerCase().includes(searchText)
  );

  const columns: TableColumnsType<DataType> = [
    // ... your existing column definitions ...
    {
      title: '',
      dataIndex: 'edit',
      key: 'edit',
      render: (_: any, record: DataType) => (
        <Button
          type="link"
          icon={<FormOutlined style={{ color: '#ff4d4f' }} />}
          onClick={() => handleEdit(record)}
        />
      ),
      width: 50,
    },
    {
      title: 'Name',
      dataIndex: 'member_name',
      key: 'member_name',
    },
    {
      title: 'Phone',
      dataIndex: 'member_phone',
      key: 'member_phone',
    },
    {
      title: 'Point',
      dataIndex: 'point',
      key: 'point',
      sorter: (a: DataType, b: DataType) => Number(a.point) - Number(b.point),
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Membership Tier',
      dataIndex: 'membership_tier',
      key: 'membership_tier',
    },
    {
      title: 'Expiry Date',
      dataIndex: 'membership_expiry_date',
      key: 'membership_expiry_date',
      sorter: (a: DataType, b: DataType) =>
        new Date(a.membership_expiry_date).getTime() - new Date(b.membership_expiry_date).getTime(),
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <Space direction="horizontal" style={{ marginBottom: '20px' }}>
        <Search
          placeholder="Search members"
          allowClear
          onSearch={onSearch}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Add New Member
        </Button>
        {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
      </Space>

      <Table
        rowSelection={rowSelection}
        dataSource={filteredData}
        columns={columns}
        locale={{ emptyText: 'No members found.' }}
        pagination={{ position: ['none', 'bottomRight'] }}
      />

      <Modal
        title="Add New Member"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
        >
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
            rules={[{ required: false, message: 'Please enter birthday' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="referrer_phone"
            label="推薦人電話號碼 (選填)"
            rules={[{ required: false, message: 'Please enter the referrer phone number' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="point"
            label="會員積分"
            rules={[{ required: true, message: 'Please enter the initial point' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={addingMember}>
              Add Member
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default GetMemberListPage;